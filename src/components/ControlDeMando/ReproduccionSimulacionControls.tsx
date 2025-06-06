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

export const SPEED_STEP_LARGE = 5;
export const SPEED_STEP_SMALL = 2;

interface ReproduccionSimulacionControlsProps {
  currentSpeed: number;
  onSetSpeed: (speed: number) => void;
  disabled?: boolean;
  minSpeed: number;
  maxSpeed: number;
  lastRealSpeed: number; // La última velocidad válida antes de pausar
}

const ReproduccionSimulacionControls: React.FC<ReproduccionSimulacionControlsProps> = ({
  currentSpeed,
  onSetSpeed,
  disabled,
  minSpeed,
  maxSpeed,
  lastRealSpeed,
}) => {
  const clampSpeed = (speed: number) => Math.min(maxSpeed, Math.max(minSpeed, speed));

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
        className="playback-button"
        onClick={() => onSetSpeed(clampSpeed((currentSpeed === 0 ? lastRealSpeed : currentSpeed) - SPEED_STEP_LARGE))}
        disabled={disabled}
        aria-label="Disminuir velocidad en 5"
        title="Disminuir velocidad en 5"
      >
        <SeekToStartIcon className="playback-icon" />
      </button>

      <button
        className="playback-button"
        onClick={() => onSetSpeed(clampSpeed((currentSpeed === 0 ? lastRealSpeed : currentSpeed) - SPEED_STEP_SMALL))}
        disabled={disabled}
        aria-label="Disminuir velocidad en 2"
        title="Disminuir velocidad en 2"
      >
        <RewindStepIcon className="playback-icon" />
      </button>

      <button
        className={`playback-button ${currentSpeed === 0 ? '' : 'active'}`}
        onClick={handlePlayPauseToggle}
        disabled={disabled}
        aria-label={currentSpeed === 0 ? 'Reproducir' : 'Pausar'}
        title={currentSpeed === 0 ? 'Reproducir' : 'Pausar'}
      >
        {currentSpeed === 0 ? <PlayIcon className="playback-icon" /> : <PauseIcon className="playback-icon" />}
      </button>

      <button
        className="playback-button"
        onClick={() => onSetSpeed(clampSpeed((currentSpeed === 0 ? lastRealSpeed : currentSpeed) + SPEED_STEP_SMALL))}
        disabled={disabled}
        aria-label="Aumentar velocidad en 2"
        title="Aumentar velocidad en 2"
      >
        <ForwardStepIcon className="playback-icon" />
      </button>

      <button
        className="playback-button"
        onClick={() => onSetSpeed(clampSpeed((currentSpeed === 0 ? lastRealSpeed : currentSpeed) + SPEED_STEP_LARGE))}
        disabled={disabled}
        aria-label="Aumentar velocidad en 5"
        title="Aumentar velocidad en 5"
      >
        <SeekToEndIcon className="playback-icon" />
      </button>
    </div>
  );
};

export default ReproduccionSimulacionControls;
