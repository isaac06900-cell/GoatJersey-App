import {
  crearJersey,
  editarJersey,
  eliminarJersey,
  listarJerseys,
} from '../api/jerseysApi';
import { JerseyDto, JerseyRequest, ResumenColeccion } from '../types';

export const obtenerColeccion = (): Promise<JerseyDto[]> => listarJerseys();

/** La API no tiene GET /api/jerseys/{id}, así que se busca dentro de la colección. */
export async function obtenerJersey(id: number): Promise<JerseyDto | undefined> {
  const coleccion = await listarJerseys();
  return coleccion.find((j) => j.idJersey === id);
}

export const agregarJersey = (payload: JerseyRequest) => crearJersey(payload);
export const actualizarJersey = (id: number, payload: JerseyRequest) => editarJersey(id, payload);
export const borrarJersey = (id: number) => eliminarJersey(id);

/** Resumen de la pantalla de inicio: total, publicados y valor estimado (RF-03). */
export function calcularResumen(coleccion: JerseyDto[]): ResumenColeccion {
  return {
    total: coleccion.length,
    publicados: coleccion.filter((j) => j.disponibilidad === 'Publicado').length,
    valorEstimado: coleccion.reduce((suma, j) => suma + (j.valorEstimado ?? 0), 0),
  };
}

/** Valida en la app lo básico antes de llamar a la API (la API vuelve a validar). */
export function validarFormulario(f: {
  equipo: string;
  temporada: string;
  valorEstimado: string;
  fotoUrl: string;
}): string[] {
  const errores: string[] = [];
  if (!f.equipo.trim()) errores.push('El equipo es obligatorio.');
  if (!/^\d{4}\/\d{2}$/.test(f.temporada.trim())) errores.push('La temporada debe tener el formato 2009/10.');
  if (f.valorEstimado.trim() && (isNaN(Number(f.valorEstimado)) || Number(f.valorEstimado) < 0))
    errores.push('El valor estimado debe ser un número mayor o igual a 0.');
  if (f.fotoUrl.trim() && !/^https?:\/\//i.test(f.fotoUrl.trim()))
    errores.push('La foto debe ser una URL que empiece con http o https.');
  return errores;
}
