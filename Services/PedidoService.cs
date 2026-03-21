namespace CrudPedidoProduto.Services {

using Microsoft.EntityFrameworkCore;
using CrudPedidoProduto.Data;
using CrudPedidoProduto.DTOs;
using CrudPedidoProduto.Models;

    public class PedidoService {


        private AppDbContext AcessoAoDB;

        public PedidoService(AppDbContext Contexto){
            AcessoAoDB = Contexto;
        }


        // Endpoint GET /pedidos
        public List<RespostaPedidoDto> ListarTodosPedidos() {
            return AcessoAoDB.Pedidos.Include(pedido => pedido.PedidosProdutos)
                .ThenInclude(pedidoProduto => pedidoProduto.Produto)
                .Select(pedido => new RespostaPedidoDto {
                    Id = pedido.Id,
                    NumeroPedido = pedido.NumeroPedido,
                    // PedidosProdutos é a coleção dentro do Pedido, contendo linhas de PedidoProduto.
                    Itens = pedido.PedidosProdutos.Select(PedidoProduto => new RespostaPedidoItemDto {
                        ProdutoNome = PedidoProduto.Produto.Nome, // Uso da propriedade de navegação
                        PrecoUnidade = PedidoProduto.Produto.Preco,
                        Quantidade = PedidoProduto.Quantidade,
                        SubTotalItem = PedidoProduto.Produto.Preco * PedidoProduto.Quantidade
                    }).ToList(),
                    ValorTotal = pedido.PedidosProdutos.Sum(PedidoProduto => PedidoProduto.Produto.Preco * PedidoProduto.Quantidade)
                }).ToList();
        }

        // Endpoint GET /pedidos:id
        public RespostaPedidoDto? ListarPedidoPorId(int id) {

            // Nessa parte, o meu raciocínio seria validar primeiro se o ID do pedido existe antes de carregar qualquer tabela
            // Porém o EF Core faz isso tudo numa unica query, se eu fosse fazer essa validação e depois carregar, seriam 2 queries no banco.
            var pedidoAcessado = AcessoAoDB.Pedidos
                .Include(pedido => pedido.PedidosProdutos) // Carrega a tabela de junção
                .ThenInclude(pedidoProduto => pedidoProduto.Produto) // Carrega os produtos, pois veio vazio do .Include()
                .FirstOrDefault(pedido => pedido.Id == id);
            
            if (pedidoAcessado == null) {
                return null;
            }

            return new RespostaPedidoDto {
                Id = pedidoAcessado.Id,
                NumeroPedido = pedidoAcessado.NumeroPedido,
                Itens = pedidoAcessado.PedidosProdutos.Select(PedidoProduto => new RespostaPedidoItemDto {
                    ProdutoNome = PedidoProduto.Produto.Nome, // Uso da propriedade de navegação
                    PrecoUnidade = PedidoProduto.Produto.Preco,
                    Quantidade = PedidoProduto.Quantidade,
                    SubTotalItem = PedidoProduto.Produto.Preco * PedidoProduto.Quantidade
                }).ToList(),
                ValorTotal = pedidoAcessado.PedidosProdutos.Sum(PedidoProduto => PedidoProduto.Produto.Preco * PedidoProduto.Quantidade)
            };
        }


        //Endpoint GET /pedidos:numeroPedido - Pra usar no filtro
        public RespostaPedidoDto? ListarPedidoPorNumeroPedido(int numeroPedido) {

            var pedidoAcessado = AcessoAoDB.Pedidos
                .Include(pedido => pedido.PedidosProdutos)
                .ThenInclude(pedidoProduto => pedidoProduto.Produto)
                .FirstOrDefault(pedido => pedido.NumeroPedido == numeroPedido);
            
            if (pedidoAcessado == null) {
                return null;
            }

            return new RespostaPedidoDto {
                Id = pedidoAcessado.Id,
                NumeroPedido = pedidoAcessado.NumeroPedido,
                Itens = pedidoAcessado.PedidosProdutos.Select(PedidoProduto => new RespostaPedidoItemDto {
                    ProdutoNome = PedidoProduto.Produto.Nome,
                    PrecoUnidade = PedidoProduto.Produto.Preco,
                    Quantidade = PedidoProduto.Quantidade,
                    SubTotalItem = PedidoProduto.Produto.Preco * PedidoProduto.Quantidade
                }).ToList(),
                ValorTotal = pedidoAcessado.PedidosProdutos.Sum(PedidoProduto => PedidoProduto.Produto.Preco * PedidoProduto.Quantidade)
            };
        }


        
        // Funções de validação:
            // Máx 5 itens
            // Valor total <= 1000

        private bool ValidarQuantidadeItens(CriarPedidoDto pedido) {
            var quantidade = pedido.Itens.Count;

            if((quantidade <= 5) && (quantidade > 0)){
                return true;
            } else {
                return false;
            }

        }

        private bool ValidarValorTotal(CriarPedidoDto pedido) {

            decimal valorTotal = 0;

            foreach (var itemPedido in pedido.Itens) {
                var produto = AcessoAoDB.Produtos.Find(itemPedido.ProdutoId);

                if(produto == null){
                    return false;
                }

                valorTotal += produto.Preco * itemPedido.Quantidade;
            }

            if((valorTotal <= 1000) && valorTotal > 0){
                return true;
            } else {
                return false;
            }

        }


        // Função para gerar um Numero de Pedido aleatório (utils)
        private int gerarNumeroPedido(){
            Random rnd = new Random();
            int numeroGerado = rnd.Next(1_000, 10_000);
            
            if(AcessoAoDB.Pedidos.FirstOrDefault(pedido => pedido.NumeroPedido == numeroGerado) != null){
                gerarNumeroPedido();
            }

            return numeroGerado;

        }
        

        // Endpoint POST /pedidos
        public RespostaPedidoDto? CriarPedido(CriarPedidoDto pedido){
            
            if((ValidarQuantidadeItens(pedido)) && (ValidarValorTotal(pedido))){
                
                var novoPedido = new Pedido {
                    NumeroPedido = gerarNumeroPedido(),
                    PedidosProdutos = pedido.Itens.Select(item => new PedidoProduto {
                        ProdutoId = item.ProdutoId,
                        Quantidade = item.Quantidade
                    }).ToList()
                };

                AcessoAoDB.Pedidos.Add(novoPedido);
                AcessoAoDB.SaveChanges();

                return ListarPedidoPorId(novoPedido.Id);

            } else {
                return null;
            }

        }


        // Endpoint PUT /pedidos:id
        public RespostaPedidoDto? AtualizarPedido(CriarPedidoDto pedido, int id){
            
            // Precisa validar de novo
            if((ValidarQuantidadeItens(pedido)) && (ValidarValorTotal(pedido))){

                var pedidoAcessado = AcessoAoDB.Pedidos
                    .Include(pedido => pedido.PedidosProdutos)
                    .ThenInclude(pedidoProduto => pedidoProduto.Produto)
                    .FirstOrDefault(pedido => pedido.Id == id);
            
                if (pedidoAcessado == null) {
                    return null;
                }

                // Remover os itens antigos
                AcessoAoDB.PedidosProdutos.RemoveRange(pedidoAcessado.PedidosProdutos);

                // Adição dos novos itens
                pedidoAcessado.PedidosProdutos = pedido.Itens.Select(item => new PedidoProduto {
                    ProdutoId = item.ProdutoId,
                    Quantidade = item.Quantidade
                }).ToList();

                AcessoAoDB.SaveChanges();

                return ListarPedidoPorId(pedidoAcessado.Id);
                
            } else {
                return null;
            }

        }



        // Endpoint DELETE /pedidos:id
        public bool DeletarPedido(int id){

            // Find() devolve PedidosProdutos == null, mas nesse caso não faz diferença    
            var pedidoAcessado = AcessoAoDB.Pedidos.Find(id);

            if (pedidoAcessado == null) {
                return false;
            }

            AcessoAoDB.Pedidos.Remove(pedidoAcessado);
            AcessoAoDB.SaveChanges();

            return true;
        }

    }
}