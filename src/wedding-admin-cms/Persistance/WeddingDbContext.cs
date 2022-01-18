using System;
using Microsoft.EntityFrameworkCore;

public class WeddingDbContext : DbContext
{
    public WeddingDbContext() { }

    public WeddingDbContext(DbContextOptions<WeddingDbContext> options) : base(options) { }

    public virtual DbSet<Wedding> Weddings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Wedding>(build => {
        build.HasKey(key => key.WeddingId);
        build.Property(prop => prop.WeddingId).ValueGeneratedOnAdd().HasDefaultValueSql("NEWID()");
        build.Property(prop => prop.Bride).IsRequired().HasMaxLength(100);        
        build.Property(prop => prop.Groom).IsRequired().HasMaxLength(100);
        build.Property(prop => prop.CeremonyDate).IsRequired();
      });
    }
}