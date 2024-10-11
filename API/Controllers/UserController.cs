using HotDeskWebApp.Models;
using HotDeskWebApp.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace HotDeskWebApp.Controllers
{
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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserDTO userDto)
        {
            try
            {
                var validationError = ValidateUserDto(userDto);
                if (validationError != null)
                    return BadRequest(validationError);

                // Add the new user
                await _userService.AddAsync(userDto);
                return StatusCode(201, "User created successfully.");
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error.");
            }
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _userService.RemoveAsync(id);
                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error.");
            }
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var user = await _userService.FindById(id);
                if (user == null)
                    return NotFound("User not found.");

                return Ok(user);
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
}
