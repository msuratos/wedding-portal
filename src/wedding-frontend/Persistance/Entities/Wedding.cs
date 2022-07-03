using System;
using System.Collections.Generic;

#nullable disable

namespace wedding_frontend.Persistance.Entities
{
    public partial class Wedding
    {
        public Wedding()
        {
            Entourages = new HashSet<Entourage>();
            FoodItems = new HashSet<FoodItem>();
            Guests = new HashSet<Guest>();
            Photos = new HashSet<Photo>();
            SongRequests = new HashSet<SongRequest>();
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
        public string PictureUrl { get; set; }
        public string Title { get; set; }
        public string Passphrase { get; set; }

        public virtual ICollection<Entourage> Entourages { get; set; }
        public virtual ICollection<FoodItem> FoodItems { get; set; }
        public virtual ICollection<Guest> Guests { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<SongRequest> SongRequests { get; set; }
    }
}
