using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using PortalApi.Models.Requests;
using PortalApi.Services;


namespace PortalApi.Controllers;

[ApiController]
[Route("api/datasets")]
[Authorize]
public class DatasetsController : ControllerBase
{
    private readonly IDatasetExecutionService _service;

    public DatasetsController(IDatasetExecutionService service)
    {
        _service = service;
    }

    [HttpPost("{id}/run")]
    public async Task<IActionResult> Run(
        int id,
        [FromBody] ViewQueryRequest request)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _service.RunAsync(id, userId, request);

        return Ok(result);
    }

    [HttpPost("{id}/export")]
    public async Task<IActionResult> Export(int id, ViewQueryRequest request)
    {
        var userId = Guid.Parse(User.FindFirst("nameidentifier")!.Value);

        var result = await _service.RunAsync(id, userId, request);

        var data = ((dynamic)result).data as IEnumerable<IDictionary<string, object>>;

        using var workbook = new ClosedXML.Excel.XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Export");

        if (data != null && data.Any())
        {
            var headers = data.First().Keys.ToList();

            for (int i = 0; i < headers.Count; i++)
                worksheet.Cell(1, i + 1).Value = headers[i];

            int row = 2;
            foreach (var item in data)
            {
                for (int col = 0; col < headers.Count; col++)
                    worksheet.Cell(row, col + 1).Value = item[headers[col]]?.ToString();

                row++;
            }
        }

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;

        return File(
            stream.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "export.xlsx"
        );
    }
}
