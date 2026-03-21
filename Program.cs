using CrudPedidoProduto.Data;
using CrudPedidoProduto.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Puxa lá no appsettings.json
var StringConexao = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(
    options => options.UseNpgsql(StringConexao)
);

// Adicionando os meus serviços
builder.Services.AddScoped<ProdutoService>();
builder.Services.AddScoped<PedidoService>();

// Adicionando controllers
builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();
app.UseHttpsRedirection();

app.Run();