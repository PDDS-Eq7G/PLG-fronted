// src/components/SimulationMap/SimulationMap.tsx
import React, { useEffect, useState, useMemo, useRef } from 'react';
import './SimulationMap.css';
import { GridMap } from '../GridMap/GridMap';
import { GridCellData } from '../../types/map';
import { Truck as TruckComponent } from '../Truck/Truck';
import { useSimulacion } from '../../context/SimulacionContext';
import { useConfig } from '../../context/ConfigContext';
import { getTanques } from '../../api/index';
import ModalResumenEjecucion from '../ModalResumenEjecucion/ModalResumenEjecucion';
import PedidoMarker from '../../icons/PedidoMarker';
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
  const [almacenPos, setAlmacenPos] = useState<Position | null>(null);
  const [baseGrid, setBaseGrid] = useState<GridCellData[][]>([]);
  const [cellSize] = useState(15);
  const [gridSize, setGridSize] = useState({ ancho: 0, alto: 0 });
  const [userScale, setUserScale] = useState(1);
  const [autoScale, setAutoScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { historial, minutoActualIdx, velocidad } = useSimulacion();
  const { config, loading: configLoading } = useConfig();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consumoFinal, setConsumoFinal] = useState<number | null>(null);
  const [rutasPorCamion, setRutasPorCamion] = useState<Record<string, Position[]>>({});
  const [pedidosEntregadosVisibles, setPedidosEntregadosVisibles] = useState<Pedido[]>([]);

  useEffect(() => {
    if (minutoActualIdx === -1) {
      setRutasPorCamion({});
      setPedidosEntregadosVisibles([]);
    }
  }, [minutoActualIdx]);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      const h = containerRef.current.offsetHeight;
      if (gridSize.ancho === 0 || gridSize.alto === 0) return;
      const mapW = cellSize * gridSize.ancho;
      const mapH = cellSize * gridSize.alto;
      const scaleW = w / mapW;
      const scaleH = h / mapH;
      const newScale = Math.min(scaleW, scaleH, 3);
      setAutoScale(newScale);
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [gridSize, cellSize]);

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

        const invertY = (y: number) => alto - 1 - y;
        grid[invertY(almacen.y)][almacen.x].type = 'central';
        tanques.forEach(t => {
          if (t.x < ancho && t.y < alto) {
            grid[invertY(t.y)][t.x].type = 'intermediate';
          }
        });

        setBaseGrid(grid);
        setAlmacenPos(almacen);
        setGridSize({ ancho, alto });
      } catch (err) {
        console.error('Error al cargar datos iniciales del mapa:', err);
      }
    };

    if (!configLoading) fetchInitialMap();
  }, [config, configLoading]);

  const minutoActualData = useMemo(() => {
    return minutoActualIdx === -1 ? null : historial[minutoActualIdx];
  }, [historial, minutoActualIdx]);

  const getPixelCoords = (pos: Position) => ({
    x: pos.x * cellSize + cellSize / 2,
    y: (gridSize.alto - 1 - pos.y) * cellSize + cellSize / 2,
  });

  useEffect(() => {
    if (historial.length > 0 && minutoActualIdx === historial.length - 1) {
      const ultimo = historial[historial.length - 1];
      if (ultimo && 'consumoTotal' in ultimo) {
        setConsumoFinal(ultimo.consumoTotal);
        setIsModalOpen(true);
      }
    }
  }, [minutoActualIdx, historial]);

  useEffect(() => {
    if (!minutoActualData || !('camiones' in minutoActualData)) return;

    setRutasPorCamion((prev) => {
      const nuevas = { ...prev };
      minutoActualData.camiones.forEach(({ codigo, posicion, estado }) => {
        const prevRuta = nuevas[codigo] || [];
        if (estado === 'DESCARGANDO' || estado === 'FINALIZADO' || estado === 'TERMINADO') {
          nuevas[codigo] = [];
        } else {
          const ultima = prevRuta[prevRuta.length - 1];
          if (!ultima || ultima.x !== posicion.x || ultima.y !== posicion.y) {
            nuevas[codigo] = [...prevRuta, posicion];
          }
        }
      });
      return nuevas;
    });
  }, [minutoActualIdx, minutoActualData]);

  useEffect(() => {
    if (!minutoActualData || !('minuto' in minutoActualData)) return;
    const pedidosActuales = minutoActualData.pedidosUbicacion ?? [];

    setPedidosEntregadosVisibles((prev) => {
      const actualesIds = new Set(pedidosActuales.map(p => p.idPedido));
      const persistentes = prev.filter(p => !actualesIds.has(p.idPedido));

      const prevIdx = Math.max(minutoActualIdx - 1, 0);
      const prevData = historial[prevIdx];
      if (!prevData || !('minuto' in prevData)) return persistentes;

      const prevPedidos = prevData.pedidosUbicacion ?? [];
      const desaparecidos = prevPedidos.filter(p => !actualesIds.has(p.idPedido));

      return [...persistentes, ...desaparecidos];
    });
  }, [minutoActualIdx, minutoActualData]);

  const { currentGrid, currentFlota } = useMemo(() => {
    if (!minutoActualData || !('minuto' in minutoActualData)) {
      return { currentGrid: baseGrid, currentFlota: [] };
    }

    const newGrid = baseGrid.map(row => row.map(cell => ({ ...cell })));
    const invertY = (y: number) => gridSize.alto - 1 - y;

    const pedidos = minutoActualData.pedidosUbicacion ?? [];
    const nodosBloqueados = minutoActualData.nodosBloqueados ?? [];
    const flota = minutoActualData.camiones ?? [];

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

    return { currentGrid: newGrid, currentFlota: flota };
  }, [minutoActualData, baseGrid, gridSize]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setConsumoFinal(null);
  };

  return (
    <div className="app-container">
      <div className="grid-map-frame" ref={containerRef}>
        <div
          className="grid-map-inner"
          style={{
            width: `${cellSize * gridSize.ancho}px`,
            height: `${cellSize * gridSize.alto}px`,
            position: 'relative',
            display: 'flex',
            transform: `scale(${Math.min(userScale * autoScale, 3)})`,
            transformOrigin: 'top left',
          }}
        >
          <GridMap gridData={currentGrid} cellSize={cellSize} />

          {Object.entries(rutasPorCamion).map(([codigo, ruta]) => (
            <svg
              key={`ruta-${codigo}`}
              style={{ position: 'absolute', pointerEvents: 'none' }}
              width={cellSize * gridSize.ancho}
              height={cellSize * gridSize.alto}
            >
              {ruta.slice(1).map((pos, i) => {
                const prev = getPixelCoords(ruta[i]);
                const curr = getPixelCoords(pos);
                return (
                  <line
                    key={`${codigo}-segmento-${i}`}
                    x1={prev.x}
                    y1={prev.y}
                    x2={curr.x}
                    y2={curr.y}
                    stroke={getColorForTruck(codigo)}
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          ))}

          {pedidosEntregadosVisibles.map((p) => (
            <PedidoMarker
              key={`entregado-${p.idPedido}`}
              x={p.posicion.x}
              y={p.posicion.y}
              cellSize={cellSize}
              gridSizeY={gridSize.alto}
              color="#999999"
              opacity={0.4}
            />
          ))}

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
        <div className="zoom-controls">
          <button className="zoom-button" onClick={() => setUserScale(s => Math.min(s + 0.1, 3))}>+</button>
          <span className="zoom-label">{Math.round(userScale * autoScale * 100)}%</span>
          <button className="zoom-button" onClick={() => setUserScale(s => Math.max(0.5, s - 0.1))}>-</button>
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
