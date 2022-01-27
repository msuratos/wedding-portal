using System;

namespace wedding_admin_cms.Persistance.Entities
{
  public sealed class Role
  {
    public int RoleId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }

    public Entourage Entourage { get; set; }
  }
}