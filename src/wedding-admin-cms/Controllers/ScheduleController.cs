using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web.Resource;
using wedding_admin_cms.Persistance;
using wedding_admin_cms.Persistance.Entities;

namespace wedding_admin_cms.Controllers
{
  [Authorize]                           // comment out if you want to skip OAuth while debugging
  [ApiController]
  [Route("api/[controller]")]
  [RequiredScope(scopeRequiredByAPI)]   // comment out if you want to skip OAuth while debugging
  public class ScheduleController : ControllerBase
  {
    const string scopeRequiredByAPI = "user.access";

    private readonly ILogger<ScheduleController> _logger;
    private readonly WeddingDbContext _context;

    public ScheduleController(ILogger<ScheduleController> logger, WeddingDbContext context)
    {
      _logger = logger;
      _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetScheduleOfWedding([FromQuery] Guid weddingId, CancellationToken cancellationToken)
    {
      _logger.LogInformation($"Getting schedule of {weddingId}");

      // validate the wedding id
      if (weddingId == Guid.Empty) return BadRequest((object)new Exception("Invalid wedding id, can not be empty"));
      if (!await _context.Schedules.AnyAsync(a => a.WeddingId == weddingId, cancellationToken)) 
        return NotFound((object)new Exception($"Can not find wedding with ID: {weddingId}"));

      // get the schedule of the wedding
      var schedule = await _context.Schedules.Where(w => w.WeddingId == weddingId).OrderBy(o => o.ActivityStartTime).ToListAsync(cancellationToken);
      return Ok(schedule);
    }

    [HttpPost]
    public async Task<IActionResult> AddActivityForWeddingSchedule([FromBody] Schedule schedule, CancellationToken cancellationToken)
    {
      // validate the wedding id
      if (schedule.WeddingId == Guid.Empty) return BadRequest((object)new Exception("Invalid wedding id, can not be empty"));
      if (!await _context.Weddings.AnyAsync(a => a.WeddingId == schedule.WeddingId)) 
        return NotFound((object)new Exception($"Can not find wedding with ID: {schedule.WeddingId}"));

      // validate the schedule
      if (string.IsNullOrEmpty(schedule.Activity)) return BadRequest((object)new Exception("Schedule activity can not be empty"));
      if (schedule.ActivityStartTime == DateTime.MinValue) return BadRequest((object)new Exception("Schedule activity start time can not be empty"));
      if (schedule.ActivityEndTime == DateTime.MinValue) return BadRequest((object)new Exception("Schedule activity end time can not be empty"));

      await _context.Schedules.AddAsync(schedule, cancellationToken);
      await _context.SaveChangesAsync(cancellationToken);

      return Created("/", schedule);
    }
  }
}
