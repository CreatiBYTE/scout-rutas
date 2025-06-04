import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { QRCodeModule } from 'angularx-qrcode';

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
    QRCodeModule
  ],
  templateUrl: './lista-rutas.component.html',
  styleUrls: ['./lista-rutas.component.scss']
})
export class ListaRutasComponent implements OnInit {
  rutas: Ruta[] = [];
  rutaMostrada: Ruta | null = null;

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
  }

  generarQR(id: string): void {
    const ruta = this.rutas.find(r => r.id === id);
    if (ruta) {
      ruta.mostrarQR = !ruta.mostrarQR;
    }
  }

  getRutaURL(id: string): string {
    return `${window.location.origin}/scout-rutas/navegar/${id}`;
  }
}
