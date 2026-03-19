namespace CrudPedidoProduto.DTOs {

    // Vai ser usado no response do POST de pedidos

    public class RespostaProdutoDto {
        public int Id {get;set;}
        public string Nome {get;set;} = string.Empty;
        public decimal Preco {get;set;}
    }
}