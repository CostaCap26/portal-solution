namespace PortalApi.Models.Entities;

public class UserDatasetPermission
{
    public int Id { get; set; }

    public Guid UserId { get; set; }
    public int DatasetId { get; set; }

    public bool CanView { get; set; }
    public bool CanRun { get; set; }
    public bool CanExport { get; set; }

    // Navigation
    public User User { get; set; } = null!;
    public Dataset Dataset { get; set; } = null!;
}
