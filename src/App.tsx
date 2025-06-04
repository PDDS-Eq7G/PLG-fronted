import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import SimulacionSemanal from './pages/SimulacionSemanal/SimulacionSemanal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/simulacion-semanal" element={<SimulacionSemanal />} />
      </Routes>
    </Router>
  );
}

export default App;
