import './App.css';
import CargarPedidos from './components/CargarPedidos/CargarPedidos';
import CargarAverias from './components/CargarAverias/CargarAverias';
import CargarBloqueos from './components/CargarBloqueos/CargarBloqueos';
import CargarMantenimientos from './components/CargarMantenimientos/CargarMantenimientos';
import ControlDeMandoCompleto from './components/ControlDeMando/ControlDeMandoCompleto';
import ControlDeMandoDiaADia from './components/ControlDeMando/ControlDeMandoDiaADia';
import BarraLateral from './components/BarraLateral/BarraLateral';
import './App.css';

function App() {
  return (
    <div className="app-layout-container"> {/* Contenedor principal con Flexbox */}
      <main className="main-page-content">
        <h1>Contenido Principal de la Página</h1>
        <p>Este es el área principal. Su ancho se ajustará automáticamente cuando la barra lateral derecha cambie de tamaño.
          Este es el área principal. Su ancho se ajustará automáticamente cuando la barra lateral derecha cambie de tamaño.
          Este es el área principal. Su ancho se ajustará automáticamente cuando la barra lateral derecha cambie de tamaño.
        </p>
        {/* Más contenido aquí */}
      </main>

      <BarraLateral
        expandedWidth="362px" // Ancho cuando está expandida
        collapsedWidth="55px"  // Ancho cuando está colapsada (solo la barra de control)
        initialCollapsed={false} // Puede empezar abierta o cerrada
        toggleBarTitle="" // Texto que se muestra en la barra cuando está expandida
      >
        {/* El contenido de tu barra lateral, como el panel de control completo */}
        <ControlDeMandoCompleto />
      </BarraLateral>
    </div>
  );
}

export default App;
