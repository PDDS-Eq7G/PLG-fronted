// src/context/SimulacionContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import API_URL from '../config';
import { v4 as uuidv4 } from 'uuid';

// Define el tipo para los datos de un minuto del historial
export interface HistorialMinuto {
  minuto: string;
  nodosBloqueados: { posicion: {x: number; y: number}; }[];
  pedidos: {
    cantidadPorEntregar: number;
    cantidadTotal: number;
    asignacion: Record<string, AsignacionDetalle>;
    cantidadPorAsignar: number;
    estado: string;
    fechaLlegada: string;
    fechaLimite: string;
    idPedido: string;
  }[];
  camiones: {
    posicion: { x: number; y: number };
    codigo: string;
    estado: string;
    cargaActual: number;
    capacidadMaxima: number;
  }[];
  pedidosUbicacion: {
    posicion: { x: number; y: number };
    idPedido: string;
  }[];
}

export interface AsignacionDetalle {
  cantidadAsignada: number;
  tiempoEntregaEstimado: number;
}

export interface HistorialConsumoFinal {
  duracionEjecucion: number;
  consumoTotal: number;
}

export interface HistorialColapso {
  colapso: string;
}

// Union type for the historial array
export type HistorialItem = HistorialMinuto | HistorialConsumoFinal | HistorialColapso;

interface SimulacionContextType {
  velocidad: number;
  setVelocidad: React.Dispatch<React.SetStateAction<number>>;
  velocidadReal: number;
  setVelocidadReal: React.Dispatch<React.SetStateAction<number>>;
  minSpeed: number;
  maxSpeed: number;
  historial: HistorialItem[]; // Corrected type for historial
  setHistorial: React.Dispatch<React.SetStateAction<HistorialItem[]>>; // Corrected type for setHistorial
  minutoActualIdx: number;
  setMinutoActualIdx: React.Dispatch<React.SetStateAction<number>>;
  isSimulando: boolean;
  setIsSimulando: React.Dispatch<React.SetStateAction<boolean>>;
  finSimulacion: boolean; // NEW: Flag to signal end of simulation
  setFinSimulacion: React.Dispatch<React.SetStateAction<boolean>>; // NEW: Setter for finSimulacion
  fechaInicio: Date | null;
  setFechaInicio: React.Dispatch<React.SetStateAction<Date | null>>;
  maxIteraciones: number | undefined;
  nLlamada: number;
  setNLlamada: React.Dispatch<React.SetStateAction<number>>;
  resetSimulationState: () => void;
  tipoSimulacion: String;
  simulacionBackendFinalizada: boolean;
  setSimulacionBackendFinalizada: React.Dispatch<React.SetStateAction<boolean>>;
}

const SimulacionContext = createContext<SimulacionContextType | undefined>(undefined);

export const SimulacionProvider: React.FC<{ children: ReactNode, tipoSimulacion: String }> = ({ children, tipoSimulacion }) => {
  const [velocidad, setVelocidad] = useState(0);
  const velocidadRealInicial = tipoSimulacion === "DIA_A_DIA" ? 60000 : 1000; // Real-time speed for daily simulation, 1000 for weekly or collapse (1 minute per second)
  const [velocidadReal, setVelocidadReal] = useState(velocidadRealInicial);
  const [isSimulando, setIsSimulando] = useState(false);
  const [historial, setHistorial] = useState<HistorialItem[]>([]); // Initialize with correct union type
  const [minutoActualIdx, setMinutoActualIdx] = useState(-1);
  const [finSimulacion, setFinSimulacion] = useState(false); // Initialize new state
  const now = new Date();
  now.setSeconds(0);
  now.setMilliseconds(0);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(now); // Set to current time rounded to the nearest minute
  const maxIteraciones = tipoSimulacion === "SEMANAL" ? Number(673) : undefined;
  const [simulacionBackendFinalizada, setSimulacionBackendFinalizada] = useState(false);
  const simulacionIdRef = useRef<string>(uuidv4());

  const [nLlamada, setNLlamada] = useState(1);
  const nLlamadaRef = useRef(nLlamada); // Para usar el valor más reciente en el closure
  const currentFetchControllerRef = useRef<AbortController | null>(null); // Para abortar peticiones
  const executionIdRef = useRef(0); // Para manejar reinicios de simulación

  const minSpeed = tipoSimulacion !== "COLAPSO" ? 100 : 500; // ms (Faster speed)
  const maxSpeed = 2000; // ms (Slower speed)

  const velocidadRealRef = useRef(velocidadReal);

  useEffect(() => {
    velocidadRealRef.current = velocidadReal;
  }, [velocidadReal]);

  /*useEffect(() => {
    if (!isSimulando && tipoSimulacion === 'DIA_A_DIA' && historial.length === 0) {
      const fechaActual = new Date()
      fechaActual.setSeconds(0, 0); // Ajustar a minuto exacto
      setFechaInicio(fechaActual);
      setVelocidad(1000); // comenzar con velocidad rápida
      setIsSimulando(true);

      setTimeout(() => {
        setVelocidad(velocidadReal); // cambiar después de iniciar
      }, 2000);
    }
  }, [isSimulando, tipoSimulacion, historial]);*/


  useEffect(() => {
    nLlamadaRef.current = nLlamada;
  }, [nLlamada]);

  useEffect(() => {
    // En cuanto haya al menos un minuto y aún no estamos mostrando ninguno…
    if (historial.length > 0 && minutoActualIdx === -1) {
      setMinutoActualIdx(0);   // ⚡ muestra el primer minuto al instante
    }
  }, [historial, minutoActualIdx]);

  // NUEVO EFFECT para iniciar y mantener la simulación de backend
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    // La simulación de backend solo se inicia si isSimulando es true y fechaInicio existe
    if (!isSimulando || !fechaInicio) {
        // Si la simulación se detiene o no hay fecha de inicio, aseguramos que cualquier llamada pendiente se aborte
        currentFetchControllerRef.current?.abort();
        currentFetchControllerRef.current = null;
        return; // No hacer nada si no se está simulando
    }

    const pad = (n: number) => String(n).padStart(2, '0');
    const fechaSinZona = (fecha: Date) =>
      `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(
        fecha.getHours()
      )}:${pad(fecha.getMinutes())}:00`;

    const hacerLlamadaAPI = async (currentExecution: number) => {
      // Abortar cualquier petición anterior para esta "ejecución"
      currentFetchControllerRef.current?.abort();

      const controller = new AbortController();
      currentFetchControllerRef.current = controller;

      const isLastIteration = maxIteraciones !== undefined && nLlamadaRef.current === maxIteraciones;

      if (maxIteraciones !== undefined && nLlamadaRef.current > maxIteraciones) {
        console.log('Simulación: Se alcanzó el máximo de iteraciones');
        setSimulacionBackendFinalizada(true); // Marcar como finalizada
        return;
      }

      const fechaInicioParam = fechaSinZona(fechaInicio);

      //console.log(`Simulación: Llamando a iteración ${nLlamadaRef.current}`);
      //console.log(`Velocidad: ${velocidad} ms`);
      //console.log(`Fecha de inicio: ${fechaInicioParam}`);
      //console.log(`Estado de simulación: ${isSimulando}`);
      try {
        const endpoint =
          tipoSimulacion === 'COLAPSO'
            ? `${API_URL}/planificador/colapso`
            : tipoSimulacion === 'SEMANAL' 
              ? `${API_URL}/planificador/semanal`
              : `${API_URL}/planificador/dia-a-dia`;

        const res = await fetch(
          `${endpoint}?simulacionId=${simulacionIdRef.current}&fechaInicio=${encodeURIComponent(fechaInicioParam)}&nLlamada=${nLlamadaRef.current}`,
          {
            credentials: 'include',
            signal: controller.signal,
          }
        );

        // Si se abortó durante la espera, no procesar la respuesta
        if (controller.signal.aborted || executionIdRef.current !== currentExecution) {
            console.log('Simulación: Petición abortada o ejecución cambiada. No procesando respuesta.');
            return;
        }

        const data = await res.json();

        console.log('Respuesta del backend:', data);

        if (data && Array.isArray(data)) {
          console.log(`Simulación: Recibidos ${data.length} elementos de datos.`);
          if (data.some(d => 'colapso' in d)) {
            console.log('Simulación: Colapso detectado.');
            const colapsoData = data.filter((d) => 'colapso' in d);
            setHistorial((prevHistorial: HistorialItem[]) => [...prevHistorial, ...colapsoData]);
            const consumoTotalData = data.filter((d) => 'consumoTotal' in d);
            setHistorial((prevHistorial: HistorialItem[]) => [...prevHistorial, ...consumoTotalData]);
            setSimulacionBackendFinalizada(true); // Marcar como finalizada
            return;
          } else {
            const minuteData = data.filter((d) => 'minuto' in d);
            let dataToAdd = [...minuteData];

            console.log(`Simulación: Añadiendo ${dataToAdd.length} elementos al historial.`);
            console.log(`${isLastIteration ? 'Última' : 'No última'} iteración: ${nLlamadaRef.current}`);

            if (isLastIteration) {
              const consumoTotalData = data.filter((d) => 'consumoTotal' in d);
              dataToAdd = [...dataToAdd, ...consumoTotalData];
              // Aquí, si se añade consumoTotal, significa que la simulación ha terminado
              setSimulacionBackendFinalizada(true); // Marcar como finalizada
            }

            setHistorial((prevHistorial: HistorialItem[]) => [...prevHistorial, ...dataToAdd]);
            /*setHistorial((prevHistorial: HistorialItem[]) => {
              const nuevoHistorial = [...prevHistorial, ...dataToAdd];
              console.log(`Simulación: Historial actualizado, ahora tiene ${nuevoHistorial.length} elementos.`);
              return nuevoHistorial;
            });*/
          }
        }

        setNLlamada((prev) => prev + 1);

        // Si la simulación aún debe continuar, programar la próxima llamada
        if (isSimulando && !controller.signal.aborted) { // isSimulando debe seguir siendo true aquí
          // Si data es [{ duracionEjecucion: 0, ... }], lanzar al instante
          const esRespuestaInstantanea =
            Array.isArray(data) &&
            data.length === 1 &&
            'duracionEjecucion' in data[0] &&
            data[0].duracionEjecucion === 0;
          
            //const delay = esRespuestaInstantanea ? 100 : 15000; // 100ms si rápida, 15s si no
            let delay;
            if (tipoSimulacion === 'DIA_A_DIA') {
              const ahora = new Date();
              const segundosRestantes = 60 - ahora.getSeconds();
              const milisRestantes = segundosRestantes * 1000 - ahora.getMilliseconds();
              delay = esRespuestaInstantanea ? 100 : milisRestantes;
            } else {
              delay = esRespuestaInstantanea ? 100 : 15 * velocidadRealRef.current;
            }
            console.log(`Delay: ${delay}`);
            timeoutId = setTimeout(() => hacerLlamadaAPI(currentExecution), delay);
        }

      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Simulación: Petición de iteración abortada (por reinicio o detención).');
        } else {
          console.error('Simulación: Error en la simulación:', error);
          setIsSimulando(false); // Detener la simulación en caso de error
          setVelocidad(0);
        }
      }
    };

    // Iniciar la primera llamada para esta "ejecución"
    const currentExecution = executionIdRef.current;
    hacerLlamadaAPI(currentExecution);

    // Función de limpieza para este useEffect
    return () => {
        if (timeoutId) clearTimeout(timeoutId);
        currentFetchControllerRef.current?.abort(); // Abortar cualquier fetch pendiente al desmontar/re-ejecutar el efecto
        currentFetchControllerRef.current = null;
    };
  }, [isSimulando, fechaInicio, maxIteraciones, setHistorial, setNLlamada, setIsSimulando, setVelocidad]); // Dependencias

  // NEW: Effect to control the simulation clock (advancing minutoActualIdx)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout | undefined;
    //console.log(`Efecto de reloj de simulación: isSimulando=${isSimulando}, velocidad=${velocidad}, finSimulacion=${finSimulacion}, historial.length=${historial.length}`);
    // The clock runs if simulation is active, not finished *from backend*, and there's history data to display
    if (isSimulando && !finSimulacion && historial.length > 0) {
      const ahora = new Date();
      const msHastaProximoMinuto = 60000 - (ahora.getSeconds() * 1000 + ahora.getMilliseconds());
      //console.log(`Iniciando intervalo de simulación con velocidad: ${velocidad} ms`);
      //console.log(`Esperando ${msHastaProximoMinuto}ms para sincronizar con el siguiente minuto.`);
      if (tipoSimulacion === 'DIA_A_DIA') {
        timeout = setTimeout(() => {
          setMinutoActualIdx(prev => Math.min(prev + 1, historial.length - 1)); // Avanza una vez al empezar

          interval = setInterval(() => {
            setMinutoActualIdx(prev => {
              const next = prev + 1;
              return next >= historial.length ? prev : next; // Avanza un minuto, pero no sobrepasa el límite
            });
          }, velocidad); // velocidad = 60000 para un minuto
        }, msHastaProximoMinuto);

        return () => {
          clearTimeout(timeout);
          clearInterval(interval);
        };
      } else {
        interval = setInterval(() => {
          setMinutoActualIdx((prevIdx: number) => {
            // Si ya estamos en el último minuto disponible,
            // simplemente quédate ahí hasta que el historial crezca.
            //console.log(`Avanzando minuto actual: ${prevIdx} de ${historial.length - 1}`);
            if (prevIdx >= historial.length - 1) {
              return prevIdx;
            }
            return prevIdx + 1;       // Avanza un minuto
          });
          
          /*setMinutoActualIdx((prevIdx: number) => {
            // If we are at or past the last available minute data, stop advancing the display.
            if (prevIdx >= historial.length - 1) {
              // STOP visual playback by pausing `isSimulando` and resetting `velocidad`.
              // DO NOT perform a full reset of historial, minutoActualIdx, etc. here.
              setIsSimulando(false); // Pause visual progression
              setVelocidad(0);       // Set speed to 0 (paused)
              if (interval) clearInterval(interval); // Clear interval to prevent further calls
              return prevIdx; // Stay at the last index
            }*/
            //return prevIdx + 1; // Advance to the next minute
          //});
        }, velocidad);

        return () => {
          if (interval) {
            clearInterval(interval);
          }
        };
      }
    }
  }, [isSimulando, velocidad, historial.length, finSimulacion]); // Depend on relevant state changes

  // Optional: Add a comprehensive reset function to the context
  // This can be called from any consumer (e.g., ControlDeMandoCompleto, SimulationMap)
  const resetSimulationState = useCallback(() => {
    currentFetchControllerRef.current?.abort(); // Abortar cualquier petición en curso
    currentFetchControllerRef.current = null;
    executionIdRef.current += 1; // Incrementar para invalidar peticiones antiguas
    
    setIsSimulando(false);
    setHistorial([]);
    setMinutoActualIdx(-1);
    setVelocidad(0); // Reset to paused default
    setVelocidadReal(1000); // Reset to default playback speed
    setNLlamada(1); // Reiniciar nLlamada
    setFinSimulacion(false); // Crucial for new simulations
    setFechaInicio(new Date());
    setSimulacionBackendFinalizada(false);

    fetch(`${API_URL}/planificador/reiniciar?simulacionId=${simulacionIdRef.current}`, { credentials: 'include' })
      .then(() => console.log('Simulación reiniciada en backend'))
      .catch((err) => console.error('Error al reiniciar backend:', err));
  }, []);

  return (
    <SimulacionContext.Provider
      value={{
        velocidad,
        setVelocidad,
        velocidadReal,
        setVelocidadReal,
        minSpeed,
        maxSpeed,
        historial,
        setHistorial, // Now correctly typed
        minutoActualIdx,
        setMinutoActualIdx,
        isSimulando,
        setIsSimulando,
        finSimulacion, // Provide the new state
        setFinSimulacion, // Provide the new setter
        fechaInicio,
        setFechaInicio,
        maxIteraciones,
        nLlamada,
        setNLlamada,
        resetSimulationState,
        tipoSimulacion,
        simulacionBackendFinalizada,
        setSimulacionBackendFinalizada,
      }}
    >
      {children}
    </SimulacionContext.Provider>
  );
};

export const useSimulacion = () => {
  const context = useContext(SimulacionContext);
  if (!context) {
    throw new Error('useSimulacion debe ser usado dentro de un SimulacionProvider');
  }
  return context;
};