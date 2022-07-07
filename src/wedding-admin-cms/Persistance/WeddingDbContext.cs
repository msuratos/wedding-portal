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
    public virtual DbSet<Guest> Guests { get; set; }
    public virtual DbSet<GuestGroup> GuestGroups { get; set; }
    public virtual DbSet<FoodItem> FoodItems { get; set; }
    public virtual DbSet<FoodType> FoodTypes { get; set; }
    public virtual DbSet<Photo> Photos { get; set; }
    public virtual DbSet<Role> Roles { get; set; }
    public virtual DbSet<Schedule> Schedules { get; set; }
    public virtual DbSet<SongRequest> SongRequests { get; set; }
    public virtual DbSet<Trivia> Trivias { get; set; }
    public virtual DbSet<TriviaQuestion> TriviaQuestions { get; set; }
    public virtual DbSet<TriviaUserAnswer> TriviaUserAnswers { get; set; }
    public virtual DbSet<UsersToWedding> UsersToWeddings { get; set; }
    public virtual DbSet<Wedding> Weddings { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      if (!optionsBuilder.IsConfigured)
        optionsBuilder.UseSqlServer("Server=(localdb)\\ProjectModels;Database=WeddingPortal;User Id=appWeddingPortal;Password=Pa$$w0rd");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      // TODO: put all of these in their own configurations file folder
      modelBuilder.Entity<Wedding>(build =>
      {
        build.HasKey(key => key.WeddingId);
        build.Property(prop => prop.WeddingId).ValueGeneratedOnAdd().HasDefaultValueSql("NEWID()");
        build.Property(prop => prop.Bride).IsRequired().HasMaxLength(100);
        build.Property(prop => prop.Groom).IsRequired().HasMaxLength(100);
        build.Property(prop => prop.LastName).HasMaxLength(100);
        build.Property(prop => prop.MessageToEveryone).IsUnicode(true);
        build.Property(prop => prop.CeremonyDate).IsRequired();

        build.Property(prop => prop.PictureUrl).IsRequired().HasDefaultValue("https://c1.staticflickr.com/1/71/226654184_26b52a6116_z.jpg?zz=1").HasMaxLength(300);
        build.Property(prop => prop.Passphrase).IsRequired().HasDefaultValue("1234").HasMaxLength(50);
        build.Property(prop => prop.Title).IsRequired().HasDefaultValue("Wedding").HasMaxLength(50);
        build.Property(prop => prop.UrlSubDomain).HasMaxLength(100);

        build.HasMany<UsersToWedding>().WithOne(nav => nav.Wedding).HasForeignKey(fk => fk.WeddingId);
      });

      modelBuilder.Entity<Entourage>(build =>
      {
        build.HasKey(key => key.EntourageId);
        build.Property(prop => prop.EntourageId).ValueGeneratedOnAdd().HasDefaultValueSql("NEWID()");
        build.Property(prop => prop.Name).HasMaxLength(50).IsRequired();

        build.HasOne<Wedding>(nav => nav.Wedding).WithMany(nav => nav.Entourage).HasForeignKey(fk => fk.EntourageOfWeddingId);
        build.HasOne<Role>(nav => nav.Role).WithOne(nav => nav.Entourage).HasForeignKey<Entourage>(fk => fk.RoleIdOfEntourage);
      });

      modelBuilder.Entity<Guest>(build =>
      {
        build.HasKey(key => key.GuestId);
        build.Property(prop => prop.GuestId).ValueGeneratedOnAdd().HasDefaultValueSql("NEWID()");
        build.Property(prop => prop.HasRsvpd).IsRequired().HasDefaultValue(false);
        build.Property(prop => prop.Name).IsRequired();

        build.HasOne<Wedding>(nav => nav.Wedding).WithMany(nav => nav.Guests).HasForeignKey(fk => fk.WeddingId);
      });

      modelBuilder.Entity<GuestGroup>(build =>
      {
        build.HasKey(key => key.GuestGroupId);
        build.Property(prop => prop.GuestGroupId).ValueGeneratedOnAdd().HasDefaultValueSql("NEWID()");
        build.Property(prop => prop.Type).IsRequired().HasMaxLength(100);
        build.Property(prop => prop.Value).IsRequired().HasMaxLength(1000);

        build.HasMany<Guest>(nav => nav.Guests).WithOne(nav => nav.GuestGroup).HasForeignKey(fk => fk.GuestGroupId).IsRequired(false);
      });

      modelBuilder.Entity<FoodItem>(build =>
      {
        build.HasKey(key => key.FoodId);
        build.Property(prop => prop.FoodTypeId).IsRequired();   // foreign key
        build.Property(prop => prop.WeddingId).IsRequired();  // foreign key
        build.Property(prop => prop.FoodId).UseIdentityColumn();
        build.Property(prop => prop.Food).HasMaxLength(100).IsUnicode();
        build.Property(prop => prop.Description).IsUnicode();

        build.HasOne<FoodType>(nav => nav.FoodType).WithMany(nav => nav.FoodItems).HasForeignKey(fk => fk.FoodTypeId);
        build.HasOne<Wedding>(nav => nav.Wedding).WithMany(nav => nav.FoodItems).HasForeignKey(fk => fk.WeddingId);
      });

      modelBuilder.Entity<FoodType>(build =>
      {
        build.HasKey(key => key.FoodTypeId);
        build.Property(prop => prop.FoodTypeId).UseIdentityColumn();
        build.Property(prop => prop.Type).HasMaxLength(50).IsRequired();
      });

      modelBuilder.Entity<Photo>(build =>
      {
        build.HasKey(key => key.PhotoId);
        build.Property(prop => prop.PhotoId).ValueGeneratedOnAdd().HasDefaultValueSql("NEWID()");
        build.Property(prop => prop.CreatedDate).ValueGeneratedOnAdd().HasDefaultValueSql("GETDATE()");
        build.Property(prop => prop.FileName).IsRequired().HasMaxLength(100);
        build.Property(prop => prop.FileType).IsRequired().HasMaxLength(10);
        build.Property(prop => prop.ForPage).IsRequired().HasMaxLength(10);

        build.HasOne<Wedding>(e => e.Wedding).WithMany(e => e.Photos).HasForeignKey(fk => fk.FkWeddingId);
      });

      modelBuilder.Entity<Role>(build => 
      {
        build.HasKey(key => key.RoleId);
        build.Property(prop => prop.RoleId).UseIdentityColumn();
        build.Property(prop => prop.Description);
      });

      modelBuilder.Entity<Schedule>(build =>
      {
        build.HasKey(key => key.ScheduleId);
        build.Property(prop => prop.ScheduleId).UseIdentityColumn();
        build.Property(prop => prop.Activity).HasMaxLength(100).IsRequired();
        build.Property(prop => prop.ActivityStartTime).IsRequired();
        build.Property(prop => prop.ActivityEndTime).IsRequired();

        build.HasOne<Wedding>(nav => nav.Wedding).WithMany(nav => nav.Schedules).HasForeignKey(fk => fk.WeddingId);
      });

      modelBuilder.Entity<SongRequest>(build =>
      {
        build.HasKey(key => key.SongRequestId);
        build.Property(prop => prop.SongRequestId).IsRequired().UseIdentityColumn();
        build.Property(prop => prop.SongName).IsRequired().HasMaxLength(100);
        build.Property(prop => prop.RequestedBy).HasMaxLength(100);

        build.HasOne<Wedding>(e => e.Wedding).WithMany(e => e.SongRequests).HasForeignKey(fk => fk.FkWeddingId);
      });

      modelBuilder.Entity<Trivia>(build =>
      {
        build.HasKey(key => key.TriviaId);
        build.Property(prop => prop.TriviaId).ValueGeneratedOnAdd().HasDefaultValueSql("NEWID()");
        build.Property(prop => prop.CreatedDate).ValueGeneratedOnAdd().HasDefaultValueSql("GETDATE()");
        build.Property(prop => prop.Description).IsUnicode();
        build.Property(prop => prop.IsOpen).IsRequired().HasDefaultValue(false);
        build.Property(prop => prop.Title).IsRequired().HasMaxLength(100);
        build.Property(prop => prop.WeddingId).IsRequired();

        build.HasOne<Wedding>(nav => nav.Wedding).WithMany(nav => nav.Trivias).HasForeignKey(fk => fk.WeddingId);
      });

      modelBuilder.Entity<TriviaQuestion>(build =>
      {
        build.HasKey(key => key.TriviaQuestionId);
        build.Property(prop => prop.TriviaQuestionId).ValueGeneratedOnAdd().HasDefaultValueSql("NEWID()");
        build.Property(prop => prop.Answer).IsRequired().HasMaxLength(100);
        build.Property(prop => prop.Question).IsRequired();
        build.Property(prop => prop.SortRank).IsRequired().HasDefaultValue(10);
        build.Property(prop => prop.TriviaId).IsRequired();

        build.HasOne<Trivia>(nav => nav.Trivia).WithMany(nav => nav.TriviaQuestions).HasForeignKey(fk => fk.TriviaId);
      });

      modelBuilder.Entity<TriviaUserAnswer>(build =>
      {
        build.HasKey(key => key.TriviaUserAnswerId);
        build.Property(prop => prop.TriviaUserAnswerId).ValueGeneratedOnAdd().HasDefaultValueSql("NEWID()");
        build.Property(prop => prop.CreatedDate).ValueGeneratedOnAdd().HasDefaultValueSql("GETDATE()");
        build.Property(prop => prop.TriviaQuestionId).IsRequired();
        build.Property(prop => prop.UserAnswer).IsRequired().HasMaxLength(100);
        build.Property(prop => prop.Username).IsRequired().HasMaxLength(100);

        build.HasOne<TriviaQuestion>(nav => nav.TriviaQuestion).WithMany(nav => nav.TriviaUserAnswers).HasForeignKey(fk => fk.TriviaQuestionId);
      });

      modelBuilder.Entity<UsersToWedding>(build =>
      {
        build.HasKey(key => key.UsersToWeddingId);
        build.Property(prop => prop.UsersToWeddingId).ValueGeneratedOnAdd().HasDefaultValueSql("NEWID()");
        build.Property(prop => prop.UserName).IsRequired().HasMaxLength(100);
        build.Property(prop => prop.DisplayName).IsRequired();
        build.Property(prop => prop.UserRoles).IsRequired().HasConversion<string>();
      });
    }
  }
}