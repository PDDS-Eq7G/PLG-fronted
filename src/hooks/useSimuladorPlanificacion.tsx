import { useEffect, useRef, useState } from 'react';
import API_URL from '../config'; 
export function useSimuladorPlanificacion(
  fechaInicio: Date | null,
  isRunning: boolean,
  onNewData: (historico: any[]) => void
) {
  const [nLlamada, setNLlamada] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wasRunning = useRef<boolean>(false);
  const historialRef = useRef<any[]>([]); // Acumula todos los pasos
  const llamadasRealizadas = useRef<Set<number>>(new Set());

  useEffect(() => {
    setNLlamada(1);
    historialRef.current = []; // Reinicia historial
  }, [fechaInicio]);

  useEffect(() => {
    if (isRunning && !wasRunning.current && fechaInicio) {
      fetchCall(1);
      wasRunning.current = true;

      intervalRef.current = setInterval(() => {
        setNLlamada((prev) => {
          const next = prev + 1;
          fetchCall(next);
          return next;
        });
      }, 60000); // Cada minuto real = una hora simulada
    }

    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      wasRunning.current = false;
    }

    

function fetchCall(n: number) {
  if (llamadasRealizadas.current.has(n)) return;
  llamadasRealizadas.current.add(n);

  const fechaIso = fechaInicio?.toISOString().split('T')[0] || '';

  fetch(`${API_URL}/api/planificador/semanal?fechaInicio=${fechaIso}&nLlamada=${n}`)
    .then(async (res) => {
      if (res.status === 304) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      return res.json();
    })
    .then((data) => {
      if (data && Array.isArray(data)) {
        const dataFiltrada = data.filter((d) => d.minuto);
        historialRef.current.push(...dataFiltrada);
        onNewData([...historialRef.current]);
      }
    })
    .catch((error) => console.error('Error en la simulación:', error));
}


    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      wasRunning.current = false;
    };
  }, [isRunning, fechaInicio, onNewData]);
}
