import React, { useMemo, useState } from "react";
import { useSimulacion } from "../../context/SimulacionContext";
import "./ListaFlotaYPedidos.css";

export enum TabType {
  FLOTA = "flota",
  PEDIDOS = "pedidos",
  TANQUES = "tanques",
}

interface FlotaData {
  codigo: string;
  posicion: string;
  capacidad: string;
  estado: string;
  cargaActualFlota: number;
  capacidadMaximaFlota: number;
  asignacion?: string;
}

interface PedidosData {
  codigo: string;
  posicion: string;
  cantidad: string;
  fecha: string;
  fechaLimite: string;
  rawFechaLimite?: number;
  asignacion?: string;
}

interface TanquesData {
  posicion: string;
  capacidad: string;
}

interface ListaFlotaYPedidosProps {
  flotaData?: FlotaData[];
  pedidosData?: PedidosData[];
  onTabChange?: (activeTab: TabType) => void;
  defaultTab?: TabType;
  disabled?: boolean;
}

const ListaFlotaYPedidos: React.FC<ListaFlotaYPedidosProps> = ({
  onTabChange,
  defaultTab = TabType.FLOTA,
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { historial, minutoActualIdx, selectedCamionId, setSelectedCamionId } = useSimulacion();
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const minutoActual = useMemo(() => {
    const item = historial[minutoActualIdx];
    if (item && "minuto" in item) return item;
    return null;
  }, [historial, minutoActualIdx]);

  const camionesAsignacionMap = useMemo(() => {
    const map = new Map<string, { pedidoId: string; cantidad: number }[]>();
    if (minutoActual) {
      minutoActual.pedidos.forEach(pedido => {
        if (pedido.asignacion) {
          Object.entries(pedido.asignacion).forEach(([codigoCamion, detalle]) => {
            if (!map.has(codigoCamion)) {
              map.set(codigoCamion, []);
            }
            map.get(codigoCamion)?.push({
              pedidoId: "P" + String(pedido.idPedido).padStart(5, '0'), // Formatear el código del pedido
              cantidad: detalle.cantidadAsignada,
            });
          });
        }
      });
    }
    return map;
  }, [minutoActual]);

  const flotaData: FlotaData[] = useMemo(() => {
    if (!minutoActual) return [];
    return minutoActual.camiones.map((camion) => {
      // Obtener asignaciones para este camión
      const asignaciones = camionesAsignacionMap.get(camion.codigo);
      let asignacionTexto = "Ninguno"; // Valor por defecto

      if (asignaciones && asignaciones.length > 0) {
        asignacionTexto = asignaciones
          .map(a => `${a.pedidoId} (${a.cantidad})`)
          .join(", ");
      }

      return {
        codigo: camion.codigo,
        posicion: `(${camion.posicion.x}, ${camion.posicion.y})`,
        capacidad: `${camion.cargaActual}/${camion.capacidadMaxima} m³ (${Math.round((camion.cargaActual / camion.capacidadMaxima) * 100)}%)`,
        estado: camion.estado,
        cargaActualFlota: camion.cargaActual,
        capacidadMaximaFlota: camion.capacidadMaxima,
        asignacion: asignacionTexto,
      }
    });
  }, [minutoActual]);

  const { totalCargaActualFlota, totalCapacidadMaximaFlota } = useMemo(() => {
    let cargaActual = 0;
    let capacidadMaxima = 0;

    flotaData.forEach(camion => {
      cargaActual += camion.cargaActualFlota;
      capacidadMaxima += camion.capacidadMaximaFlota;
    });

    return {
      totalCargaActualFlota: cargaActual,
      totalCapacidadMaximaFlota: capacidadMaxima,
    };
   }, [flotaData]);

  const pedidosData: PedidosData[] = useMemo(() => {
    if (!minutoActual) return [];
    const pedidos = minutoActual.pedidosUbicacion.map((pedido) => {
      const pedidoData = minutoActual.pedidos.find(
        (pu) => pu.idPedido === pedido.idPedido
      );
      
      const fechaLlegada = pedidoData?.fechaLlegada;
      const fechaLimite = pedidoData?.fechaLimite;

      const cantidadPorEntregar = pedidoData?.cantidadPorEntregar;
      const cantidadTotal = pedidoData?.cantidadTotal;

      // --- Lógica para asignación ---
      let asignacionTexto = "N/A"; // Valor por defecto
      if (pedidoData && pedidoData.asignacion) {
        const asignaciones = Object.entries(pedidoData.asignacion);
        if (asignaciones.length > 0) {
          asignacionTexto = asignaciones
            .map(([codigoCamion, detalle]) => {
              // Asumiendo que 'detalle' tiene una propiedad 'cantidadAsignada'
              return `${codigoCamion} (${detalle.cantidadAsignada})`;
            })
            .join(", ");
        } else {
          asignacionTexto = "Ninguno"; // Si hay propiedad pero está vacía
        }
      }

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
        fechaLimite: fechaLimite ? new Date(fechaLimite).toLocaleString("es-PE", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }) : "N/A",
        rawFechaLimite: fechaLimite ? new Date(fechaLimite).getTime() : Infinity,
        asignacion: asignacionTexto,
      };
    });

    // Ordenamiento
    pedidos.sort((a, b) =>
      ordenAscendente
        ? a.rawFechaLimite - b.rawFechaLimite
        : b.rawFechaLimite - a.rawFechaLimite
    );

    return pedidos;
  }, [minutoActual, ordenAscendente]);

  const tanquesData: TanquesData[] = useMemo(() => {
    if (!minutoActual) return [];
    return minutoActual.tanquesIntermedios.map((tanque) => {
      return {
        posicion: `(${tanque.posicion.x}, ${tanque.posicion.y})`,
        capacidad: `${tanque.capacidadActual}/${tanque.capacidadMaxima} m³ (${Math.round((tanque.capacidadActual / tanque.capacidadMaxima) * 100)}%)`,
      }
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
  const paginatedTanquesData = tanquesData.slice(
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
      <div className="flota-info">
        <strong>Capacidad de la Flota: </strong> {totalCargaActualFlota}/{totalCapacidadMaximaFlota} m³
        ({totalCapacidadMaximaFlota > 0 ? Math.round((totalCargaActualFlota / totalCapacidadMaximaFlota) * 100) : 0}%)
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Posición</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th>Asignación</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFlotaData.map((item, index) => (
              <tr
                key={index}
                onClick={() => setSelectedCamionId(item.codigo)}
                className={`clickable-row ${selectedCamionId === item.codigo ? 'selected-row' : ''}`}
              >
                <td>{item.codigo}</td>
                <td>{item.posicion}</td>
                <td>{item.capacidad}</td>
                <td>{item.estado}</td>
                <td>{item.asignacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPedidosTable = () => (
    <div className="table-container">
      <div className="orden-toggle-container">
        <button
          className="orden-toggle-button"
          onClick={() => setOrdenAscendente((prev) => !prev)}
          disabled={disabled}
        >
          Fecha límite {ordenAscendente ? "↑" : "↓"}
        </button>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Posición</th>
              <th>Cantidad por entregar</th>
              <th>Fecha llegada</th>
              <th>Fecha límite</th>
              <th>Asignación</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPedidosData.map((item, index) => (
              <tr key={index}>
                <td>{item.codigo}</td>
                <td>{item.posicion}</td>
                <td>{item.cantidad}</td>
                <td>{item.fecha}</td>
                <td>{item.fechaLimite}</td>
                <td>{item.asignacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTanqueTable = () => (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Posición</th>
              <th>Capacidad</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTanquesData.map((item, index) => (
              <tr key={index}>
                <td>{item.posicion}</td>
                <td>{item.capacidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        <button
          className={`tab-button ${
            activeTab === TabType.TANQUES ? "active" : ""
          }`}
          onClick={() => handleTabClick(TabType.TANQUES)}
          disabled={disabled}
        >
          Tanques
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

      <div className="tab-content-list">
        {activeTab === TabType.FLOTA
          ? renderFlotaTable()
          : activeTab === TabType.PEDIDOS 
            ? renderPedidosTable()
            : renderTanqueTable()}
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
