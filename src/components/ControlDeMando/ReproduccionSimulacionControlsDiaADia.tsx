import React from 'react';
import {
  SeekToStartIcon,
  RewindStepIcon,
  PauseIcon,
  PlayIcon,
  ForwardStepIcon,
  SeekToEndIcon,
} from '../../icons/MediaIcons';
import './ControlDeMando.css';

interface ReproduccionSimulacionControlsDiaADiaProps {
  currentSpeed: number;
  onSetSpeed: (speed: number) => void;
  disabled?: boolean;
  lastRealSpeed: number; // La última velocidad válida antes de pausar
}

const ReproduccionSimulacionControlsDiaADia: React.FC<ReproduccionSimulacionControlsDiaADiaProps> = ({
  currentSpeed,
  onSetSpeed,
  disabled,
  lastRealSpeed,
}) => {

  const handlePlayPauseToggle = () => {
    if (currentSpeed === 0) {
      // Si está pausado, vuelve a la última velocidad real
      onSetSpeed(lastRealSpeed);
    } else {
      // Pausar
      onSetSpeed(0);
    }
  };

  return (
    <div className="reproduccion-controls-container">
      

      <button
        className={`playback-button ${currentSpeed === 0 ? '' : 'active'}`}
        onClick={handlePlayPauseToggle}
        disabled={disabled}
        aria-label={currentSpeed === 0 ? 'Reproducir' : 'Pausar'}
        title={currentSpeed === 0 ? 'Reproducir' : 'Pausar'}
      >
        {currentSpeed === 0 ? <PlayIcon className="playback-icon" /> : <PauseIcon className="playback-icon" />}
      </button>

      
    </div>
  );
};

export default ReproduccionSimulacionControlsDiaADia;
