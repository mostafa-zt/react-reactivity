using System;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Value> Values { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Domain.Value>().HasData(
                new Value() { Id = 1, Name = "name 1" },
                new Value() { Id = 2, Name = "name 2" },
                new Value() { Id = 3, Name = "name 3" }
            );
            base.OnModelCreating(modelBuilder);
        }
    }
}