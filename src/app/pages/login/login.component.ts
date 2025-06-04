import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RutasService } from '../../services/rutas.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatError
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  form: FormGroup;
  errorMessage: string = '';
  private rutasSub?: Subscription;

  constructor(private fb: FormBuilder, private router: Router, private rutasService: RutasService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const { username, password } = this.form.value;
    if (username === 'admin' && password === 'soyscout') {
      this.rutasSub?.unsubscribe();
      this.rutasSub = this.rutasService.obtenerRutas().subscribe({
        next: rutas => {
          if (rutas.length === 0) {
            this.router.navigate(['/crear']);
          } else {
            this.router.navigate(['/rutas']);
          }
        },
        error: err => {
          console.error('Error al obtener rutas', err);
          this.errorMessage = 'Error al obtener rutas';
        }
      });
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }

  ngOnDestroy(): void {
    this.rutasSub?.unsubscribe();
  }
}
