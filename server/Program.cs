using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Pomelo.EntityFrameworkCore.MySql;
using server.Internals.Database;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.WebHost.UseUrls("http://localhost:3000");

builder.Services.AddControllers();

string? connectionString = System.Environment.GetEnvironmentVariable("CONNECTION_STRING");
if (connectionString == null || connectionString == "") {
    throw new Exception("Failed to find CONNECTION_STRING environment variable");
}
builder.Services.AddDbContext<DatabaseContext>(options =>
options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddScoped<BookService>();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.Run();
