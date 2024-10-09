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

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        try
        {
            var reservation = await _reservationService.FindByIdAsync(id);
            return Ok(reservation);
        }
        catch (Exception)
        {
            return StatusCode(500);
        }
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
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _reservationService.RemoveAsync(id);
            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(500);
        }
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromBody] ReservationDTO reservationDto, int id)
    {
        try
        {
            await _reservationService.EditAsync(reservationDto, id);
            return NoContent();
        }
        catch (Exception)
        {
            return StatusCode(500);
        }
    }
    
    
}