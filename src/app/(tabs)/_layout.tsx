import { colors } from '@/shared/constants/theme';
import { Tabs } from 'expo-router';

// Pestañas con sesión iniciada. "Explorar" se agrega en la semana 4.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
        tabBarIconStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="coleccion" options={{ title: 'Mi colección' }} />
    </Tabs>
  );
}
