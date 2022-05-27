using System;
using System.Collections.Generic;
using wedding_frontend.Persistance.Entities;

namespace wedding_frontend.Dtos
{
  public sealed class GuestListDto
  {
    public Guid WeddingId { get; set; }
    public Guid GuestId { get; set; }
    public bool? HasRsvpd { get; set; }
    public bool HasRejected { get; set; }
    public string Name { get; set; }

    public ICollection<GuestListDto> RelatedGuests { get; set; }
  }
}
