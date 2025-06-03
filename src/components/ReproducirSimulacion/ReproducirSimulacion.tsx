// src/components/ControlDeMando/ReproduccionSimulacionControls.tsx
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

// Definimos las velocidades como constantes para claridad
export const SIMULATION_SPEEDS = {
  REWIND_MAX: -2,    // Representa una velocidad muy lenta o un gran retroceso
  REWIND_STEP: -1,   // Velocidad lenta o pequeño retroceso
  PAUSED: 0,
  PLAY_NORMAL: 1,    // Velocidad normal al presionar play desde pausa
  FORWARD_STEP: 2,   // Velocidad rápida o pequeño avance
  FORWARD_MAX: 3,    // Velocidad muy rápida o gran avance
};

interface ReproducirSimulacionProps {
  currentSpeed: number; // El valor actual de la velocidad
  onSetSpeed: (speed: number) => void;
  disabled?: boolean;
}

const ReproducirSimulacion: React.FC<ReproducirSimulacionProps> = ({
  currentSpeed,
  onSetSpeed,
  disabled,
}) => {
  const handlePlayPauseToggle = () => {
    if (currentSpeed === SIMULATION_SPEEDS.PAUSED) {
      onSetSpeed(SIMULATION_SPEEDS.PLAY_NORMAL);
    } else {
      onSetSpeed(SIMULATION_SPEEDS.PAUSED);
    }
  };

  const playbackButtons = [
    { id: 'rewind-max', speed: SIMULATION_SPEEDS.REWIND_MAX, IconComponent: SeekToStartIcon, label: 'Retroceder máximo' },
    { id: 'rewind-step', speed: SIMULATION_SPEEDS.REWIND_STEP, IconComponent: RewindStepIcon, label: 'Retroceder paso' },
    {
      id: 'play-pause',
      speed: currentSpeed === SIMULATION_SPEEDS.PAUSED ? SIMULATION_SPEEDS.PLAY_NORMAL : SIMULATION_SPEEDS.PAUSED,
      IconComponent: currentSpeed === SIMULATION_SPEEDS.PAUSED ? PlayIcon : PauseIcon,
      action: handlePlayPauseToggle,
      label: currentSpeed === SIMULATION_SPEEDS.PAUSED ? 'Reproducir' : 'Pausar',
      isPlayPause: true,
    },
    { id: 'forward-step', speed: SIMULATION_SPEEDS.FORWARD_STEP, IconComponent: ForwardStepIcon, label: 'Avanzar paso' },
    { id: 'forward-max', speed: SIMULATION_SPEEDS.FORWARD_MAX, IconComponent: SeekToEndIcon, label: 'Avanzar máximo' },
  ];

  return (
    <div className="reproduccion-controls-container">
      {playbackButtons.map((btn) => {
        // Lógica de resaltado:
        // Para Play/Pause: se resalta si está pausado o si la velocidad actual es la normal (PLAY_NORMAL)
        // Para otros botones: se resalta si la velocidad actual coincide con la del botón
        let isActive = false;
        if (btn.isPlayPause) {
          isActive = currentSpeed === SIMULATION_SPEEDS.PAUSED || currentSpeed === SIMULATION_SPEEDS.PLAY_NORMAL;
        } else {
          isActive = currentSpeed === btn.speed;
        }

        return (
          <button
            key={btn.id}
            className={`playback-button ${isActive ? 'active' : ''}`}
            onClick={btn.action ? btn.action : () => onSetSpeed(btn.speed)}
            disabled={disabled}
            aria-label={btn.label}
            title={btn.label}
          >
            <btn.IconComponent className="playback-icon" />
          </button>
        );
      })}
    </div>
  );
};

export default ReproducirSimulacion;