using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web.Resource;
using Newtonsoft.Json;
using wedding_admin_cms.Dtos;
using wedding_admin_cms.Persistance;
using wedding_admin_cms.Persistance.Entities;

namespace wedding_admin_cms.Controllers
{
  [Authorize]                     // comment if you want to skip OAuth while debugging
  [ApiController]
  [Route("api/[controller]")]
  [RequiredScope(requiredScope)]  // comment if you want to skip OAuth while debugging
  public class TriviaController : ControllerBase
  {
    const string requiredScope = "User.Access";

    private readonly ILogger<TriviaController> _logger;
    private readonly WeddingDbContext _context;

    public TriviaController(ILogger<TriviaController> logger, WeddingDbContext context)
    {
      _logger = logger;
      _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTrivia([FromBody] TriviaDto trivia, CancellationToken cancellationToken)
    {
      _logger.LogInformation("creating trivia: {0}", JsonConvert.SerializeObject(trivia));

      // validate trivia dto
      if (trivia.WeddingId == Guid.Empty) throw new Exception($"Invalid wedding id: {trivia.WeddingId}. Should not be an empty GUID");
      if (!await _context.Weddings.AnyAsync(a => a.WeddingId == trivia.WeddingId, cancellationToken))
        throw new Exception($"Invalid wedding id, could not find the relatd wedding");
      if (string.IsNullOrEmpty(trivia.Title)) throw new Exception("New trivia must have a title");

      await _context.Trivias.AddAsync(new Trivia
      {
        CreatedDate = trivia.CreatedDate,
        Description = trivia.Description,
        IsOpen = trivia.IsOpen,
        Title = trivia.Title,
        WeddingId = trivia.WeddingId
      }, cancellationToken);
      await _context.SaveChangesAsync(cancellationToken);

      return Created("/", trivia);
    }

    [HttpPost("questions")]
    public async Task<IActionResult> CreateTriviaQuestions([FromBody] TriviaQuestionDto triviaQuestion, CancellationToken cancellationToken)
    {
      _logger.LogInformation("creating trivia: {0}", JsonConvert.SerializeObject(triviaQuestion));

      // validate trivia dto
      if (triviaQuestion.TriviaId == Guid.Empty) throw new Exception($"Invalid wedding id: {triviaQuestion.TriviaId}. Should not be an empty GUID");
      if (!await _context.Trivias.AnyAsync(a => a.TriviaId == triviaQuestion.TriviaId, cancellationToken))
        throw new Exception($"Invalid wedding id, could not find the relatd wedding");
      if (string.IsNullOrEmpty(triviaQuestion.Question)) throw new Exception("Question is empty, must have a question");
      if (string.IsNullOrEmpty(triviaQuestion.Answer)) throw new Exception("Answer is empty, must have an answer");

      await _context.TriviaQuestions.AddAsync(new TriviaQuestion
      {
        Answer = triviaQuestion.Answer,
        Question = triviaQuestion.Question,
        TriviaId = triviaQuestion.TriviaId,
        SortRank = triviaQuestion.SortRank
      }, cancellationToken);
      await _context.SaveChangesAsync(cancellationToken);

      return Created("/", triviaQuestion);
    }

    [HttpGet]
    public async Task<IActionResult> GetTrivia([FromQuery] Guid weddingId, CancellationToken cancellationToken)
    {
      _logger.LogInformation("Getting trivia questions for wedding: {0}", weddingId);

      // validate the wedding id
      if (weddingId == Guid.Empty) throw new Exception($"Invalid wedding id: {weddingId}. Should not be an empty GUID");
      if (!await _context.Weddings.AnyAsync(a => a.WeddingId == weddingId, cancellationToken))
        throw new Exception($"Invalid wedding id, could not find the relatd wedding");

      var trivia = await _context.Trivias
        .Include(i => i.TriviaQuestions)
        .SingleOrDefaultAsync(a => a.WeddingId == weddingId, cancellationToken);

      return Ok(trivia);
    }

    // TODO: Get trivia results; retrieve who the winner is
  }
}
