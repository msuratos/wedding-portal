using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using wedding_admin_cms.Persistance;

namespace wedding_admin_cms.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/[controller]")]
  public class SongRequestController : ControllerBase
  {
    private readonly ILogger<SongRequestController> _logger;
    private readonly WeddingDbContext _dbContext;

    public SongRequestController(ILogger<SongRequestController> logger, WeddingDbContext dbContext)
    {
      _logger = logger;
      _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetSongRequests(CancellationToken cancellationToken)
    {
      _logger.LogDebug("Getting songs requests for wedding");

      // get weddingid based of host subdomain
      var host = Request.Host.Host;
      var wedding = await _dbContext.Weddings.SingleOrDefaultAsync(s => host.ToLower().Contains(s.UrlSubDomain.ToLower()), cancellationToken);

      // get song requests
      var songRequests = await _dbContext.SongRequests.Where(w => w.FkWeddingId == wedding.WeddingId)
        .Select(s => new { s.SongRequestId, s.SongName }).ToListAsync(cancellationToken);
      return Ok(songRequests);
    }
  }
}
