import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import SimulacionSemanal from './pages/SimulacionSemanal/SimulacionSemanal';

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