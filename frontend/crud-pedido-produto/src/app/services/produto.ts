import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CriarProdutoDto } from '../models/produto.model';

@Injectable({
  providedIn: 'root',
})

// Configurações iniciasi (Quem vai fazer as requisições e a rota base)
export class ProdutoService {
  private http = inject(HttpClient); 
  private apiEndpoint = "http://localhost:5260/api/produtos";


  // Verbos HTTP
  getProdutos(){
    return this.http.get(this.apiEndpoint);
  }

  getProdutoPorId(id: number) {
    return this.http.get(this.apiEndpoint + "/" + id);
  }

  postProduto(produto: CriarProdutoDto){
    return this.http.post(this.apiEndpoint, produto);
  }

  putProduto(produto: CriarProdutoDto, id: number){
    return this.http.put(this.apiEndpoint + "/" + id, produto);
  }

  deleteProduto(id: number) {
    return this.http.delete(this.apiEndpoint + "/" + id);
  }
}
