using HotDeskWebApp.Database;
using HotDeskWebApp.Models;
using HotDeskWebApp.Records;
using HotDeskWebApp.Repositories;
using Microsoft.AspNetCore.Mvc;
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

    public async Task<LocationOut> FindByIdJoinAsync(int id)
    {
        var location = await _ctx.Locations
            .Include(x => x.Desks)
            .FirstOrDefaultAsync(l => l.LocationId == id); // Use FirstOrDefaultAsync to return null if not found

        if (location == null)
            throw new ArgumentException("Location not found");

        return new LocationOut(
            location.LocationId,
            location.Name,
            location.Address,
            location.Desks.Select(d => new DeskOut(d.DeskId, d.Name, d.LocationId)).ToList());
    }

    
    
    public async Task<(List<Location> Locations, int TotalCount)> SearchAsync(string searchTerm, int page, int pageSize)
    {
        IQueryable<Location> query = _ctx.Locations;

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            searchTerm = searchTerm.ToLower();
            query = query.Where(l => 
                l.Name.ToLower().Contains(searchTerm) || 
                l.Address.ToLower().Contains(searchTerm));
        }

        int totalCount = await query.CountAsync();

        var locations = await query
            .OrderBy(l => l.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (locations, totalCount);
    }
}