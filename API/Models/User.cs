using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HotDeskWebApp.Models;

public class User
{
    [Key]
    public int UserId { get; set; }
    
    [Required]
    public string Username { get; set; }
    
    [Required]
    public string Password { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required] 
    public bool IsAdmin { get; set; }
    
    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}