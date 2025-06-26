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
import FloatingInfoBox, { InfoBoxContent } from '../FloatingInfoBox/FloatingInfoBox';
import { LegendFloatingBox } from '../FloatingInfoBox/LegendFloatingBox';
import { set } from 'date-fns';
interface Position { x: number; y: number; }
interface Truck { codigo: string; posicion: Position; }
interface Pedido { idPedido: string; posicion: Position; estado?: string; fechaLlegada?: string; }
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
  const isPanning = useRef(false);
  const startPoint = useRef<Position>({ x: 0, y: 0 });
  const startScroll = useRef<{ left: number; top: number }>({ left: 0, top: 0 });
  
  const { historial, minutoActualIdx, velocidad } = useSimulacion();
  const { config, loading: configLoading } = useConfig();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consumoFinal, setConsumoFinal] = useState<number | null>(null);
  const [rutasPorCamion, setRutasPorCamion] = useState<Record<string, Position[]>>({});
  const [rutasPendientesPorCamion, setRutasPendientesPorCamion] = useState<Record<string, Position[]>>({});
  const [pedidosEntregadosVisibles, setPedidosEntregadosVisibles] = useState<Record<string, PedidoConTiempo>>({});
  const [minutoColapso, setMinutoColapso] = useState<string | null>(null);
  const [pedidosNoEntregados, setPedidosNoEntregados] = useState<Record<string, Pedido>>({});
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  const [infoBox, setInfoBox] = useState<{
    x: number;
    y: number;
    visible: boolean;
    contenido: InfoBoxContent;
  }>({
    x: 0,
    y: 0,
    visible: false,
    contenido: { id: '', tipo: 'camion' },
  });

  const scale = Math.min(userScale * autoScale, 3);

  useEffect(() => {
    if (minutoActualIdx === -1) {
      setRutasPorCamion({});
      setPedidosEntregadosVisibles({});
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
        const ancho = parseInt(config.ancho_ciudad, 10) + 1;
        const alto = parseInt(config.alto_ciudad, 10) + 1;
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
/*
  const minutoActualData = useMemo(() => {
    return minutoActualIdx === -1 ? null : historial[minutoActualIdx];
  }, [historial, minutoActualIdx]);
*/
  const minutoActualData = useMemo(() => {
    if (minutoActualIdx === -1) return null;
    const data = historial[minutoActualIdx];
    return 'pedidosUbicacion' in data ? data : null;
  }, [historial, minutoActualIdx]);

  const pedidosConDatos = useMemo(() => {
    if (!minutoActualData) return [];

    return minutoActualData.pedidosUbicacion.map(pu => {
      const detalles = minutoActualData.pedidos.find(p => p.idPedido === pu.idPedido);
      return {
        ...pu,
        estado: detalles?.estado ?? 'Desconocido',
        fechaLlegada: detalles?.fechaLlegada ?? '',
        cantidad: detalles?.cantidadTotal ?? 0
      };
    });
  }, [minutoActualData]);


  const getPixelCoords = (pos: Position) => ({
    x: pos.x * cellSize + cellSize / 2,
    y: (gridSize.alto - 1 - pos.y) * cellSize + cellSize / 2,
  });


  const expandToManhattanPath = (prev: Position, next: Position): Position[] => {
    const path: Position[] = [];
    let x = prev.x;
    let y = prev.y;

    path.push({ x, y });

    const dx = next.x - x;
    const stepX = dx >= 0 ? 1 : -1;
    for (let i = 0; i < Math.abs(dx); i++) {
      x += stepX;
      path.push({ x, y });
    }

    const dy = next.y - y;
    const stepY = dy >= 0 ? 1 : -1;
    for (let i = 0; i < Math.abs(dy); i++) {
      y += stepY;
      path.push({ x, y });
    }

    return path;
  };

  useEffect(() => {
    if (historial.length === 0) return;
    
    const last = historial[historial.length - 1];
    const secondLast = historial[historial.length - 2];

    if (secondLast && 'colapso' in  secondLast && last && 'consumoTotal' in last) {;
      if (minutoActualIdx === historial.length - 2) {
        setMinutoColapso(secondLast.colapso.replace('T', ' '));
        setConsumoFinal(last.consumoTotal);
        setIsModalOpen(true);
      }
    } else if (last && 'consumoTotal' in last && minutoActualIdx === historial.length - 1) {
      setMinutoColapso(null);
      setConsumoFinal(last.consumoTotal);
      setIsModalOpen(true);
    }
  }, [minutoActualIdx, historial]);

  useEffect(() => {
    if (!minutoActualData || !('camiones' in minutoActualData)) return;

    setRutasPorCamion((prev) => {
      const nuevas = { ...prev };
      minutoActualData.camiones.forEach(({ codigo, posicion, estado }) => {
        const prevRuta = nuevas[codigo] || [];
        if (
          estado === 'DESCARGANDO' ||
          estado === 'FINALIZADO' ||
          estado === 'TERMINADO' ||
          estado === 'AVERIADO' ||
          (estado !== 'OCUPADO' && posicion.x === almacenPos?.x && posicion.y === almacenPos?.y)
        ) {
          nuevas[codigo] = [];
        } else {
          const ultima = prevRuta[prevRuta.length - 1];
          if (!ultima) {
            nuevas[codigo] = [...prevRuta, posicion];
          } else if (ultima.x !== posicion.x || ultima.y !== posicion.y) {
            const dx = posicion.x - ultima.x;
            const dy = posicion.y - ultima.y;
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1 || (dx !== 0 && dy !== 0)) {
              const expanded = expandToManhattanPath(ultima, posicion).slice(1);
              nuevas[codigo] = [...prevRuta, ...expanded];
            } else {
              nuevas[codigo] = [...prevRuta, posicion];
            }
          }
        }
      });
      return nuevas;
    });
  }, [minutoActualIdx, minutoActualData]);

  useEffect(() => {
    if (
      minutoActualIdx === -1 ||
      !minutoActualData ||
      !('camiones' in minutoActualData) ||
      !almacenPos
    ) {
      setRutasPendientesPorCamion({});
      return;
    }

    const checkReset = (estado: string, pos: Position) =>
      estado === 'DESCARGANDO' ||
      estado === 'FINALIZADO' ||
      estado === 'TERMINADO' ||
      estado === 'AVERIADO' ||
      (estado !== 'OCUPADO' && pos.x === almacenPos.x && pos.y === almacenPos.y);

    const nuevas: Record<string, Position[]> = {};

    minutoActualData.camiones.forEach(({ codigo, posicion }) => {
      const futuros: Position[] = [];
      let prevStep = posicion;
      for (let idx = minutoActualIdx + 1; idx < historial.length; idx++) {
        const data = historial[idx];
        if (!('camiones' in data)) continue;
        const fut = data.camiones.find(c => c.codigo === codigo);
        if (!fut) break;

        const nextPos = fut.posicion;
        const dx = nextPos.x - prevStep.x;
        const dy = nextPos.y - prevStep.y;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1 || (dx !== 0 && dy !== 0)) {
          const expanded = expandToManhattanPath(prevStep, nextPos).slice(1);
          futuros.push(...expanded);
        } else {
          futuros.push(nextPos);
        }

        prevStep = nextPos;

        if (checkReset(fut.estado, fut.posicion)) {
          break;
        }
      }
      nuevas[codigo] = [posicion, ...futuros];
    });

    setRutasPendientesPorCamion(nuevas);
  }, [minutoActualIdx, historial, almacenPos, minutoActualData]);

  type PedidoConTiempo = Pedido & { minutoDesaparicion: string };

  useEffect(() => {
    if (!minutoActualData || !('minuto' in minutoActualData)) return;

    const pedidosActuales = minutoActualData.pedidosUbicacion ?? [];

    setPedidosNoEntregados((prev) => {
      const nuevos: Record<string, Pedido> = {};
      
      // Mantener los pedidos que aún no se han entregado
      Object.entries(prev).forEach(([id, pedido]) => {
        if (pedidosActuales.some(p => p.idPedido === id)) {
          nuevos[id] = pedido;
        }
      });

      // Agregar los pedidos actuales que no estaban antes
      pedidosActuales.forEach(p => {
        if (!nuevos[p.idPedido]) {
          nuevos[p.idPedido] = p;
        }
      });

      return nuevos;
    })

    const minutoActualTimestamp = new Date(minutoActualData.minuto).getTime();

    setPedidosEntregadosVisibles((prev) => {
      const actualesIds = new Set(pedidosActuales.map(p => p.idPedido));
      const nuevos: Record<string, PedidoConTiempo> = {};

      // Mantener los pedidos que aún no se eliminan por tiempo
      Object.entries(prev).forEach(([id, pedido]) => {
        const desaparicionTimestamp = new Date(pedido.minutoDesaparicion).getTime();
        const hanPasado30Min = minutoActualTimestamp - desaparicionTimestamp > 30 * 60 * 1000;

        if (!hanPasado30Min) {
          nuevos[id] = pedido;
        }
      });

      // Agregar los pedidos que desaparecieron en este minuto
      const prevIdx = Math.max(minutoActualIdx - 1, 0);
      const prevData = historial[prevIdx];
      if (prevData && 'minuto' in prevData) {
        const prevPedidos = prevData.pedidosUbicacion ?? [];
        const prevPedidosMap = new Map(prevPedidos.map(p => [p.idPedido, p]));

        prevPedidos.forEach(p => {
          if (!actualesIds.has(p.idPedido)) {
            nuevos[p.idPedido] = {
              ...p,
              minutoDesaparicion: minutoActualData.minuto,
            };
          }
        });
      }

      return nuevos;
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isPanning.current = true;
    startPoint.current = { x: e.clientX, y: e.clientY };
    startScroll.current = {
      left: containerRef.current.scrollLeft,
      top: containerRef.current.scrollTop,
    };
    containerRef.current.classList.add('dragging');
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopPanning);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isPanning.current || !containerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - startPoint.current.x;
    const dy = e.clientY - startPoint.current.y;
    containerRef.current.scrollLeft = startScroll.current.left - dx;
    containerRef.current.scrollTop = startScroll.current.top - dy;
  };

  const stopPanning = () => {
    isPanning.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', stopPanning);
    if (containerRef.current) {
      containerRef.current.classList.remove('dragging');
    }
  };

  return (
    <div className="app-container">
      <div
        className="grid-map-frame"
        ref={containerRef}
        onMouseDown={handleMouseDown}
      >
        <button
          className="help-button"
          onClick={() => setIsLegendOpen(true)}
          title="leyenda"
        >
        </button>
        <div
          style={{
            width: `${cellSize * gridSize.ancho * scale}px`,
            height: `${cellSize * gridSize.alto * scale}px`,
            position: 'relative',
          }}
        >
          <div
            className="grid-map-inner"
            style={{
              width: `${cellSize * gridSize.ancho}px`,
              height: `${cellSize * gridSize.alto}px`,
              position: 'relative',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
          <GridMap gridData={currentGrid} cellSize={cellSize} />

          {Object.entries(rutasPorCamion).map(([codigo, ruta]) => (
            <svg
              key={`ruta-${codigo}`}
              className="route-trail"
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
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          ))}

          {Object.entries(rutasPendientesPorCamion).map(([codigo, ruta]) => (
            <svg
              key={`ruta-futura-${codigo}`}
              className="route-future"
              width={cellSize * gridSize.ancho}
              height={cellSize * gridSize.alto}
            >
              {ruta.slice(1).map((pos, i) => {
                const prev = getPixelCoords(ruta[i]);
                const curr = getPixelCoords(pos);
                return (
                  <line
                    key={`${codigo}-futuro-${i}`}
                    x1={prev.x}
                    y1={prev.y}
                    x2={curr.x}
                    y2={curr.y}
                    stroke={getColorForTruck(codigo)}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                );
              })}
            </svg>
          ))}

          {pedidosConDatos.map((p) => (
            <PedidoMarker
              key={`pendiente-${p.idPedido}`}
              id={"P" + String(p.idPedido).padStart(5, '0')}
              x={p.posicion.x}
              y={p.posicion.y}
              cellSize={cellSize}
              gridSizeY={gridSize.alto}
              color="#ff0000"
              opacity={1.0}
              onClick={() =>
                setInfoBox({
                  x: p.posicion.x * cellSize + cellSize / 2,
                  y: (gridSize.alto - 1 - p.posicion.y) * cellSize + cellSize / 2,
                  visible: true,
                  contenido: {
                    id: "P" + String(p.idPedido).padStart(5, '0'),
                    tipo: 'pedido',
                    estado: p.estado,
                    ubicacion: `(${p.posicion.x}, ${p.posicion.y})`,
                    llegada: p.fechaLlegada,
                    cantidad: p.cantidad,
                  },
                })
              }
            />
          ))}

          {Object.values(pedidosEntregadosVisibles).map((p) => (
            <PedidoMarker
              key={`entregado-${p.idPedido}`}
              id={"P"+String(p.idPedido).padStart(5, '0')}
              x={p.posicion.x}
              y={p.posicion.y}
              cellSize={cellSize}
              gridSizeY={gridSize.alto}
              color="#999999"
              opacity={0.4}
            />
          ))}

          {currentFlota
            .filter((camion) => {
              // Ocultar si la posición del camión coincide con la del almacén central
              return !(almacenPos && camion.posicion.x === almacenPos.x && camion.posicion.y === almacenPos.y);
            })
            .map((camion) => (
              <div
                key={camion.codigo}
                onClick={() => setInfoBox({
                  x: camion.posicion.x * cellSize + cellSize / 2,
                  y: (gridSize.alto - 1 - camion.posicion.y) * cellSize + cellSize / 2,
                  visible: true,
                  contenido: {
                    id: camion.codigo,
                    tipo: 'camion',
                    color: getColorForTruck(camion.codigo),
                    estado: camion.estado,
                    pedido: '',
                    llegada: '',
                    capacidad: camion.cargaActual + "/" + camion.capacidadMaxima + " (" + Math.round(100.0 * (camion.cargaActual / camion.capacidadMaxima)) + "%)",
                  },
                })}
                style={{ position: 'absolute', left: 0, top: 0 }}
              >
                <TruckComponent
                  key={camion.codigo}
                  id={camion.codigo}
                  position={camion.posicion}
                  cellSize={cellSize}
                  color={getColorForTruck(camion.codigo)}
                  gridSizeY={gridSize.alto}
                  estado={camion.estado}
                />
              </div>
          ))}

          {infoBox && (
            <FloatingInfoBox
              x={infoBox.x}
              y={infoBox.y}
              visible={infoBox.visible}
              content={infoBox.contenido}
              containerWidth={containerRef.current?.offsetWidth ?? 800}
              containerHeight={containerRef.current?.offsetHeight ?? 600}
              onClose={() => setInfoBox(prev => ({ ...prev, visible: false }))}
            />
          )}
        </div>

        <ModalResumenEjecucion isOpen={isModalOpen} onClose={handleCloseModal}>
          <>
            <p>Simulación finalizada</p>
            {consumoFinal !== null && (
              <div style={{ marginTop: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <p>Consumo Total: {consumoFinal.toFixed(3)} galones</p>
                {minutoColapso && (
                  <p>Minuto de colapso: {minutoColapso}</p>
                )}
              </div>
            )}
          </>
        </ModalResumenEjecucion>

        {isLegendOpen && <LegendFloatingBox onClose={() => setIsLegendOpen(false)} />}
        <div className="zoom-controls">
          <button className="zoom-button" onClick={() => setUserScale(s => Math.min(s + 0.1, 3))}>+</button>
          <span className="zoom-label">{Math.round(userScale * autoScale * 100)}%</span>
          <button className="zoom-button" onClick={() => setUserScale(s => Math.max(0.5, s - 0.1))}>-</button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SimulationMap;
