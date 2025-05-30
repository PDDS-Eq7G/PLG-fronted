import './App.css';
import CargarPedidos from './components/CargarPedidos/CargarPedidos';
import CargarAverias from './components/CargarAverias/CargarAverias';
import CargarBloqueos from './components/CargarBloqueos/CargarBloqueos';
import CargarMantenimientos from './components/CargarMantenimientos/CargarMantenimientos';

function App() {
  return (
    <div>
      <h1>Prueba subida de archivos</h1>
      <CargarPedidos />
      <CargarAverias />
      <CargarBloqueos />
      <CargarMantenimientos />
    </div>
  );
}

export default App;
