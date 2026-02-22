using PortalApi.Models.Requests;

namespace PortalApi.Services;

public interface IDatasetExecutionService
{
    Task<object> RunAsync(
        int datasetId,
        Guid userId,
        ViewQueryRequest request);
}
