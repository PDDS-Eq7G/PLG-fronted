// src/components/PedidoIcon/PedidoIcon.tsx
import React from 'react';
import PedidoIconSVG from '../../icons/PedidoSvgIcon'; // Asegúrate de que la ruta sea correcta

interface Position {
  x: number;
  y: number;
}

interface Props {
  position: Position;
  cellSize: number;
  gridSizeY: number;
}

const PedidoIcon: React.FC<Props> = ({ position, cellSize, gridSizeY }) => {
  const top = (gridSizeY - 1 - position.y) * cellSize;
  const left = position.x * cellSize;

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width: cellSize,
        height: cellSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}
    >
      <PedidoIconSVG
          width={cellSize * 0.8}
          height={cellSize * 0.8}
          
        />
    </div>
  );
};

export default PedidoIcon;
