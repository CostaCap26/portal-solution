using System.ComponentModel.DataAnnotations;

namespace PortalApi.Models.Entities
{
    public class Portal
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Slug { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<UserPortal> UserPortals { get; set; } = new List<UserPortal>();
    }
}
