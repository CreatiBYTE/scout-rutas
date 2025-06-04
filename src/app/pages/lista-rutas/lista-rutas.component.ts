import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { QRCodeComponent } from 'angularx-qrcode';
import { RutasService } from '../../services/rutas.service';
import { Ruta as RutaBase } from '../../models/ruta';
import QRCode from 'qrcode';
import { Subscription } from 'rxjs';

interface Ruta extends RutaBase {
  mostrarQR: boolean;
  mostrarDetalle: boolean;
}

@Component({
  selector: 'app-lista-rutas',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    GoogleMapsModule,
    QRCodeComponent
  ],
  templateUrl: './lista-rutas.component.html',
  styleUrls: ['./lista-rutas.component.scss']
})
export class ListaRutasComponent implements OnInit, OnDestroy {
  rutas: Ruta[] = [];
  rutaMostrada: Ruta | null = null;
  rutaCompartida: Ruta | null = null;
  qrUrl: string = '';
  @ViewChild('miniMapa') miniMapa?: GoogleMap;
  private rutasSub?: Subscription;

  constructor(
    private router: Router,
    private rutasService: RutasService
  ) {}

  ngOnInit(): void {
    this.rutasSub = this.rutasService.obtenerRutas().subscribe({
      next: (rutas) => {
        this.rutas = rutas
          .sort((a, b) => {
            const fechaA = new Date(a.fechaCreacion).getTime();
            const fechaB = new Date(b.fechaCreacion).getTime();
            return fechaB - fechaA;
          })
          .map(r => ({ ...r, mostrarQR: false, mostrarDetalle: false }));
      },
      error: (err) => {
        console.error('Error al obtener rutas:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.rutasSub?.unsubscribe();
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

    setTimeout(() => {
      if (this.miniMapa && this.rutaMostrada?.puntos?.length) {
        const bounds = new google.maps.LatLngBounds();
        this.rutaMostrada.puntos.forEach(p => {
          bounds.extend(new google.maps.LatLng(p.lat, p.lng));
        });
        this.miniMapa!.fitBounds(bounds);
      }
    }, 300);
  }

  compartirRuta(ruta: Ruta): void {
    this.rutaCompartida = this.rutaCompartida === ruta ? null : ruta;
    this.rutaMostrada = null;
    this.generarQR(ruta.id!);
  }

  getRutaURL(id: string): string {
    return `${window.location.origin}/navegar/${id}`;
  }

  cerrarOverlay(): void {
    this.rutaMostrada = null;
  }

  generarQR(id: string): void {
    const ruta = this.rutas.find(r => r.id === id);
    if (ruta) {
      ruta['mostrarQR'] = !ruta['mostrarQR'];
      const qrData = `${window.location.origin}/navegar/${id}`;
      QRCode.toDataURL(qrData)
        .then(url => {
          this.qrUrl = url;
        })
        .catch(err => {
          console.error('Error generando QR:', err);
        });
    }
  }

  confirmarEliminacion(id: string): void {
    if (confirm('¿Est\u00e1 seguro de eliminar esta ruta?')) {
      this.rutasService.eliminarRuta(id)
        .then(() => {
          this.rutas = this.rutas.filter(r => r.id !== id);
          if (this.rutaMostrada?.id === id) {
            this.rutaMostrada = null;
          }
        })
        .catch(err => console.error('Error al eliminar ruta:', err));
    }
  }

  obtenerCentro(ruta: Ruta): google.maps.LatLngLiteral {
    if (!ruta || !ruta.puntos || ruta.puntos.length === 0) {
      return { lat: 0, lng: 0 };
    }

    const total = ruta.puntos.reduce(
      (acc, punto) => {
        return {
          lat: acc.lat + punto.lat,
          lng: acc.lng + punto.lng
        };
      },
      { lat: 0, lng: 0 }
    );

    return {
      lat: total.lat / ruta.puntos.length,
      lng: total.lng / ruta.puntos.length
    };
  }
}
