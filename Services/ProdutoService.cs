namespace CrudPedidoProduto.Services {

using Microsoft.EntityFrameworkCore;
using CrudPedidoProduto.Data;
using CrudPedidoProduto.DTOs;
using CrudPedidoProduto.Models;

public class ProdutoService {


    private AppDbContext AcessoAoDB;

    public ProdutoService(AppDbContext Contexto){
        AcessoAoDB = Contexto;
    }


    // Endpoint GET /produtos
    public List<RespostaProdutoDto> ListarTodosProdutos() {
        return AcessoAoDB.Produtos.Select(produto => new RespostaProdutoDto {
            Id = produto.Id,
            Nome = produto.Nome,
            Preco = produto.Preco,
        }).ToList();
    }

    // Endpoint GET /produtos:id
    public RespostaProdutoDto? BuscarProdutoPorID(int id) {

        // .Find() é um método do EF Core que ja sabe buscar pela chave primaria
        var produto = AcessoAoDB.Produtos.Find(id);

        if (produto == null) {
            return null;
        }

        var RespostaProduto = new RespostaProdutoDto {
            Id = produto.Id,
            Nome = produto.Nome,
            Preco = produto.Preco
        };

        return RespostaProduto;

    }

    // Endpoint POST /produtos
    public RespostaProdutoDto CriarProduto(CriarProdutoDto produto) {

        var NovoProduto = new Produto {
            // Id = XX, O id é gerado automaticamente pelo banco
            Nome = produto.Nome,
            Preco = produto.Preco
        }

        AcessoAoDB.Produtos.Add(NovoProduto);
        AcessoAoDB.SaveChanges();

        return new RespostaProdutoDto{
            Id = NovoProduto.Id,
            Nome = NovoProduto.Nome,
            Preco = NovoProduto.Preco,
        }
    }

    // Endpoint PUT /produtos
    public RespostaProdutoDto? AtualizarProduto(CriarProdutoDto novoProduto, int id){

        var ProdutoAntigo = AcessoAoDB.Produtos.Find(id);

        if (ProdutoAntigo == null) {
            return null;
        }

        ProdutoAntigo.Nome = novoProduto.Nome;
        ProdutoAntigo.Preco = novoProduto.Preco;

        AcessoAoDB.SaveChanges();

        return new RespostaProdutoDto{
            Id = ProdutoAntigo.Id,
            Nome = ProdutoAntigo.Nome,
            Preco = ProdutoAntigo.Preco
        };
    }

    // Endpoint DELETE /produtos:id
    public bool DeletarProduto(int id) {

        var ProdutoAntigo = AcessoAoDB.Produtos.Find(id);

        if (ProdutoAntigo == null) {
            return false;
        }

        AcessoAoDB.Produtos.Remove(ProdutoAntigo);
        AcessoAoDB.SaveChanges();

        return true;
           
    }

}
}