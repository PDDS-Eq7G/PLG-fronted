import React, { useState, ReactNode } from 'react';
import './BarraLateral.css'; // Crearemos este archivo CSS
import ToggleArrowSidebarIcon from '../../icons/ToggleArrowSidebarIcon'


interface BarraLateralProps {
  children: ReactNode;
  expandedWidth?: string;
  collapsedWidth?: string; // Ancho de la barra de control cuando está colapsada
  initialCollapsed?: boolean;
  toggleBarTitle?: string; // Título opcional para la barra de despliegue
  animationDurationMs?: number; // Duración para la animación de ancho y la base de la de contenido
  onCollapsedChange?: (collapsed: boolean) => void;
}

const BarraLateral: React.FC<BarraLateralProps> = ({
  children,
  expandedWidth = "362px",
  collapsedWidth = "55px",
  initialCollapsed = false,
  toggleBarTitle = "",
  animationDurationMs = 500, // 0.5s
  onCollapsedChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapsedChange && onCollapsedChange(newState);
  };

  const arrowShouldPointLeft = isCollapsed;

  return (
    <div
      className={`collapsible-sidebar-right ${isCollapsed ? 'collapsed' : 'expanded'}`}
      style={{
        width: isCollapsed ? collapsedWidth : expandedWidth,
        transition: `width ${animationDurationMs}ms ease-in-out`, // Animación del ancho
      }}
    >
      <div
        className="sidebar-right-toggle-bar"
        onClick={toggleCollapse}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCollapse(); }}
        aria-expanded={!isCollapsed}
        aria-controls="sidebar-right-main-content-area"
        title={isCollapsed ? `Mostrar ${toggleBarTitle}` : `Ocultar ${toggleBarTitle}`}
      >
        <span className="sidebar-right-toggle-text">{toggleBarTitle}</span>
        <ToggleArrowSidebarIcon pointingLeft={arrowShouldPointLeft} className="sidebar-right-toggle-icon" />
      </div>

      {/* Este wrapper maneja la animación de aparición/desaparición del contenido */}
      <div className={`sidebar-right-content-wrapper ${isCollapsed ? 'content-hidden' : 'content-visible'}`}>
        {/* El contenido real solo se renderiza si no está colapsado para optimizar,
            la animación visual la maneja el wrapper. */}
        {!isCollapsed && (
          <div className="sidebar-right-main-content" id="sidebar-right-main-content-area">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarraLateral;