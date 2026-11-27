import {
  explorarPublicaciones,
  FiltrosPublicaciones,
  obtenerPublicacion,
  publicarJersey,
  retirarPublicacion,
} from '../api/publicacionesApi';
import { PublicarRequest } from '../types';

export const explorar = (filtros?: FiltrosPublicaciones) => explorarPublicaciones(filtros);
export const detalle = (id: number) => obtenerPublicacion(id);
export const retirar = (id: number) => retirarPublicacion(id);

/** Publica un jersey. El precio solo aplica si hay venta. */
export function publicar(idJersey: number, tipo: string, precioTexto: string, descripcion: string) {
  const conVenta = tipo === 'Venta' || tipo === 'Ambos';
  const payload: PublicarRequest = {
    idJersey,
    tipo,
    precio: conVenta ? Number(precioTexto) : null,
    descripcion: descripcion.trim() ? descripcion.trim() : null,
  };
  return publicarJersey(payload);
}

export function validarPublicacion(tipo: string, precioTexto: string): string[] {
  const errores: string[] = [];
  if ((tipo === 'Venta' || tipo === 'Ambos') && !(Number(precioTexto) > 0))
    errores.push('El precio es obligatorio y debe ser mayor que 0 cuando hay venta.');
  return errores;
}
