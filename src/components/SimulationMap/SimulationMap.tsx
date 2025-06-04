import React, { useState } from 'react';
import './SimulationMap.css';
import { GridMap } from '../GridMap/GridMap';
import { GridCellData } from '../../types/map';
import { Truck } from '../Truck/Truck';

const gridSizeX = 70;
const gridSizeY = 50;

const createGrid = (): GridCellData[][] => {
  const grid: GridCellData[][] = [];
  for (let y = 0; y < gridSizeY; y++) {
    const row: GridCellData[] = [];
    for (let x = 0; x < gridSizeX; x++) {
      row.push({ x, y, type: 'empty' });
    }
    grid.push(row);
  }

  grid[12][8] = { x: 12, y: 8, type: 'central' };
  grid[7][6] = { x: 7, y: 6, type: 'intermediate' };

  return grid;
};

const SimulationMap: React.FC = () => {
  const [cellSize, setCellSize] = useState(13);
  const gridData = createGrid();

  return (
    <div className="app-container">


      <div className="grid-map-frame">
        <div
          className="grid-map-inner"
          style={{
            width: `${cellSize * gridSizeX}px`,
            height: `${cellSize * gridSizeY}px`,
            position: 'relative'
          }}
        >
          <GridMap gridData={gridData} cellSize={cellSize} />

          <Truck id="TR1" start={{ x: 10, y: 10 }} end={{ x: 30, y: 35 }} cellSize={cellSize} />
          <Truck id="TR2" start={{ x: 20, y: 5 }} end={{ x: 60, y: 45 }} cellSize={cellSize} speed={50} />
          <Truck id="TR3" start={{ x: 30, y: 5 }} end={{ x: 69, y: 45 }} cellSize={cellSize} speed={200} />
          <Truck id="TR4" start={{ x: 69, y: 10 }} end={{ x: 12, y: 12 }} cellSize={cellSize} speed={200} />
        </div>
      </div>
    </div>
  );
};

export default SimulationMap;
