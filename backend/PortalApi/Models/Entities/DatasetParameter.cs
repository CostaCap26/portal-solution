namespace PortalApi.Models.Entities;

public class DatasetParameter
{
    public int Id { get; set; }

    public int DatasetId { get; set; }

    public string Name { get; set; } = null!;
    public string DataType { get; set; } = null!;
    public string? DefaultValue { get; set; }
    public bool IsRequired { get; set; }
    public int DisplayOrder { get; set; }

    // Navigation
    public Dataset Dataset { get; set; } = null!;
}
