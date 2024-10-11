using HotDeskWebApp.Models;

namespace HotDeskWebApp.Repositories;

public interface IReservationService
{
    public Task AddAsync(ReservationDTO reservationDto);
    public Task RemoveAsync(int id, int userId);
}