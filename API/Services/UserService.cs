using HotDeskWebApp.Database;
using HotDeskWebApp.Models;
using HotDeskWebApp.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HotDeskWebApp.Services;

public class UserService : IUserService
{
    private readonly DatabaseContext _ctx;

    public UserService(DatabaseContext ctx)
    {
        _ctx = ctx;
    }
    
    public async Task AddAsync(UserDTO userDto, bool isAdmin = false)
    {
        var user = new User()
        {
            Username = userDto.Username,
            Password = userDto.Password,
            Email = userDto.Email,
            IsAdmin = isAdmin
        };
        await _ctx.AddAsync(user);
        await _ctx.SaveChangesAsync();
    }

    public async Task RemoveAsync(int id)
    {
        var user = await _ctx.Users.FindAsync(id);
        if (user == null) throw new ArgumentException("User not found");

        if (user.IsAdmin) throw new ArgumentException("User can't be removed due to its administrator rights");
        
        _ctx.Remove(user);
        await _ctx.SaveChangesAsync();
    }

    public async Task<User> FindById(int id)
    {
        var user = await _ctx.Users
            .FirstAsync(x => x.UserId == id);
        if (user == null) throw new ArgumentException();

        return user;
    }
}