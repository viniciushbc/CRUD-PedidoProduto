namespace CrudPedidoProduto.Models {

public class PedidoProduto {
    public int PedidoId {get;set;}
    public int ProdutoId {get;set;}
    public int Quantidade {get;set;}


    // Propriedades de navegação
    public virtual Pedido Pedido {get;set;} = null!;
    public virtual Produto Produto {get;set;} = null!;
}

}