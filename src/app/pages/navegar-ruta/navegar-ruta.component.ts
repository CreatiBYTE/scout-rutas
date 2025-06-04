import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { RutasService } from '../../services/rutas.service';
import { Ruta } from '../../models/ruta';

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
export class NavegarRutaComponent implements OnDestroy {
  puntos: PuntoRuta[] = [];
  mapaCentro = { lat: 20.6205, lng: -100.4483 };
  zoom = 15;
  idRuta: string = '';
  ruta: Ruta | null = null;
  rutaNoExiste = false;
  eventoEstado: 'no-iniciado' | 'en-curso' | 'finalizado' | null = null;
  cuentaRegresiva = '';
  navegador: 'chrome' | 'safari' | 'otro' = 'otro';
  private timer?: ReturnType<typeof setInterval>;

  constructor(private route: ActivatedRoute, private rutasService: RutasService) {
    this.detectarNavegador();
    this.route.paramMap.subscribe(params => {
      this.idRuta = params.get('id') || '';
      if (this.idRuta) {
        this.rutasService.obtenerRutaPorId(this.idRuta).subscribe(ruta => {
          if (!ruta) {
            this.rutaNoExiste = true;
            return;
          }
          this.ruta = ruta;
          if (ruta.puntos) {
            this.puntos = ruta.puntos as PuntoRuta[];
            if (this.puntos.length) {
              this.mapaCentro = {
                lat: this.puntos[0].lat,
                lng: this.puntos[0].lng
              };
            }
          }
          this.actualizarEstadoEvento();
          if (this.isStandalone()) {
            this.guardarEnLocalStorage();
          }
        });
      } else {
        this.rutaNoExiste = true;
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

  private detectarNavegador() {
    const ua = navigator.userAgent;
    if (/Chrome/i.test(ua)) {
      this.navegador = 'chrome';
    } else if (/Safari/i.test(ua)) {
      this.navegador = 'safari';
    }
  }

  private actualizarEstadoEvento() {
    if (!this.ruta) {
      return;
    }
    const inicio = new Date(`${this.ruta.fechaInicio}T${this.ruta.horaInicio}`);
    const fin = new Date(`${this.ruta.fechaFin}T${this.ruta.horaFin}`);
    const ahora = new Date();

    if (ahora < inicio) {
      this.eventoEstado = 'no-iniciado';
      this.iniciarCuentaRegresiva(inicio);
    } else if (ahora > fin) {
      this.eventoEstado = 'finalizado';
    } else {
      this.eventoEstado = 'en-curso';
    }
  }

  private iniciarCuentaRegresiva(fecha: Date) {
    this.actualizarCuentaRegresiva(fecha);
    this.timer = setInterval(() => this.actualizarCuentaRegresiva(fecha), 1000);
  }

  private actualizarCuentaRegresiva(fecha: Date) {
    const diff = fecha.getTime() - Date.now();
    if (diff <= 0) {
      this.cuentaRegresiva = '00:00:00';
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.actualizarEstadoEvento();
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    this.cuentaRegresiva = [h, m, s]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  }

  private isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone;
  }

  private guardarEnLocalStorage() {
    if (this.ruta) {
      localStorage.setItem(`ruta-${this.idRuta}`, JSON.stringify(this.ruta));
    }
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

