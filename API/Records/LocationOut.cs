namespace HotDeskWebApp.Records;

public record LocationOut(int LocationId, string Name, string Address, List<DeskOut> Desks);