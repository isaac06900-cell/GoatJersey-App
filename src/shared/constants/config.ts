// La IP de tu PC (ipconfig -> IPv4 del wifi) se cambia en el archivo .env, no aquí.
// Después de cambiar el .env reinicia con: npx expo start -c
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5300';
export const API_TIMEOUT_MS = 15000;
