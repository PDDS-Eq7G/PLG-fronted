// src/components/GridMap/GridCell.tsx
/*import React from 'react';
import { GridCellData } from '../../types/map';
import '../../App.css';

interface Props {
  data: GridCellData;
  size: number;
}

export const GridCell: React.FC<Props> = ({ data, size }) => {
  const getIcon = () => {
    // Prioridad de visualización: Nodo bloqueado > Pedido > Tanque > Almacén
    switch (data.type) {
      case 'blocked': return '🚫'; // Emoji para nodo bloqueado
      case 'order': return '📦';   // Emoji para pedido
      case 'intermediate': return '🏭';
      case 'central': return '🏠';
      default: return '';
    }
  };

  return (
    <div
      className={`grid-cell ${data.type}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.7, // Ajuste para que los emojis se vean bien
        border: '1px solid #eee', // Borde más sutil
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: data.type === 'empty' ? '#fff' : '#f0f0f0', // Color de fondo
      }}
    >
      <span
        style={{
          fontSize: size * 0.7,
          lineHeight: 1,
          display: 'block',
        }}
      >
        {getIcon()}
      </span>
    </div>
  );
};*/

import React from 'react';
import { GridCellData } from '../../types/map';
import '../../App.css';

interface Props {
  data: GridCellData;
  size: number;
}

export const GridCell: React.FC<Props> = ({ data, size }) => {
  const renderSVG = () => {
    switch (data.type) {
      case 'blocked':
        return null; // No SVG, solo color negro
      /*case 'order':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="21" viewBox="0 0 16 21" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M7.54893 0C3.38003 0 0 4.06564 0 8.633C0 13.1648 2.40905 18.0907 6.16842 19.9818C6.60052 20.1996 7.07181 20.3125 7.54893 20.3125C8.02605 20.3125 8.49734 20.1996 8.92944 19.9818C12.6888 18.0907 15.0979 13.1648 15.0979 8.633C15.0979 4.06564 11.7178 0 7.54893 0ZM7.54893 10.1565C8.04945 10.1565 8.52948 9.94246 8.8834 9.56152C9.23733 9.18058 9.43616 8.66391 9.43616 8.12518C9.43616 7.58645 9.23733 7.06978 8.8834 6.68884C8.52948 6.3079 8.04945 6.09388 7.54893 6.09388C7.0484 6.09388 6.56838 6.3079 6.21445 6.68884C5.86053 7.06978 5.6617 7.58645 5.6617 8.12518C5.6617 8.66391 5.86053 9.18058 6.21445 9.56152C6.56838 9.94246 7.0484 10.1565 7.54893 10.1565Z" fill="#FF0000" />
            <path d="M7.54883 0.5C11.3737 0.5 14.5976 4.26862 14.5977 8.63281C14.5977 12.8939 12.395 17.4567 9.0332 19.3594L8.70508 19.5352H8.7041C8.34082 19.7182 7.94659 19.8125 7.54883 19.8125C7.20079 19.8125 6.85552 19.7403 6.53125 19.5996L6.39355 19.5352C2.84747 17.7513 0.5 13.0312 0.5 8.63281C0.500094 4.26866 3.72396 0.500066 7.54883 0.5ZM7.54883 5.59375C6.90345 5.59378 6.29297 5.87047 5.84863 6.34863C5.40545 6.82564 5.16215 7.46511 5.16211 8.125C5.16211 8.78495 5.40542 9.42431 5.84863 9.90137C6.29298 10.3796 6.90337 10.6562 7.54883 10.6562C8.19433 10.6562 8.80563 10.3797 9.25 9.90137C9.69298 9.42436 9.93652 8.78477 9.93652 8.125C9.93648 7.4652 9.69306 6.82562 9.25 6.34863C8.80563 5.87034 8.19433 5.59375 7.54883 5.59375Z" stroke="black" strokeOpacity="0.5" />
          </svg>
        );*/
      case 'intermediate':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4.8158 16.0738H16.2632M4.8158 12.0113H16.2632M20.079 6.27306V18.1051C20.079 18.6438 19.878 19.1605 19.5202 19.5414C19.1624 19.9223 18.6771 20.1363 18.1711 20.1363H2.9079C2.40189 20.1363 1.91661 19.9223 1.55881 19.5414C1.20101 19.1605 1 18.6438 1 18.1051V6.27306C1.00154 5.86798 1.1168 5.47263 1.33098 5.13782C1.54517 4.80301 1.84849 4.54403 2.20198 4.39415L9.83358 1.14415C10.2869 0.951949 10.7921 0.951949 11.2454 1.14415L18.877 4.39415C19.2305 4.54403 19.5338 4.80301 19.748 5.13782C19.9622 5.47263 20.0775 5.86798 20.079 6.27306Z" stroke="#0017A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.8158 13.6724C4.8158 10.5113 7.37838 7.94873 10.5395 7.94873V7.94873C13.7006 7.94873 16.2632 10.5113 16.2632 13.6724V14.4125C16.2632 17.5736 13.7006 20.1362 10.5395 20.1362V20.1362C7.37838 20.1362 4.8158 17.5736 4.8158 14.4125V13.6724Z" stroke="#0017A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'central':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4.8158 16.0738H16.2632M4.8158 12.0113H16.2632M20.079 6.27306V18.1051C20.079 18.6438 19.878 19.1605 19.5202 19.5414C19.1624 19.9223 18.6771 20.1363 18.1711 20.1363H2.9079C2.40189 20.1363 1.91661 19.9223 1.55881 19.5414C1.20101 19.1605 1 18.6438 1 18.1051V6.27306C1.00154 5.86798 1.1168 5.47263 1.33098 5.13782C1.54517 4.80301 1.84849 4.54403 2.20198 4.39415L9.83358 1.14415C10.2869 0.951949 10.7921 0.951949 11.2454 1.14415L18.877 4.39415C19.2305 4.54403 19.5338 4.80301 19.748 5.13782C19.9622 5.47263 20.0775 5.86798 20.079 6.27306Z" stroke="#7E0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.8158 13.6724C4.8158 10.5113 7.37838 7.94873 10.5395 7.94873V7.94873C13.7006 7.94873 16.2632 10.5113 16.2632 13.6724V14.4125C16.2632 17.5736 13.7006 20.1362 10.5395 20.1362V20.1362C7.37838 20.1362 4.8158 17.5736 4.8158 14.4125V13.6724Z" stroke="#7E0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`grid-cell ${data.type}`}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #eee',
        backgroundColor: data.type === 'blocked' ? '#000' : '#fff',
      }}
      role="img"
      aria-label={
        data.type === 'intermediate'
          ? 'Tanque intermedio'
          : data.type === 'central'
          ? 'Almacén central'
          : undefined
      }
      title={
        data.type === 'intermediate'
          ? 'Tanque intermedio'
          : data.type === 'central'
          ? 'Almacén central'
          : undefined
      }
    >
      {renderSVG()}
    </div>
  );
};
