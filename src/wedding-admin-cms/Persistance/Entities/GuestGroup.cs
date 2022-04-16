using System;
using System.Collections.Generic;

namespace wedding_admin_cms.Persistance.Entities
{
  public class GuestGroup
  {
    public GuestGroup()
    {
      Guests = new HashSet<Guest>();
    }

    public Guid GuestGroupId { get; set; }
    public string Type { get; set; }
    public string Value { get; set; }

    public ICollection<Guest> Guests { get; set; }
  }
}