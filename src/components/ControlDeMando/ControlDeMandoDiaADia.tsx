// src/components/ControlDeMando/ControlDeMandoDiaADia.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSimulacion } from '../../context/SimulacionContext';
import './ControlDeMando.css';
import ReproduccionSimulacionControls from './ReproduccionSimulacionControls';
import ReproduccionSimulacionControlsDiaADia from './ReproduccionSimulacionControlsDiaADia';
import CancelarSimulacionButton from './CancelarSimulacionButton';
import NotificationPopup from '../NotificationPopup/NotificationPopup';

const ControlDeMandoDiaADia: React.FC = () => {
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
    resetSimulationState,
    tipoSimulacion,
    fechaSimulacionVisible,
  } = useSimulacion();

  const handleSetSpeed = (speed: number) => {
    if (speed !== 0) {
      const nuevaVelocidad = 60000;
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
        {!isSimulando ? (
          <ReproduccionSimulacionControlsDiaADia
            currentSpeed={velocidad}
            onSetSpeed={handleSetSpeed}
            lastRealSpeed={velocidadReal}
          />
        ) : (
          <CancelarSimulacionButton onClick={handleCancelSimulation} label='Borrar visualización'/>
        )}
      </div>
      <div className="panel-section">
        <strong>Fecha y hora actual: </strong> {fechaSimulacionVisible}
      </div>
    </div>
  );
};

export default ControlDeMandoDiaADia;