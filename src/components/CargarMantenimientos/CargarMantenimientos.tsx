import SubirArchivoButton from "../SubirArchivoButton/SubirArchivoButton";

const CargarMantenimientos = () => {
  return (
    <SubirArchivoButton
      titulo="Cargar Mantenimientos"
      endpoint="/mantenimiento/importar"
      accept=".txt"
    />
  );
};

export default CargarMantenimientos;
