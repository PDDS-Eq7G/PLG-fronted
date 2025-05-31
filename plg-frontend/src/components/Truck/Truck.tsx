import React, { useEffect, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface TruckProps {
  id: string;
  start: Position;
  end: Position;
  cellSize: number;
  speed?: number;
  onArrival?: () => void;
}

export const Truck: React.FC<TruckProps> = ({ id, start, end, cellSize, speed = 300, onArrival }) => {
  const [position, setPosition] = useState<Position>(start);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => {
        if (prev.x === end.x && prev.y === end.y) {
          clearInterval(interval);
          onArrival?.();
          return prev;
        }

        let dx = 0;
let dy = 0;

if (prev.x !== end.x) {
  dx = end.x > prev.x ? 1 : -1;
} else if (prev.y !== end.y) {
  dy = end.y > prev.y ? 1 : -1;
}

return { x: prev.x + dx, y: prev.y + dy };
      });
    }, speed);

    return () => clearInterval(interval);
  }, [end, speed, onArrival]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x * cellSize,
        top: position.y * cellSize,
        width: cellSize,
        height: cellSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: cellSize * 0.6,
        transition: 'left 0.3s linear, top 0.3s linear',
        pointerEvents: 'none'
      }}
    >
      🚛
    </div>
  );
};
