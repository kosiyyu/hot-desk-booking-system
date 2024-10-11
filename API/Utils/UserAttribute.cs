using Microsoft.AspNetCore.Authorization;

namespace HotDeskWebApp.Utils;

public class UserAttribute : AuthorizeAttribute
{
    public UserAttribute()
    {
        Roles = "User";
    }
}