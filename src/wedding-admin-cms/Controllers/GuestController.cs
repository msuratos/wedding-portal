using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web.Resource;
using OfficeOpenXml;
using System;
using System.IO;
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
  public class GuestController : ControllerBase
  {
    const string scopeRequiredByAPI = "user.access";
    private readonly ILogger<GuestController> _logger;
    private readonly WeddingDbContext _dbContext;

    public GuestController(ILogger<GuestController> logger, WeddingDbContext dbContext)
    {
      _dbContext = dbContext;
      _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreateGuestList(IFormFile file, CancellationToken cancellationToken)
    {
      if (file.Length > 0)
      {
        var filePath = Path.GetTempFileName();

        using var stream = System.IO.File.Create(filePath);
        await file.CopyToAsync(stream, cancellationToken);

        var fileInfo = new FileInfo(filePath);
        if (fileInfo.Extension != "xlsx" && fileInfo.Extension != "xls") return BadRequest($"file has to be in excel format; currently it's {fileInfo.Extension}");

        // get the wedding based on current domain
        var subDomain = Request.Host.Value;
        var wedding = await _dbContext.Weddings
          .SingleOrDefaultAsync(s => s.UrlSubDomain.Contains(subDomain, StringComparison.InvariantCultureIgnoreCase), cancellationToken);

        // setting up the EPPlus package
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        using var package = new ExcelPackage(fileInfo);
        using var sheet = package.Workbook.Worksheets[0];
        var rows = sheet.Rows.Count();

        for (int rowIndex = 1; rowIndex <= rows; rowIndex++)
        {
          var guestName = (string)sheet.Cells[rowIndex, 1].Value;

          // make sure an existing guest does not exist, if so, skip it
          if (await _dbContext.Guests.AnyAsync(a => a.Name.Equals(guestName), cancellationToken)) continue;

          var addressValue = (string)sheet.Cells[rowIndex, 2].Value;
          var guest = new Guest
          {
            HasRsvpd = false,
            Name = guestName,
            WeddingId = wedding.WeddingId,
            GuestGroup = new GuestGroup
            {
              Type = "address",
              Value = addressValue
            }
          };

          await _dbContext.Guests.AddAsync(guest, cancellationToken);
          await _dbContext.SaveChangesAsync(cancellationToken);
        }
      }

      return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetGuestList(CancellationToken cancellationToken)
    {
      var subDomain = Request.Host.Value;
      var wedding = await _dbContext.Weddings
        .SingleOrDefaultAsync(s => s.UrlSubDomain.Contains(subDomain, StringComparison.InvariantCultureIgnoreCase), cancellationToken);

      var guestList = await _dbContext.Guests
        .Include(nav => nav.GuestGroup)
        .Where(w => w.WeddingId == wedding.WeddingId)
        .ToListAsync(cancellationToken);

      return Ok(guestList);
    }
  }
}
