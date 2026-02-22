using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.EntityFrameworkCore;
using PortalApi.Data;
using PortalApi.Models.Entities;
using PortalApi.Models.Requests;

namespace PortalApi.Services
{
    public class DatasetExecutionService : IDatasetExecutionService
    {
        private readonly PortalDbContext _context;
        private readonly IConfiguration _configuration;

        public DatasetExecutionService(
            PortalDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<object> RunAsync(int datasetId, Guid userId, ViewQueryRequest request)
        {
            var dataset = await _context.Datasets
                .FirstOrDefaultAsync(d => d.Id == datasetId);

            if (dataset == null)
                throw new Exception("Dataset non trovato");

            var permission = await _context.UserDatasetPermissions
                .FirstOrDefaultAsync(p =>
                    p.DatasetId == datasetId &&
                    p.UserId == userId &&
                    p.CanRun);

            if (permission == null)
                throw new UnauthorizedAccessException("Accesso non autorizzato");

            var connectionString = _configuration.GetConnectionString(dataset.DbKey);

            using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            var rawData = (await connection.QueryAsync(dataset.SqlText)).ToList();

            var data = rawData.Cast<IDictionary<string, object>>().ToList();

            // 🔎 FILTRI
            if (request.Filters != null && request.Filters.Any())
            {
                foreach (var filter in request.Filters)
                {
                    if (string.IsNullOrWhiteSpace(filter.Field))
                        continue;

                    var op = filter.Operator?.ToLower(); // 👈 QUESTA MANCAVA

                    data = data.Where(row =>
                    {
                        if (!row.ContainsKey(filter.Field) || row[filter.Field] == null)
                            return false;

                        var rawValue = row[filter.Field];
                        var cellString = rawValue?.ToString();

                        if (string.IsNullOrWhiteSpace(cellString))
                            return false;

                        // 🔥 DATE
                        if (DateTime.TryParse(cellString, out var cellDate) &&
                            DateTime.TryParse(filter.Value, out var filterDate))
                        {
                            return op switch
                            {
                                "equals" => cellDate.Date == filterDate.Date,
                                "greater" => cellDate > filterDate,
                                "less" => cellDate < filterDate,
                                _ => true
                            };
                        }

                        // 🔥 NUMERIC
                        if (decimal.TryParse(cellString, out var cellNumber) &&
                            decimal.TryParse(filter.Value, out var filterNumber))
                        {
                            return op switch
                            {
                                "equals" => cellNumber == filterNumber,
                                "greater" => cellNumber > filterNumber,
                                "less" => cellNumber < filterNumber,
                                _ => true
                            };
                        }

                        // 🔥 STRING
                        return cellString.Contains(
                            filter.Value ?? "",
                            StringComparison.OrdinalIgnoreCase);

                    }).ToList();
                }
            }

            // ↕ ORDINAMENTO (in memoria)
            if (!string.IsNullOrWhiteSpace(request.SortColumn) &&
                data.Any() &&
                data.First().ContainsKey(request.SortColumn))
            {
                data = request.SortDirection == "desc"
                    ? data.OrderByDescending(x => x[request.SortColumn]).ToList()
                    : data.OrderBy(x => x[request.SortColumn]).ToList();
            }

            var totalCount = data.Count;

            // 📄 PAGINAZIONE
            var pagedData = data
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            return new
            {
                totalCount,
                data = pagedData
            };
        }
    }
}