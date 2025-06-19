import React from 'react';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import SimulationMap from '../../components/SimulationMap/SimulationMap';
import BarraLateral from '../../components/BarraLateral/BarraLateral';
import ControlDeMandoDiaADia from '../../components/ControlDeMando/ControlDeMandoDiaADia';
import ListaFlotaYPedidos from '../../components/ListaFlotaYPedidos/ListaFlotaYPedidos';
import { SimulacionProvider } from '../../context/SimulacionContext';
import CajetinInsertar from '../../components/CajetinInsertar/CajetinInsertar';

const OperacionesDiaADia = () => {
  return (
    <SimulacionProvider tipoSimulacion="DIA_A_DIA">
      <MainLayout>
        <div className="app-layout-container">
          <div className="main-page-content">
            <SimulationMap />
          </div>
          <div className="control-wrapper">
            <BarraLateral
              expandedWidth="362px"
              collapsedWidth="55px"
              initialCollapsed={false}
              toggleBarTitle=""
            >
              <ControlDeMandoDiaADia />
              <CajetinInsertar tipoSimulacion="DIA_A_DIA"/>
              <ListaFlotaYPedidos />
            </BarraLateral>
          </div>
        </div>
      </MainLayout>
    </SimulacionProvider>
  );
};

export default OperacionesDiaADia;
