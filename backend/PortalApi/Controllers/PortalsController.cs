using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using PortalApi.Models.Entities;

namespace PortalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PortalsController : ControllerBase
    {
        [HttpGet("my")]
        public IActionResult GetMyPortals()
        {
            var portalClaims = User.Claims
                .Where(c => c.Type == "portal")
                .Select(c => c.Value)
                .ToList();

            var portals = portalClaims.Select(pc =>
            {
                var parts = pc.Split('|');

                return new
                {
                    slug = parts[0],
                    role = parts[1]
                };
            });

            return Ok(portals);
        }
    }
}
