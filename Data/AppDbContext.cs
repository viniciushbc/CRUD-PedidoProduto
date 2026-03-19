using Microsoft.EntityFrameworkCore;
using CrudPedidoProduto.Models;

namespace CrudPedidoProduto.Data;


public class AppDbContext : DbContext {

    // DbSet é o modulo do EF Core que representa uma tabela
    // Criando tabelas onde cada linha corresponde a um Objeto
    public DbSet<Pedido> Pedidos {get; set;}
    public DbSet<Produto> Produtos {get;set;}
    public DbSet<PedidoProduto> PedidosProdutos {get;set;}

    // Recebe a configuração de conexão com o banco e repassa pra classe pai do EF Core (DbContext)
    public AppDbContext(DbContextOptions<AppDbContext> options)  : base(options) {
    }


    // Configurações relacionais do banco
    protected override void OnModelCreating(ModelBuilder modelBuilder) {

        // Criando uma chave composta pra tabela PedidoProduto
        modelBuilder.Entity<PedidoProduto>()
            .HasKey(pp => new {pp.PedidoId, pp.ProdutoId});
        
        // PEDIDO - Cada pedido tem vários produtos
        // Estou conectando isso na tabela PedidoProduto através da chave estrangeira PedidoId
        modelBuilder.Entity<PedidoProduto>()
            .HasOne(pp => pp.Pedido)
            .WithMany(p => p.PedidosProdutos)
            .HasForeignKey(pp => pp.PedidoId);

        // PRODUTO - Cada produto pertence à vários pedidos
        // Estou conectando isso na tabela PedidoProduto através da chave estrangeira ProdutoId
        modelBuilder.Entity<PedidoProduto>()
            .HasOne(pp => pp.Produto)
            .WithMany(p => p.PedidosProdutos)
            .HasForeignKey(pp => pp.ProdutoId);
    }
}

