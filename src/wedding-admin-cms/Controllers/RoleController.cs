using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web.Resource;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using wedding_admin_cms.Persistance;
using wedding_admin_cms.Persistance.Entities;

namespace wedding_admin_cms.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/[controller]")]
  [RequiredScope(scopeRequiredByAPI)]
  public class RoleController : ControllerBase
  {
    const string scopeRequiredByAPI = "user.access";

    private readonly ILogger<RoleController> _logger;
    private readonly WeddingDbContext _dbContext;

    public RoleController(ILogger<RoleController> logger, WeddingDbContext dbContext)
    {
      _logger = logger;
      _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetRoles(CancellationToken token)
    {
      _logger.LogInformation("Getting all roles for weddings");
      return Ok(await _dbContext.Roles.Select(s => new { Id = s.RoleId, s.Name, s.Description }).ToListAsync(token));
    }

    [HttpPost]
    public async Task<IActionResult> PostRoles([FromBody]Role dto, CancellationToken token)
    {
      _logger.LogInformation("Creating new role..");
      await _dbContext.Roles.AddAsync(dto, token);
      await _dbContext.SaveChangesAsync(token);

      return Ok(new { Id = dto.RoleId, dto.Name, dto.Description });
    }
  }
}
