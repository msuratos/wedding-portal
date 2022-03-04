using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web.Resource;
using wedding_admin_cms.Persistance;
using wedding_admin_cms.Persistance.Entities;

namespace wedding_admin_cms.Controllers
{
  [Authorize]
  [ApiController]
  [Route("[controller]")]
  [RequiredScope(scopeRequiredByAPI)]
  public class WeddingController : ControllerBase
  {
    const string scopeRequiredByAPI = "user.access";

    private readonly ILogger<WeddingController> _logger;
    private readonly WeddingDbContext _dbContext;

    public WeddingController(ILogger<WeddingController> logger, WeddingDbContext dbContext)
    {
      _logger = logger;
      _dbContext = dbContext;
    }

    [HttpPost]
    public async Task<IActionResult> CreateWedding([FromBody] Wedding dto, CancellationToken cancellationToken)
    {
      // create new wedding
      await _dbContext.Weddings.AddAsync(dto, cancellationToken);
      await _dbContext.SaveChangesAsync(cancellationToken);

      // add user to wedding
      var username = User.Claims.SingleOrDefault(s => s.Type == "emails").Value;
      var displayname = User.Claims.SingleOrDefault(s => s.Type == "name").Value;

      var userToWedding = new UsersToWedding()
      {
        DisplayName = displayname,
        UserName = username,
        UserRoles = UsersToWedding.UserRole.Primary,
        WeddingId = dto.WeddingId // have to wait till wedding has committed to the database to get the wedding id
      };

      await _dbContext.UsersToWeddings.AddAsync(userToWedding, cancellationToken);
      await _dbContext.SaveChangesAsync(cancellationToken);

      return Ok(dto);
    }
  }
}
