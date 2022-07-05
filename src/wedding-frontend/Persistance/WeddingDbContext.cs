﻿using System;
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
        public virtual DbSet<FoodItem> FoodItems { get; set; }
        public virtual DbSet<FoodType> FoodTypes { get; set; }
        public virtual DbSet<Guest> Guests { get; set; }
        public virtual DbSet<GuestGroup> GuestGroups { get; set; }
        public virtual DbSet<Photo> Photos { get; set; }
        public virtual DbSet<Schedule> Schedules { get; set; }
        public virtual DbSet<SongRequest> SongRequests { get; set; }
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

                entity.Property(e => e.EntourageId).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.EntourageOfWedding)
                    .WithMany(p => p.Entourages)
                    .HasForeignKey(d => d.EntourageOfWeddingId);
            });

            modelBuilder.Entity<FoodItem>(entity =>
            {
                entity.HasKey(e => e.FoodId);

                entity.HasIndex(e => e.FoodTypeId, "IX_FoodItems_FoodTypeId");

                entity.HasIndex(e => e.WeddingId, "IX_FoodItems_WeddingId");

                entity.Property(e => e.Food).HasMaxLength(100);

                entity.HasOne(d => d.FoodType)
                    .WithMany(p => p.FoodItems)
                    .HasForeignKey(d => d.FoodTypeId);

                entity.HasOne(d => d.Wedding)
                    .WithMany(p => p.FoodItems)
                    .HasForeignKey(d => d.WeddingId);
            });

            modelBuilder.Entity<FoodType>(entity =>
            {
                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Guest>(entity =>
            {
                entity.HasIndex(e => e.GuestGroupId, "IX_Guests_GuestGroupId");

                entity.HasIndex(e => e.WeddingId, "IX_Guests_WeddingId");

                entity.Property(e => e.GuestId).HasDefaultValueSql("(newid())");

                entity.Property(e => e.HasRsvpd)
                    .IsRequired()
                    .HasDefaultValueSql("(CONVERT([bit],(0)))");

                entity.Property(e => e.Name).IsRequired();

                entity.HasOne(d => d.GuestGroup)
                    .WithMany(p => p.Guests)
                    .HasForeignKey(d => d.GuestGroupId);

                entity.HasOne(d => d.Wedding)
                    .WithMany(p => p.Guests)
                    .HasForeignKey(d => d.WeddingId);
            });

            modelBuilder.Entity<GuestGroup>(entity =>
            {
                entity.Property(e => e.GuestGroupId).HasDefaultValueSql("(newid())");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Value)
                    .IsRequired()
                    .HasMaxLength(1000);
            });

            modelBuilder.Entity<Photo>(entity =>
            {
                entity.HasIndex(e => e.FkWeddingId, "IX_Photos_FkWeddingId");

                entity.Property(e => e.PhotoId).HasDefaultValueSql("(newid())");

                entity.Property(e => e.CreatedDate).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.FileName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.FileType)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.ForPage)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.HasOne(d => d.FkWedding)
                    .WithMany(p => p.Photos)
                    .HasForeignKey(d => d.FkWeddingId);
            });

            modelBuilder.Entity<Schedule>(entity =>
            {
                entity.HasIndex(e => e.WeddingId, "IX_Schedules_WeddingId");

                entity.Property(e => e.Activity)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasOne(d => d.Wedding)
                    .WithMany(p => p.Schedules)
                    .HasForeignKey(d => d.WeddingId);
            });

            modelBuilder.Entity<SongRequest>(entity =>
            {
                entity.HasIndex(e => e.FkWeddingId, "IX_SongRequests_FkWeddingId");

                entity.Property(e => e.RequestedBy).HasMaxLength(100);

                entity.Property(e => e.SongName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasOne(d => d.FkWedding)
                    .WithMany(p => p.SongRequests)
                    .HasForeignKey(d => d.FkWeddingId);
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
