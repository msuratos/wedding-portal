using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web.Resource;
using wedding_admin_cms.Dtos;
using wedding_admin_cms.Persistance;
using wedding_admin_cms.Persistance.Entities;

namespace wedding_admin_cms.Controllers
{
  [Authorize]                           // comment out if you want to skip OAuth while debugging
  [ApiController]
  [Route("api/[controller]")]
  [RequiredScope(scopeRequiredByAPI)]   // comment out if you want to skip OAuth while debugging
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

    /// <summary>
    /// Gets the food items related to the wedding. We pass the Wedding ID through the 
    /// query so that we can switch between weddings.
    /// </summary>
    /// <param name="weddingId">GUID of wedding users are managing</param>
    /// <param name="cancellationToken">Default generated cancellation token that ASP.NET generates</param>
    /// <returns>JSON array of all the items for the wedding</returns>
    [HttpGet]
    public async Task<IActionResult> GetFoodItemsForWedding([FromQuery] Guid weddingId, CancellationToken cancellationToken)
    {
      _logger.LogInformation($"Getting food items for wedding: {weddingId}");

      var foodItems = await _context.FoodItems
        .Where(w => w.WeddingId == weddingId)
        .Include(nav => nav.FoodType)
        .OrderBy(o => o.FoodType.FoodTypeId)
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

    /// <summary>
    /// Adds a food item to the wedding selected
    /// </summary>
    /// <param name="foodItem">Actual food item entity to add</param>
    /// <param name="cancellationToken">Default generated cancellation token that ASP.NET generates</param>
    /// <returns>201 with newly added food item or 500 with exception details</returns>
    /// <exception cref="Exception">Exception details of the error</exception>
    [HttpPost]
    public async Task<IActionResult> AddFoodItemsForWedding([FromBody] FoodItem foodItem, CancellationToken cancellationToken)
    {
      // validating request body content
      if (foodItem.WeddingId == Guid.Empty) throw new Exception("Wedding ID is empty, submit a valid GUID");
      if (!await _context.Weddings.AnyAsync(a => a.WeddingId == foodItem.WeddingId, cancellationToken)) throw new Exception("Can't find the right wedding, check wedding id");
      if (!await _context.FoodTypes.AnyAsync(a => a.FoodTypeId == foodItem.FoodTypeId, cancellationToken)) throw new Exception("Invalid food type id");
      if (string.IsNullOrEmpty(foodItem.Food)) throw new Exception("Empty food value, submit a valid food value");

      // if valid rquest object, add food item and save changes to database
      await _context.FoodItems.AddAsync(foodItem, cancellationToken);
      await _context.SaveChangesAsync(cancellationToken);

      return Created("/api/fooditem", foodItem);
    }
  }
}
