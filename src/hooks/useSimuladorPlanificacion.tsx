// src/hooks/useSimuladorPlanificacion.ts

import { useEffect, useRef, useState } from 'react';
import API_URL from '../config';
import { useSimulacion } from '../context/SimulacionContext';

export function useSimuladorPlanificacion(
  fechaInicio: Date | null,
  maxIteraciones: number | undefined,
) {
  const { isSimulando, setHistorial } = useSimulacion();
  const [nLlamada, setNLlamada] = useState(1);
  const nLlamadaRef = useRef(nLlamada);
  const currentFetchRef = useRef<AbortController | null>(null);
  const executionIdRef = useRef(0);

  useEffect(() => {
    nLlamadaRef.current = nLlamada;
  }, [nLlamada]);

  useEffect(() => {
    if (!isSimulando || !fechaInicio) {
      return;
    }

    const pad = (n: number) => String(n).padStart(2, '0');
    const fechaSinZona = (fecha: Date) =>
      `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(
        fecha.getHours()
      )}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}`;

    const hacerLlamada = () => {
      const isLastIteration = maxIteraciones !== undefined && nLlamadaRef.current === maxIteraciones;

      if (maxIteraciones !== undefined && nLlamadaRef.current > maxIteraciones) {
        console.log('Se alcanzó el máximo de iteraciones');
        return;
      }
      
      const currentExecution = executionIdRef.current;
      currentFetchRef.current?.abort();

      const controller = new AbortController();
      currentFetchRef.current = controller;

      const fechaInicioParam = fechaSinZona(fechaInicio);

      console.log(`Simulando iteración ${nLlamadaRef.current}`);
      fetch(
        `${API_URL}/api/planificador/semanal?fechaInicio=${encodeURIComponent(
          fechaInicioParam
        )}&nLlamada=${nLlamadaRef.current}`,
        {
          credentials: 'include',
          signal: controller.signal,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (executionIdRef.current !== currentExecution) return;

          if (data && typeof data === 'object' && 'colapso' in data) {
            console.log('Colapso detectado. Deteniendo simulación.');
            return;
          }

          /*if (data && Array.isArray(data)) {
            const dataFiltrada = data.filter((d) => d.minuto);
            setHistorial((prevHistorial: any[]) => [...prevHistorial, ...dataFiltrada]);
          }

          if (maxIteraciones !== undefined && nLlamadaRef.current === maxIteraciones && data && Array.isArray(data)) {
            const dataFiltrada = data.filter((d) => d.consumoTotal);
            setHistorial((prevHistorial: any[]) => [...prevHistorial, ...dataFiltrada]);
          }*/

          if (data && Array.isArray(data)) {
            // Filtrar datos de minuto por minuto
            const minuteData = data.filter((d) => 'minuto' in d);
            
            let dataToAdd = [...minuteData];

            // Si es la última iteración, agregar el consumo total
            if (isLastIteration) {
                const consumoTotalData = data.filter((d) => 'consumoTotal' in d);
                dataToAdd = [...dataToAdd, ...consumoTotalData];
            }
            
            setHistorial((prevHistorial: any[]) => [...prevHistorial, ...dataToAdd]);
          }

          setNLlamada((prev) => prev + 1);

          if (isSimulando) {
            hacerLlamada();
          }
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Error en la simulación:', error);
          }
        });
    };

    hacerLlamada();

    return () => {
      currentFetchRef.current?.abort();
    };
  }, [isSimulando, fechaInicio, maxIteraciones, setHistorial]);

  const reiniciar = () => {
    currentFetchRef.current?.abort();
    executionIdRef.current += 1;
    setNLlamada(1);
    // Ya no es necesario que reiniciar limpie el historial aquí, 
    // `handleCancelSimulation` en el componente se encarga de eso.
    fetch(`${API_URL}/api/planificador/reiniciar`, { credentials: 'include' })
      .then(() => console.log('Simulación reiniciada en backend'))
      .catch((err) => console.error('Error al reiniciar:', err));
  };

  return { reiniciar };
}