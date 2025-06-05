// types/CamionCisterna.ts
export interface Nodo {
  x: number;
  y: number;
}

export interface CamionCisterna {
  codigo: string;
  cargaMaxima: number;
  nodoActual: Nodo;
  // Puedes agregar más si los necesitas
}
