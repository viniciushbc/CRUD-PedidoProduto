namespace CrudPedidoProduto.DTOs {

    // Vai ser usado no request do POST de Produtos
    // Criar um produto através do nome e preco

    public class CriarProdutoDto {
        public string Nome {get;set;} = string.Empty;
        public decimal Preco {get;set;}
    }


}