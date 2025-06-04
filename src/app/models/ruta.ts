export interface Ruta {
  id?: string;
  nombre: string;
  descripcion?: string;
  puntos: { lat: number; lng: number; nombre?: string }[];
  fechaCreacion: Date;
}
