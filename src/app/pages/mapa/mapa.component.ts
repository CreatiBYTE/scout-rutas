import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { GoogleMapsModule } from '@angular/google-maps';

interface PuntoRuta {
  nombre: string;
  lat: number;
  lng: number;
}

@Component({
  standalone: true,
  selector: 'app-mapa',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    GoogleMapsModule
  ],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent {
  direccion = '';
  mapaCentro = { lat: 20.6205, lng: -100.4483 }; // Centro default (puedes usar localStorage)
  zoom = 15;

  modoCreacion = false;
  puntos: PuntoRuta[] = [];

  agregarPunto(event: google.maps.MapMouseEvent) {
    if (!this.modoCreacion || !event.latLng) return;

    const nuevoPunto: PuntoRuta = {
      nombre: `Punto ${this.puntos.length + 1}`,
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

    this.puntos.push(nuevoPunto);
  }

  buscarDireccion() {
    // integración con geocoding API (en la siguiente fase)
    alert(`Buscar dirección: ${this.direccion}`);
  }

  guardarRuta() {
    const ruta = {
      datos: JSON.parse(localStorage.getItem('rutaTemporal') || '{}'),
      puntos: this.puntos
    };
    console.log('Ruta lista para subir:', ruta);
    // en Fase 6: subir a Firebase y generar QR
  }

  get polylinePath() {
    return this.puntos.map(p => ({ lat: p.lat, lng: p.lng }));
  }

}
