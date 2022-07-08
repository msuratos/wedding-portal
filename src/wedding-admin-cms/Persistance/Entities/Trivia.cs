namespace wedding_admin_cms.Persistance.Entities
{
  public class Trivia
  {
    public Trivia()
    {
      TriviaQuestions = new HashSet<TriviaQuestion>();
    }

    public Guid TriviaId { get; set; }
    public Guid WeddingId { get; set; }
    public DateTime CreatedDate { get; set; }
    public string Description { get; set; }
    public bool IsOpen { get; set; }
    public string Title { get; set; }

    public Wedding Wedding { get; set; }
    public ICollection<TriviaQuestion> TriviaQuestions { get; set; }
  }
}
