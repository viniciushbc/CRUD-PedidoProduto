namespace CrudPedidoProduto.Models {

    public class Produto {
        public int Id {get;set;}
        public string Nome {get;set;} = string.Empty;
        public decimal Preco {get;set;}
        public ICollection<PedidoProduto> PedidosProdutos {get;set;} = new List<PedidoProduto>();
    }
}