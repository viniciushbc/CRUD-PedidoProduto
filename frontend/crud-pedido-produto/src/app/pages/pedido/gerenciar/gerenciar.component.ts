import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PedidoService } from '../../../services/pedido.service';
import { RespostaPedidoDto } from '../../../models/pedido.model';

@Component({
  selector: 'app-gerenciar-pedido',
  imports: [TableModule, ButtonModule],
  templateUrl: './gerenciar.component.html',
  styleUrl: './gerenciar.component.css',
})


export class GerenciarPedido {


  private pedidoService = inject(PedidoService);
  private changeDetector = inject(ChangeDetectorRef);
  private router = inject(Router);

  pedidos: RespostaPedidoDto[] = [];

  ngOnInit(){
    this.visualizarPedidos();
  }

  // GET de todods os pedidos
  visualizarPedidos(){
    this.pedidoService.getPedidos().subscribe(data => {
      this.pedidos = data;
      this.changeDetector.detectChanges();
    })
  }


  // Detalhes, produtos de um pedido
  detalhes(id: number){
    this.router.navigate(['/pedidos/detalhes', id]);
  }

  editar(id?: number){
    if(id == null || id == undefined){
      this.router.navigate(['/pedidos/editar']);
    } else {
      this.router.navigate(['/pedidos/editar', id]);
    }
  }

  deletar(id: number){
    this.pedidoService.deletePedido(id).subscribe(()=> {
      this.visualizarPedidos();
    })
  }




}
