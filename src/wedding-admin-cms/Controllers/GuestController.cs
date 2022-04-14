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
      if (file == null) return BadRequest("file is empty, need a file");

      if (file.Length > 0)
      {
        // verify incoming file is in .xlsx or .xls
        var fileInfo = new FileInfo(file.FileName);
        if (fileInfo.Extension != ".xlsx" && fileInfo.Extension != ".xls") return BadRequest($"file has to be in excel format; currently it's {fileInfo.Extension}");

        var filePath = Path.GetTempPath();
        var fileName = Path.GetRandomFileName() + fileInfo.Extension;

        using var stream = System.IO.File.Create(filePath + fileName);
        await file.CopyToAsync(stream, cancellationToken);
        stream.Close();

        fileInfo = new FileInfo(filePath + fileName);

        // get the wedding based on current domain
        var subDomain = Request.Host.Value;
        var wedding = await _dbContext.Weddings
          .SingleOrDefaultAsync(s => subDomain.ToLower().Contains(s.UrlSubDomain.ToLower()), cancellationToken);

        // setting up the EPPlus package
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        using var package = new ExcelPackage(fileInfo);
        using var sheet = package.Workbook.Worksheets[0];

        var rows = sheet.Dimension.Rows;
        string prevGuestName = string.Empty;    // used to group guests together that have the '+1'
        string prevAddress = string.Empty;      // used to group guests together that have the same address

        for (int rowIndex = 2; rowIndex <= rows; rowIndex++)
        {
          // skip the 'maybe' guests; identified as having an empty background color
          var guestNameBackground = sheet.Cells[rowIndex, 1].Style.Fill.BackgroundColor.Rgb;
          if (string.IsNullOrEmpty(guestNameBackground)) continue;

          var guestName = (string)sheet.Cells[rowIndex, 1].Value;

          // validate the guest name to be inputted
          // make sure guestname is not empty and an existing guest does not exist
          if (string.IsNullOrEmpty(guestName)) continue;
          if (await _dbContext.Guests.AnyAsync(a => a.Name.Equals(guestName), cancellationToken)) continue;

          var guest = new Guest
          {
            HasRsvpd = false,
            Name = guestName,
            WeddingId = wedding.WeddingId
          };

          if (guestName.Contains("+1"))
          {
            guest.GuestGroup = new GuestGroup
            {
              Type = "plus one",
              Value = prevGuestName
            };
          }

          prevGuestName = guestName;

          // don't group guests that don't have an address yet, just insert them as individual guests
          var addressBackground = sheet.Cells[rowIndex, 2].Style.Fill.BackgroundColor.Rgb;
          if (guest.GuestGroup == null && string.IsNullOrEmpty(addressBackground))   // skip the guests that already have '+1' group type
          {
            var addressValue = (string)sheet.Cells[rowIndex, 2].Value;

            if (string.IsNullOrEmpty(addressValue)) addressValue = prevAddress;
            prevAddress = addressValue;

            guest.GuestGroup = new GuestGroup
            {
              Type = "address",
              Value = addressValue
            };
          }

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
