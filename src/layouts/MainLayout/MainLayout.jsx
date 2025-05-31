import './MainLayout.css';
import { useNavigate } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica para cerrar sesión
    navigate('/');
  };

  return (
    <div className="main-container">
      {/* Barra lateral */}
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
            <li onClick={() => {}}>Simulación Semanal</li>
            <li onClick={() => {}}>Simulación Colapso Logístico</li>
            <li onClick={() => {}}>Cargar Datos</li>
            <li onClick={() => {}}>Historial</li>
            <li className="logout" onClick={handleLogout}>Cerrar Sesión</li>
          </ul>
        </nav>
      </aside>

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