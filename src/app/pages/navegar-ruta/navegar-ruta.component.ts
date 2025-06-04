import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { RutasService } from '../../services/rutas.service';

interface PuntoRuta {
  nombre: string;
  lat: number;
  lng: number;
}

@Component({
  standalone: true,
  selector: 'app-navegar-ruta',
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './navegar-ruta.component.html',
  styleUrls: ['./navegar-ruta.component.scss']
})
export class NavegarRutaComponent {
  puntos: PuntoRuta[] = [];
  mapaCentro = { lat: 20.6205, lng: -100.4483 };
  zoom = 15;
  idRuta: string = '';

  constructor(private route: ActivatedRoute, private rutasService: RutasService) {
    this.route.paramMap.subscribe(params => {
      this.idRuta = params.get('id') || '';
      if (this.idRuta) {
        this.rutasService.obtenerRutaPorId(this.idRuta).subscribe(ruta => {
          if (ruta?.puntos) {
            this.puntos = ruta.puntos as PuntoRuta[];
            if (this.puntos.length) {
              this.mapaCentro = {
                lat: this.puntos[0].lat,
                lng: this.puntos[0].lng
              };
            }
          }
        });
      }
    });

    // const id = this.route.snapshot.paramMap.get('id');
    // const rutaGuardada = localStorage.getItem(`ruta-${id}`);
    // if (rutaGuardada) {
    //   const ruta = JSON.parse(rutaGuardada);
    //   this.puntos = ruta.puntos || [];
    //   if (this.puntos.length > 0) {
    //     this.mapaCentro = { lat: this.puntos[0].lat, lng: this.puntos[0].lng };
    //   }
    // }
  }

  get polylinePath() {
    return this.puntos.map(p => ({ lat: p.lat, lng: p.lng }));
  }
}
