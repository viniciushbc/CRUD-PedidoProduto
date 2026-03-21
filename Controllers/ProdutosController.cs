using Microsoft.AspNetCore.Mvc;
using CrudPedidoProduto.Services;
using CrudPedidoProduto.DTOs;
using CrudPedidoProduto.Models;

namespace CrudPedidoProduto.Controllers
{
    
    [ApiController]
    [Route("api/produtos")]
    public class ProdutosController : ControllerBase {
    
        private ProdutoService produtoService;

        public ProdutosController(ProdutoService ps)
        {
            produtoService = ps;
        }

    [HttpGet]
    public IActionResult ListarTodosProdutos() {
    
        var Produtos = produtoService.ListarTodosProdutos();

        return Ok(Produtos);
            
    }

    [HttpGet("{id}")]
    public IActionResult BuscarProdutoPorID(int id) {

        var Produto = produtoService.BuscarProdutoPorID(id);

        if(Produto == null)
        {
            return NotFound();
        }

        return Ok(Produto);

    }


    [HttpPost]
    public IActionResult CriarProduto(CriarProdutoDto produtoDto) {
        
        var Produto = produtoService.CriarProduto(produtoDto);

        return Ok(Produto);


    }

    [HttpPut("{id}")]
    public IActionResult AtualizarProduto(CriarProdutoDto novoProdutoDto, int id) {
            
        var Produto = produtoService.AtualizarProduto(novoProdutoDto, id);

        if(Produto == null) {
            return NotFound();
        }

        return Ok(Produto);

    }

    [HttpDelete("{id}")]
    public IActionResult DeletarProduto(int id) {

        var Resultado = produtoService.DeletarProduto(id);

        if(Resultado == false) {
            return NotFound(); // 404
        }
        
        return NoContent(); // 204

    }

    }
}
