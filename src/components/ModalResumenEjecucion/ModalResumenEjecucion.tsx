import React from 'react';
import './ModalResumenEjecucion.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalResumenEjecucion: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose} className="modal-close-button">
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default ModalResumenEjecucion;