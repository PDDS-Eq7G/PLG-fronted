import MainLayout from '../../layouts/MainLayout/MainLayout';
import SimulationMap from '../../components/SimulationMap/SimulationMap';

import BarraLateral from '../../components/BarraLateral/BarraLateral';
import ControlDeMandoCompleto from '../../components/ControlDeMando/ControlDeMandoCompleto';

const SimulacionSemanal = () => {
  return (
    <MainLayout>
      <div className="app-layout-container" >
        <div className="main-page-content" >
          <SimulationMap />
        </div>

        <BarraLateral
          expandedWidth="362px"
          collapsedWidth="55px"
          initialCollapsed={false}
          toggleBarTitle=""
        >
          <ControlDeMandoCompleto />
        </BarraLateral>
      </div>
    </MainLayout>
  );
};

export default SimulacionSemanal;
