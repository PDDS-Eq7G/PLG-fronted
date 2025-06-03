// src/components/ControlDeMando/ControlDeMandoCargaArchivos.tsx
import React from 'react';
import CargarPedidos from '../CargarPedidos/CargarPedidos';
import CargarAverias from '../CargarAverias/CargarAverias';
import './ControlDeMando.css';

const ControlDeMandoDiaADia: React.FC = () => {
  return (
    <div className="control-de-mando-panel">
      <div className="panel-header">Control de Mando</div>
      <div className="panel-section file-upload-buttons-container">
        <CargarPedidos />
        <CargarAverias />
      </div>
    </div>
  );
};

export default ControlDeMandoDiaADia;