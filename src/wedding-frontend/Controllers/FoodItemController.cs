using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using wedding_frontend.Persistance;

namespace wedding_frontend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class FoodItemController : ControllerBase
  {
    private readonly ILogger<FoodItemController> _logger;
    private readonly WeddingDbContext _context;

    public FoodItemController(ILogger<FoodItemController> logger, WeddingDbContext context)
    {
      _logger = logger;
      _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetFoodItems(CancellationToken cancellationToken)
    {
      var currentDomain = Request.Host.Host;
      var wedding = await _context.Weddings
        .SingleOrDefaultAsync(s => currentDomain.Contains(s.UrlSubDomain), cancellationToken);

      if (wedding == null) return NotFound();

      var foodItems = await _context.FoodItems
        .Where(w => w.WeddingId == wedding.WeddingId)
        .Include(nav => nav.FoodType)
        .Select(s => new
        {
          s.FoodId,
          s.WeddingId,
          s.Food,
          s.Description,
          s.FoodType.Type
        })
        .ToListAsync(cancellationToken);

      return Ok(foodItems);
    }
  }
}
