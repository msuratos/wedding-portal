using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace wedding_admin_cms.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeddingController : ControllerBase
    {
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
