using HotDeskWebApp.Models;
using HotDeskWebApp.Repositories;
using HotDeskWebApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace HotDeskWebApp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LocationController : ControllerBase
{
    private readonly ILocationService _locationService;

    public LocationController(ILocationService locationService)
    {
        _locationService = locationService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody]LocationDTO locationDto)
    {
        try
        {
            // TODO add validation
            await _locationService.AddAsync(locationDto);
            return StatusCode(201);
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _locationService.RemoveAsync(id);
            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromBody]LocationDTO locationDto, int id)
    {
        try
        {
            await _locationService.EditAsync(locationDto, id);
            return Ok();
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        try
        {
            var location = await _locationService.FindByIdAsync(id);
            return Ok(location);
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }
    
    [HttpGet("test/{id}")]
    public async Task<IActionResult> Get2(int id)
    {
        try
        {
            var location = await _locationService.FindByIdJoinAsync(id);
            return Ok(location);
        }
        catch (Exception e)
        {
            return StatusCode(500);
        }
    }
}