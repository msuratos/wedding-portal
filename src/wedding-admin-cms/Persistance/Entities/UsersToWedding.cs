using System;

namespace wedding_admin_cms.Persistance.Entities
{
  public sealed class UsersToWedding
  {
    public enum UserRole
    {
      Primary, Celebrant
    }

    public Guid UsersToWeddingId { get; set; }
    public Guid WeddingId { get; set; } // Foreign key to Wedding entity
    public string UserName { get; set; }
    public string DisplayName { get; set; }
    public UserRole UserRoles { get; set; }

    public Wedding Wedding { get; set; }
  }
}
