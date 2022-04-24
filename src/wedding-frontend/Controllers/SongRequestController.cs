using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using wedding_frontend.Dtos;
using wedding_frontend.Persistance;
using wedding_frontend.Persistance.Entities;

namespace wedding_frontend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SongRequestController : ControllerBase
  {
    private readonly ILogger<SongRequestController> _logger;
    private readonly WeddingDbContext _dbContext;

    public SongRequestController(ILogger<SongRequestController> logger, WeddingDbContext dbContext)
    {
      _logger = logger;
      _dbContext = dbContext;
    }

    [HttpPost]
    public async Task<IActionResult> AddSongRequest([FromBody] SongRequestDto request, CancellationToken cancellationToken)
    {
      // get wedding id from host subdomain
      var host = Request.Host.Host;
      var wedding = await _dbContext.Weddings.SingleOrDefaultAsync(s => host.ToLower().Contains(s.UrlSubDomain.ToLower()), cancellationToken);

      // split request by commas and add each request by split
      var songRequests = request.SongNames.Split(',');
      foreach (var songRequest in songRequests)
      {
        await _dbContext.SongRequests.AddAsync(new SongRequest
        {
          FkWeddingId = wedding.WeddingId,
          SongName = songRequest.Trim(),
          RequestedDate = DateTime.Now
        }, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
      }

      return Ok();
    }
  }
}
