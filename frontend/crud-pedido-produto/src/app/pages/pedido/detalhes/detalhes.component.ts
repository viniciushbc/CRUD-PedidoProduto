import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../../../services/pedido.service';
import { RespostaPedidoDto } from '../../../models/pedido.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-detalhes-pedido',
  imports: [ButtonModule],
  templateUrl: './detalhes.component.html',
  styleUrl: './detalhes.component.css',
})
export class DetalhesPedido {
  private pedidoService = inject(PedidoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private changeDetector = inject(ChangeDetectorRef);

  pedido: RespostaPedidoDto | null = null;

  ngOnInit() {
    const idURL = this.route.snapshot.paramMap.get('id');

    if (!idURL) {
      this.router.navigate(['/pedidos']);
      return;
    }

    this.pedidoService.getPedidoPorId(Number(idURL)).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.router.navigate(['/pedidos']);
      }
    });
  }

  voltar() {
    this.router.navigate(['/pedidos']);
  }
}
