import ArchivoUploader from "../ArchivoUploader/ArchivoUploader";

const CargarBloqueos = () => {
  return (
    <ArchivoUploader
      titulo="Cargar Bloqueos"
      endpoint="/api/bloqueo/importar"
      accept=".txt"
    />
  );
};

export default CargarBloqueos;
