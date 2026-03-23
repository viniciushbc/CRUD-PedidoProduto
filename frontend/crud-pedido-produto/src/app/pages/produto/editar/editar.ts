import { Component, inject } from '@angular/core';
import { ProdutoService } from '../../../services/produto';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CriarProdutoDto } from '../../../models/produto.model';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-editar',
  imports: [ReactiveFormsModule, ButtonModule],
  templateUrl: './editar.html',
  styleUrl: './editar.css',
})
export class EditarProduto {
  private produtoService = inject(ProdutoService);

  // usar pra pegar o parametro da URL - id?
  private route = inject(ActivatedRoute);

  // usar pra navegar entre as páginas
  private router = inject(Router);

  id: number | null = null;


  formReativo = new FormGroup({

    // Validações
    // Nome não pode ser nulo.
    nome: new FormControl('', Validators.required),

    // Preco não pode ser nulo & < 1.
    preco: new FormControl(0, [Validators.required, Validators.min(1)])
  });

  // Formulario de criar e editar é igual
  // Se editar não receber ID == POST
  // Se editar receber um ID == PUT
  
  ngOnInit(){

    const idURL = this.route.snapshot.paramMap.get('id');
    
    // Quando o componente carregar, ele já preenche o formulário se existir um ID (PUT)
    if(idURL){

      // método this.route.snapshot.paramMap.get retorna string ou nulo, por isso Number(idURL)
      this.id = Number(idURL);
      
      this.produtoService.getProdutoPorId(this.id).subscribe(produto => {
        this.formReativo.patchValue({
          nome: produto.nome,
          preco: produto.preco
        })
      })
    }

    // Senão tiver ID, form começa vazio (POST)

  }

  // É chamado quando clica no botão de salvar
  salvar() {

    if(this.formReativo.valid){

      const dadosProduto: CriarProdutoDto = {
        nome: this.formReativo.value.nome!,
        preco: this.formReativo.value.preco!
      };


      if (this.id) {
        // Se tiver ID, chama PUT
        this.produtoService.putProduto(dadosProduto, this.id).subscribe( () => {
          this.router.navigate(['/produtos']);
        });
      } else {
        // Se não tiver ID, chama POST
          this.produtoService.postProduto(dadosProduto).subscribe( () => {
          this.router.navigate(['/produtos']);

          });
        }
    }
  }

  cancelar(){
    this.router.navigate(['/produtos']);
  }
}
