namespace CrudPedidoProduto.DTOs {


    public class RespostaPedidoDto {
        public int Id {get; set;}
        public int NumeroPedido {get;set;} // Usar no filtro
        public ICollection<PedidoProduto> PedidosProdutos {get;set;} = new List<PedidoProduto>();
        
    }

}