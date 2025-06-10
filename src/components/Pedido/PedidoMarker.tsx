// src/components/Pedido/PedidoMarker.tsx
import React from 'react';
import PedidoIconSVG from '../../icons/PedidoSvgIcon';

interface Props {
  x: number;
  y: number;
  cellSize: number;
  gridSizeY: number;
}

const PedidoMarker: React.FC<Props> = ({ x, y, cellSize, gridSizeY }) => {
  const top = (gridSizeY - 1 - y) * cellSize;

  return (
    <div
      style={{
        position: 'absolute',
        left: x * cellSize,
        top: top,
        width: cellSize,
        height: cellSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}
    >
      <PedidoIconSVG width={cellSize * 0.7} height={cellSize * 0.7} />
    </div>
  );
};

export default PedidoMarker;
