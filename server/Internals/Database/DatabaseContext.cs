using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace server.Internals.Database
{
   public class Book
    {
        public Guid Id { get; set; } // Guid for primary key (UUID format)
        public string Title { get; set; }
        public string? Genre { get; set; }
        public string? Author { get; set; }
        public string? ISBN { get; set; }
        public string? Publisher { get; set; }
        [JsonPropertyName("publication_date")]
        public DateTime? PublicationDate { get; set; }
        public string? Language { get; set; }
    }
    public class DatabaseContext : DbContext
    {
        public DbSet<Book> Books { get; set; }
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Property(x => x.Title).HasMaxLength(255).IsRequired();
                entity.Property(x => x.Genre).HasMaxLength(30);
                entity.Property(x => x.Author).HasMaxLength(255);
                entity.Property(x => x.ISBN).HasMaxLength(13);
                entity.Property(x => x.Publisher).HasMaxLength(255);
                entity.Property(x => x.PublicationDate);
                entity.Property(x => x.Language).HasMaxLength(50);
            });
        }
    }
}
