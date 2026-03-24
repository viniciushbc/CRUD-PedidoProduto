import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CriarPedidoDto } from '../../../models/pedido.model';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ProdutoService } from '../../../services/produto.service';
import { RespostaProdutoDto } from '../../../models/produto.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-editar-pedido',
  imports: [ReactiveFormsModule, ButtonModule, ProgressSpinnerModule, AutoCompleteModule, InputNumberModule],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css',
})

export class EditarPedido {

  private pedidoService = inject(PedidoService);
  private produtoService = inject(ProdutoService);
  private changeDetector = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Controle da tela
  id: number | null = null;
  produtos: RespostaProdutoDto[] = [];
  produtosCarregados = false;
  produtosFiltradosPorItem: RespostaProdutoDto[][] = [];
  mensagemErro = '';

  // Formulario do pedido
  // "itens" é um FormArray porque o pedido pode ter varios produtos (array de produtos)
  // Cada posição do array representa uma "linha/card" do pedido
  formReativo = new FormGroup({
    itens: new FormArray([])
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
          this.produtosFiltradosPorItem = [];

          pedido.itens.forEach(item => {
            const produtoEncontrado = this.produtos.find(produto => produto.nome == item.produtoNome) ?? null;

            this.itensDoPedido.push(this.criarItemPedido(produtoEncontrado, item.quantidade));
            this.produtosFiltradosPorItem.push([...this.produtos]);
          });

          this.produtosCarregados = true;
          this.changeDetector.detectChanges();
        });
        return;
      }

      this.adicionarItemAoPedido();

      // libera a renderizacao depois que os produtos chegam no select
      this.produtosCarregados = true;

      //força a atualizacao da tela dps do subscribe
      this.changeDetector.detectChanges();
    });

  }

  // Atalho para acessar o FormArray "itens"
  // Sem isso, eu teria que usar this.formReativo.get('itens') toda hora
  get itensDoPedido(): FormArray {
    return this.formReativo.get('itens') as FormArray;
  }

  // Cria uma linha do pedido com o produto selecionado e quantidade
  private criarItemPedido(produto: RespostaProdutoDto | null = null, quantidade = 1){
    return new FormGroup({
      produto: new FormControl<RespostaProdutoDto | null>(produto, Validators.required),
      quantidade: new FormControl(quantidade, [Validators.required, Validators.min(1)])
    })
  }

  adicionarItemAoPedido(){
    this.itensDoPedido.push(this.criarItemPedido());
    this.produtosFiltradosPorItem.push([...this.produtos]);
  }

  removerItemDoPedido(index: number){
    this.itensDoPedido.removeAt(index);
    this.produtosFiltradosPorItem.splice(index, 1);
  }

  // Filtra os produtos do AutoComplete conforme o usuário digita
  // o event do primeNG que traz o texto digitado
  filtrarProdutos(event: AutoCompleteCompleteEvent, index: number){
    const query = event.query.trim().toLowerCase();

    if(!query){
      this.produtosFiltradosPorItem[index] = [...this.produtos];
      return;
    }

    this.produtosFiltradosPorItem[index] = this.produtos.filter(produto =>
      produto.nome.toLowerCase().includes(query)
    );
  }

  salvar(){
    this.mensagemErro = '';

    if(this.formReativo.invalid){
      this.formReativo.markAllAsTouched();
      return;
    }

    // Monta o body no formato da interface CriarPedidoDto
    const dadosPedido: CriarPedidoDto = {
      itens: this.itensDoPedido.controls.map(item => ({
        produtoId: item.value.produto!.id,
        quantidade: item.value.quantidade!
      }))
    };

    if(this.id){
      this.pedidoService.putPedido(dadosPedido, this.id).subscribe({
        next: () => {
          this.router.navigate(['/pedidos']);
        },
        error: () => {
          // Exibe o erro do backend quando a regra de negocio do pedido falhar
          this.mensagemErro = 'Nao foi possivel atualizar o pedido. Verifique as regras do pedido e tente novamente.';
          this.changeDetector.detectChanges();
        }
      })
    } else {
      this.pedidoService.postPedido(dadosPedido).subscribe({
        next: () => {
          this.router.navigate(['/pedidos']);
        },
        error: () => {
          // Exibe o erro do backend quando a regra de negocio do pedido falhar
          this.mensagemErro = 'Nao foi possivel criar o pedido. Verifique as regras do pedido e tente novamente.';
          this.changeDetector.detectChanges();
        }
      })
    }
  }

  cancelar() {
    this.router.navigate(['/pedidos']);
  }
}
