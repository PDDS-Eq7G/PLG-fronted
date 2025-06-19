import React from 'react';
import CancelSimulacionIcon from '../../icons/CancelSimulationIcon';
import './ControlDeMando.css';
import '../SubirArchivoButton/SubirArchivoButton.css';

interface CancelarSimulacionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

const CancelarSimulacionButton: React.FC<CancelarSimulacionButtonProps> = ({ onClick, disabled, label = 'Cancelar Simulación' }) => {
  return (
    <div className="cancel-simulation-container">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="cancel-simulation-button"
      >
        <CancelSimulacionIcon /> {label}
      </button>
    </div>
  );
};

export default CancelarSimulacionButton;