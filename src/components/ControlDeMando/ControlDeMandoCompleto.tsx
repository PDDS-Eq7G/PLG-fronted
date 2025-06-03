// src/components/ControlDeMando/ControlDeMandoCompleto.tsx
import React, { useState } from 'react';
import FechaInicioDateTimePicker from './FechaInicioDateTimePicker';
import ReproduccionSimulacionControls, { SIMULATION_SPEEDS } from './ReproduccionSimulacionControls';
import CargarPedidos from '../CargarPedidos/CargarPedidos';
import CargarAverias from '../CargarAverias/CargarAverias';
import CancelarSimulacionButton from './CancelarSimulacionButton';
import './ControlDeMando.css';

const ControlDeMandoCompleto: React.FC = () => {
  // Estados de ejemplo para los componentes hijos
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date()); // Fecha actual por defecto
  const [currentSpeed, setCurrentSpeed] = useState<number>(SIMULATION_SPEEDS.PAUSED);

  const handleCancelSimulation = () => {
    console.log("Simulación cancelada");
    // Lógica para cancelar la simulación
  };

  // Aquí es donde conectarías con tu lógica global de estado de simulación o un contexto
  const handleSetSpeed = (speed: number) => {
    console.log("Nueva velocidad de simulación:", speed);
    setCurrentSpeed(speed);
    // Ejemplo: updateGlobalSimulationSpeed(speed);
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
          onSetSpeed={handleSetSpeed}
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