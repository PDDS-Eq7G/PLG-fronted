import React, { useState, useRef } from "react"; // useEffect ya no es necesario aquí para el popup
import API_URL from '../../config';
import './CargarPedidos.css';
import NotificationPopup from '../NotificationPopup/NotificationPopup'; // Ajusta la ruta si es necesario

// El UploadIcon puede quedarse aquí o moverse a un archivo de iconos si es reutilizable
const UploadIcon: React.FC = () => (
  <svg
    className="upload-icon"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.7"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
    />
  </svg>
);

const CargarPedidos: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState<string>("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error" | "">("");
  const [cargando, setCargando] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // La lógica de auto-cierre del popup se ha movido a NotificationPopup.tsx

  const procesarCargaArchivo = async (archivoParaSubir: File) => {
    if (!archivoParaSubir) return;

    setCargando(true);
    setMensaje(`Cargando archivo: ${archivoParaSubir.name}...`);
    setTipoMensaje("success"); // Se podría considerar un tipo "info" aquí

    const formData = new FormData();
    formData.append("file", archivoParaSubir);

    try {
      const response = await fetch(`${API_URL}/api/pedido/importar`, {
        method: "POST",
        body: formData,
      });

      const textoRespuesta = await response.text();

      if (response.ok) {
        setMensaje(textoRespuesta || "Archivo cargado con éxito.");
        setTipoMensaje("success");
        setCurrentFile(null);
      } else {
        let errorMsg = `Error ${response.status}: ${textoRespuesta}`;
        try {
          const errorJson = JSON.parse(textoRespuesta);
          if (errorJson && errorJson.message) {
            errorMsg = `Error: ${errorJson.message}`;
          }
        } catch (parseError) { /* No es JSON */ }
        setMensaje(errorMsg);
        setTipoMensaje("error");
      }
    } catch (error) {
      setMensaje("Error de conexión al subir el archivo: " + (error as Error).message);
      setTipoMensaje("error");
    } finally {
      setCargando(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const archivoSeleccionado = e.target.files[0];
      setCurrentFile(archivoSeleccionado);
      procesarCargaArchivo(archivoSeleccionado);
    } else {
      setCurrentFile(null);
    }
  };

  const handleBotonBonitoClick = () => {
    if (cargando) return;
    fileInputRef.current?.click();
  };

  // Esta función se pasa a NotificationPopup para que pueda cerrar el mensaje
  const cerrarPopup = () => {
    setMensaje("");
    setTipoMensaje("");
  };

  return (
    <div className="cargar-pedidos-container">
      {/* --- Usar el Componente NotificationPopup --- */}
      {mensaje && tipoMensaje && (
        <NotificationPopup
          message={mensaje}
          type={tipoMensaje}
          onClose={cerrarPopup}
          //visibleDuration={12000} // 12 segundos explícitos
          // fadeOutAnimationDuration={300} // Cambiar la duración del fade out
        />
      )}
      {/* --- Fin --- */}

      <h2>Subir archivo de pedidos</h2>
      <form onSubmit={(e) => e.preventDefault()} className="upload-form">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
          id="fileUpload"
        />
        <button
          type="button"
          onClick={handleBotonBonitoClick}
          disabled={cargando}
          className="custom-upload-button"
          style={{ position: 'relative' }}
        >
          {/* Contenido invisible que reserva el espacio total del botón */}
          <span style={{ visibility: 'hidden' }}>
            <UploadIcon />
            Cargar Pedidos
          </span>

          {/* Contenido visible, posicionado absolutamente en el centro del botón */}
          <span
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {cargando ? (
              "Cargando..."
            ) : (
              <>
                <UploadIcon />
                Cargar Pedidos
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

export default CargarPedidos;