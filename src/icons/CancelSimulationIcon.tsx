import React from 'react';

const CancelSimulacionIcon: React.FC = () => (
  <svg
    className="cancel-simulation-icon"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.7"
    stroke="none"
    aria-hidden="true"
    width="16"
    height="16"
    style={{ marginRight: "8px" }}
  >
    <circle cx="12" cy="12" r="10" fill="#FF3B30"/> {/* Rojo iOS */}
    <path d="M15 9L9 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default CancelSimulacionIcon;