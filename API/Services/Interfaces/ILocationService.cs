using HotDeskWebApp.Models;

namespace HotDeskWebApp.Repositories;

public interface ILocationService
{
    public Task AddAsync(LocationDTO locationDto);
    public Task RemoveAsync(int id);
    public Task EditAsync(LocationDTO locationDto, int id);
    public Task<Location> FindByIdAsync(int id);
    public Task<Location> FindByIdJoinAsync(int id);
}