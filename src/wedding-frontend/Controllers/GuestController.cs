using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using wedding_frontend.Dtos;
using wedding_frontend.Persistance;

namespace wedding_frontend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class GuestController : ControllerBase
  {
    private readonly ILogger<GuestController> _logger;
    private readonly WeddingDbContext _dbContext;

    public GuestController(ILogger<GuestController> logger, WeddingDbContext dbContext)
    {
      _logger = logger;
      _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> FindGuest(string nameSearchValue, CancellationToken cancellationToken)
    {
      // get the wedding id based on request url
      var subDomain = Request.Host.Value;
      var wedding = await _dbContext.Weddings.SingleOrDefaultAsync(s => subDomain.ToLower().Contains(s.UrlSubDomain.ToLower()), cancellationToken);

      // make sure a valid wedding exists
      if (wedding == null) return NotFound();
      var weddingId = wedding.WeddingId;

      // TODO: switch to using full text search, currently using EF.Functions
      // reference - https://stackoverflow.com/questions/43277868/entity-framework-core-contains-is-case-sensitive-or-case-insensitive
      // reference - https://docs.microsoft.com/en-us/sql/relational-databases/search/get-started-with-full-text-search?view=sql-server-ver15
      // reference - https://www.bricelam.net/2020/08/08/mssql-freetext-and-efcore.html
      var similarGuests = await _dbContext.Guests
        .Where(w => w.WeddingId == weddingId && EF.Functions.Like(w.Name, $"%{nameSearchValue}%"))
        .Select(s => new GuestListDto
        {
          WeddingId = s.WeddingId,
          Name = s.Name,
          GuestId = s.GuestId,
          GuestGroupId = s.GuestGroup.GuestGroupId,
          GroupType = s.GuestGroup.Type,
          GroupValue = s.GuestGroup.Value
        })
        .ToListAsync(cancellationToken);

      foreach (var guest in similarGuests)
      {
        guest.RelatedGuests = await BuildRelatedGuests(guest.GuestGroupId, guest.GroupType, guest.GroupValue, cancellationToken);
      }

      return Ok(similarGuests);
    }

    [HttpPost]
    public async Task<IActionResult> RsvpGuests([FromBody] ICollection<GuestListDto> rsvpGuests, CancellationToken cancellationToken)
    {
      // get the wedding id based on request url
      var subDomain = Request.Host.Value;
      var wedding = await _dbContext.Weddings.SingleOrDefaultAsync(s => subDomain.ToLower().Contains(s.UrlSubDomain.ToLower()), cancellationToken);

      // make sure a valid wedding exists
      if (wedding == null) return NotFound();
      var weddingId = wedding.WeddingId;

      foreach (var guest in rsvpGuests)
      {
        var dbGuest = await _dbContext.Guests
          .SingleOrDefaultAsync(s => s.WeddingId == weddingId && s.GuestId == guest.GuestId, cancellationToken);

        dbGuest.RsvpDate = DateTime.Now;
        dbGuest.HasRsvpd = true;

        await _dbContext.SaveChangesAsync(cancellationToken);
      }

      return Ok();
    }

    private async Task<ICollection<GuestListDto>> BuildRelatedGuests(Guid? guestGroupId, string groupType, 
      string groupValue, CancellationToken cancellationToken)
    {
      return await _dbContext.GuestGroups
        .Where(w => w.GuestGroupId != guestGroupId && w.Type.Equals(groupType) && w.Value.Equals(groupValue))
        .Select(s => new GuestListDto
        {
          GuestId = s.Guests.SingleOrDefault().GuestId,
          WeddingId = s.Guests.SingleOrDefault().WeddingId,
          Name = s.Guests.SingleOrDefault().Name,
          GuestGroupId = s.GuestGroupId
        })
        .ToListAsync(cancellationToken);
    }
  }
}
