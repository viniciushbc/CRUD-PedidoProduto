namespace CrudPedidoProduto.DTOs {

    // Response de Pedido

    public class RespostaPedidoDto {
        public int Id {get;set;}
        public int NumeroPedido {get;set;}
        public List<RespostaPedidoItemDto> Itens {get;set;} = new List<RespostaPedidoItemDto>();
        public decimal ValorTotal {get;set;}
    }
}