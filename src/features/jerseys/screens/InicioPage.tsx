import { useAuth } from '@/features/auth/context/AuthContext';
import { ApiError, toApiError } from '@/shared/api/ApiError';
import { colors, radius, spacing } from '@/shared/constants/theme';
import ErrorBanner from '@/shared/ui/ErrorBanner';
import PrimaryButton from '@/shared/ui/PrimaryButton';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { calcularResumen, obtenerColeccion } from '../services/jerseyService';
import { ResumenColeccion } from '../types';

/** Pantalla de inicio: saludo y resumen de la colección (RF-03). */
const InicioPage = () => {
  const { user, logout } = useAuth();
  const [resumen, setResumen] = useState<ResumenColeccion | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  // Se recalcula cada vez que la pantalla vuelve a mostrarse (después de agregar o publicar).
  useFocusEffect(
    useCallback(() => {
      let activo = true;
      setLoading(true);
      obtenerColeccion()
        .then((coleccion) => {
          if (activo) {
            setResumen(calcularResumen(coleccion));
            setError(null);
          }
        })
        .catch((e) => activo && setError(toApiError(e)))
        .finally(() => activo && setLoading(false));
      return () => {
        activo = false;
      };
    }, []),
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hola, {user?.email}</Text>
      <Text style={styles.subtitle}>Rol: {user?.role || 'N/D'}</Text>

      {error ? <ErrorBanner message={error.message} details={error.errors} /> : null}

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
      ) : resumen ? (
        <View style={styles.cards}>
          <Dato titulo="Jerseys" valor={String(resumen.total)} />
          <Dato titulo="Publicados" valor={String(resumen.publicados)} />
          <Dato titulo="Valor estimado" valor={`$${resumen.valorEstimado.toFixed(2)}`} />
        </View>
      ) : null}

      <PrimaryButton label="Cerrar sesión" variant="secondary" onPress={logout} />
    </ScrollView>
  );
};

const Dato = ({ titulo, valor }: { titulo: string; valor: string }) => (
  <View style={styles.dato}>
    <Text style={styles.datoValor}>{valor}</Text>
    <Text style={styles.datoTitulo}>{titulo}</Text>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xxl, paddingTop: spacing.xxl * 2 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: spacing.xl },
  cards: { gap: spacing.md, marginBottom: spacing.lg },
  dato: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  datoValor: { fontSize: 28, fontWeight: '700', color: colors.primary },
  datoTitulo: { fontSize: 14, color: colors.textSecondary },
});

export default InicioPage;
