using Microsoft.AspNetCore.Authorization;

namespace HotDeskWebApp.Utils;

public class AdminAttribute : AuthorizeAttribute
{
    public AdminAttribute()
    {
        Roles = "Admin";
    }
}