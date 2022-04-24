using System;

namespace wedding_admin_cms.Persistance.Entities
{
  public sealed class SongRequest
  {
    public int SongRequestId { get; set; }
    public string SongName { get; set; }
    public string RequestedBy { get; set; }
    public DateTime RequestedDate { get; set; }

    public Guid FkWeddingId { get; set; }
    public Wedding Wedding { get; set; }
  }
}
