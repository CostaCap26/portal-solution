using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortalApi.Data;
using PortalApi.Filters;
using PortalApi.Models.Requests;
using ClosedXML.Excel;
using System.Linq.Expressions;
using System.Reflection;
using PortalApi.Models.Entities;

namespace PortalApi.Controllers
{
    [ApiController]
    [Route("api/portal/{slug}/views")]
    [Authorize]
    [ServiceFilter(typeof(PortalAccessFilter))]
    public class ViewsController : ControllerBase
    {
        private readonly PortalDbContext _context;

        public ViewsController(PortalDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // USERS GRID
        // ==========================================
        [HttpPost("users/query")]
        public async Task<IActionResult> QueryUsers(
            string slug,
            [FromBody] ViewQueryRequest request)
        {
            var result = await ExecuteQuery(
                _context.Users.AsQueryable(),
                request);

            return Ok(new
            {
                totalCount = result.TotalCount,
                data = result.Data
            });
        }

        // ==========================================
        // USERS EXPORT (ESATTAMENTE COME LA GRID)
        // ==========================================
        [HttpPost("users/export")]
        public async Task<IActionResult> ExportUsers(
            string slug,
            [FromBody] ViewQueryRequest request)
        {
            var result = await ExecuteQuery(
                _context.Users.AsQueryable(),
                request);

            var data = result.Data;

            if (!data.Any())
            {
                return File(
                    Array.Empty<byte>(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "UsersExport.xlsx");
            }

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Export");

            var properties = typeof(User)
                .GetProperties()
                .Where(p =>
                       p.PropertyType == typeof(string)
                    || p.PropertyType == typeof(DateTime)
                    || p.PropertyType == typeof(bool)
                    || p.PropertyType == typeof(Guid)
                    || p.PropertyType.IsPrimitive)
                .Where(p => p.Name != "PasswordHash") // 🔥 sicurezza
                .ToList();

            // HEADER
            for (int col = 0; col < properties.Count; col++)
            {
                worksheet.Cell(1, col + 1).Value = properties[col].Name;
            }

            // DATA
            for (int row = 0; row < data.Count; row++)
            {
                for (int col = 0; col < properties.Count; col++)
                {
                    var value = properties[col].GetValue(data[row]);

                    worksheet.Cell(row + 2, col + 1).Value =
                        value switch
                        {
                            null => "",
                            DateTime dt => dt,
                            bool b => b,
                            Guid g => g.ToString(),
                            _ => value?.ToString()
                        };
                }
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            return File(
                stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "UsersExport.xlsx");
        }

        // ==========================================
        // CORE QUERY ENGINE (GRID + EXPORT)
        // ==========================================
        private async Task<QueryResult<T>> ExecuteQuery<T>(
            IQueryable<T> source,
            ViewQueryRequest request)
            where T : class
        {
            var query = ApplyFiltersAndSorting(source, request);

            var totalCount = await query.CountAsync();

            var data = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return new QueryResult<T>
            {
                TotalCount = totalCount,
                Data = data
            };
        }

        private class QueryResult<T>
        {
            public int TotalCount { get; set; }
            public List<T> Data { get; set; } = new();
        }

        // ==========================================
        // FILTER + SORT ENGINE
        // ==========================================
        private IQueryable<T> ApplyFiltersAndSorting<T>(
            IQueryable<T> query,
            ViewQueryRequest request)
            where T : class
        {
            var entityType = typeof(T);

            // FILTERS
            if (request.Filters != null && request.Filters.Any())
            {
                var parameter = Expression.Parameter(entityType, "e");
                Expression? finalExpression = null;

                foreach (var filter in request.Filters)
                {
                    if (string.IsNullOrWhiteSpace(filter.Field))
                        continue;

                    var property = entityType.GetProperty(
                        filter.Field,
                        BindingFlags.IgnoreCase |
                        BindingFlags.Public |
                        BindingFlags.Instance);

                    if (property == null)
                        continue;

                    var propertyAccess = Expression.Property(parameter, property);
                    Expression? condition = null;

                    if (property.PropertyType == typeof(string))
                    {
                        var constant = Expression.Constant(filter.Value ?? "");

                        if (filter.Operator == "contains")
                        {
                            var method = typeof(string)
                                .GetMethod("Contains", new[] { typeof(string) });

                            condition = Expression.Call(propertyAccess, method!, constant);
                        }

                        if (filter.Operator == "equals")
                            condition = Expression.Equal(propertyAccess, constant);

                        if (filter.Operator == "notEquals")
                            condition = Expression.NotEqual(propertyAccess, constant);
                    }

                    if (property.PropertyType == typeof(bool) &&
                        bool.TryParse(filter.Value, out bool boolValue))
                    {
                        var constant = Expression.Constant(boolValue);

                        if (filter.Operator == "equals")
                            condition = Expression.Equal(propertyAccess, constant);

                        if (filter.Operator == "notEquals")
                            condition = Expression.NotEqual(propertyAccess, constant);
                    }

                    if (property.PropertyType == typeof(DateTime) &&
                        DateTime.TryParse(filter.Value, out DateTime date))
                    {
                        var constant = Expression.Constant(date);

                        if (filter.Operator == "greater")
                            condition = Expression.GreaterThan(propertyAccess, constant);

                        if (filter.Operator == "less")
                            condition = Expression.LessThan(propertyAccess, constant);

                        if (filter.Operator == "equals")
                            condition = Expression.Equal(propertyAccess, constant);
                    }

                    if (condition == null)
                        continue;

                    finalExpression = finalExpression == null
                        ? condition
                        : filter.Logic == "OR"
                            ? Expression.OrElse(finalExpression, condition)
                            : Expression.AndAlso(finalExpression, condition);
                }

                if (finalExpression != null)
                {
                    var lambda =
                        Expression.Lambda<Func<T, bool>>(finalExpression, parameter);

                    query = query.Where(lambda);
                }
            }

            // SORT
            if (!string.IsNullOrEmpty(request.SortColumn))
            {
                var property = entityType.GetProperty(
                    request.SortColumn,
                    BindingFlags.IgnoreCase |
                    BindingFlags.Public |
                    BindingFlags.Instance);

                if (property != null)
                {
                    var propertyName = property.Name;

                    query = request.SortDirection == "desc"
                        ? query.OrderByDescending(e => EF.Property<object>(e, propertyName))
                        : query.OrderBy(e => EF.Property<object>(e, propertyName));
                }
            }

            return query;
        }
    }
}