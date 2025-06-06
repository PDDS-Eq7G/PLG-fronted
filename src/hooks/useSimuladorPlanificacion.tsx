import { useEffect, useRef, useState } from 'react';

export function useSimuladorPlanificacion(
  fechaInicio: Date | null,
  isRunning: boolean,
  onNewData: (dataChunk: any[]) => void // callback para pasar datos al componente
) {
  const [nLlamada, setNLlamada] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const nLlamadaRef = useRef(nLlamada);

  useEffect(() => {
    nLlamadaRef.current = nLlamada;
  }, [nLlamada]);

  useEffect(() => {
    if (!isRunning || !fechaInicio) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const hacerLlamada = () => {
      const fechaIso = fechaInicio.toISOString().split('T')[0];
      console.log(`Simulando iteración ${nLlamadaRef.current}`);
      fetch(`/api/planificador/semanal?fechaInicio=${fechaIso}&nLlamada=${nLlamadaRef.current}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Respuesta del backend:', data);
          if (Array.isArray(data)) {
            // Pasar solo los objetos con minuto, ignorar final con duración y consumo
            const dataFiltrada = data.filter((d) => d.minuto);
            onNewData(dataFiltrada);
          }
        })
        .catch((error) => console.error('Error en la simulación:', error));

      setNLlamada((prev) => prev + 1);
    };

    hacerLlamada();

    intervalRef.current = setInterval(hacerLlamada, 60_000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, fechaInicio]);

  const reiniciar = () => {
    setNLlamada(1);
    fetch('/api/planificador/reiniciar')
      .then(() => console.log('Simulación reiniciada'))
      .catch((err) => console.error('Error al reiniciar:', err));
  };

  return { reiniciar };
}
