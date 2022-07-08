namespace wedding_admin_cms.Persistance.Entities
{
  public class TriviaUserAnswer
  {
    public Guid TriviaUserAnswerId { get; set; }
    public Guid TriviaQuestionId { get; set; }    // foreign key
    public DateTime CreatedDate { get; set; }
    public string Username { get; set; }
    public string UserAnswer { get; set; }

    public TriviaQuestion TriviaQuestion { get; set; }
  }
}
