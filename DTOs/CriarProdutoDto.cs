namespace CrudPedidoProduto.DTOs {

    // Vai ser usado no request do POST de produtos

    public class CriarProdutoDto {
        public string Nome {get;set;} = string.Empty;
        public decimal Preco {get;set;}
    }


}