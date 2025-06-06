import React, { useEffect, useState } from 'react';
import './SimulationMap.css';
import { GridMap } from '../GridMap/GridMap';
import { GridCellData } from '../../types/map';
import Truck from '../Truck/Truck';
import { useSimulacion } from '../../context/SimulacionContext';
import { useConfig } from '../../context/ConfigContext';
import { getTanques, getFlota } from '../../api/index';

interface Position {
  x: number;
  y: number;
}

interface Flota {
  codigo: string;
  route: Position[];
}

const getColorForTruck = (codigo: string) => {
  if (codigo.startsWith('TA')) return '#D300DE';
  if (codigo.startsWith('TB')) return '#FFDE00';
  if (codigo.startsWith('TC')) return '#00A35C';
  if (codigo.startsWith('TD')) return '#BF360C';
  return '#999999';
};

const createGridFromConfig = (
  ancho: number,
  alto: number,
  almacen: Position,
  tanques: Position[]
): GridCellData[][] => {
  const grid: GridCellData[][] = [];

  for (let y = 0; y < alto; y++) {
    const row: GridCellData[] = [];
    for (let x = 0; x < ancho; x++) {
      row.push({ x, y, type: 'empty' });
    }
    grid.push(row);
  }

  const invertY = (y: number) => alto - 1 - y;

  grid[invertY(almacen.y)][almacen.x] = {
    x: almacen.x,
    y: almacen.y,
    type: 'central',
  };

  tanques.forEach((t) => {
    if (t.x < ancho && t.y < alto) {
      grid[invertY(t.y)][t.x] = {
        x: t.x,
        y: t.y,
        type: 'intermediate',
      };
    }
  });

  return grid;
};

const SimulationMap: React.FC = () => {
  const [gridData, setGridData] = useState<GridCellData[][]>([]);
  const [cellSize] = useState(13);
  const [flota, setFlota] = useState<Flota[]>([]);
  const [gridSizeX, setGridSizeX] = useState(0);
  const [gridSizeY, setGridSizeY] = useState(0);
  const { velocidad } = useSimulacion();
  const { config, loading: configLoading } = useConfig();

  const simulationRunning = velocidad !== 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tanquesRes, flotaRes] = await Promise.all([getTanques(), getFlota()]);
        console.log(config);
        console.log(`Velocidad: ${velocidad}`);

        const ancho = parseInt(config.ancho_ciudad, 10);
        const alto = parseInt(config.alto_ciudad, 10);
        const almacenX = parseInt(config.almacen_central_x, 10);
        const almacenY = parseInt(config.almacen_central_y, 10);

        const tanques: Position[] = (tanquesRes.data.tanquesIntermedios || []).map((t: any) => ({
          x: t.ubicacion.x,
          y: t.ubicacion.y,
        }));

        const grid = createGridFromConfig(ancho, alto, { x: almacenX, y: almacenY }, tanques);

        const flotaTransformada: Flota[] = (flotaRes.data.flota || []).map((camion: any) => ({
          codigo: camion.codigo,
          route: camion.NodoActual ? [{ x: camion.NodoActual.x, y: camion.NodoActual.y }] : [],
        }));

        setGridSizeX(ancho);
        setGridSizeY(alto);
        setGridData(grid);
        setFlota(flotaTransformada);
      } catch (err) {
        console.error('Error al cargar datos para el mapa:', err);
      }
    };

    if (!configLoading) {
      fetchData();
    }
  }, [config, configLoading]);

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
            <Truck
              key={camion.codigo}
              id={camion.codigo}
              route={camion.route}
              cellSize={cellSize}
              color={getColorForTruck(camion.codigo)}
              gridSizeY={gridSizeY}
              isRunning={simulationRunning}
              speed={velocidad}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimulationMap;
