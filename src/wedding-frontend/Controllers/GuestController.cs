using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
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
        .Where(w => w.WeddingId == weddingId && w.Name.ToLower().Contains(nameSearchValue.ToLower()))
        .Select(s => new GuestListDto
        {
          GuestId = s.GuestId,
          WeddingId = s.WeddingId,
          Name = s.Name,
          HasRsvpd = s.HasRsvpd,
          RelatedGuests = s.GuestGroup.Guests
            .Where(w => w.GuestId != s.GuestId)
            .Select(g => new GuestListDto
            {
              GuestId = g.GuestId,
              WeddingId = g.WeddingId,
              Name = g.Name,
              HasRsvpd = g.HasRsvpd
            })
            .ToList()
        })
        .ToListAsync(cancellationToken);

      return Ok(similarGuests);
    }

    [HttpPost]
    public async Task<IActionResult> RsvpGuests([FromBody] ICollection<GuestListDto> rsvpGuests, CancellationToken cancellationToken)
    {
      _logger.LogInformation("Updating guests' responses: {0}", JsonConvert.SerializeObject(rsvpGuests));

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
        dbGuest.HasRsvpd = !guest.HasRejected;

        await _dbContext.SaveChangesAsync(cancellationToken);
      }

      return Ok();
    }
  }
}
