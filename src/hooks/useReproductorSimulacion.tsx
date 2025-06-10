import { useEffect, useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface EstadoMinuto {
  minuto: string;
  camiones: { codigo: string; posicion: Position; estado: string }[];
  pedidosUbicacion: { idPedido: string; posicion: Position }[];
}

interface FlotaActual {
  codigo: string;
  route: Position[];
}

interface PedidoActual {
  id: string;
  ubicacion: Position;
}

interface UseReproductorSimulacionParams {
  historial: EstadoMinuto[];
  isRunning: boolean;
  velocidadMs: number;
  onUpdate: (flota: FlotaActual[], pedidos: PedidoActual[]) => void;
}

export function useReproductorSimulacion({
  historial,
  isRunning,
  velocidadMs,
  onUpdate
}: UseReproductorSimulacionParams) {
  const [indiceActual, setIndiceActual] = useState(0);
  const intervaloRef = useRef<NodeJS.Timeout | null>(null);
  const historialRef = useRef<EstadoMinuto[]>([]);

  // Siempre mantener actualizado el historial
  useEffect(() => {
    historialRef.current = historial;
  }, [historial]);

  useEffect(() => {
    if (!isRunning || historialRef.current.length === 0) {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
      intervaloRef.current = null;
      return;
    }

    setIndiceActual(0); // al iniciar, siempre reinicia

    intervaloRef.current = setInterval(() => {
      setIndiceActual((prev) => {
        const next = prev + 1;
        const estado = historialRef.current[next];
        if (!estado) {
          clearInterval(intervaloRef.current!);
          return prev;
        }

        const flota: FlotaActual[] = estado.camiones.map((c) => ({
          codigo: c.codigo,
          route: [c.posicion]
        }));

        const pedidos: PedidoActual[] = estado.pedidosUbicacion.map((p) => ({
          id: p.idPedido,
          ubicacion: p.posicion
        }));

        onUpdate(flota, pedidos);
        return next;
      });
    }, velocidadMs);

    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [isRunning, velocidadMs, onUpdate]);
}
