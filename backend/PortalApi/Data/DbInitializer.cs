using PortalApi.Models;
using Microsoft.EntityFrameworkCore;
using PortalApi.Models.Entities;


namespace PortalApi.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(PortalDbContext context)
        {
            await context.Database.MigrateAsync();

            // =========================
            // PORTALI
            // =========================

            var demoPortal = await context.Portals
                .FirstOrDefaultAsync(p => p.Slug == "demo");

            if (demoPortal == null)
            {
                demoPortal = new Portal
                {
                    Id = Guid.NewGuid(),
                    Name = "Portale Demo",
                    Slug = "demo",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Portals.Add(demoPortal);
                await context.SaveChangesAsync();
            }

            var ecommercePortal = await context.Portals
                .FirstOrDefaultAsync(p => p.Slug == "ecommerce");

            if (ecommercePortal == null)
            {
                ecommercePortal = new Portal
                {
                    Id = Guid.NewGuid(),
                    Name = "E-Commerce Cliente",
                    Slug = "ecommerce",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Portals.Add(ecommercePortal);
                await context.SaveChangesAsync();
            }

            // =========================
            // ADMIN
            // =========================

            var admin = await context.Users
                .FirstOrDefaultAsync(u => u.Username == "admin");

            if (admin == null)
            {
                admin = new User
                {
                    Id = Guid.NewGuid(),
                    Username = "admin",
                    Email = "admin@portal.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(admin);
                await context.SaveChangesAsync();
            }

            // Associa admin a entrambi i portali
            if (!context.UserPortals.Any(up => up.UserId == admin.Id && up.PortalId == demoPortal.Id))
            {
                context.UserPortals.Add(new UserPortal
                {
                    UserId = admin.Id,
                    PortalId = demoPortal.Id,
                    Role = "ADMIN"
                });
            }

            if (!context.UserPortals.Any(up => up.UserId == admin.Id && up.PortalId == ecommercePortal.Id))
            {
                context.UserPortals.Add(new UserPortal
                {
                    UserId = admin.Id,
                    PortalId = ecommercePortal.Id,
                    Role = "ADMIN"
                });
            }

            await context.SaveChangesAsync();

            // =========================
            // UTENTI RANDOM
            // =========================

            if (!context.Users.Any(u => u.Username.StartsWith("user")))
            {
                var random = new Random();
                var users = new List<User>();

                for (int i = 1; i <= 100; i++)
                {
                    users.Add(new User
                    {
                        Id = Guid.NewGuid(),
                        Username = $"user{i}",
                        Email = $"user{i}@demo.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("1234"),
                        IsActive = random.Next(0, 2) == 1,
                        CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 365))
                    });
                }

                await context.Users.AddRangeAsync(users);
                await context.SaveChangesAsync();

                var relations = new List<UserPortal>();

                foreach (var user in users)
                {
                    relations.Add(new UserPortal
                    {
                        UserId = user.Id,
                        PortalId = demoPortal.Id,
                        Role = "USER"
                    });

                    // metà utenti anche su ecommerce
                    if (random.Next(0, 2) == 1)
                    {
                        relations.Add(new UserPortal
                        {
                            UserId = user.Id,
                            PortalId = ecommercePortal.Id,
                            Role = "USER"
                        });
                    }
                }

                await context.UserPortals.AddRangeAsync(relations);
                await context.SaveChangesAsync();
            }
        }


    }
}
