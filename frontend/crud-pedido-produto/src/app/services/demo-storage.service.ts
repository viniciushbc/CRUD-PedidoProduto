import { Injectable } from '@angular/core';
import { CriarProdutoDto, RespostaProdutoDto } from '../models/produto.model';
import { CriarPedidoDto, RespostaPedidoDto } from '../models/pedido.model';
import { Observable, of, throwError } from 'rxjs';

interface DemoPedidoItemStorage {
  produtoId: number;
  produtoNome: string;
  precoUnidade: number;
  quantidade: number;
}

interface DemoPedidoStorage {
  id: number;
  numeroPedido: number;
  itens: DemoPedidoItemStorage[];
}

@Injectable({
  providedIn: 'root',
})

// "Mini banco" do modo demo
// Guarda produtos e pedidos no localStorage do navegador
export class DemoStorageService {
  private readonly produtosKey = 'crud-demo-produtos';
  private readonly pedidosKey = 'crud-demo-pedidos';

  // Cria as chaves basicas quando a aplicacao roda no demo
  inicializarDemo(){
    if(localStorage.getItem(this.produtosKey) == null){
      localStorage.setItem(this.produtosKey, JSON.stringify([]));
    }

    if(localStorage.getItem(this.pedidosKey) == null){
      localStorage.setItem(this.pedidosKey, JSON.stringify([]));
    }
  }

  // PRODUTOS
  getProdutos(): Observable<RespostaProdutoDto[]> {
    return of(this.lerProdutos());
  }

  getProdutoPorId(id: number): Observable<RespostaProdutoDto> {
    const produto = this.lerProdutos().find(produto => produto.id === id);

    if(produto == null){
      return throwError(() => new Error('Produto nao encontrado.'));
    }

    return of(produto);
  }

  postProduto(produto: CriarProdutoDto): Observable<RespostaProdutoDto> {
    const produtos = this.lerProdutos();

    const novoProduto: RespostaProdutoDto = {
      id: this.gerarNovoId(produtos),
      nome: produto.nome,
      preco: produto.preco
    };

    produtos.push(novoProduto);
    this.salvarProdutos(produtos);

    return of(novoProduto);
  }

  putProduto(produto: CriarProdutoDto, id: number): Observable<RespostaProdutoDto> {
    const produtos = this.lerProdutos();
    const index = produtos.findIndex(produtoSalvo => produtoSalvo.id === id);

    if(index === -1){
      return throwError(() => new Error('Produto nao encontrado.'));
    }

    produtos[index] = {
      id,
      nome: produto.nome,
      preco: produto.preco
    };

    this.salvarProdutos(produtos);
    return of(produtos[index]);
  }

  deleteProduto(id: number): Observable<boolean> {
    const produtos = this.lerProdutos();
    const produtosAtualizados = produtos.filter(produto => produto.id !== id);

    if(produtosAtualizados.length === produtos.length){
      return throwError(() => new Error('Produto nao encontrado.'));
    }

    this.salvarProdutos(produtosAtualizados);
    return of(true);
  }

  // PEDIDOS
  getPedidos(): Observable<RespostaPedidoDto[]> {
    return of(this.lerPedidos().map(pedido => this.mapearPedidoResposta(pedido)));
  }

  getPedidoPorId(id: number): Observable<RespostaPedidoDto> {
    const pedido = this.lerPedidos().find(pedido => pedido.id === id);

    if(pedido == null){
      return throwError(() => new Error('Pedido nao encontrado.'));
    }

    return of(this.mapearPedidoResposta(pedido));
  }

  getPedidoPorNumeroPedido(numeroPedido: number): Observable<RespostaPedidoDto> {
    const pedido = this.lerPedidos().find(pedido => pedido.numeroPedido === numeroPedido);

    if(pedido == null){
      return throwError(() => new Error('Pedido nao encontrado.'));
    }

    return of(this.mapearPedidoResposta(pedido));
  }

  postPedido(pedido: CriarPedidoDto): Observable<RespostaPedidoDto> {
    const pedidos = this.lerPedidos();
    let novoPedido: DemoPedidoStorage;

    try {
      novoPedido = {
        id: this.gerarNovoId(pedidos),
        numeroPedido: this.gerarNumeroPedido(pedidos),
        itens: this.montarItensPedido(pedido)
      };
    } catch {
      return throwError(() => new Error('Pedido invalido.'));
    }

    if(!this.validarPedido(novoPedido)){
      return throwError(() => new Error('Pedido invalido.'));
    }

    pedidos.push(novoPedido);
    this.salvarPedidos(pedidos);

    return of(this.mapearPedidoResposta(novoPedido));
  }

  putPedido(pedido: CriarPedidoDto, id: number): Observable<RespostaPedidoDto> {
    const pedidos = this.lerPedidos();
    const index = pedidos.findIndex(pedidoSalvo => pedidoSalvo.id === id);

    if(index === -1){
      return throwError(() => new Error('Pedido nao encontrado.'));
    }

    let pedidoAtualizado: DemoPedidoStorage;

    try {
      pedidoAtualizado = {
        id,
        numeroPedido: pedidos[index].numeroPedido,
        itens: this.montarItensPedido(pedido)
      };
    } catch {
      return throwError(() => new Error('Pedido invalido.'));
    }

    if(!this.validarPedido(pedidoAtualizado)){
      return throwError(() => new Error('Pedido invalido.'));
    }

    pedidos[index] = pedidoAtualizado;
    this.salvarPedidos(pedidos);

    return of(this.mapearPedidoResposta(pedidoAtualizado));
  }

  deletePedido(id: number): Observable<boolean> {
    const pedidos = this.lerPedidos();
    const pedidosAtualizados = pedidos.filter(pedido => pedido.id !== id);

    if(pedidosAtualizados.length === pedidos.length){
      return throwError(() => new Error('Pedido nao encontrado.'));
    }

    this.salvarPedidos(pedidosAtualizados);
    return of(true);
  }

  // Leitura das listas gravadas
  private lerProdutos(): RespostaProdutoDto[] {
    const produtos = localStorage.getItem(this.produtosKey);
    return produtos ? JSON.parse(produtos) : [];
  }

  private lerPedidos(): DemoPedidoStorage[] {
    const pedidos = localStorage.getItem(this.pedidosKey);
    return pedidos ? JSON.parse(pedidos) : [];
  }

  // Persistencia no navegador
  private salvarProdutos(produtos: RespostaProdutoDto[]){
    localStorage.setItem(this.produtosKey, JSON.stringify(produtos));
  }

  private salvarPedidos(pedidos: DemoPedidoStorage[]){
    localStorage.setItem(this.pedidosKey, JSON.stringify(pedidos));
  }

  // Cria um ID incremental simples pro modo demo
  private gerarNovoId(lista: { id: number }[]){
    if(lista.length === 0){
      return 1;
    }

    return Math.max(...lista.map(item => item.id)) + 1;
  }

  // Gera um numero de pedido aleatorio e evita repeticao
  private gerarNumeroPedido(pedidos: DemoPedidoStorage[]){
    let numeroPedido = Math.floor(Math.random() * 9000) + 1000;

    while(pedidos.some(pedido => pedido.numeroPedido === numeroPedido)){
      numeroPedido = Math.floor(Math.random() * 9000) + 1000;
    }

    return numeroPedido;
  }

  // Monta o pedido salvando um "snapshot" do produto na hora do pedido
  private montarItensPedido(pedido: CriarPedidoDto): DemoPedidoItemStorage[] {
    const produtos = this.lerProdutos();

    return pedido.itens.map(item => {
      const produto = produtos.find(produto => produto.id === item.produtoId);

      if(produto == null){
        throw new Error('Produto nao encontrado.');
      }

      return {
        produtoId: produto.id,
        produtoNome: produto.nome,
        precoUnidade: produto.preco,
        quantidade: item.quantidade
      };
    });
  }

  // Regras principais do pedido tambem no modo demo
  private validarPedido(pedido: DemoPedidoStorage){
    if(pedido.itens.length === 0 || pedido.itens.length > 5){
      return false;
    }

    const valorTotal = pedido.itens.reduce((total, item) =>
      total + (item.precoUnidade * item.quantidade), 0
    );

    return valorTotal > 0 && valorTotal <= 1000;
  }

  // Converte o formato salvo no navegador para o DTO da tela
  private mapearPedidoResposta(pedido: DemoPedidoStorage): RespostaPedidoDto {
    return {
      id: pedido.id,
      numeroPedido: pedido.numeroPedido,
      itens: pedido.itens.map(item => ({
        produtoNome: item.produtoNome,
        precoUnidade: item.precoUnidade,
        quantidade: item.quantidade,
        subTotalItem: item.precoUnidade * item.quantidade
      })),
      valorTotal: pedido.itens.reduce((total, item) =>
        total + (item.precoUnidade * item.quantidade), 0
      )
    };
  }
}
