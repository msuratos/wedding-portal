using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using wedding_frontend.Persistance;

namespace wedding_frontend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class ScheduleController : ControllerBase
  {
    private readonly ILogger<ScheduleController> _logger;
    private readonly WeddingDbContext _context;

    public ScheduleController(ILogger<ScheduleController> logger, WeddingDbContext context)
    {
      _logger = logger;
      _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetScheduleOfWedding(CancellationToken cancellationToken)
    {
      var host = Request.Host.Value;
      var wedding = await _context.Weddings.SingleOrDefaultAsync(s => host.Contains(s.UrlSubDomain), cancellationToken);

      if (wedding == null) return BadRequest((object)new Exception("Could not find wedding based on url"));
      var weddingId = wedding.WeddingId;

      _logger.LogInformation($"Getting schedule of {weddingId}");

      // validate the wedding id
      if (weddingId == Guid.Empty) return BadRequest((object)new Exception("Invalid wedding id, can not be empty"));
      if (!await _context.Schedules.AnyAsync(a => a.WeddingId == weddingId, cancellationToken))
        return NotFound((object)new Exception($"Can not find wedding with ID: {weddingId}"));

      // get the schedule of the wedding
      var schedule = await _context.Schedules
        .Where(w => w.WeddingId == weddingId)
        .Select(s => new
        {
          s.ScheduleId,
          s.Activity,
          s.ActivityStartTime,
          s.ActivityEndTime
        })
        .OrderBy(o => o.ActivityStartTime)
        .ToListAsync(cancellationToken);

      return Ok(schedule);
    }
  }
}