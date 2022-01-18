using System;

public class Wedding
{
    public Guid WeddingId { get;set; }
    public string Bride { get; set; }
    public string Groom { get; set; }
    public DateTimeOffset CeremonyDate { get; set; }
}