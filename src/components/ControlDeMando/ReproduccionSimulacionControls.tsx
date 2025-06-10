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

export const SPEED_STEP_LARGE = 100;
export const SPEED_STEP_SMALL = 50;

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
        onClick={() => onSetSpeed(clampSpeed((currentSpeed === 0 ? lastRealSpeed : currentSpeed) + SPEED_STEP_LARGE))}
        disabled={disabled}
        aria-label="Disminuir velocidad en 100"
        title="Disminuir velocidad en 100"
      >
        <SeekToStartIcon className="playback-icon" />
      </button>

      <button
        className="playback-button"
        onClick={() => onSetSpeed(clampSpeed((currentSpeed === 0 ? lastRealSpeed : currentSpeed) + SPEED_STEP_SMALL))}
        disabled={disabled}
        aria-label="Disminuir velocidad en 50"
        title="Disminuir velocidad en 50"
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
        onClick={() => onSetSpeed(clampSpeed((currentSpeed === 0 ? lastRealSpeed : currentSpeed) - SPEED_STEP_SMALL))}
        disabled={disabled}
        aria-label="Aumentar velocidad en 50"
        title="Aumentar velocidad en 50"
      >
        <ForwardStepIcon className="playback-icon" />
      </button>

      <button
        className="playback-button"
        onClick={() => onSetSpeed(clampSpeed((currentSpeed === 0 ? lastRealSpeed : currentSpeed) - SPEED_STEP_LARGE))}
        disabled={disabled}
        aria-label="Aumentar velocidad en 100"
        title="Aumentar velocidad en 100"
      >
        <SeekToEndIcon className="playback-icon" />
      </button>
    </div>
  );
};

export default ReproduccionSimulacionControls;
