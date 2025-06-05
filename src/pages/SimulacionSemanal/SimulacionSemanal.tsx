import React, { useState } from 'react'; // ✅ Importar useState
import MainLayout from '../../layouts/MainLayout/MainLayout';
import SimulationMap from '../../components/SimulationMap/SimulationMap';
import BarraLateral from '../../components/BarraLateral/BarraLateral';
import ControlDeMandoCompleto from '../../components/ControlDeMando/ControlDeMandoCompleto';
import { SIMULATION_SPEEDS } from '../../components/ControlDeMando/ReproduccionSimulacionControls';

const SimulacionSemanal = () => {
  // ✅ Declarar estado local para la velocidad
  const [simulationSpeed, setSimulationSpeed] = useState(SIMULATION_SPEEDS.PAUSED);

  return (
    <MainLayout>
      <div className="app-layout-container">
        <div className="main-page-content">
          <SimulationMap simulationSpeed={simulationSpeed} />
        </div>

        <BarraLateral
          expandedWidth="362px"
          collapsedWidth="55px"
          initialCollapsed={false}
          toggleBarTitle=""
        >
          {/* ✅ También puedes pasar los setters si ControlDeMandoCompleto lo necesita */}
          <ControlDeMandoCompleto
            simulationSpeed={simulationSpeed}
            setSimulationSpeed={setSimulationSpeed}
          />
        </BarraLateral>
      </div>
    </MainLayout>
  );
};

export default SimulacionSemanal;
