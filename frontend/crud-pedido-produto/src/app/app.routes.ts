import { Routes } from '@angular/router';
import { GerenciarProduto } from './pages/produto/gerenciar/gerenciar.component';
import { EditarProduto } from './pages/produto/editar/editar.component';
import { GerenciarPedido } from './pages/pedido/gerenciar/gerenciar.component';


export const routes: Routes = [
    // Produto
    {path: 'produtos', component: GerenciarProduto }, // Página de produtos
    {path: 'produtos/editar', component: EditarProduto}, // Formulario de criacao/edicao de produto
    {path: 'produtos/editar/:id', component: EditarProduto}, // Formulario de criacao/edicao de produto
    
    // Pedido
    {path: 'pedidos', component: GerenciarPedido}, // Pagina de pedidos
    //{path: 'pedidos/editar',}

];
