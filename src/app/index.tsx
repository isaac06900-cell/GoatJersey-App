import { useAuth } from '@/features/auth/context/AuthContext';
import { colors, spacing } from '@/shared/constants/theme';
import PrimaryButton from '@/shared/ui/PrimaryButton';
import { StyleSheet, Text, View } from 'react-native';

// Pantalla protegida de prueba: solo se llega aquí con sesión iniciada.
// Más adelante aquí va la colección de jerseys.
export default function Index() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola, {user?.email}</Text>
      <Text style={styles.text}>Rol: {user?.role || 'N/D'}</Text>
      <PrimaryButton label="Cerrar sesión" variant="secondary" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
});
