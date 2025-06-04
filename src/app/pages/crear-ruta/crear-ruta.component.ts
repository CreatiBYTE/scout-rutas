import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-crear-ruta',
  templateUrl: './crear-ruta.component.html',
  styleUrls: ['./crear-ruta.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class CrearRutaComponent {
  form: FormGroup;
  get equipos(): FormArray<FormControl<string>> {
    return this.form.get('equipos') as FormArray<FormControl<string>>;
  }

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      horaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      horaFin: ['', Validators.required],
      crearEquipos: [false],
      equipos: this.fb.array<FormControl<string>>([]),
    });
  }

  agregarEquipo(): void {
    this.equipos.push(new FormControl<string>('', { nonNullable: true, validators: Validators.required }));
  }

  eliminarEquipo(index: number): void {
    this.equipos.removeAt(index);
  }

  continuar(): void {
    if (this.form.valid) {
      const datosRuta = this.form.value;
      localStorage.setItem('rutaTemporal', JSON.stringify(datosRuta));
      this.router.navigate(['/mapa']);
    }
  }
}
