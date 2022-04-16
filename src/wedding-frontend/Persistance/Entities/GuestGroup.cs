using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class GuestGroup
    {
        public GuestGroup()
        {
            Guests = new HashSet<Guest>();
        }

        public Guid GuestGroupId { get; set; }
        public string Type { get; set; }
        public string Value { get; set; }

        public virtual ICollection<Guest> Guests { get; set; }
    }
}
