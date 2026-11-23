import { setUnauthorizedHandler } from '@/shared/api/apiClient';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { AuthStatus, RegisterRequest, UserDto } from '../types';

interface AuthState {
  status: AuthStatus;
  user: UserDto | null;
}

interface AuthContextValue extends AuthState {
  login: (correo: string, password: string) => Promise<UserDto>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null });

  // Al abrir la app: restaurar la sesión desde SecureStore
  useEffect(() => {
    let cancelled = false;

    authService.restoreSession().then((user) => {
      if (cancelled) return;
      setState(user ? { status: 'authenticated', user } : { status: 'unauthenticated', user: null });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (correo: string, password: string) => {
    const user = await authService.login(correo, password);
    setState({ status: 'authenticated', user });
    return user;
  }, []);

  // El registro no inicia sesión: la pantalla regresa al login
  const register = useCallback(async (payload: RegisterRequest) => {
    await authService.register(payload);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setState({ status: 'unauthenticated', user: null });
  }, []);

  // Un 401 en una ruta protegida (token vencido) cierra la sesión
  useEffect(() => {
    setUnauthorizedHandler(() => {
      void logout();
    });
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, register, logout }),
    [state, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
}
