export interface ConfiguracionGeneral {
  almacen_central_x: string;
  almacen_central_y: string;
  ancho_ciudad: string;
  alto_ciudad: string;
  [key: string]: string; // Para permitir claves adicionales si las hay
}