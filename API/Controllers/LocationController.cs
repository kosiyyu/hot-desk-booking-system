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
    
    [HttpGet("{id}/full")]
    public async Task<IActionResult> GetFull(int id)
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
    
    [HttpGet("search")]
    public async Task<IActionResult> SearchLocations(string searchTerm = "", int page = 1, int pageSize = 10)
    {
        var (locations, totalCount) = await _locationService.SearchAsync(searchTerm, page, pageSize);

        var result = new
        {
            Locations = locations,
            TotalCount = totalCount,
            CurrentPage = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };

        return Ok(result);
    }
    
    [HttpGet("count")]
    public async Task<IActionResult> GetTotalLocationCount()
    {
        var count = await _locationService.CountAsync();
        return Ok(count);
    }
}