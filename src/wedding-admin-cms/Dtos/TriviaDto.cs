namespace wedding_admin_cms.Dtos
{
  public class TriviaDto
  {
    public Guid WeddingId { get; set; }         // foreign key
    public DateTime CreatedDate { get; set; }
    public string Description { get; set; }
    public bool IsOpen { get; set; }
    public string Title { get; set; }
  }

  public class TriviaQuestionDto
  {
    public Guid TriviaId { get; set; }         // foreign key
    public string Question { get; set; }
    public string Answer { get; set; }
    public int SortRank { get; set; }
  }
}
