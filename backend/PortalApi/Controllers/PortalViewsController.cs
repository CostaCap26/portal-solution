using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortalApi.Filters;
using PortalApi.Models.Entities;


namespace PortalApi.Controllers
{
    [ApiController]
    [Route("api/portal/{slug}/test")]
    [Authorize]
    [ServiceFilter(typeof(PortalAccessFilter))]
    public class PortalTestController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetTest(string slug)
        {
            return Ok($"Accesso consentito al portale {slug}");
        }
    }
}
