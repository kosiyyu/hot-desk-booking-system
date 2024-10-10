using HotDeskWebApp.Database;
using HotDeskWebApp.Repositories;
using HotDeskWebApp.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<DatabaseContext>(
    options =>
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")).LogTo(Console.WriteLine, LogLevel.Information);
        // options.UseLazyLoadingProxies();
    }
);

builder.Services.AddControllers();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<IDeskService, DeskService>();
builder.Services.AddScoped<IReservationService, ReservationService>();

var app = builder.Build();

app.UseCors("AllowLocalhost");
app.MapControllers();

app.Run();