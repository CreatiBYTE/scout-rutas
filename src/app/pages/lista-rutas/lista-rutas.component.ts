import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { QRCodeComponent } from 'angularx-qrcode';
import { GoogleMapsModule } from '@angular/google-maps';
import { ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';


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
    QRCodeComponent,
    GoogleMapsModule,
    GoogleMap
  ],
  templateUrl: './lista-rutas.component.html',
  styleUrls: ['./lista-rutas.component.scss']
})
export class ListaRutasComponent implements OnInit {
  // @ViewChild('miniMapa') miniMapa?: GoogleMap;
  @ViewChild('miniMapa') miniMapa!: GoogleMap;
  
  
  rutas: Ruta[] = [];
  rutaMostrada: Ruta | null = null;
  rutaCompartida: any = null;
  

  constructor(public router: Router) { }

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

onMiniMapaReady(map: google.maps.Map): void {
  if (this.rutaMostrada?.['puntos']?.length > 0) {
    const bounds = new google.maps.LatLngBounds();
    for (const punto of this.rutaMostrada!['puntos']) {
      bounds.extend(new google.maps.LatLng(punto.lat, punto.lng));
    }
    map.fitBounds(bounds);
  }
}


navegarRuta(id: string): void {
    this.router.navigate(['/navegar', id]);
  }

  crearRuta(): void {
    this.router.navigate(['/crear']);
  }

  verRuta(ruta: any): void {
  this.rutaMostrada = this.rutaMostrada === ruta ? null : ruta;
  this.rutaCompartida = null;

  setTimeout(() => {
    if (this.miniMapa && this.rutaMostrada?.['puntos']?.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      this.rutaMostrada?.['puntos']?.forEach((p: any) => {
        bounds.extend(new google.maps.LatLng(p.lat, p.lng));
      });
      this.miniMapa.fitBounds(bounds);
    }
  }, 250); // Da más tiempo para asegurar render
}


  ajustarZoomRuta(ruta: any): void {
    if (!ruta || !ruta.puntos || ruta.puntos.length === 0 || !this.miniMapa) return;

    const bounds = new google.maps.LatLngBounds();
    ruta.puntos.forEach((p: any) => bounds.extend(new google.maps.LatLng(p.lat, p.lng)));

    setTimeout(() => {
      this.miniMapa.fitBounds(bounds);
    }, 0);
  }


  generarQR(id: string): void {
    const ruta = this.rutas.find(r => r.id === id);
    if (ruta) {
      ruta['mostrarQR'] = !ruta['mostrarQR'];
    }
  }

  obtenerCentro(ruta: any): google.maps.LatLngLiteral {
    if (!ruta || !ruta.puntos || ruta.puntos.length === 0) {
      return { lat: 20.5931, lng: -100.3926 }; // Querétaro fallback
    }

    const sumLat = ruta.puntos.reduce((acc: number, p: any) => acc + p.lat, 0);
    const sumLng = ruta.puntos.reduce((acc: number, p: any) => acc + p.lng, 0);
    return {
      lat: sumLat / ruta.puntos.length,
      lng: sumLng / ruta.puntos.length
    };
  }


  cerrarOverlay(): void {
    this.rutaMostrada = null;
  }


  getRutaURL(id: string): string {
    //return `${window.location.origin}/scout-rutas/navegar/${id}`;
    return `https://creatibyte.github.io/scout-rutas/navegar/${id}`;
  }
}
