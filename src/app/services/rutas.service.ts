import { Injectable } from '@angular/core';
import { collection, collectionData, doc, setDoc, Firestore } from '@angular/fire/firestore';
import { addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Ruta } from '../models/ruta';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  private rutasRef;

  constructor(private firestore: Firestore) {
    this.rutasRef = collection(this.firestore, 'rutas');
  }

  obtenerRutas(): Observable<Ruta[]> {
    return collectionData(this.rutasRef, { idField: 'id' }) as Observable<Ruta[]>;
  }

  agregarRuta(ruta: Ruta): Promise<void> {
    const nuevaRuta = doc(this.rutasRef);
    return setDoc(nuevaRuta, { ...ruta, fechaCreacion: ruta.fechaCreacion ?? new Date() });
  }

  // Si ya tienes el ID y quieres sobreescribir o actualizar
  guardarRutaConID(ruta: Ruta): Promise<void> {
    if (!ruta.id) {
      throw new Error('Ruta debe tener un ID para guardarse con ID.');
    }
    const rutaRef = doc(this.firestore, `rutas/${ruta.id}`);
    return setDoc(rutaRef, ruta);
  }
}
