import ArchivoUploader from "../ArchivoUploader/ArchivoUploader";

const CargarMantenimientos = () => {
  return (
    <ArchivoUploader
      titulo="Cargar Mantenimiento"
      endpoint="/api/mantenimiento/importar"
      accept=".txt"
    />
  );
};

export default CargarMantenimientos;
