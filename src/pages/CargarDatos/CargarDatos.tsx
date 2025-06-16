import React from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { FaTools } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import "./CargarDatos.css";
import CargarMantenimientos from "../../components/CargarMantenimientos/CargarMantenimientos";
import CargarBloqueos from "../../components/CargarBloqueos/CargarBloqueos";

const CargarDatos = () => {
  return (
    <MainLayout>
      <div className="cargar-datos-main">
        <h2 className="cargar-datos-title">CARGAR DATOS</h2>
        <div className="cargar-datos-cards-container">
          <div className="cargar-datos-card">
            <FaTools className="cargar-datos-icon mantenimiento" />
            <div className="cargar-datos-label">Mantenimientos</div>
            <CargarMantenimientos />
          </div>
          <div className="cargar-datos-card">
            <MdBlock className="cargar-datos-icon bloqueos" />
            <div className="cargar-datos-label">Bloqueos</div>
            <CargarBloqueos />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CargarDatos;
