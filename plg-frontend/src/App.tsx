import React, { useState } from 'react';
import './App.css';
import { GridMap } from './components/GridMap/GridMap';
import { GridCellData } from './types/map';
import { Truck } from './components/Truck/Truck';

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

  // Elementos estáticos
  grid[12][8] = { x: 12, y: 8, type: 'central' };
  grid[7][6] = { x: 7, y: 6, type: 'intermediate' };

  return grid;
};

const App: React.FC = () => {
  const [cellSize, setCellSize] = useState(20);
  const gridData = createGrid();

  return (
    <div className="app-container">
      <div className="zoom-controls">
        <button onClick={() => setCellSize(s => Math.min(s + 5, 100))}>+</button>
        <button onClick={() => setCellSize(s => Math.max(s - 5, 10))}>−</button>
        <span>{cellSize}px</span>
      </div>

      <div className="grid-wrapper">
        <div
          className="grid-map-container"
          style={{
            width: cellSize * gridSizeX,
            height: cellSize * gridSizeY,
            position: 'relative'
          }}
        >
          <GridMap gridData={gridData} cellSize={cellSize} />
          
          {/* Componente Truck con animación */}
          <Truck
            id="TR1"
            start={{ x: 10, y: 10 }}
            end={{ x: 30, y: 35 }}
            cellSize={cellSize}
          />

          <Truck
          id="TR2"
          start={{ x: 20, y: 5 }}
          end={{ x: 60, y: 45 }}
          cellSize={cellSize}
          speed={50} // 
          />

          <Truck
          id="TR3"
          start={{ x: 30, y: 5 }}
          end={{ x: 69, y: 45 }}
          cellSize={cellSize}
          speed={200} // 
          />

                    <Truck
          id="TR3"
          start={{ x: 69, y: 10 }}
          end={{ x: 12, y: 12 }}
          cellSize={cellSize}
          speed={200} // 
          />
        </div>
      </div>
    </div>
  );
};

export default App;
