using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HotDeskWebApp.Models;

public class Reservation
{
    [Key] 
    public int ReservationId { get; set; }
    
    [ForeignKey("User")] 
    public int UserId { get; set; }
    
    [ForeignKey("Desk")] 
    public int DeskId { get; set; }
    
    [Required] 
    public DateOnly ReservationDate { get; set; }
    
    [Required]
    public DateTime CreatedAt { get; set; }
    
    public virtual User User { get; set; }
    
    public virtual Desk Desk { get; set; }
}