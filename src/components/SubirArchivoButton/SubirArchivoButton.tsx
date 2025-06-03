import React, { useRef, useState } from "react";
import NotificationPopup from "../NotificationPopup/NotificationPopup";
import UploadFileIcon from "../../icons/UploadFileIcon";
import API_URL from "../../config";
import "./SubirArchivoButton.css";

type Props = {
  titulo: string;
  endpoint: string;
  formFieldName?: string;
  accept?: string;
  onUploadSuccess?: (responseText: string) => void;
  onUploadError?: (error: string) => void;
};

const SubirArchivoButton: React.FC<Props> = ({
  titulo,
  endpoint,
  formFieldName = "file",
  accept = ".txt",
  onUploadSuccess,
  onUploadError,
}) => {
  const [mensaje, setMensaje] = useState<string>("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error" | "">("");
  const [cargando, setCargando] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cerrarPopup = () => {
    setMensaje("");
    setTipoMensaje("");
  };

  const procesarCargaArchivo = async (archivo: File) => {
    setCargando(true);
    setMensaje(`Cargando archivo: ${archivo.name}...`);
    setTipoMensaje("success");

    const formData = new FormData();
    formData.append(formFieldName, archivo);

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });
      const textoRespuesta = await response.text();

      if (response.ok) {
        setMensaje(textoRespuesta || "Archivo cargado con éxito.");
        setTipoMensaje("success");
        onUploadSuccess?.(textoRespuesta);
      } else {
        let errorMsg = `Error ${response.status}: ${textoRespuesta}`;
        try {
          const errorJson = JSON.parse(textoRespuesta);
          if (errorJson?.message) {
            errorMsg = `Error: ${errorJson.message}`;
          }
        } catch {}
        setMensaje(errorMsg);
        setTipoMensaje("error");
        onUploadError?.(errorMsg);
      }
    } catch (error) {
      const msg = "Error de conexión: " + (error as Error).message;
      setMensaje(msg);
      setTipoMensaje("error");
      onUploadError?.(msg);
    } finally {
      setCargando(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      procesarCargaArchivo(e.target.files[0]);
    }
  };

  const abrirSelectorArchivo = () => {
    if (!cargando) fileInputRef.current?.click();
  };

  return (
    <div className="archivo-uploader-container">
      {mensaje && tipoMensaje && (
        <NotificationPopup
          message={mensaje}
          type={tipoMensaje}
          onClose={cerrarPopup}
        />
      )}
      <form onSubmit={(e) => e.preventDefault()} className="upload-form">
        <input
          type="file"
          accept={accept}
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={abrirSelectorArchivo}
          disabled={cargando}
          className="custom-upload-button"
        >
          <span style={{ visibility: "hidden" }}>
            <UploadFileIcon /> {titulo}
          </span>
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            {cargando ? "Cargando..." : <><UploadFileIcon /> {titulo}</>}
          </span>
        </button>
      </form>
    </div>
  );
};

export default SubirArchivoButton;
