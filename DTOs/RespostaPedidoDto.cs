namespace CrudPedidoProduto.DTOs {

    // Response de Pedido

    public class RespostaPedidoDto {
        public int Id {get;set;};
        public int NumeroPedido {get;set;}
        public List<RespostaPedidoItem> Itens {get;set;} = new List<RespostaPedidoItem>();
        public decimal ValorTotal {get;set;}
    }
}