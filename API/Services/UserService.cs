using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HotDeskWebApp.Database;
using HotDeskWebApp.Models;
using HotDeskWebApp.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace HotDeskWebApp.Services;

public class UserService : IUserService
{
    private readonly DatabaseContext _ctx;
    private readonly IConfiguration _configuration;

    public UserService(DatabaseContext ctx, IConfiguration configuration)
    {
        _ctx = ctx;
        _configuration = configuration;
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
    
    public async Task<string> ValidateUserAsync(UserDTO userDto)
    {
        var user = await _ctx.Users
            .FirstOrDefaultAsync(u => u.Email == userDto.Email && u.Password == userDto.Password);

        if (user == null)
        {
            throw new ArgumentException("Invalid username or password");
        }
        
        var token = GenerateJwtToken(user);

        return token;
    }

    private string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("username", user.Username)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}