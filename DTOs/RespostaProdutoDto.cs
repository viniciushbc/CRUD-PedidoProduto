namespace CrudPedidoProduto.DTOs {

    // Vai ser usado no response do POST de Produtos
    // Quando um produto for criado, o back retorna os dados do produto criado: {id, nome, preco}

    public class RespostaProdutoDto {
        public int Id {get;set;}
        public string Nome {get;set;} = string.Empty;
        public decimal Preco {get;set;}
    }
}