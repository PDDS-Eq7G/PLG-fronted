import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SimulacionContextProps {
  velocidad: number;
  setVelocidad: (v: number) => void;
  velocidadReal: number;
  setVelocidadReal: (v: number) => void;
  minSpeed: number;
  maxSpeed: number;
}

const SimulacionContext = createContext<SimulacionContextProps | undefined>(undefined);

export const SimulacionProvider = ({ children }: { children: ReactNode }) => {
  const MIN_SPEED = 750;
  const MAX_SPEED = 1250;

  // Estado para la velocidad real (entre min y max)
  const [velocidadReal, setVelocidadReal] = useState<number>(1000);
  // Estado para la velocidad actual (0 = pausa, o la velocidad real)
  const [velocidad, setVelocidad] = useState<number>(0);

  return (
    <SimulacionContext.Provider
      value={{
        velocidad,
        setVelocidad,
        velocidadReal,
        setVelocidadReal,
        minSpeed: MIN_SPEED,
        maxSpeed: MAX_SPEED,
      }}
    >
      {children}
    </SimulacionContext.Provider>
  );
};

// Hook para usar el contexto más fácilmente
export const useSimulacion = () => {
  const context = useContext(SimulacionContext);
  if (!context) {
    throw new Error('useSimulacion debe usarse dentro de un SimulacionProvider');
  }
  return context;
};
