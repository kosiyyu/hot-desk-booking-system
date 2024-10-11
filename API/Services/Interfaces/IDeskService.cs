using HotDeskWebApp.Models;
using HotDeskWebApp.Records;


public interface IDeskService
{
    public Task AddAsync(DeskDTO deskDto);
    public Task RemoveAsync(int id);
    public Task EditAsync(DeskDTO deskDto, int id);
    public Task<List<DailyAvailability>> DesksAvailableByMonth(DateOnly reservationDate, int deskId, int userId);
}

