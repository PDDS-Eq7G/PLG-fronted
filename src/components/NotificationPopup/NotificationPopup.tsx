import React, { useEffect, useState } from 'react';
import './NotificationPopup.css';

// --- Definiciones de Iconos (CheckIcon, ErrorIcon, CloseButtonIcon) ---
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2.5"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2.5"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CloseButtonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2.5"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
// --- Fin de las definiciones de iconos ---

interface NotificationPopupProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  visibleDuration?: number;      // Duración visible antes de empezar a desaparecer (ms)
  fadeOutAnimationDuration?: number; // Duración de la animación de fade-out (ms)
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  message,
  type,
  onClose,
  visibleDuration = 7000, // 7 segundos por defecto para visibilidad
  fadeOutAnimationDuration = 500, // 1 segundo por defecto para la animación de fade out
}) => {
  const [isExiting, setIsExiting] = useState(false);

  // Efecto para iniciar la salida después de visibleDuration
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
    }, visibleDuration);

    return () => clearTimeout(timer);
  }, [message, visibleDuration]); // Se reinicia si el mensaje o la duración cambian

  // Efecto para llamar a onClose después de que la animación de salida termine
  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        onClose(); // Llama a la función del padre para desmontar/ocultar
      }, fadeOutAnimationDuration);

      return () => clearTimeout(timer);
    }
  }, [isExiting, fadeOutAnimationDuration, onClose]);

  if (!message) {
    return null;
  }

  // El botón de cierre manual ahora también inicia la animación de salida
  const handleManualClose = () => {
    setIsExiting(true);
  };

  return (
    <div
      className={`popup-notification ${type} ${isExiting ? 'fading-out' : 'visible-popup'}`}
      role="alert"
      style={{
        // Aplicar la duración de la transición directamente para que coincida con la lógica de JS
        // si las duraciones de las animaciones de entrada y salida son diferentes.
        // La animación de entrada se define en CSS, la de salida usará esta transición.
        transition: `opacity ${fadeOutAnimationDuration}ms ease-out, transform ${fadeOutAnimationDuration}ms ease-out`,
      }}
    >
      <div className="popup-icon-container">
        {type === "success" && <CheckIcon className="popup-status-icon" />}
        {type === "error" && <ErrorIcon className="popup-status-icon" />}
      </div>
      <p className="popup-message-text">{message}</p>
      <button onClick={handleManualClose} className="popup-close-btn" aria-label="Cerrar notificación">
        <CloseButtonIcon className="popup-close-icon" />
      </button>
    </div>
  );
};

export default NotificationPopup;