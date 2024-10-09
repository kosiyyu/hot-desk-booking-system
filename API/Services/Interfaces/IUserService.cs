using HotDeskWebApp.Models;

namespace HotDeskWebApp.Repositories
{
    public interface IUserService
    {
        public Task AddAsync(UserDTO userDto, bool isAdmin = false);
        public Task RemoveAsync(int id);
        public Task<User> FindById(int id);
    }
}