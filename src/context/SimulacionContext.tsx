// src/context/SimulacionContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Define el tipo para los datos de un minuto del historial
export interface HistorialMinuto {
  minuto: string;
  nodosBloqueados: { posicion: {x: number; y: number}; }[];
  pedidos: any[];
  camiones: {
    posicion: { x: number; y: number };
    codigo: string;
    estado: string;
  }[];
  pedidosUbicacion: {
    posicion: { x: number; y: number };
    idPedido: string;
  }[];
}

export interface HistorialConsumoFinal {
  duracionEjecucion: number;
  consumoTotal: number;
  // Make sure this matches the exact structure of the final element if it's different
  // For example, if it *also* has a 'minuto' field, you might need to adjust the filtering logic.
  // Assuming it's a separate summary object.
}

// Union type for the historial array
export type HistorialItem = HistorialMinuto | HistorialConsumoFinal;

interface SimulacionContextType {
  velocidad: number;
  setVelocidad: React.Dispatch<React.SetStateAction<number>>;
  velocidadReal: number;
  setVelocidadReal: React.Dispatch<React.SetStateAction<number>>;
  minSpeed: number;
  maxSpeed: number;
  historial: HistorialItem[]; // Corrected type for historial
  setHistorial: React.Dispatch<React.SetStateAction<HistorialItem[]>>; // Corrected type for setHistorial
  minutoActualIdx: number;
  setMinutoActualIdx: React.Dispatch<React.SetStateAction<number>>;
  isSimulando: boolean;
  setIsSimulando: React.Dispatch<React.SetStateAction<boolean>>;
  finSimulacion: boolean; // NEW: Flag to signal end of simulation
  setFinSimulacion: React.Dispatch<React.SetStateAction<boolean>>; // NEW: Setter for finSimulacion
  fechaInicio: Date | null;
  setFechaInicio: React.Dispatch<React.SetStateAction<Date | null>>;
}

const SimulacionContext = createContext<SimulacionContextType | undefined>(undefined);

export const SimulacionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [velocidad, setVelocidad] = useState(0); // 0 means paused/stopped initially
  const [velocidadReal, setVelocidadReal] = useState(1000); // Default 1000ms (1 second per minute)
  const [isSimulando, setIsSimulando] = useState(false);
  const [historial, setHistorial] = useState<HistorialItem[]>([]); // Initialize with correct union type
  const [minutoActualIdx, setMinutoActualIdx] = useState(-1);
  const [finSimulacion, setFinSimulacion] = useState(false); // Initialize new state
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());

  const minSpeed = 100; // ms (Faster speed)
  const maxSpeed = 2000; // ms (Slower speed)

  // NEW: Effect to control the simulation clock (advancing minutoActualIdx)
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    // The clock runs if simulation is active, not finished *from backend*, and there's history data to display
    if (isSimulando && !finSimulacion && historial.length > 0) {
      interval = setInterval(() => {
        setMinutoActualIdx((prevIdx: number) => {
          // If we are at or past the last available minute data, stop advancing the display.
          if (prevIdx >= historial.length - 1) {
            // STOP visual playback by pausing `isSimulando` and resetting `velocidad`.
            // DO NOT perform a full reset of historial, minutoActualIdx, etc. here.
            setIsSimulando(false); // Pause visual progression
            setVelocidad(0);       // Set speed to 0 (paused)
            if (interval) clearInterval(interval); // Clear interval to prevent further calls
            return prevIdx; // Stay at the last index
          }
          return prevIdx + 1; // Advance to the next minute
        });
      }, velocidad);
    }

    // Cleanup function: clear the interval when dependencies change or component unmounts
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSimulando, velocidad, historial.length, finSimulacion]); // Depend on relevant state changes

  // Optional: Add a comprehensive reset function to the context
  // This can be called from any consumer (e.g., ControlDeMandoCompleto, SimulationMap)
  const resetSimulationState = useCallback(() => {
    setIsSimulando(false);
    setHistorial([]);
    setMinutoActualIdx(-1);
    setVelocidad(0); // Reset to paused default
    setVelocidadReal(1000); // Reset to default playback speed
    setFinSimulacion(false); // Crucial for new simulations
    setFechaInicio(new Date());
  }, []);

  return (
    <SimulacionContext.Provider
      value={{
        velocidad,
        setVelocidad,
        velocidadReal,
        setVelocidadReal,
        minSpeed,
        maxSpeed,
        historial,
        setHistorial, // Now correctly typed
        minutoActualIdx,
        setMinutoActualIdx,
        isSimulando,
        setIsSimulando,
        finSimulacion, // Provide the new state
        setFinSimulacion, // Provide the new setter
        fechaInicio,
        setFechaInicio,
      }}
    >
      {children}
    </SimulacionContext.Provider>
  );
};

export const useSimulacion = () => {
  const context = useContext(SimulacionContext);
  if (!context) {
    throw new Error('useSimulacion debe ser usado dentro de un SimulacionProvider');
  }
  return context;
};