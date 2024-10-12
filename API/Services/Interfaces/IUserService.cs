using HotDeskWebApp.Models;

namespace HotDeskWebApp.Repositories
{
    public interface IUserService
    {
        public Task AddAsync(UserDTO userDto, bool isAdmin = false);
        public Task<string> ValidateUserAsync(UserDTO userDto);
        public Task<UserDTO> GetUserInfoByReservationIdAsync(int reservationId);
    }
}