import ArchivoUploader from "../ArchivoUploader/ArchivoUploader";

const CargarAverias = () => {
  return (
    <ArchivoUploader
      titulo="Cargar Averías"
      endpoint="/api/averia/importar"
      accept=".txt"
    />
  );
};

export default CargarAverias;
