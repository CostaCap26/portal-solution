using PortalApi.Models.Enums;
using PortalApi.Models.Entities;

namespace PortalApi.Models.Entities;

public class Dataset
{
    public int Id { get; set; }

    public Guid PortalId { get; set; }
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string DbKey { get; set; } = null!;

    public DatasetType Type { get; set; }

    public string SqlText { get; set; } = null!;

    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int Version { get; set; }

    // Navigation
    public Portal Portal { get; set; } = null!;
    public ICollection<DatasetParameter> Parameters { get; set; } = new List<DatasetParameter>();
    public ICollection<UserDatasetPermission> UserPermissions { get; set; } = new List<UserDatasetPermission>();
}
