import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import SimulacionSemanal from "./pages/SimulacionSemanal/SimulacionSemanal";
import SimulacionColapso from "./pages/SimulacionColapso/SimulacionColapso";
import CargarDatos from "./pages/CargarDatos/CargarDatos";
import { ConfigProvider } from "./context/ConfigContext";

function App() {
  return (
    <ConfigProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simulacion-semanal" element={<SimulacionSemanal />} />
          <Route
            path="/simulacion-colapso-logistico"
            element={<SimulacionColapso />}
          />
          <Route path="/cargar-datos" element={<CargarDatos />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
