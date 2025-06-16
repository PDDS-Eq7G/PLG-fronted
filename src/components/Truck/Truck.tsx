// src/components/Truck/Truck.tsx
import React from 'react';
import TruckSvgIcon from '../../icons/TruckSvgIcon';
import TruckBrokenIcon from '../../icons/TruckBrokenIcon';

interface Position {
  x: number;
  y: number;
}

interface TruckProps {
  id: string;
  position: Position; // Recibe una única posición
  cellSize: number;
  gridSizeY: number;
  color?: string;
  estado?: string;
}

// Renombrado para evitar conflictos
export const Truck: React.FC<TruckProps> = ({
  id,
  position,
  cellSize,
  gridSizeY,
  color,
  estado,
}) => {
  if (!position) return null; // No renderizar si no hay posición

  // La coordenada Y se invierte para el sistema de renderizado (CSS)
  const getTop = (y: number) => (gridSizeY - 1 - y) * cellSize;

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x * cellSize,
        top: getTop(position.y),
        width: cellSize,
        height: cellSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        //pointerEvents: 'none',
        transition: 'left 0.5s linear, top 0.5s linear', // Animación suave
        zIndex: 1100,
      }}
      role="img"
      aria-label={id}
      title={id}
    >
      {estado === 'AVERIADO' ? (
        <TruckBrokenIcon
          width={cellSize * 0.8}
          height={cellSize * 0.8}
          color={color || '#D300DE'}
        />
      ) : (
        <TruckSvgIcon
          width={cellSize * 0.8}
          height={cellSize * 0.8}
          color={color || '#D300DE'}
        />
      )}
    </div>
  );
};

export default Truck;
