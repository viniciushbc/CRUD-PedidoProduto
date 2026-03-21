export interface CriarPedidoItemDto {
    produtoId: number;
    quantidade: number;
}

export interface RespostaPedidoItemDto {
    produtoNome: string;
    precoUnidade: number;
    quantidade: number;
    subTotalItem: number;
}

export interface CriarPedidoDto {
    itens: CriarPedidoItemDto[];
}

export interface RespostaPedidoDto {
    id: number;
    numeroPedido: number;
    itens: RespostaPedidoItemDto[];
    valorTotal: number;
}