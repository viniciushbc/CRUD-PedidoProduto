import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CriarPedidoDto, RespostaPedidoDto } from '../models/pedido.model';
import { DemoStorageService } from './demo-storage.service';

@Injectable({
  providedIn: 'root',
})

// Configuracoes iniciais (Quem vai fazer as requisicoes e a rota base)
export class PedidoService {
  private http = inject(HttpClient);
  private demoStorage = inject(DemoStorageService);
  private apiEndpoint = "http://localhost:5260/api/pedidos";

  // Quando estiver no GitHub Pages, usa o localStorage como "banco"
  private usandoModoDemo(){
    return window.location.hostname.includes('github.io');
  }

  // Verbos HTTP
  // Uso as interfaces depois do metodo para evitar erro de tipagem

  getPedidos(){
    if(this.usandoModoDemo()){
      this.demoStorage.inicializarDemo();
      return this.demoStorage.getPedidos();
    }

    return this.http.get<RespostaPedidoDto[]>(this.apiEndpoint);
  }

  getPedidoPorId(id: number){
    if(this.usandoModoDemo()){
      this.demoStorage.inicializarDemo();
      return this.demoStorage.getPedidoPorId(id);
    }

    return this.http.get<RespostaPedidoDto>(this.apiEndpoint + "/" + id);
  }

  getPedidoPorNumeroPedido(numPedido: number){
    if(this.usandoModoDemo()){
      this.demoStorage.inicializarDemo();
      return this.demoStorage.getPedidoPorNumeroPedido(numPedido);
    }

    return this.http.get<RespostaPedidoDto>(this.apiEndpoint + "/filtro/" + numPedido);
  }

  postPedido(pedido: CriarPedidoDto){
    if(this.usandoModoDemo()){
      this.demoStorage.inicializarDemo();
      return this.demoStorage.postPedido(pedido);
    }

    return this.http.post<RespostaPedidoDto | null>(this.apiEndpoint, pedido);
  }

  putPedido(pedido: CriarPedidoDto, id: number){
    if(this.usandoModoDemo()){
      this.demoStorage.inicializarDemo();
      return this.demoStorage.putPedido(pedido, id);
    }

    return this.http.put<RespostaPedidoDto | null>(this.apiEndpoint + "/" + id, pedido);
  }

  deletePedido(id: number){
    if(this.usandoModoDemo()){
      this.demoStorage.inicializarDemo();
      return this.demoStorage.deletePedido(id);
    }

    return this.http.delete<boolean>(this.apiEndpoint + "/" + id);
  }
}
