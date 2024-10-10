using HotDeskWebApp.Models;
using HotDeskWebApp.Records;

namespace HotDeskWebApp.Repositories;

public interface ILocationService
{
    public Task AddAsync(LocationDTO locationDto);
    public Task RemoveAsync(int id);
    public Task EditAsync(LocationDTO locationDto, int id);
    public Task<Location> FindByIdAsync(int id);
    public Task<LocationOut> FindByIdJoinAsync(int id);
    Task<(List<Location> Locations, int TotalCount)> SearchAsync(string searchTerm, int page, int pageSize);
    Task<int> CountAsync();
}