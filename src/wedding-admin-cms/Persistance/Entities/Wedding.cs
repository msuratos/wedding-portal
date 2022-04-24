using System;
using System.Collections.Generic;

namespace wedding_admin_cms.Persistance.Entities
{
  public sealed class Wedding
  {
    public Wedding()
    {
      Entourage = new HashSet<Entourage>();
      Guests = new HashSet<Guest>();
      Photos = new HashSet<Photo>();
      SongRequests = new HashSet<SongRequest>();
    }
    
    public Guid WeddingId { get; set; }
    public string Bride { get; set; }
    public string Groom { get; set; }
    public string LastName { get; set; }
    public string MessageToEveryone { get; set; }
    public string CeremonyLocation { get; set; }
    public string ReceptionLocation { get; set; }
    public DateTimeOffset CeremonyDate { get; set; }
    public DateTimeOffset ReceptionDate { get; set; }

    public string PictureUrl { get; set; }
    public string Passphrase { get; set; }
    public string Title { get; set; }
    public string UrlSubDomain { get; set; }

    public ICollection<Entourage> Entourage { get; set; }
    public ICollection<Guest> Guests { get; set; }
    public ICollection<Photo> Photos { get; set; }
    public ICollection<SongRequest> SongRequests { get; set; }
  }
}