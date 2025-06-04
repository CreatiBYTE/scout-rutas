import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RutasService } from '../../services/rutas.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GoogleMapsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})

export class MapaComponent implements OnInit {
  direccion: string = '';
  mapaCentro = { lat: 20.7048, lng: -100.4431 }; // Valor inicial aproximado de Querétaro
  zoom = 14;
  puntos: { lat: number, lng: number, nombre: string }[] = [];
  ruta: any = null;
  mostrarNombres: boolean = true;
  modoCreacion: boolean = false;
  distanciaTotal: number = 0;
  polylinePath: google.maps.LatLngLiteral[] = [];


  constructor(private router: Router, private rutasService: RutasService) {}

  ngOnInit(): void {
    const datosRuta = localStorage.getItem('rutaTemporal');
    if (datosRuta) {
      this.ruta = JSON.parse(datosRuta);
    } else {
      this.router.navigate(['/crear']);
    }
  }

  buscarDireccion(): void {
    if (!this.direccion.trim()) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.direccion }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        this.mapaCentro = {
          lat: location.lat(),
          lng: location.lng(),
        };
        this.zoom = 16;
      } else {
        alert('No se pudo encontrar la dirección.');
      }
    });
  }

  activarModoCreacion(): void {
    this.modoCreacion = true;
  }

  agregarPunto(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const punto = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        nombre: `Punto ${this.puntos.length + 1}`
      };
      this.puntos.push(punto);
      this.polylinePath = this.puntos.map((p) => ({ lat: p.lat, lng: p.lng }));
      this.calcularDistanciaTotal();
    }
  }

  eliminarPunto(index: number): void {
    this.puntos.splice(index, 1);
    this.calcularDistanciaTotal();
  }

  guardarRuta(): void {
    const rutaGuardada = {
      ...this.ruta,
      puntos: this.puntos,
      distanciaTotal: this.distanciaTotal
    };
    localStorage.setItem('rutaFinal', JSON.stringify(rutaGuardada));
    this.rutasService.agregarRuta(rutaGuardada).then(() => {
      alert('Ruta guardada correctamente.');
      this.router.navigate(['/rutas']);
    }).catch(err => console.error('Error al guardar ruta', err));
  }

  private calcularDistanciaTotal(): void {
    this.distanciaTotal = 0;
    if (this.puntos.length < 2) return;

    for (let i = 1; i < this.puntos.length; i++) {
      const p1 = this.puntos[i - 1];
      const p2 = this.puntos[i];
      this.distanciaTotal += this.obtenerDistanciaEnKm(p1.lat, p1.lng, p2.lat, p2.lng);
    }
  }

  private obtenerDistanciaEnKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.gradosARadianes(lat2 - lat1);
    const dLng = this.gradosARadianes(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.gradosARadianes(lat1)) *
      Math.cos(this.gradosARadianes(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private gradosARadianes(grados: number): number {
    return grados * Math.PI / 180;
  }
}
