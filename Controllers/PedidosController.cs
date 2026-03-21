using Microsoft.AspNetCore.Mvc;
using CrudPedidoProduto.Services;
using CrudPedidoProduto.DTOs;
using CrudPedidoProduto.Models;

namespace CrudPedidoProduto.Controllers
{
    
    [ApiController]
    [Route("api/pedidos")]
    public class PedidosController : ControllerBase {
    
        private PedidoService pedidoService;

        public PedidosController(PedidoService ps)
        {
            pedidoService = ps;
        }

    [HttpGet]
    public IActionResult ListarTodosPedidos() {
    
        var Pedidos = pedidoService.ListarTodosPedidos();

        return Ok(Pedidos);
            
    }

    [HttpGet("{id}")]
    public IActionResult ListarPedidoPorId(int id) {

        var Pedido = pedidoService.ListarPedidoPorId(id);

        if(Pedido == null)
        {
            return NotFound();
        }

        return Ok(Pedido);

    }

    [HttpGet("filtro/{numeroPedido}")]
    public IActionResult ListarPedidoPorNumeroPedido(int numeroPedido) {
        
        var Pedido = pedidoService.ListarPedidoPorNumeroPedido(numeroPedido);

        if(Pedido == null)
        {
            return NotFound();
        }

        return Ok(Pedido);
    }



    [HttpPost]
    public IActionResult CriarPedido(CriarPedidoDto pedidoDto) {
        
        var Pedido = pedidoService.CriarPedido(pedidoDto);

        if(Pedido == null)
            {
                return BadRequest();
            }

        return Ok(Pedido);


    }

    [HttpPut("{id}")]
    public IActionResult AtualizarPedido(CriarPedidoDto novoPedidoDto, int id) {
            
        var Pedido = pedidoService.AtualizarPedido(novoPedidoDto, id);

        if(Pedido == null) {
            return BadRequest();
        }

        return Ok(Pedido);

    }

    [HttpDelete("{id}")]
    public IActionResult DeletarPedido(int id) {

        var Resultado = pedidoService.DeletarPedido(id);

        if(Resultado == false) {
            return NotFound(); // 404
        }
        
        return NoContent(); // 204

    }

    }
}
