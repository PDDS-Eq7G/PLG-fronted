// src/components/ControlDeMando/ControlDeMandoCompleto.tsx
import React from 'react';
import FechaInicioDateTimePicker from './FechaInicioDateTimePicker';
import ReproduccionSimulacionControls from './ReproduccionSimulacionControls';
import CargarPedidos from '../CargarPedidos/CargarPedidos';
import CargarAverias from '../CargarAverias/CargarAverias';
import CancelarSimulacionButton from './CancelarSimulacionButton';
import ListaFlotaYPedidos from '../ListaFlotaYPedidos/ListaFlotaYPedidos';
import './ControlDeMando.css';

import { useSimulacion } from '../../context/SimulacionContext';
import { SIMULATION_SPEEDS } from './ReproduccionSimulacionControls';

interface Props {
  fechaInicio: Date | null;
  setFechaInicio: (date: Date | null) => void;
}

const ControlDeMandoCompleto: React.FC<Props> = ({
  fechaInicio,
  setFechaInicio,
}) => {
  const { velocidad, setVelocidad } = useSimulacion();

  const handleSetSpeed = (speed: number) => {
    setVelocidad(speed);
  };

  const handleCancelSimulation = () => {
    console.log("Simulación cancelada");
    setVelocidad(SIMULATION_SPEEDS.PAUSED);
  };

  return (
    <div className="control-de-mando-panel">
      <div className="panel-header">Control de Mando</div>

      <div className="panel-section compact">
        <FechaInicioDateTimePicker
          selectedDateTime={fechaInicio}
          onChange={setFechaInicio}
        />
      </div>

      <div className="panel-section compact">
        <ReproduccionSimulacionControls
          currentSpeed={velocidad}
          onSetSpeed={handleSetSpeed}
        />
      </div>

      <div className="panel-section file-upload-buttons-container">
        <CargarPedidos />
        <CargarAverias />
      </div>

      <div className="panel-section compact">
        <CancelarSimulacionButton onClick={handleCancelSimulation} />
      </div>

      <div className="panel-section lista-flota">
        <ListaFlotaYPedidos />
      </div>
    </div>
  );
};

export default ControlDeMandoCompleto;
