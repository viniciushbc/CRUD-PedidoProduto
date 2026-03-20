namespace CrudPedidoProduto.DTOs {

    // Será usado no POST para criar um PEDIDO
    // POST de uma instancia única de um produto e suas quantidades (Será incluído na lista de Produtos de um Pedido)

    public class CriarPedidoItemDto {
        public int ProdutoId {get;set;}
        public int Quantidade {get;set;}
    }
}