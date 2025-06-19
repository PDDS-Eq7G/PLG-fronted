// src/components/FloatingInfoBox/FloatingInfoBox.tsx
import React, { JSX, useEffect, useRef, useState } from 'react';
import { FaTimes, FaTruck, FaCubes, FaCalendarAlt, FaBatteryHalf, FaWarehouse } from 'react-icons/fa';

export interface InfoBoxContent {
  id: string;
  tipo: 'camion' | 'pedido' | 'almacen' | string;
  estado?: string;
  pedido?: string;
  llegada?: string;
  capacidad?: string;
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

const BOX_WIDTH = 200;
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
      x: e.clientX - (boxRef.current?.getBoundingClientRect().left ?? 0),
      y: e.clientY - (boxRef.current?.getBoundingClientRect().top ?? 0),
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
    camion: <FaTruck color="#d300de" />,
    pedido: <FaCubes color="#ffc107" />,
    almacen: <FaWarehouse color="#4caf50" />,
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
        zIndex: 999,
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
      <div style={{ padding: '8px 12px' }}>
        {content.estado && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 6 }}>
            <FaTruck color="#3f51b5" />
            <span>Estado: {content.estado}</span>
          </div>
        )}
        {content.pedido && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 6 }}>
            <FaCubes color="#ffc107" />
            <span>Pedido: {content.pedido}</span>
          </div>
        )}
        {content.llegada && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 6 }}>
            <FaCalendarAlt color="#2196f3" />
            <span>Llegada: {content.llegada}</span>
          </div>
        )}
        {content.capacidad && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaBatteryHalf color="#ff9800" />
            <span>Capacidad: {content.capacidad}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingInfoBox;
