// src/pages/SimulacionSemanal/SimulacionSemanal.tsx
import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import SimulationMap from '../../components/SimulationMap/SimulationMap';
import BarraLateral from '../../components/BarraLateral/BarraLateral';
import ControlDeMandoCompleto from '../../components/ControlDeMando/ControlDeMandoCompleto';
import { useSimulacion } from '../../context/SimulacionContext';

const SimulacionSemanal = () => {
  const { velocidad } = useSimulacion();
  const [fechaInicio, setFechaInicio] = useState<Date | null>(new Date());

  return (
    <MainLayout>
      <div className="app-layout-container">
        <div className="main-page-content">
          <SimulationMap fechaInicio={fechaInicio} />
        </div>
        <BarraLateral
          expandedWidth="362px"
          collapsedWidth="55px"
          initialCollapsed={false}
          toggleBarTitle=""
        >
          <ControlDeMandoCompleto
            fechaInicio={fechaInicio}
            setFechaInicio={setFechaInicio}
          />
        </BarraLateral>
      </div>
    </MainLayout>
  );
};

export default SimulacionSemanal;
