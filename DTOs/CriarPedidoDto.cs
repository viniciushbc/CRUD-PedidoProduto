namespace CrudPedidoProduto.DTOs {

    // Vai ser usado no request do POST de PedidosS
    
    public class CriarPedidoDto {
        public List<CriarPedidoItemDto> Itens {get;set;} = new List<CriarPedidoItemDto>();
    }
}