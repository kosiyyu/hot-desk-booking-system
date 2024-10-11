using HotDeskWebApp.Models;
using HotDeskWebApp.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotDeskWebApp.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DeskController : ControllerBase
{
    private readonly IDeskService _deskService;

    public DeskController(IDeskService deskService)
    {
        _deskService = deskService;
    }
    
    [HttpPost]
    [Admin]
    public async Task<IActionResult> Post([FromBody] DeskDTO deskDto)
    {
        try
        {
            await _deskService.AddAsync(deskDto);
            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }
    
    [HttpDelete("{id}")]
    [Admin]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _deskService.RemoveAsync(id);
            return NoContent();
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }
    
    [HttpPut("{id}")]
    [Admin]
    public async Task<IActionResult> Put(DeskDTO deskDto, int id)
    {
        try
        {
            await _deskService.EditAsync(deskDto, id);
            return NoContent();
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }
    
    [HttpGet("{deskId}/availability/array/{dateOnlyString}/{userId}")]
    public async Task<IActionResult> GetAvailabilityArray(string dateOnlyString, int deskId, int userId)
    {
        try
        {
            var date = DateOnly.Parse(dateOnlyString);
            var array = await _deskService.DesksAvailableByMonth(date, deskId, userId);
            return Ok(array);
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }
}