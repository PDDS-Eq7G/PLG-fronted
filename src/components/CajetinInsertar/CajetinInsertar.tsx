import React, { useEffect, useMemo, useState } from "react";
import "./CajetinInsertar.css";
import NotificationPopup from "../NotificationPopup/NotificationPopup";
import { useSimulacion } from "../../context/SimulacionContext";

enum Tab {
  AVERIA = "averia",
  PEDIDO = "pedido",
}

const pad = (num: number) => String(num).padStart(2, "0");

const getFechaAplicacion = (tipoSimulacion?: string, tiempoSimulado?: string) => {
  //const atraso = tipoSimulacion === 'DIA_A_DIA' ? 60 * 1000 : tipoSimulacion === 'SEMANAL' ? 60 * 1000 * 15 : 0;
  //const fecha = new Date(Date.now() + atraso); // actual + 1 minuto
  let fecha: Date;
  const atraso = tipoSimulacion === 'DIA_A_DIA' ? 60 * 1000 : 60 * 1000 * 15;
  if (tipoSimulacion === 'SEMANAL' && tiempoSimulado) {
    // Convertir "yyyy-mm-dd hh:mm" a Date
    const [fechaPart, horaPart] = tiempoSimulado.split(" ");
    const [anio, mes, dia] = fechaPart.split("-").map(Number);
    const [hora, minuto] = horaPart.split(":").map(Number);
    fecha = new Date(anio, mes - 1, dia, hora, minuto);
    fecha = new Date(fecha.getTime() + atraso);
  } else {
    fecha = new Date(Date.now() + atraso);
  }
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(
    fecha.getHours()
  )}:${pad(fecha.getMinutes())}:00`;
};

const getFechaLlegada = (tipoSimulacion?: string, tiempoSimulado?: string) => {
  let fecha: Date;

  if (tipoSimulacion === 'SEMANAL' && tiempoSimulado) {
    const [fechaPart, horaPart] = tiempoSimulado.split(" ");
    const [anio, mes, dia] = fechaPart.split("-").map(Number);
    const [hora, minuto] = horaPart.split(":").map(Number);
    fecha = new Date(anio, mes - 1, dia, hora, minuto);
  } else {
    fecha = new Date();
  }
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(
    fecha.getHours()
  )}:${pad(fecha.getMinutes())}:00`;
};

interface CajetinInsertarProps {
  tipoSimulacion: "DIA_A_DIA" | "SEMANAL";
  tiempoSimulado?: string;
}

const CajetinInsertar: React.FC<CajetinInsertarProps> = ({ tipoSimulacion }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.AVERIA);
  const [loading, setLoading] = useState(false);

  // Avería
  const [codigoCamion, setCodigoCamion] = useState("");
  const [turno, setTurno] = useState("");
  const [tipo, setTipo] = useState("");

  // Pedido
  const [horasLimite, setHorasLimite] = useState("");
  const [destinoX, setDestinoX] = useState("");
  const [destinoY, setDestinoY] = useState("");
  const [idCliente, setIdCliente] = useState("");
  const [cantidad, setCantidad] = useState("");

  const [popupMensaje, setPopupMensaje] = useState('');
  const [popupTipo, setPopupTipo] = useState<"success" | "error" | "">('');

  const { historial, minutoActualIdx } = useSimulacion();

  const tiempoSimulado = useMemo(() => {
    const itemActual = historial[minutoActualIdx];
    if (itemActual && 'minuto' in itemActual) {
      return itemActual.minuto.replace('T', ' ');
    }
    return '';
  }, [minutoActualIdx, historial]);

  const insertarAveria = async () => {
    const fechaAplicacion = getFechaAplicacion(tipoSimulacion, tiempoSimulado);
    const url = `/api/averia/insertar-manual?codigoCamion=${codigoCamion}&turno=${turno}&tipo=${tipo}&fechaAplicacion=${fechaAplicacion}`;
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
      });

      const texto = await response.text();

      if (response.ok) {
        setPopupMensaje(texto || 'Avería insertada con éxito.');
        setPopupTipo('success');
      } else {
        setPopupMensaje(`Error ${response.status}: ${texto}`);
        setPopupTipo('error');
      }
    } catch (error) {
      setPopupMensaje(`Error de conexión: ${(error as Error).message}`);
      setPopupTipo('error');
    } finally {
      setCodigoCamion('');
      setTurno('');
      setTipo('');
      setLoading(false);
    }
  };

  const insertarPedido = async () => {
    const fechaLlegada = getFechaLlegada(tiempoSimulado);
    const url = `/api/pedido/insertar-manual?horasLimite=${horasLimite}&destinoX=${destinoX}&destinoY=${destinoY}&idCliente=${idCliente}&cantidad=${cantidad}&fechaLlegada=${fechaLlegada}`;
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
      });

      const texto = await response.text();

      if (response.ok) {
        setPopupMensaje(texto || 'Pedido insertado con éxito.');
        setPopupTipo('success');
      } else {
        setPopupMensaje(`Error ${response.status}: ${texto}`);
        setPopupTipo('error');
      }
    } catch (error) {
      setPopupMensaje(`Error de conexión: ${(error as Error).message}`);
      setPopupTipo('error');
    } finally {
      setHorasLimite('');
      setDestinoX('');
      setDestinoY('');
      setIdCliente('');
      setCantidad('');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tipoSimulacion === "SEMANAL") {
        setActiveTab(Tab.AVERIA);
    }
  }, [tipoSimulacion]);

  return (
    <div className="cajetin-insertar-container">
      <div className="tab-header">
        <button
          className={`tab-button ${activeTab === Tab.AVERIA ? "active" : ""}`}
          onClick={() => setActiveTab(Tab.AVERIA)}
        >
          Insertar Avería
        </button>
        <button
          className={`tab-button ${activeTab === Tab.PEDIDO ? "active" : ""}`}
          onClick={() => setActiveTab(Tab.PEDIDO)}
          disabled={tipoSimulacion === "SEMANAL"}
        >
          Insertar Pedido
        </button>
      </div>

      <div className="tab-content">
        {activeTab === Tab.AVERIA ? (
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              insertarAveria();
            }}
          >
            <input
              type="text"
              placeholder="Código camión"
              value={codigoCamion}
              onChange={(e) => setCodigoCamion(e.target.value)}
              required
            />
            <select value={turno} onChange={(e) => setTurno(e.target.value)}>
                <option value="">-- Selecciona un turno --</option>
                <option value="T1">T1</option>
                <option value="T2">T2</option>
                <option value="T3">T3</option>
              required
            </select>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">-- Selecciona un tipo --</option>
                <option value="TI1">TI1</option>
                <option value="TI2">TI2</option>
                <option value="TI3">TI3</option>
              required
            </select>
            <button type="submit" disabled={loading}>
              {loading ? "Insertando..." : "Insertar Avería"}
            </button>
          </form>
        ) : (
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              insertarPedido();
            }}
          >
            <input
              type="number"
              placeholder="Horas límite"
              value={horasLimite}
              onChange={(e) => setHorasLimite(e.target.value)}
              required
            />
            <div className='coordenadas-input'>
                <input
                type="number"
                placeholder="Destino X"
                value={destinoX}
                onChange={(e) => setDestinoX(e.target.value)}
                required
                />
                <input
                type="number"
                placeholder="Destino Y"
                value={destinoY}
                onChange={(e) => setDestinoY(e.target.value)}
                required
                />
            </div>
            <input
              type="text"
              placeholder="ID Cliente"
              value={idCliente}
              onChange={(e) => setIdCliente(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Insertando..." : "Insertar Pedido"}
            </button>
          </form>
        )}
      </div>
      {popupMensaje && popupTipo && (
        <NotificationPopup
          message={popupMensaje}
          type={popupTipo}
          onClose={() => {
            setPopupMensaje('');
            setPopupTipo('');
          }}
        />
      )}
    </div>
  );
};

export default CajetinInsertar;
