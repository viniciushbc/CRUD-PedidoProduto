import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CriarProdutoDto, RespostaProdutoDto } from '../models/produto.model';

@Injectable({
  providedIn: 'root',
})

// Configurações iniciasi (Quem vai fazer as requisições e a rota base)
export class ProdutoService {
  private http = inject(HttpClient); 
  private apiEndpoint = "http://localhost:5260/api/produtos";


  // Verbos HTTP
  // Uso das interfaces pra evitar erro de tipagem

  getProdutos(){
    return this.http.get<RespostaProdutoDto[]>(this.apiEndpoint);
  }

  getProdutoPorId(id: number) {
    return this.http.get<RespostaProdutoDto>(this.apiEndpoint + "/" + id);
  }

  postProduto(produto: CriarProdutoDto){
    return this.http.post<RespostaProdutoDto>(this.apiEndpoint, produto);
  }

  putProduto(produto: CriarProdutoDto, id: number){
    return this.http.put<RespostaProdutoDto>(this.apiEndpoint + "/" + id, produto);
  }

  deleteProduto(id: number) {
    return this.http.delete<boolean>(this.apiEndpoint + "/" + id);
  }
}
