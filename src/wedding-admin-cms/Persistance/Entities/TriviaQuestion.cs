namespace wedding_admin_cms.Persistance.Entities
{
  public class TriviaQuestion
  {
    public TriviaQuestion()
    {
      TriviaUserAnswers = new HashSet<TriviaUserAnswer>();
    }

    public Guid TriviaQuestionId { get; set; }
    public Guid TriviaId { get; set; }         // foreign key
    public string Question { get; set; }
    public string Answer { get; set; }
    public int SortRank { get; set; }

    public Trivia Trivia { get; set; }
    public ICollection<TriviaUserAnswer> TriviaUserAnswers { get; set; }
  }
}
