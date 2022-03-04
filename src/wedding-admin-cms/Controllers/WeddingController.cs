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

        [HttpGet]
        public string Get()
        {
            return "Api for Wedding CMS (Admin)";
        }

        [HttpPost]
        public async Task<IActionResult> CreateWedding([FromBody] Wedding dto, CancellationToken cancellationToken) 
        {
            await _dbContext.Weddings.AddAsync(dto, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);
            return Ok(dto);
        }
    }
}
