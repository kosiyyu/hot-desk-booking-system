using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HotDeskWebApp.Models;

public class Desk
{
    [Key] 
    public int DeskId { get; set; }
    
    [Required] 
    public string Name { get; set; }
    
    [ForeignKey("Location")]
    public int LocationId { get; set; }
    
    public virtual Location Location { get; set; }
    
    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}