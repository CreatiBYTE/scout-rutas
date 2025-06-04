import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-crear-ruta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './crear-ruta.component.html',
  styleUrls: ['./crear-ruta.component.scss']
})
export class CrearRutaComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      horaInicio: ['', Validators.required],
      fechaFin: [''],
      horaFin: [''],
      crearEquipos: [false],
      equipos: this.fb.array([])
    });

    this.form.get('crearEquipos')?.valueChanges.subscribe(val => {
      const equipos = this.form.get('equipos') as FormArray;
      if (val && equipos.length === 0) {
        equipos.push(this.fb.control('', Validators.required));
      } else if (!val) {
        equipos.clear();
      }
    });
  }

 get equipos(): FormArray<FormControl> {
  return this.form.get('equipos') as FormArray<FormControl>;
}

  agregarEquipo() {
    this.equipos.push(this.fb.control('', Validators.required));
  }

  eliminarEquipo(i: number) {
    this.equipos.removeAt(i);
  }

  continuar() {
    if (this.form.valid) {
      const datosRuta = this.form.value;
      localStorage.setItem('rutaTemporal', JSON.stringify(datosRuta));
      this.router.navigate(['/mapa']);
    }
  }
}
