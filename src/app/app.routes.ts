import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'navegar/:id',
  loadComponent: () =>
    import('./pages/navegar-ruta/navegar-ruta.component').then(m => m.NavegarRutaComponent)
  },
  {
    path: 'crear',
    loadComponent: () => import('./pages/crear-ruta/crear-ruta.component').then(m => m.CrearRutaComponent)
  },
  {
    path: 'rutas',
    loadComponent: () => import('./pages/lista-rutas/lista-rutas.component').then(m => m.ListaRutasComponent)
  },
  {
    path: 'mapa', // 👈 ESTA ES LA QUE FALTABA
    loadComponent: () =>
      import('./pages/mapa/mapa.component').then(m => m.MapaComponent)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
