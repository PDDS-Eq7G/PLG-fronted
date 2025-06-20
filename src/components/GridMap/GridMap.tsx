import React from 'react';
import { GridCell } from './GridCell';
import { GridCellData } from '../../types/map';

interface Props {
  gridData: GridCellData[][];
  cellSize: number;
}

export const GridMap: React.FC<Props> = ({ gridData, cellSize }) => {
  return (
    <div className="grid-map"
    style={{
      width: cellSize * 71, // 70 nodos horizontales
      height: cellSize * 51 // 50 nodos verticales
    }}>
      {gridData.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((cell, cellIndex) => (
            <GridCell key={cellIndex} data={cell} size={cellSize} />
          ))}
        </div>
      ))}
    </div>
  );
};
