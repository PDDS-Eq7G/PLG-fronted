export const LegendFloatingBox = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="legend-box">
      <div className="legend-header">
        <strong>Leyenda</strong>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="legend-content">
        <div className="legend-item"><span className="legend-icon central" /> Almacén central</div>
        <div className="legend-item"><span className="legend-icon intermediate" /> Almacén intermedio</div>
        <div className="legend-item"><span className="legend-icon ta" /> Cisterna tipo TA</div>
        <div className="legend-item"><span className="legend-icon tb" /> Cisterna tipo TB</div>
        <div className="legend-item"><span className="legend-icon tc" /> Cisterna tipo TC</div>
        <div className="legend-item"><span className="legend-icon td" /> Cisterna tipo TD</div>
        <div className="legend-item"><span className="legend-icon broken" /> Cisterna averiada</div>
        <div className="legend-item"><span className="legend-line solid" /> Ruta Cisterna</div>
        <div className="legend-item"><span className="legend-line dashed" /> Ruta futura</div>
        <div className="legend-item"><span className="legend-blocked" /> Bloqueo</div>
        <div className="legend-item"><span className="legend-order" /> Pedido</div>
      </div>
    </div>
  );
};
