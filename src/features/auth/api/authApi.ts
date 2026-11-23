import { apiClient } from '@/shared/api/apiClient';
import { toApiError } from '@/shared/api/ApiError';
import { LoginRequest, LoginResponseDto, RegisterRequest } from '../types';
import { API_AUTH_LOGIN, API_AUTH_REGISTER } from './endpoints';

// El backend guarda el rol con ClaimTypes.Role. Según cómo se firme el token llega
// con la URL larga o simplemente como "role"; se aceptan las dos.
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

function decodeJwt(token: string): Record<string, any> {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return JSON.parse(atob(padded));
}

/** POST /api/auth/login  ->  { token } */
export async function login(payload: LoginRequest): Promise<LoginResponseDto> {
  try {
    const { data } = await apiClient.post<{ token: string }>(API_AUTH_LOGIN, payload);
    const claims = decodeJwt(data.token);

    return {
      accessToken: data.token,
      expiresAt: new Date((claims.exp ?? 0) * 1000).toISOString(),
      user: {
        id: Number(claims.sub),
        email: claims.email ?? payload.correo,
        role: claims[ROLE_CLAIM] ?? claims.role ?? '',
      },
    };
  } catch (error) {
    throw toApiError(error);
  }
}

/** POST /api/auth/registro  ->  { mensaje }  (no devuelve token) */
export async function register(payload: RegisterRequest): Promise<void> {
  try {
    await apiClient.post(API_AUTH_REGISTER, payload);
  } catch (error) {
    throw toApiError(error);
  }
}
