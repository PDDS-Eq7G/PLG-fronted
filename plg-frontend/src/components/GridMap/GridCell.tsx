import React from 'react';
import { GridCellData } from '../../types/map';
import '../../App.css';

interface Props {
  data: GridCellData;
  size: number;
}

export const GridCell: React.FC<Props> = ({ data, size }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'central': return '🏠';
      case 'intermediate': return '🏭';
      case 'truck': return '🚛';
      default: return '';
    }
  };

  return (
    <div
      className={`grid-cell ${data.type}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.6
      }}
    >
      {getIcon()}
    </div>
  );
};
