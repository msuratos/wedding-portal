using System;

namespace wedding_admin_cms.Persistance.Entities
{
  public sealed class Photo
  {
    public Guid PhotoId { get; set; }
    public string FileName { get; set; }
    public string FileType { get; set; }
    public string ForPage { get; set; }

    public DateTime CreatedDate { get; set; }

    public Guid FkWeddingId { get; set; }
    public Wedding Wedding { get; set; }
  }
}
