export interface Ruta {
  id?: string;
  nombre: string;
  descripcion?: string;
  puntos: { lat: number; lng: number; nombre?: string }[];
  fechaCreacion: Date;
  fechaInicio?: string;
  horaInicio?: string;
  fechaFin?: string;
  horaFin?: string;
  crearEquipos?: boolean;
  equipos?: string[];
  /** Distancia estimada de la ruta en kilómetros */
  distancia?: number;
  /** Distancia total calculada de la ruta en kilómetros */
  distanciaTotal?: number;
}
