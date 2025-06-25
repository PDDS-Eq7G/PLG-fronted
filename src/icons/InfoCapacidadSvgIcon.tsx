import React from 'react';

interface InfoCapacidadSvgIconProps {
  width?: number;
  height?: number;
  color?: string;
}

const InfoCapacidadSvgIcon: React.FC<InfoCapacidadSvgIconProps> = ({
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
      <rect x="4" y="3.375" width="7" height="10.125" rx="2" stroke="#F4AB02" stroke-width="2"/>
      <rect x="5.625" y="5" width="3.75" height="6.875" rx="0.8" fill="#F4AB02"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.64421 1.42991C5.625 1.52651 5.625 1.64267 5.625 1.875H9.375C9.375 1.64267 9.375 1.52651 9.35579 1.42991C9.27688 1.03322 8.96678 0.723121 8.57009 0.644215C8.47349 0.625 8.35733 0.625 8.125 0.625H6.875C6.64267 0.625 6.52651 0.625 6.42991 0.644215C6.03322 0.723121 5.72312 1.03322 5.64421 1.42991Z" fill="#F4AB02"/>
    </svg>
  );
};

export default InfoCapacidadSvgIcon;
