﻿using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class Wedding
    {
        public Wedding()
        {
            EntourageEntourageOfWeddings = new HashSet<Entourage>();
            EntourageWeddings = new HashSet<Entourage>();
        }

        public Guid WeddingId { get; set; }
        public string Bride { get; set; }
        public string Groom { get; set; }
        public DateTimeOffset CeremonyDate { get; set; }
        public string CeremonyLocation { get; set; }
        public DateTimeOffset ReceptionDate { get; set; }
        public string ReceptionLocation { get; set; }
        public string LastName { get; set; }
        public string MessageToEveryone { get; set; }
        public string UrlSubDomain { get; set; }

        public virtual ICollection<Entourage> EntourageEntourageOfWeddings { get; set; }
        public virtual ICollection<Entourage> EntourageWeddings { get; set; }
    }
}