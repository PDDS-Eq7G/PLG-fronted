import SubirArchivoButton from "../SubirArchivoButton/SubirArchivoButton";

const CargarMantenimientos = () => {
  return (
    <SubirArchivoButton
      titulo="Cargar Mantenimiento"
      endpoint="/mantenimiento/importar"
      accept=".txt"
    />
  );
};

export default CargarMantenimientos;
