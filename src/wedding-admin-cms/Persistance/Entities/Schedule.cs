namespace wedding_admin_cms.Persistance.Entities
{
  public class Schedule
  {
    public int ScheduleId { get; set; }
    public Guid WeddingId { get; set; }   // foreign key
    public string Activity { get; set; }
    public DateTime ActivityDateTime { get; set; }

    public Wedding Wedding { get; set; }
  }
}
