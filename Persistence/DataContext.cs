using System;
using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
        
        public DbSet<Activity> Activities { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> Followings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        
            modelBuilder.Entity<UserActivity>(x => x.HasKey(ua => new { ua.AppUserId, ua.ActivityId }));
            modelBuilder.Entity<UserActivity>().HasOne(u => u.AppUser).WithMany(a => a.UserActivities).HasForeignKey(u => u.AppUserId);
            modelBuilder.Entity<UserActivity>().HasOne(u => u.Activity).WithMany(a => a.UserActivities).HasForeignKey(u => u.ActivityId);

            modelBuilder.Entity<UserFollowing>(b =>
            {
                b.HasKey(k=>new {k.ObserveId , k.TargetId});

                b.HasOne(o=>o.Observer)
                .WithMany(f=>f.Followings)
                .HasForeignKey(o=>o.ObserveId)
                .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(o=>o.Target)
                .WithMany(f=>f.Followers)
                .HasForeignKey(o=>o.TargetId)
                .OnDelete(DeleteBehavior.Restrict);
            });

        }
    }
}