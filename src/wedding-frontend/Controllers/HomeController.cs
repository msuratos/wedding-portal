using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using wedding_frontend.Persistance;
using wedding_frontend.Persistance.Entities;

namespace wedding_frontend.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class HomeController : ControllerBase
  {
    private readonly ILogger<HomeController> _logger;
    private readonly WeddingDbContext _dbContext;

    public HomeController(ILogger<HomeController> logger, WeddingDbContext dbContext)
    {
      _logger = logger;
      _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<Wedding> Get(CancellationToken cancellationToken)
    {
      var currentDomain = Request.Host.Host;
      var wedding = await _dbContext.Weddings.SingleOrDefaultAsync(s => s.UrlSubDomain.Contains(currentDomain), cancellationToken);

      _logger.LogInformation("Attempting to get wedding information based on url: {0} - {1}", currentDomain, JsonConvert.SerializeObject(wedding));

      return wedding;
    }
  }
}
