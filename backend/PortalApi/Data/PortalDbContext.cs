using Microsoft.EntityFrameworkCore;
using PortalApi.Models;
using PortalApi.Models.Entities;
using PortalApi.Models.Enums;

namespace PortalApi.Data
{
    public class PortalDbContext : DbContext
    {
        public PortalDbContext(DbContextOptions<PortalDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Portal> Portals => Set<Portal>();
        public DbSet<UserPortal> UserPortals => Set<UserPortal>();
        public DbSet<Dataset> Datasets => Set<Dataset>();
        public DbSet<DatasetParameter> DatasetParameters => Set<DatasetParameter>();
        public DbSet<UserDatasetPermission> UserDatasetPermissions => Set<UserDatasetPermission>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserPortal>()
                .HasKey(up => new { up.UserId, up.PortalId });

            modelBuilder.Entity<UserPortal>()
                .HasOne(up => up.User)
                .WithMany(u => u.UserPortals)
                .HasForeignKey(up => up.UserId);

            modelBuilder.Entity<UserPortal>()
                .HasOne(up => up.Portal)
                .WithMany(p => p.UserPortals)
                .HasForeignKey(up => up.PortalId);

            modelBuilder.Entity<Dataset>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Code)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(x => x.DbKey)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasOne(x => x.Portal)
                    .WithMany()
                    .HasForeignKey(x => x.PortalId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<DatasetParameter>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.HasOne(x => x.Dataset)
                    .WithMany(x => x.Parameters)
                    .HasForeignKey(x => x.DatasetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<UserDatasetPermission>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.HasOne(x => x.User)
                    .WithMany()
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.Dataset)
                    .WithMany(x => x.UserPermissions)
                    .HasForeignKey(x => x.DatasetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

        }
    }
}
