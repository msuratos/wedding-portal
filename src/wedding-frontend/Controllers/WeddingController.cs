﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using wedding_frontend.Dtos;
using wedding_frontend.Persistance;
using wedding_frontend.Persistance.Entities;

namespace wedding_frontend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
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
    public async Task<Wedding> GetWedding(CancellationToken cancellationToken)
    {
      var currentDomain = Request.Host.Host;
      var wedding = await _dbContext.Weddings.SingleOrDefaultAsync(s => currentDomain.Contains(s.UrlSubDomain), cancellationToken);

      _logger.LogInformation("Attempting to get wedding information based on url: {0} - {1}", currentDomain, JsonConvert.SerializeObject(wedding));

      return wedding;
    }

    [HttpPost]
    public async Task<IActionResult> ValidatePassphrase([FromBody] PassphraseValidationDto dto, CancellationToken cancellationToken)
    {
      // validate the request dto
      if (dto.WeddingId == Guid.Empty) return BadRequest(new Exception("Invalid wedding id"));
      if (string.IsNullOrEmpty(dto.Passphrase)) return BadRequest(new Exception("passphrase can not be empty"));

      var wedding = await _dbContext.Weddings.SingleOrDefaultAsync(s => s.WeddingId == dto.WeddingId, cancellationToken);
      var passphrase = wedding.Passphrase;
      var isValidPassphrase = dto.Passphrase.Equals(passphrase, StringComparison.OrdinalIgnoreCase);

      return Ok(isValidPassphrase);
    }
  }
}