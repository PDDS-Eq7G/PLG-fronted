import React from 'react';
import CancelSimulacionIcon from '../../icons/CancelSimulationIcon';
import './ControlDeMando.css';
import '../SubirArchivoButton/SubirArchivoButton.css';

interface CancelarSimulacionButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const CancelarSimulacionButton: React.FC<CancelarSimulacionButtonProps> = ({ onClick, disabled }) => {
  return (
    <div className="cancel-simulation-container">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="cancel-simulation-button"
      >
        <CancelSimulacionIcon /> Cancelar Simulación
      </button>
    </div>
  );
};

export default CancelarSimulacionButton;