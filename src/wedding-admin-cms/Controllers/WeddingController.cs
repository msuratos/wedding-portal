﻿using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web.Resource;
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

    private readonly ILogger<WeddingController> _logger;
    private readonly WeddingDbContext _dbContext;

    public WeddingController(ILogger<WeddingController> logger, WeddingDbContext dbContext)
    {
      _logger = logger;
      _dbContext = dbContext;
    }

    [HttpPost("entourage")]
    public async Task<IActionResult> AddEntourage([FromBody]Entourage dto, CancellationToken cancellationToken)
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
    public async Task<IActionResult> UpdateMessage([FromBody]MessageDto messageDto, CancellationToken cancellationToken)
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
    public async Task<IActionResult> UpdateWedding([FromBody]Wedding request, CancellationToken cancellationToken)
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
