import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { status } = useAuth();

  useEffect(() => {
    if (status !== 'loading') {
      SplashScreen.hideAsync();
    }
  }, [status]);

  if (status === 'loading') return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Con sesión: pantalla principal. Sin sesión, cualquier intento de entrar manda al login */}
      <Stack.Protected guard={status === 'authenticated'} redirectTo="/login">
        <Stack.Screen name="index" />
      </Stack.Protected>

      {/* Sin sesión: login y registro. Con sesión, mandan a la pantalla principal */}
      <Stack.Protected guard={status === 'unauthenticated'} redirectTo="/">
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
