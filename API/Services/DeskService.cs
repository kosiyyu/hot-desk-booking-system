using HotDeskWebApp.Database;
using HotDeskWebApp.Models;
using HotDeskWebApp.Records;
using Microsoft.EntityFrameworkCore;
using DateOnly = System.DateOnly;

namespace HotDeskWebApp.Services;

public class DeskService : IDeskService
{
    private readonly DatabaseContext _ctx;

    public DeskService(DatabaseContext ctx)
    {
        _ctx = ctx;
    }

    public async Task AddAsync(DeskDTO deskDto)
    {
        Desk desk = new Desk()
        {
            Name = deskDto.Name,
            LocationId = deskDto.LocationId
        };

        await _ctx.AddAsync(desk);
        await _ctx.SaveChangesAsync();
    }

    public async Task RemoveAsync(int id)
    {
        var desk = await _ctx.Desks.FindAsync(id);
        if (desk == null) 
            throw new ArgumentException();
        
        _ctx.Desks.Remove(desk);
        await _ctx.SaveChangesAsync();
    }
    
    public async Task EditAsync(DeskDTO deskDto, int id)
    {
        var desk = await _ctx.Desks.FindAsync(id);
        if (desk == null) 
            throw new ArgumentException();
        
        // TODO 
        // prevent from using fake LocationId

        desk.Name = deskDto.Name;
        // no change for LocationId since Desks are meant to be only deleted / added
        // changing Name should be possible as well
        
        _ctx.Desks.Update(desk);
        await _ctx.SaveChangesAsync();
    }

    public async Task<bool> IsAvailable(int id, DateOnly reservationDate)
    {
        var deskExists = await _ctx.Desks.AnyAsync(x => x.DeskId == id);
        if (!deskExists)
            return false;

        var isReserved = await _ctx.Reservations
            .AnyAsync(r =>
                r.DeskId == id &&
                r.ReservationDate == reservationDate);

        return !isReserved;
    }
    
    public async Task<List<DailyAvailability>> DesksAvailableByMonth(DateOnly reservationDate, int deskId, int userId)
    {
        var startOfMonth = new DateOnly(reservationDate.Year, reservationDate.Month, 1);
        var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);
        var today = DateOnly.FromDateTime(DateTime.Now);
        
        var reservations = await _ctx.Reservations
            .Where(r =>
                r.DeskId == deskId &&
                r.ReservationDate >= startOfMonth && 
                r.ReservationDate <= endOfMonth)
            .Select(r => new { r.ReservationDate, r.UserId, r.ReservationId })
            .ToListAsync();

        var result = new List<DailyAvailability>();

        for (var date = startOfMonth; date <= endOfMonth; date = date.AddDays(1))
        {
            var reservation = reservations.FirstOrDefault(r => r.ReservationDate == date);
            var availability = DetermineAvailability(date, today, reservation, userId);
            result.Add(new DailyAvailability(date, availability, reservation?.ReservationId));
        }

        return result;
    }
    
    private AvailabilityStatus DetermineAvailability(DateOnly date, DateOnly today, dynamic reservation, int userId)
    {
        if (date <= today)
            return AvailabilityStatus.Past;
        
        if (reservation == null)
            return AvailabilityStatus.Available;
        
        return reservation.UserId == userId ? AvailabilityStatus.ReservedByUser : AvailabilityStatus.ReservedByOther;
    }
}