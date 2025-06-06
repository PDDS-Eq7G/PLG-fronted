import React, { useEffect, useState } from 'react';
import TruckSvgIcon from '../../icons/TruckSvgIcon';

interface Position {
  x: number;
  y: number;
}

interface TruckProps {
  id: string;
  route: Position[];
  cellSize: number;
  gridSizeY: number;
  speed?: number;
  color?: string;
  isRunning?: boolean;
}

export const Truck: React.FC<TruckProps> = ({
  id,
  route,
  cellSize,
  gridSizeY,
  speed = 300,
  color,
  isRunning = false,
}) => {
  const [step, setStep] = useState(0);
  const [trailSteps, setTrailSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isRunning || step >= route.length - 1) return;

    const interval = setInterval(() => {
      setStep((prev) => prev + 1);
      setTrailSteps((prev) => [...prev, prev.length]);
    }, speed);

    return () => clearInterval(interval);
  }, [isRunning, step, route, speed]);

  const current = route[step];
  if (!current) return null; // Evitar error si no hay posición actual

  const getTop = (y: number) => (gridSizeY - 1 - y) * cellSize;

  return (
    <>
      {trailSteps.map((trailIndex, i) => {
        const pos = route[trailIndex];
        if (!pos) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pos.x * cellSize + cellSize / 2 - 0.75,
              top: getTop(pos.y) + cellSize / 2 - 0.75,
              width: 1.5,
              height: 1.5,
              backgroundColor: 'black',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: current.x * cellSize,
          top: getTop(current.y),
          width: cellSize,
          height: cellSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <TruckSvgIcon
          width={cellSize * 0.8}
          height={cellSize * 0.8}
          color={color || '#D300DE'}
        />
      </div>
    </>
  );
};

export default Truck;
