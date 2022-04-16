using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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

      // TODO: switch to using full text search
      // refrence - https://docs.microsoft.com/en-us/sql/relational-databases/search/get-started-with-full-text-search?view=sql-server-ver15
      // refernce - https://www.bricelam.net/2020/08/08/mssql-freetext-and-efcore.html
      var similarGuests = await _dbContext.Guests.Where(w => w.WeddingId == weddingId && EF.Functions.Like(w.Name, $"%{nameSearchValue}%"))
        .Select(s => s.Name)
        .ToListAsync(cancellationToken);

      return Ok(similarGuests);
    }
  }
}
