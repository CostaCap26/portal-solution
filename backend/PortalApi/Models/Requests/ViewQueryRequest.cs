namespace PortalApi.Models.Requests;

public class ViewQueryRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    public string? SortColumn { get; set; }
    public string? SortDirection { get; set; }

    public List<ViewFilter>? Filters { get; set; }
}

public class ViewFilter
{
    public string Field { get; set; } = "";
    public string Operator { get; set; } = "";
    public string Value { get; set; } = "";
    public string Logic { get; set; } = "AND";
}
