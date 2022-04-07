using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using wedding_frontend.Persistance.Entities;

#nullable disable

namespace wedding_frontend.Persistance
{
    public partial class WeddingDbContext : DbContext
    {
        public WeddingDbContext()
        {
        }

        public WeddingDbContext(DbContextOptions<WeddingDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Entourage> Entourages { get; set; }
        public virtual DbSet<Wedding> Weddings { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Name=WeddingDbContext");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Entourage>(entity =>
            {
                entity.HasIndex(e => e.EntourageOfWeddingId, "IX_Entourages_EntourageOfWeddingId");

                entity.HasIndex(e => e.RoleIdOfEntourage, "IX_Entourages_RoleIdOfEntourage");

                entity.HasIndex(e => e.WeddingId, "IX_Entourages_WeddingId");

                entity.Property(e => e.EntourageId).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.EntourageOfWedding)
                    .WithMany(p => p.EntourageEntourageOfWeddings)
                    .HasForeignKey(d => d.EntourageOfWeddingId);

                entity.HasOne(d => d.Wedding)
                    .WithMany(p => p.EntourageWeddings)
                    .HasForeignKey(d => d.WeddingId);
            });

            modelBuilder.Entity<Wedding>(entity =>
            {
                entity.Property(e => e.WeddingId).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Bride)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Groom)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.LastName).HasMaxLength(100);

                entity.Property(e => e.Passphrase)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValueSql("(N'1234')");

                entity.Property(e => e.PictureUrl)
                    .IsRequired()
                    .HasMaxLength(300)
                    .HasDefaultValueSql("(N'https://c1.staticflickr.com/1/71/226654184_26b52a6116_z.jpg?zz=1')");

                entity.Property(e => e.ReceptionDate).HasDefaultValueSql("('0001-01-01T00:00:00.0000000+00:00')");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasDefaultValueSql("(N'Wedding')");

                entity.Property(e => e.UrlSubDomain).HasMaxLength(100);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
