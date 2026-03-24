import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CriarProdutoDto, RespostaProdutoDto } from '../models/produto.model';
import { DemoStorageService } from './demo-storage.service';

@Injectable({
  providedIn: 'root',
})

// Configuracoes iniciais (Quem vai fazer as requisicoes e a rota base)
export class ProdutoService {
  private http = inject(HttpClient);
  private demoStorage = inject(DemoStorageService);
  private apiEndpoint = "http://localhost:5260/api/produtos";

  // Quando estiver no GitHub Pages, usa o localStorage como "banco"
  private usandoModoDemo(){
    return window.location.hostname.includes('github.io');
  }

  // Verbos HTTP
  // Uso das interfaces pra evitar erro de tipagem

  getProdutos(){
    if(this.usandoModoDemo()){
      this.demoStorage.inicializarDemo();
      return this.demoStorage.getProdutos();
    }

    return this.http.get<RespostaProdutoDto[]>(this.apiEndpoint);
  }

  getProdutoPorId(id: number) {
    if(this.usandoModoDemo()){
      this.demoStorage.inicializarDemo();
      return this.demoStorage.getProdutoPorId(id);
    }

    return this.http.get<RespostaProdutoDto>(this.apiEndpoint + "/" + id);
  }

  postProduto(produto: CriarProdutoDto){
    if(this.usandoModoDemo()){
      this.demoStorage.inicializarDemo();
      return this.demoStorage.postProduto(produto);
    }

    return this.http.post<RespostaProdutoDto>(this.apiEndpoint, produto);
  }

  putProduto(produto: CriarProdutoDto, id: number){
    if(this.usandoModoDemo()){
      this.demoStorage.inicializarDemo();
      return this.demoStorage.putProduto(produto, id);
    }

    return this.http.put<RespostaProdutoDto>(this.apiEndpoint + "/" + id, produto);
  }

  deleteProduto(id: number) {
    if(this.usandoModoDemo()){
      this.demoStorage.inicializarDemo();
      return this.demoStorage.deleteProduto(id);
    }

    return this.http.delete<boolean>(this.apiEndpoint + "/" + id);
  }
}
