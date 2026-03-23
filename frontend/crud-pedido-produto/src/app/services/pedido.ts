import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CriarPedidoDto } from '../models/pedido.model';

@Injectable({
  providedIn: 'root',
})


// Configurações iniciais (Quem vai fazer as requisições e a rota base)
export class PedidoService {
  private http = inject(HttpClient);
  private apiEndpoint = "http://localhost:5260/api/pedidos";

  // Verbos HTTP
  getPedidos(){
    return this.http.get(this.apiEndpoint);
  }

  getPedidoPorId(id: number){
    return this.http.get(this.apiEndpoint + "/" + id);
  }

  getPedidoPorNumeroPedido(numPedido: number){
    return this.http.get(this.apiEndpoint + "/filtro/" + numPedido);
  }

  postPedido(pedido: CriarPedidoDto){
    return this.http.post(this.apiEndpoint, pedido);
  }

  putPedido(pedido: CriarPedidoDto, id: number){
    return this.http.put(this.apiEndpoint + "/" + id, pedido);
  }

  deletePedido(id: number){
    return this.http.delete(this.apiEndpoint + "/" + id);
  }
}
