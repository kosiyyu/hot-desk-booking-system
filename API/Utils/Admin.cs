using Microsoft.AspNetCore.Authorization;

namespace HotDeskWebApp.Utils;

public class Admin : AuthorizeAttribute
{
    public Admin()
    {
        Roles = "Admin";
    }
}