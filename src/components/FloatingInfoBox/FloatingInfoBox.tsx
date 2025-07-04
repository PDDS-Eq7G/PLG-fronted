// src/components/FloatingInfoBox/FloatingInfoBox.tsx
import React, { JSX, useEffect, useRef, useState } from 'react';
import { FaTimes, FaTruck, FaCubes, FaCalendarAlt, FaBatteryHalf, FaWarehouse } from 'react-icons/fa';
import TruckSvgIcon from '../../icons/TruckSvgIcon';
import InfoStatusSvgIcon from '../../icons/InfoStatusSvgIcon';
import InfoPedidoSvgIcon from '../../icons/InfoPedidoSvgIcon';
import InfoCalendarioSvgIcon from '../../icons/InfoCalendarioSvgIcon';
import InfoCapacidadSvgIcon from '../../icons/InfoCapacidadSvgIcon';
import InfoUbicacionSvgIcon from '../../icons/InfoUbicacionSvgIcon';
import InfoCantidadSvgIcon from '../../icons/InfoCantidadSvgIcon';
import TanqueIntermedioIcon from '../../icons/TanqueIntermedioIcon';

function formatearFecha(fechaStr: string): string {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export interface InfoBoxContent {
  id?: string;
  tipo: 'camion' | 'pedido' | 'tanque' | string;
  color?: string;
  estado?: string;
  pedido?: string;
  llegada?: string;
  capacidad?: string;
  ubicacion?: string;
  camionAsignado?: string;
  cantidad?: number;
  cantidadAsignada?: number;
  [key: string]: any;
}

interface FloatingInfoBoxProps {
  x: number;
  y: number;
  visible: boolean;
  content: InfoBoxContent;
  onClose?: () => void;
  containerWidth: number;
  containerHeight: number;
}

const BOX_WIDTH = 250;
const BOX_HEIGHT = 140;

const FloatingInfoBox: React.FC<FloatingInfoBoxProps> = ({
  x,
  y,
  visible,
  content,
  onClose,
  containerWidth,
  containerHeight,
}) => {
  const [pos, setPos] = useState({ x, y });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging.current) setPos({ x, y });
  }, [x, y]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    offset.current = {
      x: e.clientX - pos.x, // - (boxRef.current?.getBoundingClientRect().left ?? 0),
      y: e.clientY - pos.y, //- (boxRef.current?.getBoundingClientRect().top ?? 0),
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    let newX = e.clientX - offset.current.x;
    let newY = e.clientY - offset.current.y;

    newX = Math.max(0, Math.min(containerWidth - BOX_WIDTH, newX));
    newY = Math.max(0, Math.min(containerHeight - BOX_HEIGHT, newY));
    setPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  if (!visible) return null;

  const iconMap: Record<string, JSX.Element> = {
    camion: <TruckSvgIcon width={20} height={20} color={content.color || '#D300DE'} />,
    pedido: <InfoPedidoSvgIcon width={20} height={20} />,
    tanque: <TanqueIntermedioIcon width={20} height={20} />,
  };

  return (
    <div
      ref={boxRef}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: BOX_WIDTH,
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #ddd',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontFamily: 'sans-serif',
        fontSize: '0.85rem',
        zIndex: 5000,
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '6px 10px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'grab',
        }}
        onMouseDown={handleMouseDown}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {iconMap[content.tipo] || <FaTruck />}
          <span>{content.id}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
            color: '#777',
          }}
        >
          <FaTimes />
        </button>
      </div>

      {/* Body */}
      <div 
        style={{ 
          padding: '10px 14px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px'
        }}
      >
        {content.estado && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InfoStatusSvgIcon width={22} height={20} />
            <span>Estado: {content.estado}</span>
          </div>
        )}
        {content.ubicacion && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InfoUbicacionSvgIcon width={22} height={20} />
            <span>Ubicación: {content.ubicacion}</span>
          </div>
        )}
        {content.pedido && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InfoPedidoSvgIcon width={22} height={20} />
            <span>Pedido: {content.pedido}</span>
          </div>
        )}
        {content.camionAsignado && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TruckSvgIcon width={22} height={20} />
            <span>Camión: {content.camionAsignado}</span>
          </div>
        )}
        {content.cantidad && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InfoCantidadSvgIcon width={22} height={20} />
            <span>Cantidad: {content.cantidad}</span>
          </div>
        )}
        {content.cantidadAsignada !== undefined && content.cantidadAsignada > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InfoCantidadSvgIcon width={22} height={20} />
            <span>Cant. Asignada: {content.cantidadAsignada}</span>
          </div>
        )}
        {content.capacidad && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InfoCapacidadSvgIcon width={22} height={20} />
            <span>Capacidad (m<sup>3</sup>): {content.capacidad}</span>
          </div>
        )}
        {content.llegada && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InfoCalendarioSvgIcon width={22} height={20} />
            <span>Llegada: {formatearFecha(content.llegada)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingInfoBox;
