using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class Guest
    {
        public Guid GuestId { get; set; }
        public bool? HasRsvpd { get; set; }
        public string Name { get; set; }
        public DateTime? RsvpDate { get; set; }
        public Guid? GuestGroupId { get; set; }
        public Guid WeddingId { get; set; }

        public virtual GuestGroup GuestGroup { get; set; }
        public virtual Wedding Wedding { get; set; }
    }
}
