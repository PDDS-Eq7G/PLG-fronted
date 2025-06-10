import React, { useEffect, useState } from 'react';
import './SimulationMap.css';
import { GridMap } from '../GridMap/GridMap';
import { GridCellData } from '../../types/map';
import Truck from '../Truck/Truck';
import PedidoMarker from '../Pedido/PedidoMarker';
import { useSimulacion } from '../../context/SimulacionContext';
import { useSimuladorPlanificacion } from '../../hooks/useSimuladorPlanificacion';
import { useReproductorSimulacion } from '../../hooks/useReproductorSimulacion';
import { useCallback } from 'react';
interface Position { x: number; y: number; }
interface Pedido { id: string; ubicacion: Position; }
interface Flota { codigo: string; route: Position[]; pedido?: Pedido; }

interface EstadoMinuto {
  minuto: string;
  camiones: { codigo: string; posicion: Position; estado: string }[];
  pedidosUbicacion: { idPedido: string; posicion: Position }[];
}

interface SimulationMapProps {
  fechaInicio: Date | null;
}

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

const SimulationMap: React.FC<SimulationMapProps> = ({ fechaInicio }) => {
  const { velocidad } = useSimulacion();
  const gridData = createGrid();

  const [historial, setHistorial] = useState<EstadoMinuto[]>([]);
  const [flota, setFlota] = useState<Flota[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

 const handleNuevoHistorial = useCallback((nuevoHistorial: EstadoMinuto[]) => {
  setHistorial(nuevoHistorial);
}, []);

useSimuladorPlanificacion(
  fechaInicio,
  velocidad > 0,
  handleNuevoHistorial
);

  useReproductorSimulacion({
  historial,
  isRunning: velocidad > 0,
  velocidadMs: velocidad,
  onUpdate: (flotaNueva, pedidosNuevos) => {
    setFlota(flotaNueva);
    setPedidos(pedidosNuevos);
  }
});

  const cellSize = 13;

  const getColorForTruck = (codigo: string) => {
    if (codigo.startsWith('TA')) return '#D300DE';
    if (codigo.startsWith('TB')) return '#FFDE00';
    if (codigo.startsWith('TC')) return '#00A35C';
    if (codigo.startsWith('TD')) return '#BF360C';
    return '#999999';
  };

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
              <Truck
                id={camion.codigo}
                route={camion.route}
                cellSize={cellSize}
                gridSizeY={gridSizeY}
                color={getColorForTruck(camion.codigo)}
                isRunning={velocidad > 0}
              />
            </React.Fragment>
          ))}

          {pedidos.map((p) => (
            <PedidoMarker
              key={p.id}
              x={p.ubicacion.x}
              y={p.ubicacion.y}
              cellSize={cellSize}
              gridSizeY={gridSizeY}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimulationMap;
// SimulationMap.tsx
