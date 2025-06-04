import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { collection, collectionData, addDoc, doc, updateDoc, deleteDoc, docData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-firebase-test',
  templateUrl: './firebase-test.component.html',
  styleUrls: ['./firebase-test.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class FirebaseTestComponent {
  form: FormGroup;
  items$: Observable<any[]>;
  logs: string[] = [];
  private itemsRef;

  constructor(private firestore: Firestore, private fb: FormBuilder) {
    this.itemsRef = collection(this.firestore, 'prueba');
    this.items$ = collectionData(this.itemsRef, { idField: 'id' });
    this.form = this.fb.group({ nombre: [''] });
  }

  async crear() {
    const nombre = this.form.value.nombre?.trim();
    if (!nombre) return;
    await addDoc(this.itemsRef, { nombre });
    this.agregarLog(`Creado documento con nombre: ${nombre}`);
    console.log('Documento creado:', nombre);
    this.form.reset();
  }

  leer(id: string) {
    docData(doc(this.firestore, `prueba/${id}`)).subscribe(data => {
      this.agregarLog(`Leído documento ${id}: ${JSON.stringify(data)}`);
      console.log('Documento leído:', id, data);
    });
  }

  async actualizar(item: any) {
    const nuevoNombre = prompt('Nuevo nombre', item.nombre);
    if (nuevoNombre) {
      await updateDoc(doc(this.firestore, `prueba/${item.id}`), { nombre: nuevoNombre });
      this.agregarLog(`Actualizado documento ${item.id} a nombre: ${nuevoNombre}`);
      console.log('Documento actualizado:', item.id, nuevoNombre);
    }
  }

  async eliminar(id: string) {
    await deleteDoc(doc(this.firestore, `prueba/${id}`));
    this.agregarLog(`Eliminado documento ${id}`);
    console.log('Documento eliminado:', id);
  }

  private agregarLog(mensaje: string) {
    this.logs.unshift(mensaje);
  }
}
