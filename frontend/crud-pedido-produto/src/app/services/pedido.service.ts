import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CriarPedidoDto, RespostaPedidoDto } from '../models/pedido.model';

@Injectable({
  providedIn: 'root',
})


// Configurações iniciais (Quem vai fazer as requisições e a rota base)
export class PedidoService {
  private http = inject(HttpClient);
  private apiEndpoint = "http://localhost:5260/api/pedidos";

  // Verbos HTTP
  // Uso as interfaces depois do método para evitar erro de tipagem.
  // Ex: http.get retorna Object por padrão mas nesse caso é um array de RespostaPedidoDto

  getPedidos(){
    return this.http.get<RespostaPedidoDto[]>(this.apiEndpoint);
  }

  getPedidoPorId(id: number){
    return this.http.get<RespostaPedidoDto>(this.apiEndpoint + "/" + id);
  }

  getPedidoPorNumeroPedido(numPedido: number){
    return this.http.get<RespostaPedidoDto>(this.apiEndpoint + "/filtro/" + numPedido);
  }

  postPedido(pedido: CriarPedidoDto){
    return this.http.post<RespostaPedidoDto | null>(this.apiEndpoint, pedido);
  }

  putPedido(pedido: CriarPedidoDto, id: number){
    return this.http.put<RespostaPedidoDto | null>(this.apiEndpoint + "/" + id, pedido);
  }

  deletePedido(id: number){
    return this.http.delete<boolean>(this.apiEndpoint + "/" + id);
  }
}
