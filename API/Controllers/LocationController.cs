using HotDeskWebApp.Models;
using HotDeskWebApp.Repositories;
using HotDeskWebApp.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotDeskWebApp.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class LocationController : ControllerBase
{
    private readonly ILocationService _locationService;

    public LocationController(ILocationService locationService)
    {
        _locationService = locationService;
    }
    
    [HttpPost]
    [Admin]
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
    [Admin]
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
    [Admin]
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
        try
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
        catch (Exception e)
        {
            // Log the exception
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }
}