import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CriarPedidoDto } from '../../../models/pedido.model';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ProdutoService } from '../../../services/produto.service';
import { RespostaProdutoDto } from '../../../models/produto.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-editar-pedido',
  imports: [ReactiveFormsModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css',
})


export class EditarPedido {

  // Serviços e dependências da página
  private pedidoService = inject(PedidoService);
  private produtoService = inject(ProdutoService);
  private changeDetector = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  private router = inject(Router);

  // Controle da tela
  id: number | null = null;
  produtos: RespostaProdutoDto[] = [];
  produtosCarregados = false;

  // Formulário do pedido
  // "itens" é um FormArray porque o pedido pode ter vários produtos
  // Cada posição do array representa uma linha do pedido
  formReativo = new FormGroup({
    itens: new FormArray([
      new FormGroup({

        produtoId: new FormControl<number | null>(null, Validators.required),

        quantidade: new FormControl(1, [Validators.required, Validators.min(1),Validators.max(5)])
        
      })
    ])
  })

  ngOnInit(){
    const idURL = this.route.snapshot.paramMap.get('id');

    // Carrega todos os produtos para poder selecionar
    this.produtoService.getProdutos().subscribe(produtos => {
      this.produtos = produtos;

      // Se vier ID pela rota = PUT -> Preenche o formulário com os itens do pedido
      if(idURL){
        this.id = Number(idURL);

        this.pedidoService.getPedidoPorId(this.id).subscribe(pedido => {
          this.itensDoPedido.clear();

          pedido.itens.forEach(item => {
            const produtoEncontrado = this.produtos.find(produto => produto.nome === item.produtoNome);

            this.itensDoPedido.push(
              new FormGroup({
                produtoId: new FormControl<number | null>(produtoEncontrado?.id ?? null, Validators.required),
                quantidade: new FormControl(item.quantidade, [Validators.required, Validators.min(1), Validators.max(5)])
              })
            );
          });
          this.produtosCarregados = true;
          this.changeDetector.detectChanges();
        });
        return;
      }

      // libera a renderização do formulário depois que os produtos chegam
      // fiz assim pq o select não estava renderizando...
      this.produtosCarregados = true;

      //força a atualização da tela após o subscribe
      this.changeDetector.detectChanges();
    });

  }

  // Atalho para acessar o FormArray "itens"
  // Sem isso, eu teria que usar this.formReativo.get('itens') toda hora
  get itensDoPedido(): FormArray {
    return this.formReativo.get('itens') as FormArray;
  }

  adicionarItemAoPedido(){
    this.itensDoPedido.push(
      new FormGroup({
        produtoId: new FormControl<number | null>(null, Validators.required),
        quantidade: new FormControl(1, [Validators.required, Validators.min(1)])
      })
    )
  }

  removerItemDoPedido(index: number){
    this.itensDoPedido.removeAt(index);
  }

  
  salvar(){
    // Monta o body no formato da minha interface CriarProdutoDto
    const dadosPedido: CriarPedidoDto = {
      itens: this.itensDoPedido.value
    };

    if(this.id){
      this.pedidoService.putPedido(dadosPedido, this.id).subscribe( () => {
        this.router.navigate(['/pedidos']);
      })
    } else {
      this.pedidoService.postPedido(dadosPedido).subscribe( () => {
        this.router.navigate(['/pedidos']);
      })
    }
  }

  cancelar() {
    this.router.navigate(['/pedidos']);
  }


}
