import { apiClient } from '@/shared/api/apiClient';
import { toApiError } from '@/shared/api/ApiError';
import { JerseyDto, JerseyRequest } from '../types';
import { API_JERSEYS, apiJersey } from './endpoints';

/** GET /api/jerseys -> mi colección */
export async function listarJerseys(): Promise<JerseyDto[]> {
  try {
    const { data } = await apiClient.get<JerseyDto[]>(API_JERSEYS);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

/** POST /api/jerseys -> 201 con el jersey creado */
export async function crearJersey(payload: JerseyRequest): Promise<JerseyDto> {
  try {
    const { data } = await apiClient.post<JerseyDto>(API_JERSEYS, payload);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

/** PUT /api/jerseys/{id} -> 204 */
export async function editarJersey(id: number, payload: JerseyRequest): Promise<void> {
  try {
    await apiClient.put(apiJersey(id), payload);
  } catch (error) {
    throw toApiError(error);
  }
}

/** DELETE /api/jerseys/{id} -> 204 (400 si tiene publicación activa) */
export async function eliminarJersey(id: number): Promise<void> {
  try {
    await apiClient.delete(apiJersey(id));
  } catch (error) {
    throw toApiError(error);
  }
}
