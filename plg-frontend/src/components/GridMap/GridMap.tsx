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
      width: cellSize * 70, // 70 columnas
      height: cellSize * 50 // 50 filas
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
