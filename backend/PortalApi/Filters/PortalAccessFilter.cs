using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace PortalApi.Filters
{
    public class PortalAccessFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(
            ActionExecutingContext context,
            ActionExecutionDelegate next)
        {
            var user = context.HttpContext.User;

            if (!user.Identity?.IsAuthenticated ?? true)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            if (!context.RouteData.Values.TryGetValue("slug", out var slugObj))
            {
                context.Result = new BadRequestObjectResult("Slug mancante");
                return;
            }

            var slug = slugObj?.ToString();

            var portalClaims = user.Claims
                .Where(c => c.Type == "portal")
                .Select(c => c.Value)
                .ToList();

            var allowedSlugs = portalClaims
                .Select(c => c.Split('|')[0])
                .ToList();

            if (!allowedSlugs.Contains(slug))
            {
                context.Result = new ForbidResult();
                return;
            }

            await next();
        }
    }
}
