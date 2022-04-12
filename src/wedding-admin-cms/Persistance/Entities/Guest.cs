using System;

namespace wedding_admin_cms.Persistance.Entities
{
  public class Guest
  {
    public Guid GuestId { get; set; }
    public bool HasRsvpd { get; set; }
    public string Name { get; set; }
    public DateTime? RsvpDate { get; set; }

    public Guid WeddingId { get; set; }
    public Wedding Wedding { get; set; }
  }
}