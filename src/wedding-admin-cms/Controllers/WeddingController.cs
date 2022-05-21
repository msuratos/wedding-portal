using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web.Resource;
using Microsoft.Net.Http.Headers;
using wedding_admin_cms.Common.Filters;
using wedding_admin_cms.Common.Helpers;
using wedding_admin_cms.Dtos;
using wedding_admin_cms.Persistance;
using wedding_admin_cms.Persistance.Entities;

namespace wedding_admin_cms.Controllers
{
  [Authorize]
  [ApiController]
  [Route("[controller]")]
  [RequiredScope(scopeRequiredByAPI)]
  public class WeddingController : ControllerBase
  {
    const string scopeRequiredByAPI = "user.access";

    private readonly IConfiguration _configuration;
    private readonly ILogger<WeddingController> _logger;
    private readonly WeddingDbContext _dbContext;

    public WeddingController(IConfiguration configuration, ILogger<WeddingController> logger, WeddingDbContext dbContext)
    {
      _configuration = configuration;
      _logger = logger;
      _dbContext = dbContext;
    }

    [HttpPost("entourage")]
    public async Task<IActionResult> AddEntourage([FromBody] Entourage dto, CancellationToken cancellationToken)
    {
      await _dbContext.Entourages.AddAsync(dto, cancellationToken);
      await _dbContext.SaveChangesAsync(cancellationToken);

      return Ok(dto);
    }

    [HttpPut]
    public async Task<IActionResult> AddWeddingToUser([FromQuery] Guid weddingId, CancellationToken cancellationToken)
    {
      var username = User.Claims.SingleOrDefault(s => s.Type == "emails").Value;
      var displayname = User.Claims.SingleOrDefault(s => s.Type == "name").Value;

      var userToWedding = new UsersToWedding()
      {
        DisplayName = displayname,
        UserName = username,
        UserRoles = UsersToWedding.UserRole.Primary,
        WeddingId = weddingId
      };

      await _dbContext.UsersToWeddings.AddAsync(userToWedding, cancellationToken);
      await _dbContext.SaveChangesAsync(cancellationToken);

      return Ok();
    }

    // reference - https://github.com/dotnet/AspNetCore.Docs/blob/main/aspnetcore/mvc/models/file-uploads/samples/5.x/LargeFilesSample/Controllers/FileUploadController.cs
    [HttpPost("photos")]
    [DisableFormValueModelBinding]
    public async Task<IActionResult> AddPhotos([FromQuery] Guid weddingId, [FromQuery] string forPage, CancellationToken cancellationToken)
    {
      // validation of Content-Type
      // 1. first, it must be a form-data request
      // 2. a boundary should be found in the Content-Type
      if (!Request.HasFormContentType ||
          !MediaTypeHeaderValue.TryParse(Request.ContentType, out var mediaTypeHeader) ||
          string.IsNullOrEmpty(mediaTypeHeader.Boundary.Value))
      {
        return new UnsupportedMediaTypeResult();
      }

      try
      {
        var reader = new MultipartReader(mediaTypeHeader.Boundary.Value, Request.Body);
        var section = await reader.ReadNextSectionAsync(cancellationToken);

        // This sample try to get the first file from request and save it
        // Make changes according to your needs in actual use
        while (section != null)
        {
          var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out var contentDisposition);

          if (hasContentDispositionHeader && contentDisposition.DispositionType.Equals("form-data") &&
              !string.IsNullOrEmpty(contentDisposition.FileName.Value))
          {
            // Don't trust any file name, file extension, and file data from the request unless you trust them completely
            // Otherwise, it is very likely to cause problems such as virus uploading, disk filling, etc
            // In short, it is necessary to restrict and verify the upload
            // Here, we just use the temporary folder and a random file name
            var permittedExtensions = new string[] { ".jpg", ".png" };
            var fileSizeLimit = Convert.ToInt32(_configuration["FileSize"]);

            var streamedFileBytes = await FileHelpers.ProcessStreamedFile(section, contentDisposition, ModelState, permittedExtensions, fileSizeLimit);

            if (ModelState.IsValid)
            {
              // Get the temporary folder, and combine a random file name with it
              var fileExtension = new FileInfo(contentDisposition.FileName.Value).Extension;
              var fileName = Path.GetRandomFileName() + fileExtension;

              var connectionString = _configuration["AzureBlobConnectionString"];

              // Create a BlobServiceClient object which will be used to create a container client
              var blobServiceClient = new BlobServiceClient(connectionString);

              // Create a unique name for the container
              const string CONTAINER_NAME = "merlynn-wedding";

              // Get a reference to blob container and blob client
              var blobContainerClient = blobServiceClient.GetBlobContainerClient(CONTAINER_NAME);
              var blobClient = blobContainerClient.GetBlobClient(fileName);

              // Upload the file to blob
              using var fileStream = new MemoryStream(streamedFileBytes);
              await blobClient.UploadAsync(fileStream, true, cancellationToken);

              // Save to database
              await _dbContext.Photos.AddAsync(new Photo
              {
                FileName = fileName,
                FileType = fileExtension,
                ForPage = forPage,
                FkWeddingId = weddingId
              }, cancellationToken);
              await _dbContext.SaveChangesAsync(cancellationToken);
            }
          }
          else
          {
            var errorMessage = $"Could not process file: ${contentDisposition.FileName.Value}";
            _logger.LogError(errorMessage);
            ModelState.AddModelError("File", errorMessage);
          }

          section = await reader.ReadNextSectionAsync(cancellationToken);
        }

        if (ModelState.IsValid)
          return Ok();
        else
          return BadRequest(ModelState);
      }
      catch (Exception ex)
      {
        return BadRequest(ex);
      }
    }

    [HttpPost]
    public async Task<IActionResult> CreateWedding([FromBody] Wedding dto, CancellationToken cancellationToken)
    {
      // create new wedding
      // TODO: send a message queue to create azure services from url subdomain property
      await _dbContext.Weddings.AddAsync(dto, cancellationToken);
      await _dbContext.SaveChangesAsync(cancellationToken);

      // add user to wedding
      var username = User.Claims.SingleOrDefault(s => s.Type == "emails").Value;
      var displayname = User.Claims.SingleOrDefault(s => s.Type == "name").Value;

      var userToWedding = new UsersToWedding()
      {
        DisplayName = displayname,
        UserName = username,
        UserRoles = UsersToWedding.UserRole.Primary,
        WeddingId = dto.WeddingId // have to wait till wedding has committed to the database to get the wedding id
      };

      await _dbContext.UsersToWeddings.AddAsync(userToWedding, cancellationToken);
      await _dbContext.SaveChangesAsync(cancellationToken);

      return Ok(dto);
    }

    [HttpGet("photos")]
    public async Task<IActionResult> GetPhotos(CancellationToken cancellationToken)
    {
      // Get wedding id based on subdomain
      var host = Request.Host.Value;
      var wedding = await _dbContext.Weddings.SingleOrDefaultAsync(s => host.ToLower().Contains(s.UrlSubDomain.ToLower()), cancellationToken);
      var weddingId = wedding.WeddingId;

      // Get photos from database
      var photos = await _dbContext.Photos.Where(w => w.FkWeddingId.Equals(weddingId))
        .Select(s => $"{_configuration["AzureCdnUrl"]}/{s.FileName}")
        .ToListAsync(cancellationToken: cancellationToken);

      return Ok(photos);
    }

    [HttpGet]
    public async Task<IActionResult> GetWeddingForLogin(CancellationToken cancellationToken)
    {
      // TODO: validate the username and wedding. Make sure only one wedding per user(?)
      var username = User.Claims.SingleOrDefault(s => s.Type == "emails").Value;
      var userToWedding = await _dbContext.UsersToWeddings.Include(i => i.Wedding).SingleOrDefaultAsync(s => s.UserName == username, cancellationToken);
      var wedding = userToWedding?.Wedding;

      return Ok(wedding);
    }

    [HttpPost("message")]
    public async Task<IActionResult> UpdateMessage([FromBody] MessageDto messageDto, CancellationToken cancellationToken)
    {
      // TODO: validate current 'user' by getting 'name' claim of token
      //var currentUser = User.Claims.SingleOrDefault(s => s.Type == ClaimsIdentity.DefaultNameClaimType).Value;
      //var usersToWedding = await _dbContext.UsersToWeddings.SingleOrDefaultAsync(s => s.UserName == currentUser, cancellationToken);
      _logger.LogInformation($"editing message of wedding {messageDto.WeddingId}: {messageDto.MessageForEveryone}");
      var wedding = await _dbContext.Weddings.SingleOrDefaultAsync(s => s.WeddingId == messageDto.WeddingId, cancellationToken);

      wedding.MessageToEveryone = messageDto.MessageForEveryone;
      await _dbContext.SaveChangesAsync(cancellationToken: cancellationToken);

      return Ok(messageDto);
    }

    [HttpPatch]
    public async Task<IActionResult> UpdateWedding([FromBody] Wedding request, CancellationToken cancellationToken)
    {
      var wedding = await _dbContext.Weddings.SingleOrDefaultAsync(s => s.WeddingId == request.WeddingId, cancellationToken);
      if (wedding == null) return BadRequest("Wedding not found!");

      wedding.Bride = request.Bride;
      wedding.CeremonyDate = request.CeremonyDate;
      wedding.CeremonyLocation = request.CeremonyLocation;
      wedding.Groom = request.Groom;
      wedding.LastName = request.LastName;
      wedding.Passphrase = request.Passphrase;
      wedding.PictureUrl = request.PictureUrl;
      wedding.ReceptionDate = request.ReceptionDate;
      wedding.ReceptionLocation = request.ReceptionLocation;
      wedding.Title = request.Title;
      wedding.UrlSubDomain = request.UrlSubDomain;
      // skip messageToEveryone; used in another workflow

      await _dbContext.SaveChangesAsync(cancellationToken);

      return Ok(wedding);
    }
  }
}
