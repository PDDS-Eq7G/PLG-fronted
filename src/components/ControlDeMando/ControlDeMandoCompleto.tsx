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
    ultimoTiempoSimuladoValido,
    historial,
    minutoActualIdx,
    setMinutoActualIdx,
    setHistorial,
    fechaInicio,
    setFechaInicio,
    maxIteraciones,
    resetSimulationState,
    tipoSimulacion,
    tiempoTranscurrido,
  } = useSimulacion();

  const tiempoSimuladoDisplay = useMemo(() => {
    if (ultimoTiempoSimuladoValido) {
      // El formato en el JSON es "2025-01-01T00:00"
      return ultimoTiempoSimuladoValido.replace('T', ' ');
    }
    return 'Simulación no iniciada';
  }, [minutoActualIdx, historial]);

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
    console.log('Simulación cancelada');
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
        {tipoSimulacion === 'SEMANAL' && 
          <CargarAverias />}
      </div>
      <div className="panel-section">
        <CancelarSimulacionButton onClick={handleCancelSimulation} />
      </div>
      <div className="panel-section">
        <strong>Fecha y hora (simulación): </strong> {tiempoSimuladoDisplay}
      </div>
      <div className="panel-section">
        <strong>Tiempo transcurrido: </strong> {tiempoTranscurrido}
      </div>
    </div>
  );
};

export default ControlDeMandoCompleto;