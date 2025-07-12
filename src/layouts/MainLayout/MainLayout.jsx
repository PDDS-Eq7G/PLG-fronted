import "./MainLayout.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="main-container">
      {/* Barra lateral izquierda */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="logo-container">
          <div className="logo">PLG</div>
          <div className="user-info">
            <div>Usuario: Admin</div>
            <div>Rol: Administrador</div>
          </div>
        </div>

        <nav className="menu">
          <ul>
            <li onClick={() => navigate("/dashboard")}>Bienvenido</li>
            <li onClick={() => navigate("/operaciones-dia-a-dia")}>
              Operaciones día a día
            </li>
            <li onClick={() => navigate("/simulacion-semanal")}>
              Simulación Semanal
            </li>
            <li onClick={() => navigate("/simulacion-colapso-logistico")}>
              Simulación Colapso Logístico
            </li>
            <li onClick={() => navigate("/cargar-datos")}>Cargar Datos</li>
            <li>Historial</li>
            <li className="logout" onClick={handleLogout}>
              Cerrar Sesión
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="content-area">
        <main className="main-content">{children}</main>
      </div>

      {/* Botón de toggle (fuera del flujo normal) */}
      <button className="toggle-button" onClick={toggleSidebar}>
        {sidebarCollapsed ? "▶" : "◀"}
      </button>
    </div>
  );
};

export default MainLayout;