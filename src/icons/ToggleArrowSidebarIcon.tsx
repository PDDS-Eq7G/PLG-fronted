import React from 'react';
// Icono de flecha para la barra lateral derecha:
// - Base: '>' (Chevron hacia la derecha)
// - Si 'pointingLeft' es true, rota 180 grados para convertirse en '<'

const ToggleArrowSidebarIcon: React.FC<{ pointingLeft: boolean; className?: string }> = ({ pointingLeft, className }) => (
  <svg
    className={className}
    style={{
      transform: pointingLeft ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease-in-out',
    }}
    width="22" // Ligeramente más pequeño para la barra
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3" // Más grueso para mejor visibilidad
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" /> {/* Por defecto: '>' */}
  </svg>
);

export default ToggleArrowSidebarIcon;