using System;

namespace wedding_admin_cms.Persistance.Entities
{
  public sealed class Entourage
  {
    public Guid EntourageId { get; set; }
    public string Name { get; set; }
    public Guid EntourageOfWeddingId { get; set; }
    public int RoleIdOfEntourage { get; set; }

    public Role Role { get; set; }
    public Wedding Wedding { get; set; } 
  }
}