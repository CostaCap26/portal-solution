namespace PortalApi.Models.Entities
{
    public class UserPortal
    {
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        public Guid PortalId { get; set; }
        public Portal Portal { get; set; } = null!;

        public string Role { get; set; } = "USER"; // ADMIN / USER
    }
}
