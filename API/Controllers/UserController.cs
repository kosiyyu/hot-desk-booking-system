using HotDeskWebApp.Models;
using HotDeskWebApp.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using HotDeskWebApp.Repositories;

namespace HotDeskWebApp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    [AllowAnonymous] // Anyone can register
    public async Task<IActionResult> Register([FromBody] UserDTO userDto)
    {
        try
        {
            var validationError = ValidateUserDto(userDto);
            if (validationError != null)
                return BadRequest(validationError);
            
            await _userService.AddAsync(userDto);
            return StatusCode(201, "User registered successfully.");
        }
        catch (Exception)
        {
            return StatusCode(500, "Internal server error.");
        }
    }
    
    [HttpPost("validate")]
    [AllowAnonymous] // Anyone can attempt to log in
    public async Task<IActionResult> ValidateUser([FromBody] UserDTO userDto)
    {
        try
        {
            var jwt = await _userService.ValidateUserAsync(userDto);
            return Ok(jwt);
        }
        catch (Exception)
        {
            return StatusCode(500, "Internal server error.");
        }
    }
    
    [HttpGet("reservation/{reservationId}")]
    [Authorize]
    [Admin]
    public async Task<IActionResult> GetUserInfoByReservationId(int reservationId)
    {
        try
        {
            var userInfo = await _userService.GetUserInfoByReservationIdAsync(reservationId);
            return Ok(userInfo);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception)
        {
            return StatusCode(500, "Internal server error.");
        }
    }
    
    private string ValidateUserDto(UserDTO userDto)
    {
        if (string.IsNullOrEmpty(userDto.Email) || !IsValidEmail(userDto.Email))
            return "Invalid or missing email.";

        if (string.IsNullOrEmpty(userDto.Username))
            return "Username is required.";

        if (string.IsNullOrEmpty(userDto.Password) || userDto.Password.Length < 6)
            return "Password must be at least 6 characters long.";

        return null;
    }
    
    private bool IsValidEmail(string email)
    {
        var emailRegex = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
        return Regex.IsMatch(email, emailRegex);
    }
}
