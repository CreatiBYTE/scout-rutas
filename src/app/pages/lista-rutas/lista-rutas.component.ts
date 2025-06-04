import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxQrCodeModule } from 'ngx-qrcode2';

interface Ruta {
  id: string;
  nombre: string;
  descripcion?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-lista-rutas',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    NgxQrCodeModule
  ],
  templateUrl: './lista-rutas.component.html',
  styleUrls: ['./lista-rutas.component.scss']
})
export class ListaRutasComponent implements OnInit {
generarQR(arg0: string) {
throw new Error('Method not implemented.');
}
getRutaURL(arg0: string) {
throw new Error('Method not implemented.');
}
  rutas: Ruta[] = [];
  rutaMostrada: Ruta | null = null;
  rutaCompartida: Ruta | null = null;
  qrUrl: string = '';

  constructor(public router: Router) {}

  ngOnInit(): void {
    const data = localStorage.getItem('rutas');

    if (!data) {
      this.router.navigate(['/crear']);
      return;
    }

    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        this.rutas = parsed.map(r => ({
          ...r,
          mostrarDetalle: false,
          mostrarQR: false
        }));
      } else {
        this.router.navigate(['/crear']);
      }
    } catch (e) {
      console.error('Error al leer rutas del localStorage:', e);
      this.router.navigate(['/crear']);
    }
  }

  navegarRuta(id: string): void {
    this.router.navigate(['/navegar', id]);
  }

  crearRuta(): void {
    this.router.navigate(['/crear']);
  }

  verRuta(ruta: Ruta): void {
    this.rutaMostrada = this.rutaMostrada === ruta ? null : ruta;
    this.rutaCompartida = null;
  }

  async compartirRuta(ruta: Ruta): Promise<void> {
    if (this.rutaCompartida === ruta) {
      this.rutaCompartida = null;
      this.qrUrl = '';
      return;
    }

    const url = `${window.location.origin}/scout-rutas/navegar/${ruta.id}`;
    try {
      this.qrUrl = await QRCode.toDataURL(url);
      this.rutaCompartida = ruta;
      this.rutaMostrada = null;
    } catch (err) {
      console.error('Error al generar QR:', err);
    }
  }
}
