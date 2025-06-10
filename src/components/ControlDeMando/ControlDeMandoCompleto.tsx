// src/components/ControlDeMando/ControlDeMandoCompleto.tsx

import React, { useEffect, useMemo, useState } from 'react';
import FechaInicioDateTimePicker from './FechaInicioDateTimePicker';
import ReproduccionSimulacionControls from './ReproduccionSimulacionControls';
import CargarPedidos from '../CargarPedidos/CargarPedidos';
import CargarAverias from '../CargarAverias/CargarAverias';
import CancelarSimulacionButton from './CancelarSimulacionButton';
import { useSimulacion } from '../../context/SimulacionContext';
import './ControlDeMando.css';
import { useSimuladorPlanificacion } from '../../hooks/useSimuladorPlanificacion';
import ModalResumenEjecucion from '../ModalResumenEjecucion/ModalResumenEjecucion';

const ControlDeMandoCompleto: React.FC = () => {
  const {
    velocidad,
    setVelocidad,
    velocidadReal,
    setVelocidadReal,
    minSpeed,
    maxSpeed,
    isSimulando,
    setIsSimulando,
    historial,
    minutoActualIdx,
    setMinutoActualIdx,
    setHistorial,
    fechaInicio,
    setFechaInicio,
    maxIteraciones,
    resetSimulationState
  } = useSimulacion();

  //const [fechaInicio, setFechaInicio] = React.useState<Date | null>(new Date());
  //const [consumoFinal, setConsumoFinal] = useState<number | null>(null);
  //const maxIteraciones = tipoSimulacion === "SEMANAL" ? Number(169) : undefined;
  //const { reiniciar } = useSimuladorPlanificacion(fechaInicio, maxIteraciones);

  const tiempoSimulado = useMemo(() => {
    const itemActual = historial[minutoActualIdx];
    if (itemActual && 'minuto' in itemActual) {
      // El formato en el JSON es "2025-01-01T00:00"
      return itemActual.minuto.replace('T', ' ');
    }
    return 'Simulación no iniciada';
  }, [minutoActualIdx, historial]);

  // Efecto para controlar la visualización de los minutos
  /*useEffect(() => {
    if (velocidad === 0 || !isSimulando) {
      return;
    }

    const interval = setInterval(() => {
      // Comprobamos si el índice actual ya es el último del historial
      if (minutoActualIdx >= historial.length - 1) {
        // Si hemos llegado al final:
        reiniciar();
        setIsSimulando(false);
        setVelocidad(0);
        setHistorial([]);
        setMinutoActualIdx(-1);
        clearInterval(interval); // Importante: Limpiamos el intervalo.

        const ultimoElemento = historial[historial.length - 1];
        if (ultimoElemento && 'consumoTotal' in ultimoElemento) {
          setConsumoFinal(ultimoElemento.consumoTotal);
        }
      } else {
        setMinutoActualIdx((prevIdx: number) => {
          if (prevIdx < historial.length - 1) {
            return prevIdx + 1;
          }
          return prevIdx;
        });
      }
    }, velocidad);

    return () => clearInterval(interval);
  }, [velocidad, isSimulando, historial, setMinutoActualIdx]);*/

  const clampSpeed = (speed: number) => Math.min(maxSpeed, Math.max(minSpeed, speed));

  const handleSetSpeed = (speed: number) => {
    if (speed !== 0) {
      const nuevaVelocidad = clampSpeed(speed);
      setVelocidadReal(nuevaVelocidad);
      setVelocidad(nuevaVelocidad);
      setIsSimulando(true);
    } else if (speed === 0) {
      setVelocidad(0);
      setIsSimulando(false);
    }
  };

  const handleCancelSimulation = () => {
    resetSimulationState();
    /*reiniciar();
    setIsSimulando(false);
    setVelocidad(0);
    setVelocidadReal(1000);
    setHistorial([]);
    setMinutoActualIdx(-1);*/
    console.log('Simulación cancelada');
    //setConsumoFinal(null);
  };

  return (
    <div className="control-de-mando-panel">
      <div className="panel-header">Control de Mando</div>
      <div className="panel-section">
        <FechaInicioDateTimePicker selectedDateTime={fechaInicio} onChange={setFechaInicio} disabled={isSimulando} />
      </div>
      <div className="panel-section">
        <ReproduccionSimulacionControls
          currentSpeed={velocidad}
          onSetSpeed={handleSetSpeed}
          minSpeed={minSpeed}
          maxSpeed={maxSpeed}
          lastRealSpeed={velocidadReal}
        />
      </div>
      <div className="panel-section file-upload-buttons-container">
        <CargarPedidos />
        <CargarAverias />
      </div>
      <div className="panel-section">
        <CancelarSimulacionButton onClick={handleCancelSimulation} />
      </div>
      <div className="panel-section">
        <strong>Fecha y hora (simulación): </strong> {tiempoSimulado}
      </div>
    </div>
  );
};

export default ControlDeMandoCompleto;