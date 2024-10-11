namespace HotDeskWebApp.Records;

public record DailyAvailability(DateOnly Date, AvailabilityStatus Status, int? ReservationId);