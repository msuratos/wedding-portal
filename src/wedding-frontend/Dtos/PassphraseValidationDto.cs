using System;

namespace wedding_frontend.Dtos
{
  public sealed class PassphraseValidationDto
  {
    public Guid WeddingId { get; set; }
    public string Passphrase { get; set; }
  }
}
