using HotDeskWebApp.Models;
using HotDeskWebApp.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace HotDeskWebApp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReservationController : ControllerBase
{
    private readonly IReservationService _reservationService;

    public ReservationController(IReservationService reservationService)
    {
        _reservationService = reservationService;
    }
    
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ReservationDTO reservationDto)
    {
        try
        {
            await _reservationService.AddAsync(reservationDto);
            return Created();
        }
        catch (Exception)
        {
            return StatusCode(500);
        }
    }
    
    [HttpDelete("{id}/{userId}")]
    public async Task<IActionResult> Delete(int id, int userId)
    {
        try
        {
            await _reservationService.RemoveAsync(id, userId);
            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized("You are not authorized to delete this reservation.");
        }
        catch (ArgumentException)
        {
            return NotFound("Reservation not found.");
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }
}