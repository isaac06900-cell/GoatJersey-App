import { isAxiosError } from 'axios';

/** Error de la API ya traducido a algo que se puede mostrar en pantalla. */
export class ApiError extends Error {
  readonly errors: string[];
  readonly status?: number;

  constructor(message: string, errors: string[] = [], status?: number) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
    this.status = status;
  }
}

/**
 * Convierte cualquier error de Axios en un ApiError.
 * El backend responde:
 *  - { "error": "mensaje" }                      -> reglas de negocio, 401, 403, 404
 *  - { "title": "...", "errors": { Campo: [] } } -> validaciones de los DTOs (400)
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    if (!error.response) {
      return new ApiError(
        'No se pudo conectar con el servidor. Revisa tu red y la IP de la API en el .env.',
      );
    }

    const status = error.response.status;
    const data: any = error.response.data;

    if (typeof data?.error === 'string') {
      return new ApiError(data.error, [], status);
    }

    if (data?.errors && typeof data.errors === 'object') {
      const list: string[] = Object.values<unknown>(data.errors).flat().map(String);
      return new ApiError('Hay datos inválidos.', list, status);
    }

    return new ApiError(`Error del servidor (${status}).`, [], status);
  }

  return new ApiError('Ocurrió un error inesperado.');
}
