import './MainLayout.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleLogout = () => {
    // Lógica para cerrar sesión
    navigate('/');
  };
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  }

  return (
    <div className="main-container">

      <button className="toggle-button" onClick={toggleSidebar}>
        {sidebarVisible ? '◀' : '▶'}
      </button>
      {/* Barra lateral */}
      {sidebarVisible &&(
        <aside className="sidebar">
          <div className="logo-container">
            <div className="logo">PLG</div>
            <div className="user-info">
              <div className="user-name">Usuario: Admin</div>
              <div className="user-role">Rol: Administrador</div>
            </div>
          </div>

          <nav className="menu">
            <ul>
              <li onClick={() => {}}>Bienvenido</li>
              <li onClick={() => {}}>Operaciones día a día</li>
              <li onClick={() => navigate('/simulacion-semanal')}>Simulación Semanal</li>
              <li onClick={() => navigate('/simulacion-colapso-logistico')}>Simulación Colapso Logístico</li>
              <li onClick={() => {}}>Cargar Datos</li>
              <li onClick={() => {}}>Historial</li>
              <li className="logout" onClick={handleLogout}>Cerrar Sesión</li>
            </ul>
          </nav>
        </aside>
      )}

      {/* Contenido principal */}
      <div className="content-area">
        {/* Contenido dinámico */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;