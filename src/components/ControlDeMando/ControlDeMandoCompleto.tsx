import React from 'react';
import FechaInicioDateTimePicker from './FechaInicioDateTimePicker';
import ReproduccionSimulacionControls from './ReproduccionSimulacionControls';
import CargarPedidos from '../CargarPedidos/CargarPedidos';
import CargarAverias from '../CargarAverias/CargarAverias';
import CancelarSimulacionButton from './CancelarSimulacionButton';
import { useSimulacion } from '../../context/SimulacionContext';
import './ControlDeMando.css';
import { useSimuladorPlanificacion } from '../../hooks/useSimuladorPlanificacion';

const ControlDeMandoCompleto: React.FC = () => {
  const { velocidad, setVelocidad, velocidadReal, setVelocidadReal, minSpeed, maxSpeed } = useSimulacion();
  const [fechaInicio, setFechaInicio] = React.useState<Date | null>(new Date());
  const [isSimulando, setIsSimulando] = React.useState(false);
  const [simData, setSimData] = React.useState<any[]>([]);

  const onNewData = (dataChunk: any[]) => {
    setSimData((prev) => [...prev, ...dataChunk]);
  };

  const { reiniciar } = useSimuladorPlanificacion(fechaInicio, isSimulando, onNewData);

  const clampSpeed = (speed: number) => Math.min(maxSpeed, Math.max(minSpeed, speed));

  const handleSetSpeed = (speed: number) => {
    if (speed === 0) {
      setVelocidad(0);
      setIsSimulando(false);
    } else {
      const nuevaVelocidad = clampSpeed(speed);
      setVelocidadReal(nuevaVelocidad);
      setVelocidad(nuevaVelocidad);
      setIsSimulando(true); // <-- Aquí activa el planificador
      console.log(`Velocidad: ${velocidad}`);
    }
  };

  const handleCancelSimulation = () => {
    reiniciar();
    setIsSimulando(false);
    setVelocidad(0); // Opcional: pausar visualmente
    console.log('Simulación cancelada');
  };

  return (
    <div className="control-de-mando-panel">
      <div className="panel-header">Control de Mando</div>

      <div className="panel-section">
        <FechaInicioDateTimePicker selectedDateTime={fechaInicio} onChange={setFechaInicio} />
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
    </div>
  );
};

export default ControlDeMandoCompleto;
