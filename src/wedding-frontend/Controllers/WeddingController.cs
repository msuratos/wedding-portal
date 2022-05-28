using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using wedding_frontend.Dtos;
using wedding_frontend.Persistance;
using wedding_frontend.Persistance.Entities;

namespace wedding_frontend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class WeddingController : ControllerBase
  {
    private readonly IConfiguration _configuration;
    private readonly ILogger<WeddingController> _logger;
    private readonly WeddingDbContext _dbContext;

    public WeddingController(IConfiguration configuration, ILogger<WeddingController> logger, WeddingDbContext dbContext)
    {
      _configuration = configuration;
      _logger = logger;
      _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<Wedding> GetWedding(CancellationToken cancellationToken)
    {
      var currentDomain = Request.Host.Host;
      var wedding = await _dbContext.Weddings.SingleOrDefaultAsync(s => currentDomain.Contains(s.UrlSubDomain), cancellationToken);

      _logger.LogInformation("Attempting to get wedding information based on url: {0} - {1}", currentDomain, JsonConvert.SerializeObject(wedding));

      return wedding;
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
        .Select(s => new
        {
          PhotoId = s.PhotoId,
          ImgPath = $"{_configuration["AzureCdnUrl"]}/{s.FileName}",
          Label = $"Photo"
        })
        .ToListAsync(cancellationToken: cancellationToken);

      return Ok(photos);
    }

    [HttpPost]
    public async Task<IActionResult> ValidatePassphrase([FromBody] PassphraseValidationDto dto, CancellationToken cancellationToken)
    {
      var currentDomain = Request.Host.Host;
      var wedding = await _dbContext.Weddings.SingleOrDefaultAsync(s => currentDomain.Contains(s.UrlSubDomain), cancellationToken);

      // validate the request dto
      if (wedding == null) return BadRequest(new Exception("could not find a wedding based on url"));
      if (string.IsNullOrEmpty(dto.Passphrase)) return BadRequest(new Exception("passphrase can not be empty"));

      var isValidPassphrase = wedding.Passphrase.Equals(dto.Passphrase, StringComparison.OrdinalIgnoreCase);

      return Ok(isValidPassphrase);
    }
  }
}
