import * as SecureStore from 'expo-secure-store';
import type { UserDto } from '../types';

const KEYS = {
  accessToken: 'goat_jersey.access_token',
  expiresAt: 'goat_jersey.expires_at',
  user: 'goat_jersey.user',
} as const;

export interface StoredSession {
  accessToken: string;
  expiresAt: number; // milisegundos desde 1970
  user: UserDto;
}

export async function saveSession(session: StoredSession): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.accessToken, session.accessToken),
    SecureStore.setItemAsync(KEYS.expiresAt, String(session.expiresAt)),
    SecureStore.setItemAsync(KEYS.user, JSON.stringify(session.user)),
  ]);
}

export async function loadSession(): Promise<StoredSession | null> {
  const [accessToken, expiresAtStr, userStr] = await Promise.all([
    SecureStore.getItemAsync(KEYS.accessToken),
    SecureStore.getItemAsync(KEYS.expiresAt),
    SecureStore.getItemAsync(KEYS.user),
  ]);

  if (!accessToken || !expiresAtStr || !userStr) return null;

  try {
    return {
      accessToken,
      expiresAt: Number(expiresAtStr),
      user: JSON.parse(userStr) as UserDto,
    };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.accessToken),
    SecureStore.deleteItemAsync(KEYS.expiresAt),
    SecureStore.deleteItemAsync(KEYS.user),
  ]);
}
