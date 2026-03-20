namespace CrudPedidoProduto.DTOs {

    // Response da criação de um produto pertencente à um pedido

    public class RespostaPedidoItemDto {
        public string ProdutoNome {get;set;} = string.Empty;
        public decimal PrecoUnidade {get;set;}
        public int Quantidade {get;set;}
        public decimal SubTotalItem {get;set;}
    }
}