import { apiClient } from '@/shared/api/apiClient';
import { toApiError } from '@/shared/api/ApiError';
import { PublicacionDto, PublicarRequest } from '../types';
import { API_PUBLICACIONES, apiPublicacion, apiRetirar } from './endpoints';

export interface FiltrosPublicaciones {
  equipo?: string;
  temporada?: string;
  talla?: string;
  tipo?: string;
  version?: string;
}

/** GET /api/publicaciones -> activas de otros usuarios (los filtros son opcionales) */
export async function explorarPublicaciones(filtros: FiltrosPublicaciones = {}): Promise<PublicacionDto[]> {
  try {
    const { data } = await apiClient.get<PublicacionDto[]>(API_PUBLICACIONES, { params: filtros });
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

/** GET /api/publicaciones/{id} */
export async function obtenerPublicacion(id: number): Promise<PublicacionDto> {
  try {
    const { data } = await apiClient.get<PublicacionDto>(apiPublicacion(id));
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

/** POST /api/publicaciones -> 201 con la publicación creada */
export async function publicarJersey(payload: PublicarRequest): Promise<PublicacionDto> {
  try {
    const { data } = await apiClient.post<PublicacionDto>(API_PUBLICACIONES, payload);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

/** PATCH /api/publicaciones/{id}/retirar -> 204 */
export async function retirarPublicacion(id: number): Promise<void> {
  try {
    await apiClient.patch(apiRetirar(id));
  } catch (error) {
    throw toApiError(error);
  }
}
