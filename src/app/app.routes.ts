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
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
