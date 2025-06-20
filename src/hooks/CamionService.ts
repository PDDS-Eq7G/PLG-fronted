// src/services/truckService.ts

export interface Truck {
  id: string;
  lat: number;
  lng: number;
}

export const fetchTruckPositions = async (): Promise<Truck[]> => {
  const response = await fetch("/api/flota/listar");
  if (!response.ok) {
    throw new Error("No se pudieron obtener los camiones");
  }
  return await response.json();
};
