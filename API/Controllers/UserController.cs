using HotDeskWebApp.Models;
using HotDeskWebApp.Repositories;
using HotDeskWebApp.Services;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserDTO userDto)
        {
            try
            {
                // TODO validate userDto
                await _userService.AddAsync(userDto);
                return StatusCode(201);
            }
            catch (Exception)
            {
                return StatusCode(500);
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
                return StatusCode(500);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var user = await _userService.FindById(id);
                return Ok(user);
            }
            catch (Exception)
            {
                return StatusCode(500);
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
                return StatusCode(500);
            }
        }
    }
}