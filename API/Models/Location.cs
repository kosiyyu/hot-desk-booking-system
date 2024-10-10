using System.ComponentModel.DataAnnotations;

namespace HotDeskWebApp.Models;

public class Location
{
    [Key] 
    public int LocationId { get; set; }

    [Required] 
    public string Name { get; set; }
    
    [Required] 
    public string Address { get; set; }
    
    public virtual ICollection<Desk> Desks { get; set; } = new List<Desk>();
}