// src/components/ControlDeMando/ControlDeMandoCompleto.tsx
import React, { useState, useEffect } from 'react';
import FechaInicioDateTimePicker from './FechaInicioDateTimePicker';
import ReproduccionSimulacionControls, { SIMULATION_SPEEDS } from './ReproduccionSimulacionControls';
import CargarPedidos from '../CargarPedidos/CargarPedidos';
import CargarAverias from '../CargarAverias/CargarAverias';
import CancelarSimulacionButton from './CancelarSimulacionButton';
import './ControlDeMando.css';

// ✅ Props opcionales
interface Props {
  simulationSpeed?: number;
  setSimulationSpeed?: (speed: number) => void;
}

const ControlDeMandoCompleto: React.FC<Props> = ({ simulationSpeed, setSimulationSpeed }) => {
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());
  const [internalSpeed, setInternalSpeed] = useState<number>(SIMULATION_SPEEDS.PAUSED);

  // ✅ Sync si viene velocidad externa
  const currentSpeed = simulationSpeed !== undefined ? simulationSpeed : internalSpeed;
  const updateSpeed = (speed: number) => {
    if (setSimulationSpeed) {
      setSimulationSpeed(speed); 
    } else {
      setInternalSpeed(speed);
    }
  };

  const handleCancelSimulation = () => {
    console.log("Simulación cancelada");
    updateSpeed(SIMULATION_SPEEDS.PAUSED);
  };

  return (
    <div className="control-de-mando-panel">
      <div className="panel-header">Control de Mando</div>

      <div className="panel-section">
        <FechaInicioDateTimePicker
          selectedDateTime={fechaInicio}
          onChange={setFechaInicio}
        />
      </div>

      <div className="panel-section">
        <ReproduccionSimulacionControls
          currentSpeed={currentSpeed}
          onSetSpeed={updateSpeed}
        />
      </div>

      <div className="panel-section file-upload-buttons-container">
        <CargarPedidos />
        <CargarAverias />
      </div>

      <div className="panel-section">
        <CancelarSimulacionButton onClick={handleCancelSimulation} />
      </div>
    </div>
  );
};

export default ControlDeMandoCompleto;
