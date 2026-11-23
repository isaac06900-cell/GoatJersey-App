export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface UserDto {
  id: number;
  email: string;
  role: string;
}

/* Modelos de entrada hacia el backend (POST /api/auth/login y /api/auth/registro) */
export interface LoginRequest {
  correo: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  password: string;
  // El rol no se manda: el servidor siempre registra como "Coleccionista".
}

/* Modelo interno de sesión (se arma a partir del token que devuelve el login) */
export interface LoginResponseDto {
  user: UserDto;
  accessToken: string;
  expiresAt: string;
}
