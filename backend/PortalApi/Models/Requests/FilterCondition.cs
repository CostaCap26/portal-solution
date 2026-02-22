namespace PortalApi.Models.Requests
{
    public class FilterCondition
    {
        public string Field { get; set; } = string.Empty;
        public string Operator { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Logic { get; set; } = "AND"; // AND / OR
    }
}
