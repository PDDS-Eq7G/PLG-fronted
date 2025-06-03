import SubirArchivoButton from "../SubirArchivoButton/SubirArchivoButton";

const CargarAverias = () => {
  return (
    <SubirArchivoButton
      titulo="Cargar Averías"
      endpoint="/api/averia/importar"
      accept=".txt"
    />
  );
};

export default CargarAverias;
