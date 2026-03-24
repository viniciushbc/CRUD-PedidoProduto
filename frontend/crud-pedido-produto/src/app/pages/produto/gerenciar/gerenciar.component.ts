import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ProdutoService } from '../../../services/produto.service';
import { RespostaProdutoDto } from '../../../models/produto.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

// TELA(COMPONENTE) DE VISUALIZAR/EDITAR/REMOVER PRODUTOS

@Component({
  selector: 'app-gerenciar-produto',
  imports: [ButtonModule , TableModule],
  templateUrl: './gerenciar.component.html',
  styleUrl: './gerenciar.component.css',
})


export class GerenciarProduto {
  private produtoService = inject(ProdutoService);
  private changeDetector = inject(ChangeDetectorRef);
  private router = inject(Router);

  produtos: RespostaProdutoDto[] = [];

  ngOnInit() {
    // subscribe agenda a minha requisição pra puxar todos os produtos
    // ao inves de usar o subscribe + detectChanges, daria pra usar signal
    this.visualizarProdutos();
    }

  // GET da lista atualizada
  visualizarProdutos(){
    this.produtoService.getProdutos().subscribe(data => {
      this.produtos = data;
      this.changeDetector.detectChanges();
    });
  }

  //redireciona pra pagina de pedidos
  acessarPedidos(){
    this.router.navigate(['/pedidos']);
  }

  // DELETAR PRODUTO
  deletar(id: number){
    this.produtoService.deleteProduto(id).subscribe( () => {

      // Renderiza os produtos atualizados pós DELETE
      this.visualizarProdutos();
    })
  }

  editar(id?: number){
    console.log("Clicou");

    if(id == null || id == undefined){
      this.router.navigate(['/produtos/editar'])
    } else {
      this.router.navigate(['/produtos/editar', id]);
    }
  }
}
