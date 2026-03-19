namespace CrudPedidoProduto.DTOs {

    // Vai ser usado no request do POST de pedidos
    
    public class CriarPedidoDto {
        public ICollection<PedidoProduto> PedidosProdutos {get;set;} = new List<PedidoProduto>();
    }

}