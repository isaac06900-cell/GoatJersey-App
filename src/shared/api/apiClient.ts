import axios from 'axios';
import { API_TIMEOUT_MS, API_URL } from '../constants/config';

/** Única instancia de Axios de toda la app: baseURL, timeout e interceptores. */
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// Token en memoria. Lo fija authService al iniciar sesión o al restaurarla.
let currentToken: string | null = null;

export function setToken(token: string | null): void {
  currentToken = token;
}

// Callback que registra el AuthContext para cerrar sesión cuando el backend responde 401.
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

// Interceptor de REQUEST: adjunta el Bearer token automáticamente.
apiClient.interceptors.request.use((config) => {
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

// Interceptor de RESPONSE: un 401 en una ruta protegida significa token vencido o inválido.
// Las rutas /api/auth/ se excluyen: ahí un 401 solo quiere decir "credenciales incorrectas".
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? '';
    const esAuth = url.includes('/api/auth/');

    if (error.response?.status === 401 && !esAuth) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);
