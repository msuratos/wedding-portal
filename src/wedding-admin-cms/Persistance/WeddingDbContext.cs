using System;
using Microsoft.EntityFrameworkCore;
using wedding_admin_cms.Persistance.Entities;

namespace wedding_admin_cms.Persistance
{
  public class WeddingDbContext : DbContext
  {
    public WeddingDbContext() { }

    public WeddingDbContext(DbContextOptions<WeddingDbContext> options) : base(options) { }

    public virtual DbSet<Entourage> Entourages { get; set; }
    public virtual DbSet<Role> Roles { get; set; }
    public virtual DbSet<Wedding> Weddings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Wedding>(build =>
      {
        build.HasKey(key => key.WeddingId);
        build.Property(prop => prop.WeddingId).ValueGeneratedOnAdd().HasDefaultValueSql("NEWID()");
        build.Property(prop => prop.Bride).IsRequired().HasMaxLength(100);
        build.Property(prop => prop.Groom).IsRequired().HasMaxLength(100);
        build.Property(prop => prop.CeremonyDate).IsRequired();
        build.HasMany<Entourage>(nav => nav.Entourage).WithOne(nav => nav.Wedding).HasForeignKey(fk => fk.EntourageOfWeddingId);
      });

      modelBuilder.Entity<Entourage>(build =>
      {
        build.HasKey(key => key.EntourageId);
        build.Property(prop => prop.EntourageId).ValueGeneratedOnAdd().HasDefaultValueSql("NEWID()");
        build.Property(prop => prop.Name).HasMaxLength(50).IsRequired();
        build.HasOne<Role>(nav => nav.Role).WithOne(nav => nav.Entourage).HasForeignKey<Entourage>(fk => fk.RoleIdOfEntourage);
      });

      modelBuilder.Entity<Role>(build => 
      {
        build.HasKey(key => key.RoleId);
        build.Property(prop => prop.RoleId).UseIdentityColumn();
        build.Property(prop => prop.Description);
      });
    }
  }
}