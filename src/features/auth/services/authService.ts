import { login as loginRequest, register as registerRequest } from '@/features/auth/api/authApi';
import { setToken } from '@/shared/api/apiClient';
import { clearSession, loadSession, saveSession } from '../storage/secureStorage';
import { LoginResponseDto, RegisterRequest, UserDto } from '../types';

async function persistSession(response: LoginResponseDto): Promise<UserDto> {
  const expiresAtMs = new Date(response.expiresAt).getTime();

  await saveSession({
    accessToken: response.accessToken,
    expiresAt: Number.isFinite(expiresAtMs) ? expiresAtMs : Date.now(),
    user: response.user,
  });

  setToken(response.accessToken); // el interceptor ya puede adjuntar el Bearer

  return response.user;
}

export async function login(correo: string, password: string): Promise<UserDto> {
  const response = await loginRequest({ correo, password });
  return persistSession(response);
}

export async function register(payload: RegisterRequest): Promise<void> {
  await registerRequest(payload);
}

export async function logout(): Promise<void> {
  setToken(null); // deja de mandar el token
  await clearSession();
}

/** Al abrir la app: si hay token guardado y no ha expirado, se restaura la sesión. */
export async function restoreSession(): Promise<UserDto | null> {
  try {
    const stored = await loadSession();
    if (!stored) return null;

    if (stored.expiresAt <= Date.now()) {
      await logout();
      return null;
    }

    setToken(stored.accessToken);
    return stored.user;
  } catch {
    await logout();
    return null;
  }
}
