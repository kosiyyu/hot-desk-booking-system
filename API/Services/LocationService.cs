using HotDeskWebApp.Database;
using HotDeskWebApp.Models;
using HotDeskWebApp.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HotDeskWebApp.Services;

public class LocationService : ILocationService
{
    private readonly DatabaseContext _ctx;

    public LocationService(DatabaseContext ctx)
    {
        _ctx = ctx;
    }
    
    public async Task AddAsync(LocationDTO locationDto)
    {
        var location = new Location()
        {
            Name = locationDto.Name,
            Address = locationDto.Address,
        };

        await _ctx.Locations.AddAsync(location);
        await _ctx.SaveChangesAsync();
    }

    public async Task RemoveAsync(int id)
    {
        await using var transaction = await _ctx.Database.BeginTransactionAsync();
        try
        {
            var fetchedLocation = await _ctx.Locations
                .Include(location => location.Desks)
                .FirstAsync(x => x.LocationId == id);
            
            if (fetchedLocation.Desks.Any())
                throw new InvalidOperationException("Location has assigned desks and can't be removed");
            
            _ctx.Locations.Remove(fetchedLocation);
            await _ctx.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    
    
    // Only for changing strings
    public async Task EditAsync(LocationDTO locationDto, int id)
    {
        var fetchedLocation = await _ctx.Locations.FindAsync(id);

        if (fetchedLocation == null) 
            throw new ArgumentException("Location not found");

        fetchedLocation.Address = locationDto.Address;
        fetchedLocation.Name = locationDto.Name;

        _ctx.Locations.Update(fetchedLocation);
        await _ctx.SaveChangesAsync();
    }

    public async Task<Location> FindByIdAsync(int id)
    {
        var location = await _ctx.Locations
            .FirstAsync(x => x.LocationId == id);
        
        if (location == null) 
            throw new ArgumentException("Location not found");
        
        return location;
    }
    
    public async Task<Location> FindByIdJoinAsync(int id)
    {
        var location = await _ctx.Locations
            .Include(x => x.Desks)
            .FirstAsync(l => l.LocationId == id);
            
        if (location == null) 
            throw new ArgumentException("Location not found");

        return location;
    }

}