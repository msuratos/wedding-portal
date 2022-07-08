namespace wedding_admin_cms.Dtos
{
  public class CloseTriviaDto
  {
    public Guid WeddingId { get; set; }
    public Guid TriviaId { get; set; }
    public bool Status { get; set; }
  }
}
