// src/components/ControlDeMando/FechaInicioDateTimePicker.tsx
import React from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from 'date-fns/locale'; // Importar el locale en español

import "react-datepicker/dist/react-datepicker.css"; // Estilos por defecto de react-datepicker
import { CalendarIcon } from '../../icons/CalendarIcon'; // Asumiendo que Icons.tsx está en el mismo directorio
import './ControlDeMando.css'; // Tus estilos personalizados

// Registrar y establecer el locale español como predeterminado para el datepicker
registerLocale('es', es);
setDefaultLocale('es');

interface FechaInicioDateTimePickerProps {
  selectedDateTime: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
}

// Componente CustomInput para pasar a react-datepicker
// Esto nos permite estilizar el input y añadir el ícono como en tu imagen
interface CustomInputProps {
  value?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void; // onClick es provisto por DatePicker
  disabled?: boolean;
}

const CustomDatePickerInput = React.forwardRef<HTMLDivElement, CustomInputProps>(
  ({ value, onClick, disabled }, ref) => (
    <div className="datetime-picker-custom-input-wrapper" onClick={onClick} ref={ref}>
      <input
        type="text"
        className="datetime-picker-custom-display"
        value={value}
        readOnly // El valor se actualiza por el DatePicker
        disabled={disabled}
        placeholder="dd/mm/aaaa hh:mm:ss"
      />
      <CalendarIcon className="datetime-picker-custom-icon" />
    </div>
  )
);
CustomDatePickerInput.displayName = 'CustomDatePickerInput'; // Para el DevTools de React

const FechaInicioDateTimePicker: React.FC<FechaInicioDateTimePickerProps> = ({
  selectedDateTime,
  onChange,
  disabled,
}) => {
  return (
    <div className="datetime-picker-container">
      <label htmlFor="fecha-inicio-datepicker" className="datetime-picker-label">Fecha de Inicio:</label>
      <DatePicker
        selected={selectedDateTime}
        onChange={onChange}
        showTimeSelect          // Habilitar selección de hora
        timeFormat="HH:mm:ss"   // Formato de hora en el selector de tiempo
        timeIntervals={15}      // Intervalos de minutos en el selector (ej. 15, 30)
        showTimeInput           // Permite escribir la hora directamente, útil para segundos
        timeInputLabel="Hora:"  // Etiqueta para el input de hora
        dateFormat="dd/MM/yyyy HH:mm:ss" // Formato de fecha y hora en el input visible
        locale="es"             // Usar el locale español que registramos
        popperPlacement="bottom-start" // Ubicación del popup del calendario
        customInput={<CustomDatePickerInput disabled={disabled} />} // Nuestro input personalizado
        disabled={disabled}
        enableTabLoop={false}   // Mejora el focus management
        id="fecha-inicio-datepicker" // Para el label
        // portalId="root-portal" // Útil si tienes problemas de z-index con elementos fixed/absolute
        // calendarClassName="mi-calendario-popup-custom" // Clase para estilizar el popup del calendario
      />
    </div>
  );
};

export default FechaInicioDateTimePicker;