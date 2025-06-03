import SubirArchivoButton from "../SubirArchivoButton/SubirArchivoButton";

const CargarPedidos = () => {
  return (
    <SubirArchivoButton
      titulo="Cargar Pedidos"
      endpoint="/api/pedido/importar"
      accept=".txt"
    />
  );
};

export default CargarPedidos;
