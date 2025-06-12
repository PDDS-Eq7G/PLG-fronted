import React from 'react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import SimulationMap from '../../components/SimulationMap/SimulationMap';
import BarraLateral from '../../components/BarraLateral/BarraLateral';
import ControlDeMandoCompleto from '../../components/ControlDeMando/ControlDeMandoCompleto';
import ListaFlotaYPedidos from '../../components/ListaFlotaYPedidos/ListaFlotaYPedidos';
import { SimulacionProvider } from '../../context/SimulacionContext';

const SimulacionColapso = () => {
  return (
    <SimulacionProvider tipoSimulacion="COLAPSO">
      <MainLayout>
        <div className="app-layout-container">
          <div className="main-page-content">
            <SimulationMap />
          </div>

          <BarraLateral
            expandedWidth="362px"
            collapsedWidth="55px"
            initialCollapsed={false}
            toggleBarTitle=""
          >
            <ControlDeMandoCompleto />
            <ListaFlotaYPedidos />
          </BarraLateral>
        </div>
      </MainLayout>
    </SimulacionProvider>
  );
};

export default SimulacionColapso;
