﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using wedding_admin_cms.Persistance;

namespace wedding_admin_cms.Persistance.Migrations
{
    [DbContext(typeof(WeddingDbContext))]
    partial class WeddingDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.13")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.Entourage", b =>
                {
                    b.Property<Guid>("EntourageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWID()");

                    b.Property<Guid>("EntourageOfWeddingId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int>("RoleIdOfEntourage")
                        .HasColumnType("int");

                    b.HasKey("EntourageId");

                    b.HasIndex("EntourageOfWeddingId");

                    b.HasIndex("RoleIdOfEntourage")
                        .IsUnique();

                    b.ToTable("Entourages");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.FoodItem", b =>
                {
                    b.Property<int>("FoodId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:IdentityIncrement", 1)
                        .HasAnnotation("SqlServer:IdentitySeed", 1)
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Description")
                        .IsUnicode(true)
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Food")
                        .HasMaxLength(100)
                        .IsUnicode(true)
                        .HasColumnType("nvarchar(100)");

                    b.Property<int>("FoodTypeId")
                        .HasColumnType("int");

                    b.Property<Guid>("WeddingId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("FoodId");

                    b.HasIndex("FoodTypeId");

                    b.HasIndex("WeddingId");

                    b.ToTable("FoodItems");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.FoodType", b =>
                {
                    b.Property<int>("FoodTypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:IdentityIncrement", 1)
                        .HasAnnotation("SqlServer:IdentitySeed", 1)
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("FoodTypeId");

                    b.ToTable("FoodTypes");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.Guest", b =>
                {
                    b.Property<Guid>("GuestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWID()");

                    b.Property<Guid?>("GuestGroupId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("HasRsvpd")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("RsvpDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("WeddingId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("GuestId");

                    b.HasIndex("GuestGroupId");

                    b.HasIndex("WeddingId");

                    b.ToTable("Guests");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.GuestGroup", b =>
                {
                    b.Property<Guid>("GuestGroupId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWID()");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)");

                    b.HasKey("GuestGroupId");

                    b.ToTable("GuestGroups");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.Photo", b =>
                {
                    b.Property<Guid>("PhotoId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWID()");

                    b.Property<DateTime>("CreatedDate")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("GETDATE()");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("FileType")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.Property<Guid>("FkWeddingId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("ForPage")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.HasKey("PhotoId");

                    b.HasIndex("FkWeddingId");

                    b.ToTable("Photos");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:IdentityIncrement", 1)
                        .HasAnnotation("SqlServer:IdentitySeed", 1)
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("RoleId");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.Schedule", b =>
                {
                    b.Property<int>("ScheduleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:IdentityIncrement", 1)
                        .HasAnnotation("SqlServer:IdentitySeed", 1)
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Activity")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime>("ActivityEndTime")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("ActivityStartTime")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("WeddingId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("ScheduleId");

                    b.HasIndex("WeddingId");

                    b.ToTable("Schedules");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.SongRequest", b =>
                {
                    b.Property<int>("SongRequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:IdentityIncrement", 1)
                        .HasAnnotation("SqlServer:IdentitySeed", 1)
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<Guid>("FkWeddingId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("RequestedBy")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime>("RequestedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("SongName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("SongRequestId");

                    b.HasIndex("FkWeddingId");

                    b.ToTable("SongRequests");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.UsersToWedding", b =>
                {
                    b.Property<Guid>("UsersToWeddingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWID()");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("UserRoles")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("WeddingId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("UsersToWeddingId");

                    b.HasIndex("WeddingId");

                    b.ToTable("UsersToWeddings");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.Wedding", b =>
                {
                    b.Property<Guid>("WeddingId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier")
                        .HasDefaultValueSql("NEWID()");

                    b.Property<string>("Bride")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTimeOffset>("CeremonyDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("CeremonyLocation")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Groom")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("LastName")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("MessageToEveryone")
                        .IsUnicode(true)
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Passphrase")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasDefaultValue("1234");

                    b.Property<string>("PictureUrl")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(300)
                        .HasColumnType("nvarchar(300)")
                        .HasDefaultValue("https://c1.staticflickr.com/1/71/226654184_26b52a6116_z.jpg?zz=1");

                    b.Property<DateTimeOffset>("ReceptionDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("ReceptionLocation")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasDefaultValue("Wedding");

                    b.Property<string>("UrlSubDomain")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("WeddingId");

                    b.ToTable("Weddings");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.Entourage", b =>
                {
                    b.HasOne("wedding_admin_cms.Persistance.Entities.Wedding", "Wedding")
                        .WithMany("Entourage")
                        .HasForeignKey("EntourageOfWeddingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("wedding_admin_cms.Persistance.Entities.Role", "Role")
                        .WithOne("Entourage")
                        .HasForeignKey("wedding_admin_cms.Persistance.Entities.Entourage", "RoleIdOfEntourage")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("Wedding");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.FoodItem", b =>
                {
                    b.HasOne("wedding_admin_cms.Persistance.Entities.FoodType", "FoodType")
                        .WithMany("FoodItems")
                        .HasForeignKey("FoodTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("wedding_admin_cms.Persistance.Entities.Wedding", "Wedding")
                        .WithMany("FoodItems")
                        .HasForeignKey("WeddingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FoodType");

                    b.Navigation("Wedding");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.Guest", b =>
                {
                    b.HasOne("wedding_admin_cms.Persistance.Entities.GuestGroup", "GuestGroup")
                        .WithMany("Guests")
                        .HasForeignKey("GuestGroupId");

                    b.HasOne("wedding_admin_cms.Persistance.Entities.Wedding", "Wedding")
                        .WithMany("Guests")
                        .HasForeignKey("WeddingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("GuestGroup");

                    b.Navigation("Wedding");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.Photo", b =>
                {
                    b.HasOne("wedding_admin_cms.Persistance.Entities.Wedding", "Wedding")
                        .WithMany("Photos")
                        .HasForeignKey("FkWeddingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Wedding");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.Schedule", b =>
                {
                    b.HasOne("wedding_admin_cms.Persistance.Entities.Wedding", "Wedding")
                        .WithMany("Schedules")
                        .HasForeignKey("WeddingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Wedding");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.SongRequest", b =>
                {
                    b.HasOne("wedding_admin_cms.Persistance.Entities.Wedding", "Wedding")
                        .WithMany("SongRequests")
                        .HasForeignKey("FkWeddingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Wedding");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.UsersToWedding", b =>
                {
                    b.HasOne("wedding_admin_cms.Persistance.Entities.Wedding", "Wedding")
                        .WithMany()
                        .HasForeignKey("WeddingId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Wedding");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.FoodType", b =>
                {
                    b.Navigation("FoodItems");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.GuestGroup", b =>
                {
                    b.Navigation("Guests");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.Role", b =>
                {
                    b.Navigation("Entourage");
                });

            modelBuilder.Entity("wedding_admin_cms.Persistance.Entities.Wedding", b =>
                {
                    b.Navigation("Entourage");

                    b.Navigation("FoodItems");

                    b.Navigation("Guests");

                    b.Navigation("Photos");

                    b.Navigation("Schedules");

                    b.Navigation("SongRequests");
                });
#pragma warning restore 612, 618
        }
    }
}
