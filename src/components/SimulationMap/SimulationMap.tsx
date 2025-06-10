// src/components/SimulationMap/SimulationMap.tsx
import React, { useEffect, useState, useMemo } from 'react';
import './SimulationMap.css';
import { GridMap } from '../GridMap/GridMap';
import { GridCellData } from '../../types/map';
import { Truck as TruckComponent } from '../Truck/Truck'; // Renombrado para evitar conflicto de nombres
import { useSimulacion } from '../../context/SimulacionContext';
import { useConfig } from '../../context/ConfigContext';
import { getTanques } from '../../api/index'; // getFlota ya no es necesario aquí
import ModalResumenEjecucion from '../ModalResumenEjecucion/ModalResumenEjecucion';

interface Position { x: number; y: number; }
interface Truck { codigo: string; posicion: Position; }
interface Pedido { idPedido: string; posicion: Position; }
interface NodoBloqueado { posicion: Position; }

const getColorForTruck = (codigo: string) => {
  if (codigo.startsWith('TA')) return '#D300DE';
  if (codigo.startsWith('TB')) return '#FFDE00';
  if (codigo.startsWith('TC')) return '#00A35C';
  if (codigo.startsWith('TD')) return '#BF360C';
  return '#999999';
};

const SimulationMap: React.FC = () => {
  const [baseGrid, setBaseGrid] = useState<GridCellData[][]>([]);
  const [cellSize] = useState(15);
  const [gridSize, setGridSize] = useState({ ancho: 0, alto: 0 });
  
  const { historial, minutoActualIdx, velocidad } = useSimulacion();
  const { config, loading: configLoading } = useConfig();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consumoFinal, setConsumoFinal] = useState<number | null>(null);

  // 1. Cargar la configuración inicial del mapa (almacén, tanques)
  useEffect(() => {
    const fetchInitialMap = async () => {
      if (!config) return;
      try {
        const tanquesRes = await getTanques();
        const ancho = parseInt(config.ancho_ciudad, 10);
        const alto = parseInt(config.alto_ciudad, 10);
        const almacen = { x: parseInt(config.almacen_central_x, 10), y: parseInt(config.almacen_central_y, 10) };
        
        const tanques: Position[] = (tanquesRes.data.tanquesIntermedios || []).map((t: any) => t.ubicacion);
        
        const grid: GridCellData[][] = Array.from({ length: alto }, (_, y) =>
          Array.from({ length: ancho }, (_, x) => ({ x, y: alto - 1 - y, type: 'empty' }))
        );
        
        const invertY = (yCoord: number) => alto - 1 - yCoord;

        grid[invertY(almacen.y)][almacen.x] = { ...grid[invertY(almacen.y)][almacen.x], type: 'central' };
        tanques.forEach(t => {
          if (t.x < ancho && t.y < alto) {
            grid[invertY(t.y)][t.x] = { ...grid[invertY(t.y)][t.x], type: 'intermediate' };
          }
        });

        setBaseGrid(grid);
        setGridSize({ ancho, alto });
      } catch (err) {
        console.error('Error al cargar datos iniciales del mapa:', err);
      }
    };

    if (!configLoading) {
      fetchInitialMap();
    }
  }, [config, configLoading]);

  // 2. Obtener el estado actual de la simulación
  const minutoActualData = useMemo(() => {
    if (minutoActualIdx === -1 || !historial[minutoActualIdx]) {
      return null;
    }
    return historial[minutoActualIdx];
  }, [historial, minutoActualIdx]);

  useEffect(() => {
     if (historial.length > 0 && minutoActualIdx === historial.length - 1) {
       const ultimoElemento = historial[historial.length - 1];
       if (ultimoElemento && 'consumoTotal' in ultimoElemento) {
       console.log('Final de simulación detectado. Mostrando modal.');
         setConsumoFinal(ultimoElemento.consumoTotal);
         setIsModalOpen(true);
       }
     }
   }, [minutoActualIdx, historial]);

  // 3. Generar el grid y la flota para el minuto actual
  const { currentGrid, currentFlota } = useMemo(() => {
    if (!minutoActualData) {
      return { currentGrid: baseGrid, currentFlota: [] };
    }
    
    const newGrid = baseGrid.map(row => row.map(cell => ({ ...cell })));
    const invertY = (y: number) => gridSize.alto - 1 - y;

    let flota: Truck[] = [];

    if ('minuto' in minutoActualData) {
      const pedidos: Pedido[] = minutoActualData.pedidosUbicacion || [];
      const nodosBloqueados: NodoBloqueado[] = minutoActualData.nodosBloqueados || [];
      flota = minutoActualData.camiones || [];

      pedidos.forEach(p => {
        if (p.posicion.x < gridSize.ancho && p.posicion.y < gridSize.alto) {
          newGrid[invertY(p.posicion.y)][p.posicion.x].type = 'order';
        }
      });

      nodosBloqueados.forEach(n => {
        if (n.posicion.x < gridSize.ancho && n.posicion.y < gridSize.alto) {
          newGrid[invertY(n.posicion.y)][n.posicion.x].type = 'blocked';
        }
      });
    }

    return { currentGrid: newGrid, currentFlota: flota };
  }, [minutoActualData, baseGrid, gridSize]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setConsumoFinal(null);
  }

  return (
    <div className="app-container">
      <div className="grid-map-frame">
        <div
          className="grid-map-inner"
          style={{
            width: `${cellSize * gridSize.ancho}px`,
            height: `${cellSize * gridSize.alto}px`,
            position: 'relative',
            display: 'flex'
          }}
        >
          <GridMap gridData={currentGrid} cellSize={cellSize} />

          {currentFlota.map((camion) => (
            <TruckComponent
              key={camion.codigo}
              id={camion.codigo}
              position={camion.posicion}
              cellSize={cellSize}
              color={getColorForTruck(camion.codigo)}
              gridSizeY={gridSize.alto}
            />
          ))}
        </div>

        <ModalResumenEjecucion isOpen={isModalOpen} onClose={handleCloseModal}>
          <>
              <p>Simulación finalizada</p>
              {consumoFinal !== null && (
                  <div style={{ marginTop: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      <p>Consumo Total: {consumoFinal.toFixed(3)} galones</p>
                  </div>
              )}
          </>
        </ModalResumenEjecucion>
      </div>
    </div>
  );
};

export default SimulationMap;