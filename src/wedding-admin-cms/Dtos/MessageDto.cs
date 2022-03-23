using System;

namespace wedding_admin_cms.Dtos
{
  public class MessageDto
  {
    public Guid WeddingId { get; set; }
    public string MessageForEveryone { get; set; }
  }
}
