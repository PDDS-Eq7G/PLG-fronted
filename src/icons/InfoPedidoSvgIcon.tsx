import React from 'react';

interface InfoPedidoSvgIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const InfoPedidoSvgIcon: React.FC<InfoPedidoSvgIconProps> = ({
  width = 25,
  height = 25,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 19V11M9 19L1.94 14.5875C1.48048 14.3003 1.25072 14.1567 1.12536 13.9305C1 13.7043 1 13.4334 1 12.8915V6M9 19L13 16.5L16.06 14.5875C16.5195 14.3003 16.7493 14.1567 16.8746 13.9305C17 13.7043 17 13.4334 17 12.8915V6M9 11L1 6M9 11L17 6M1 6L7.94 1.6625C8.45547 1.34033 8.7132 1.17925 9 1.17925C9.2868 1.17925 9.54453 1.34033 10.06 1.6625L17 6" stroke="#E4BB4B" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  );
};

export default InfoPedidoSvgIcon;
