namespace HotDeskWebApp.Models;

public class ReservationDTO
{
    public int UserId { get; set; }
    public int DeskId { get; set; }
    public DateOnly ReservationDate { get; set; }
}
