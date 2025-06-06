// src/components/SimulationMap/SimulationMap.tsx
import React, { useEffect, useState } from 'react';
import './SimulationMap.css';
import { GridMap } from '../GridMap/GridMap';
import { GridCellData } from '../../types/map';
import Truck from '../Truck/Truck';
import { SIMULATION_SPEEDS } from '../ControlDeMando/ReproduccionSimulacionControls';
import PedidoIcon from '../Pedido/Pedido'; // ✅ NUEVO COMPONENTE

interface Position {
  x: number;
  y: number;
}

interface FlotaMock {
  codigo: string;
  route: Position[];
  pedido: {
    id: string;
    ubicacion: Position;
  };
}

const gridSizeX = 70;
const gridSizeY = 50;

const getColorForTruck = (codigo: string) => {
  if (codigo.startsWith('TA')) return '#D300DE';
  if (codigo.startsWith('TB')) return '#FFDE00';
  if (codigo.startsWith('TC')) return '#00A35C';
  if (codigo.startsWith('TD')) return '#BF360C';
  return '#999999';
};

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

interface SimulationMapProps {
  simulationSpeed: number;
}

const SimulationMap: React.FC<SimulationMapProps> = ({ simulationSpeed }) => {
  const [cellSize, setCellSize] = useState(13);
  const [flota, setFlota] = useState<FlotaMock[]>([]);
  const gridData = createGrid();

  useEffect(() => {
    fetch('/mockFlota.json')
      .then(res => res.json())
      .then(data => setFlota(data.flota))
      .catch(err => console.error('Error al cargar flota simulada:', err));
  }, []);

const isPlaying = simulationSpeed === SIMULATION_SPEEDS.PLAY_NORMAL;

  return (
    <div className="app-container">
      <div className="grid-map-frame">
        <div
          className="grid-map-inner"
          style={{
            width: `${cellSize * gridSizeX}px`,
            height: `${cellSize * gridSizeY}px`,
            position: 'relative',
          }}
        >
          <GridMap gridData={gridData} cellSize={cellSize} />

          {flota.map((camion) => (
             <React.Fragment key={camion.codigo}>
              {isPlaying && (
                <PedidoIcon
                  position={camion.pedido.ubicacion}
                  cellSize={cellSize}
                  gridSizeY={gridSizeY}
                />
              )}

              <Truck
                id={camion.codigo}
                route={camion.route}
                cellSize={cellSize}
                color={getColorForTruck(camion.codigo)}
                gridSizeY={gridSizeY}
                isRunning={simulationSpeed === SIMULATION_SPEEDS.PLAY_NORMAL}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimulationMap;
