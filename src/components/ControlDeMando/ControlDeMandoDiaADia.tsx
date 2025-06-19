// src/components/ControlDeMando/ControlDeMandoDiaADia.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import CargarPedidos from '../CargarPedidos/CargarPedidos';
import CargarAverias from '../CargarAverias/CargarAverias';
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
  } = useSimulacion();

  const ultimoTickRealRef = useRef(Date.now());
  const [fechaVisible, setFechaVisible] = useState<string>('Cargando...');

  useEffect(() => {
    const item = historial[minutoActualIdx];
    if (!item || !('minuto' in item)) return;

    const raw = item.minuto;
    const baseDate = new Date(raw.replace(' ', 'T') + ':00');
    if (isNaN(baseDate.getTime())) return;

    // En lugar de marcar cuándo *llegó* el dato, calculamos cuánto ha pasado desde la hora simulada
    const segundosPasados = Math.floor((Date.now() - baseDate.getTime()) / 1000);
    ultimoTickRealRef.current = Date.now() - segundosPasados * 1000; // Corrige la referencia hacia el pasado
  }, [minutoActualIdx]);

  useEffect(() => {
    const interval = setInterval(() => {
      const item = historial[minutoActualIdx];
      if (!item || !('minuto' in item)) return;

      const raw = item.minuto;
      const baseDate = new Date(raw.replace(' ', 'T') + ':00');

      if (isNaN(baseDate.getTime())) {
        setFechaVisible('Hora inválida');
        return;
      }

      const segundosTranscurridos = Math.floor((Date.now() - ultimoTickRealRef.current) / 1000);
      const fechaMostrada = new Date(baseDate.getTime() + segundosTranscurridos * 1000);

      setFechaVisible(
        fechaMostrada.toLocaleString("es-PE", {
          hour12: false,
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: '2-digit',
        }).replace(',', ''),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [minutoActualIdx, historial]);

  

  /*const tiempoSimulado = useMemo(() => {
    const itemActual = historial[minutoActualIdx];
    if (itemActual && 'minuto' in itemActual) {
      // El formato en el JSON es "2025-01-01T00:00"
      return itemActual.minuto.replace('T', ' ');
    }
    return 'Simulación no iniciada';
  }, [minutoActualIdx, historial]);*/

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
    window.location.reload();
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
      <div className="panel-section file-upload-buttons-container">
        <CargarPedidos />
        {tipoSimulacion === 'SEMANAL' && 
          <CargarAverias />}
      </div>
      <div className="panel-section">
        <strong>Fecha y hora actual: </strong> {fechaVisible}
      </div>
    </div>
  );
};

export default ControlDeMandoDiaADia;