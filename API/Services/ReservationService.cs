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
            if (user == null) throw new ArgumentException();

            var desk = await _ctx.Desks.FindAsync(reservationDto.DeskId);
            if (desk == null) throw new ArgumentException();
 
            if (reservationDto.ReservationDate <= DateOnly.FromDateTime(DateTime.Now))
                throw new ArgumentException();

            var isReservationUnavailable = await _ctx.Reservations
                .AnyAsync(x =>
                    x.DeskId == reservationDto.DeskId &&
                    x.ReservationDate == reservationDto.ReservationDate);
            if (isReservationUnavailable) throw new InvalidOperationException();
            
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
    
    public async Task EditAsync(ReservationDTO reservationDto, int id)
    {
        await using var transaction = await _ctx.Database.BeginTransactionAsync();
        try
        {
            var reservation = await _ctx.Reservations
                .FirstOrDefaultAsync(x => x.ReservationId == id);
            if (reservation == null) throw new ArgumentException();

            var isAny = await _ctx.Reservations
                .AnyAsync(x =>
                    x.ReservationId != id &&
                    x.DeskId == reservationDto.DeskId &&
                    x.ReservationDate == reservationDto.ReservationDate);
            if (isAny) throw new InvalidOperationException();

            if (DateOnly.FromDateTime(DateTime.Now) >= reservationDto.ReservationDate.AddDays(-1))
                throw new ArgumentException();
            
            if (reservationDto.ReservationDate <= DateOnly.FromDateTime(DateTime.Now))
                throw new ArgumentException();
            
            reservation.ReservationDate = reservationDto.ReservationDate;
            reservation.UserId = reservationDto.UserId;
            reservation.DeskId = reservationDto.DeskId;

            _ctx.Reservations.Update(reservation);
            await _ctx.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<Reservation> FindByIdAsync(int id)
    {
        var reservation = await _ctx.Reservations
            .Include(x => x.Desk)
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.ReservationId == id);
        
        if (reservation == null) throw new ArgumentException("Reservation not found");

        return reservation;
    }
}