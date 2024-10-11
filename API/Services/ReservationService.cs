using HotDeskWebApp.Database;
using HotDeskWebApp.Models;
using HotDeskWebApp.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HotDeskWebApp.Services;

public class ReservationService : IReservationService
{
    private readonly DatabaseContext _ctx;

    public ReservationService(DatabaseContext ctx)
    {
        _ctx = ctx;
    }
    
    public async Task AddAsync(ReservationDTO reservationDto)
    {
        await using var transaction = await _ctx.Database.BeginTransactionAsync();
        try
        {
            var user = await _ctx.Users.FindAsync(reservationDto.UserId);
            if (user == null) throw new ArgumentException("User not found");

            var desk = await _ctx.Desks.FindAsync(reservationDto.DeskId);
            if (desk == null) throw new ArgumentException("Desk not found");
 
            if (reservationDto.ReservationDate <= DateOnly.FromDateTime(DateTime.Now))
                throw new ArgumentException("Reservation date must be in the future");

            var isReservationUnavailable = await _ctx.Reservations
                .AnyAsync(x =>
                    x.DeskId == reservationDto.DeskId &&
                    x.ReservationDate == reservationDto.ReservationDate);
            if (isReservationUnavailable) throw new InvalidOperationException("Desk is already reserved for this date");
            
            if (await WouldExceedSevenConsecutiveDays(reservationDto.UserId, reservationDto.DeskId, reservationDto.ReservationDate))
                throw new InvalidOperationException("This reservation would result in more than 7 consecutive days of reservations");

            var reservation = new Reservation
            {
                UserId = reservationDto.UserId,
                DeskId = reservationDto.DeskId,
                ReservationDate = reservationDto.ReservationDate,
                CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc)
            };

            await _ctx.Reservations.AddAsync(reservation);
            await _ctx.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    
    public async Task RemoveAsync(int id, int userId)
    {
        await using var transaction = await _ctx.Database.BeginTransactionAsync();
        try
        {
            var reservation = await _ctx.Reservations
                .FirstOrDefaultAsync(x => x.ReservationId == id);

            if (reservation == null) throw new ArgumentException("Reservation not found");
            
            if (reservation.UserId != userId)
                throw new UnauthorizedAccessException("You are not authorized to delete this reservation.");

            // Check if the reservation is within 24 hours
            if (reservation.ReservationDate <= DateOnly.FromDateTime(DateTime.Now.AddHours(24)))
                throw new InvalidOperationException("Cannot delete reservations within 24 hours of the reservation time");

            _ctx.Reservations.Remove(reservation);
            await _ctx.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private async Task<bool> WouldExceedSevenConsecutiveDays(int userId, int deskId, DateOnly newReservationDate, int? excludeReservationId = null)
    {
        // Fetch all reservations for the user (14 days)
        var startDate = newReservationDate.AddDays(-14);
        var endDate = newReservationDate.AddDays(14);

        var reservations = await _ctx.Reservations
            .Where(r => r.UserId == userId &&
                        r.DeskId == deskId &&
                        r.ReservationDate >= startDate &&
                        r.ReservationDate <= endDate &&
                        (excludeReservationId == null || r.ReservationId != excludeReservationId))
            .Select(r => r.ReservationDate)
            .ToListAsync();

        reservations.Add(newReservationDate);
        reservations = reservations.Distinct().OrderBy(d => d).ToList();

        int consecutiveDays = 1;
        DateOnly? previousDate = null;

        foreach (var date in reservations)
        {
            if (previousDate.HasValue && date == previousDate.Value.AddDays(1))
            {
                consecutiveDays++;
                if (consecutiveDays > 7)
                {
                    return true;
                }
            }
            else
            {
                consecutiveDays = 1;
            }
            previousDate = date;
        }

        return false;
    }
}