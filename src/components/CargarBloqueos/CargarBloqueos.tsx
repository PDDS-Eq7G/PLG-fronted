import SubirArchivoButton from "../SubirArchivoButton/SubirArchivoButton";

const CargarBloqueos = () => {
  return (
    <SubirArchivoButton
      titulo="Cargar Bloqueos"
      endpoint="/bloqueo/importar"
      accept=".txt"
    />
  );
};

export default CargarBloqueos;
