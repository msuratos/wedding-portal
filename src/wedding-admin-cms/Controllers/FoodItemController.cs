using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web.Resource;
using wedding_admin_cms.Dtos;
using wedding_admin_cms.Persistance;

namespace wedding_admin_cms.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/[controller]")]
  [RequiredScope(scopeRequiredByAPI)]
  public class FoodItemController : ControllerBase
  {
    const string scopeRequiredByAPI = "user.access";

    private readonly ILogger<FoodItemController> _logger;
    private readonly WeddingDbContext _context;

    public FoodItemController(ILogger<FoodItemController> logger, WeddingDbContext context)
    {
      _context = context;
      _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetFoodItemsForWedding([FromQuery] Guid weddingId, CancellationToken cancellationToken)
    {
      _logger.LogInformation($"Getting food items for wedding: {weddingId}");

      var foodItems = await _context.FoodItems
        .Where(w => w.WeddingId == weddingId)
        .Include(nav => nav.FoodType)
        .Select(s => new FoodItemDto
        {
          FoodId = s.FoodId,
          Description = s.Description,
          Food = s.Food,
          FoodType = s.FoodType.Type
        })
        .ToListAsync(cancellationToken);
      return Ok(foodItems);
    }
  }
}
