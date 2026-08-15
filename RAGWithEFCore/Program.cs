using EFCoreDatabaseLayer.Models;
using Microsoft.AI.Foundry.Local;
using Microsoft.EntityFrameworkCore;
using ServiceLayer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var config = new Microsoft.AI.Foundry.Local.Configuration
{
    AppName = "foundry_local_samples",
    LogLevel = Microsoft.AI.Foundry.Local.LogLevel.Information,
    // Installed Foundry CLI and loaded the model catalog before running this sample. Cache location is as below. Note: this cache location varies with that of code generated model cache location
    ModelCacheDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".foundry", "cache", "models"),
};

using var loggerFactory = LoggerFactory.Create(logging => logging.AddConsole());
var logger = loggerFactory.CreateLogger("FoundryLocal");

await FoundryLocalManager.CreateAsync(config, logger);

// Register the loaded IModel instance directly
builder.Services.AddSingleton<IModel>(sp =>
{
    var mgr = FoundryLocalManager.Instance;
    var catalog = mgr.GetCatalogAsync().GetAwaiter().GetResult();

    var model = catalog.GetModelAsync("qwen3-embedding-0.6b").Result;

    if (model != null)
    {
        // Find the CPU variant from available variants
        var cpuVariant = model.Variants.FirstOrDefault(v =>
            v.Id.Contains("cpu", StringComparison.OrdinalIgnoreCase));

        if (cpuVariant != null)
        {
            // Explicitly override the hardware selection
            model.SelectVariant(cpuVariant);
        }

        if (!model.IsCachedAsync().Result)
        {
            model.DownloadAsync().Wait();
        }

        model.LoadAsync().Wait();
    }
    return model!;
});

builder.Services.AddCors(options=>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder.WithOrigins("http://localhost:52543")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Register the DbContext in Dependency Injection (MISSING PIECE)
builder.Services.AddDbContext<LearningRagwithSqlContext>(options =>
    options.UseSqlServer(connectionString));

// Register domain wrapper
builder.Services.AddSingleton<ICustomEmbeddingService, FoundryEmbeddingService>();
builder.Services.AddScoped<IDocumentChunkService, DocumentChunkService>();


builder.Services.AddControllers();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Enable CORS for SPA
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
