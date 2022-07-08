using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using wedding_frontend.Persistance;
using wedding_frontend.Persistance.Entities;

namespace wedding_frontend.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class TriviaController : ControllerBase
  {
    private readonly ILogger<TriviaController> _logger;
    private readonly WeddingDbContext _context;

    public TriviaController(ILogger<TriviaController> logger, WeddingDbContext context)
    {
      _logger = logger;
      _context = context;
    }

    [HttpPost("answer")]
    public async Task<IActionResult> AddTriviaUserAnswer([FromBody] TriviaUserAnswer request, CancellationToken cancellationToken)
    {
      _logger.LogInformation("Add trivia user answer: {0}", JsonConvert.SerializeObject(request));

      // get wedding id
      var host = Request.Host.Value;
      var wedding = await _context.Weddings.SingleOrDefaultAsync(s => host.Contains(s.UrlSubDomain), cancellationToken);

      if (wedding == null) return BadRequest((object)new Exception("Could not find wedding based on url"));
      var weddingId = wedding.WeddingId;

      // validate the wedding id
      if (weddingId == Guid.Empty) throw new Exception($"Invalid wedding id: {weddingId}. Should not be an empty GUID");
      if (!await _context.Weddings.AnyAsync(a => a.WeddingId == weddingId, cancellationToken))
        throw new Exception($"Invalid wedding id, could not find the related wedding");

      // validate the trivia id: make sure trivia id is not an empty guid &
      // make sure that the trivia answer that are adding is adding to the correct trivia with the correct wedding id
      if (request.TriviaQuestionId == Guid.Empty) throw new Exception($"Invalid trivia question id to add: {request.TriviaQuestionId}. Should not be emtpy GUID");
      if (!await _context.Trivias
        .Include(i => i.TriviaQuestions)
        .AnyAsync(a => a.WeddingId == weddingId && a.TriviaQuestions.Any(a => a.TriviaQuestionId == request.TriviaQuestionId), cancellationToken)
      )
        return BadRequest($"Could not find trivia question id to add answer: {request.TriviaQuestionId}");

      // make sure the trivia is not closed
      var trivia = await _context.Trivias.SingleOrDefaultAsync(s => s.WeddingId == weddingId, cancellationToken);
      if (!trivia.IsOpen.Value) return BadRequest("Sorry, the trivia has been closed.");

      // add the user answer
      await _context.TriviaUserAnswers.AddAsync(request, cancellationToken);
      await _context.SaveChangesAsync(cancellationToken);

      return Created("/", request);
    }

    [HttpGet]
    public async Task<IActionResult> GetTriviaQuestions(CancellationToken cancellationToken)
    {
      _logger.LogInformation("Getting trivia questions for wedding");

      // get wedding id
      var host = Request.Host.Value;
      var wedding = await _context.Weddings.SingleOrDefaultAsync(s => host.Contains(s.UrlSubDomain), cancellationToken);

      if (wedding == null) return BadRequest((object)new Exception("Could not find wedding based on url"));
      var weddingId = wedding.WeddingId;

      // validate the wedding id
      if (weddingId == Guid.Empty) throw new Exception($"Invalid wedding id: {weddingId}. Should not be an empty GUID");
      if (!await _context.Weddings.AnyAsync(a => a.WeddingId == weddingId, cancellationToken))
        throw new Exception($"Invalid wedding id, could not find the relatd wedding");

      var trivia = await _context.Trivias
        .Include(i => i.TriviaQuestions)
        .Select(s => new
        {
          s.WeddingId,
          s.TriviaId,
          s.Title,
          s.Description,
          s.IsOpen,
          TriviaQuestions = s.TriviaQuestions
            .Select(se => new
            {
              se.TriviaQuestionId,
              se.Question,
              se.Answer,
              se.SortRank
            })
            .OrderBy(o => o.SortRank)
            .ToList()
        })
        .SingleOrDefaultAsync(a => a.WeddingId == weddingId, cancellationToken);

      return Ok(trivia);
    }
  }
}
