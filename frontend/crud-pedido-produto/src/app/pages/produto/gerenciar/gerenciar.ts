import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ProdutoService } from '../../../services/produto';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-gerenciar',
  imports: [ButtonModule , TableModule],
  templateUrl: './gerenciar.html',
  styleUrl: './gerenciar.css',
})


export class Gerenciar {
  private produtoService = inject(ProdutoService);
  private changeDetector = inject(ChangeDetectorRef);

  produtos: any[] = [];

  ngOnInit() {
    // subscribe agenda a minha requisição pra puxar todos os produtos
    // ao inves de usar o subscribe + detectChanges, daria pra usar signal
    this.produtoService.getProdutos().subscribe(data => {
      this.produtos = data;
      this.changeDetector.detectChanges();
    })
  }
}
