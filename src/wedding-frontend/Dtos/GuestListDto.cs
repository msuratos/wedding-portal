using System;
using System.Collections.Generic;

namespace wedding_frontend.Dtos
{
  public sealed class GuestListDto
  {
    public Guid WeddingId { get; set; }
    public Guid? GuestGroupId { get; set; }
    public string GroupType { get; set; }
    public string GroupValue { get; set; }
    public string Name { get; set; }
    public ICollection<GuestListDto> RelatedGuests { get; set; }
  }
}
