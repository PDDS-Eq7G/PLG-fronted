import React, { useMemo, useState } from "react";
import { useSimulacion } from "../../context/SimulacionContext";
import "./ListaFlotaYPedidos.css";

export enum TabType {
  FLOTA = "flota",
  PEDIDOS = "pedidos",
}

interface FlotaData {
  codigo: string;
  posicion: string;
  capacidad: string;
}

interface PedidosData {
  codigo: string;
  posicion: string;
  cantidad: string;
  fecha: string;
}

interface ListaFlotaYPedidosProps {
  flotaData?: FlotaData[];
  pedidosData?: PedidosData[];
  onTabChange?: (activeTab: TabType) => void;
  defaultTab?: TabType;
  disabled?: boolean;
}

/*const defaultFlotaData: FlotaData[] = [
  { codigo: "TA01", posicion: "(16, 10)", capacidad: "10/25 (40%)" },
  { codigo: "TA02", posicion: "(24, 17)", capacidad: "11/25 (44%)" },
  { codigo: "TA03", posicion: "(7, 22)", capacidad: "3/25 (12%)" },
  { codigo: "TA04", posicion: "(42, 20)", capacidad: "1/25 (4%)" },
  { codigo: "TA05", posicion: "(28, 36)", capacidad: "7/25 (28%)" },
  { codigo: "TB01", posicion: "(19, 30)", capacidad: "19/25 (76%)" },
  { codigo: "TB02", posicion: "(32, 29)", capacidad: "13/25 (52%)" },
  { codigo: "TB03", posicion: "(36, 11)", capacidad: "25/25 (100%)" },
  { codigo: "TB04", posicion: "(7, 40)", capacidad: "15/25 (60%)" },
  { codigo: "TD01", posicion: "(32, 30)", capacidad: "19/25 (76%)" },
  { codigo: "TD02", posicion: "(41, 15)", capacidad: "12/25 (48%)" },
  { codigo: "TD03", posicion: "(14, 28)", capacidad: "19/25 (76%)" },
  { codigo: "TD04", posicion: "(5, 23)", capacidad: "12/25 (48%)" },
  { codigo: "TD05", posicion: "(44, 3)", capacidad: "15/25 (60%)" },
];

const defaultPedidosData: PedidosData[] = [
  { codigo: "P001", posicion: "(16, 10)", fecha: "09/05 14:30" },
  { codigo: "P002", posicion: "(24, 17)", fecha: "09/05 15:30" },
  { codigo: "P003", posicion: "(7, 22)", fecha: "09/05 15:45" },
  { codigo: "P004", posicion: "(42, 20)", fecha: "09/05 16:10" },
  { codigo: "P005", posicion: "(28, 36)", fecha: "09/05 16:15" },
  { codigo: "P006", posicion: "(19, 30)", fecha: "09/05 14:24" },
  { codigo: "P007", posicion: "(32, 29)", fecha: "09/05 17:30" },
  { codigo: "P008", posicion: "(36, 11)", fecha: "09/05 19:24" },
  { codigo: "P009", posicion: "(7, 40)", fecha: "09/05 18:15" },
  { codigo: "P010", posicion: "(32, 30)", fecha: "09/05 11:34" },
  { codigo: "P011", posicion: "(41, 15)", fecha: "09/05 12:30" },
  { codigo: "P012", posicion: "(14, 28)", fecha: "09/05 17:04" },
  { codigo: "P013", posicion: "(5, 23)", fecha: "09/05 16:54" },
  { codigo: "P014", posicion: "(44, 3)", fecha: "09/05 17:18" },
  { codigo: "P015", posicion: "(44, 3)", fecha: "09/05 18:31" },
];*/

const ListaFlotaYPedidos: React.FC<ListaFlotaYPedidosProps> = ({
  onTabChange,
  defaultTab = TabType.FLOTA,
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { historial, minutoActualIdx } = useSimulacion();

  const minutoActual = useMemo(() => {
    const item = historial[minutoActualIdx];
    if (item && "minuto" in item) return item;
    return null;
  }, [historial, minutoActualIdx]);

  const flotaData: FlotaData[] = useMemo(() => {
    if (!minutoActual) return [];
    return minutoActual.camiones.map((camion) => ({
      codigo: camion.codigo,
      posicion: `(${camion.posicion.x}, ${camion.posicion.y})`,
      capacidad: `${camion.cargaActual}/${camion.capacidadMaxima} galones (${Math.round((camion.cargaActual / camion.capacidadMaxima) * 100)}%)`,
    }));
  }, [minutoActual]);

  const pedidosData: PedidosData[] = useMemo(() => {
    if (!minutoActual) return [];
    return minutoActual.pedidosUbicacion.map((pedido) => {
      const pedidoData = minutoActual.pedidos.find(
        (pu) => pu.idPedido === pedido.idPedido
      );
      
      const fechaLlegada = pedidoData?.fechaLlegada;

      const cantidadPorEntregar = pedidoData?.cantidadPorEntregar;
      const cantidadTotal = pedidoData?.cantidadTotal;

      return {
        codigo: "P"+String(pedido.idPedido).padStart(5, '0'),
        posicion: `(${pedido.posicion.x}, ${pedido.posicion.y})`,
        cantidad: `${cantidadPorEntregar}/${cantidadTotal} m³`,
        fecha: fechaLlegada ? new Date(fechaLlegada).toLocaleString("es-PE", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }) : "N/A",
      };
    });
  }, [minutoActual]);

  const handleTabClick = (tab: TabType) => {
    if (disabled) return;
    setActiveTab(tab);
    setCurrentPage(1); // Reiniciar a la página 1 al cambiar de pestaña
    onTabChange?.(tab);
  };

  const filteredFlotaData = flotaData.filter((item) =>
    item.codigo.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredPedidosData = pedidosData.filter((item) =>
    item.codigo.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedFlotaData = filteredFlotaData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const paginatedPedidosData = filteredPedidosData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages =
    activeTab === TabType.FLOTA
      ? Math.ceil(filteredFlotaData.length / itemsPerPage)
      : Math.ceil(filteredPedidosData.length / itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const renderFlotaTable = () => (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Posición</th>
            <th>Capacidad</th>
          </tr>
        </thead>
        <tbody>
          {paginatedFlotaData.map((item, index) => (
            <tr key={index}>
              <td>{item.codigo}</td>
              <td>{item.posicion}</td>
              <td>{item.capacidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPedidosTable = () => (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Posición</th>
            <th>Cantidad por entregar</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPedidosData.map((item, index) => (
            <tr key={index}>
              <td>{item.codigo}</td>
              <td>{item.posicion}</td>
              <td>{item.cantidad}</td>
              <td>{item.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flota-pedidos-container">
      <div className="tab-header">
        <button
          className={`tab-button ${
            activeTab === TabType.FLOTA ? "active" : ""
          }`}
          onClick={() => handleTabClick(TabType.FLOTA)}
          disabled={disabled}
        >
          Flota
        </button>
        <button
          className={`tab-button ${
            activeTab === TabType.PEDIDOS ? "active" : ""
          }`}
          onClick={() => handleTabClick(TabType.PEDIDOS)}
          disabled={disabled}
        >
          Pedidos
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por código..."
          className="search-input"
          disabled={disabled}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1); // Reiniciar página al buscar
          }}
        />
        <div className="search-icon">🔍</div>
      </div>

      <div className="tab-content">
        {activeTab === TabType.FLOTA
          ? renderFlotaTable()
          : renderPedidosTable()}
      </div>

      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={goToPreviousPage}
          disabled={disabled || currentPage === 1}
        >
          {"<"}
        </button>
        <span className="pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={goToNextPage}
          disabled={disabled || currentPage === totalPages}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default ListaFlotaYPedidos;
