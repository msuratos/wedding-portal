using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web.Resource;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using wedding_admin_cms.Persistance;

namespace wedding_admin_cms.Controllers
{
  [Authorize]
  [ApiController]
  [Route("[controller]")]
  [RequiredScope(scopeRequiredByAPI)]
  public class EntourageController : ControllerBase
  {
    const string scopeRequiredByAPI = "user.access";

    private readonly ILogger<EntourageController> _logger;
    private readonly WeddingDbContext _dbContext;

    public EntourageController(ILogger<EntourageController> logger, WeddingDbContext dbContext)
    {
      _logger = logger;
      _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetEntourage([FromQuery] Guid weddingId, CancellationToken cancellationToken)
    {
      var entourages = await _dbContext.Entourages.Where(w => w.EntourageOfWeddingId == weddingId).ToListAsync(cancellationToken);
      return Ok(entourages);
    }
  }
}
