using CrudPedidoProduto.Data;
using CrudPedidoProduto.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Puxa lá no appsettings.json
var StringConexao = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(
    options => options.UseNpgsql(StringConexao)
);

// Adicionando os serviços
builder.Services.AddScoped<ProdutoService>();
builder.Services.AddScoped<PedidoService>();

// Adicionando controllers
builder.Services.AddControllers();

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Middlewares
app.UseCors("AllowAngular");

app.MapControllers();
app.UseHttpsRedirection();

app.Run();