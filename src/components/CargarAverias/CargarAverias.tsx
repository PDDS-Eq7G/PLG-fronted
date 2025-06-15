import SubirArchivoButton from "../SubirArchivoButton/SubirArchivoButton";

const CargarAverias = () => {
  return (
    <SubirArchivoButton
      titulo="Cargar Averías"
      endpoint="/averia/importar"
      accept=".txt"
    />
  );
};

export default CargarAverias;
