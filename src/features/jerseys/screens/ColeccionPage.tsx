import { retirar } from '@/features/publicaciones/services/publicacionService';
import { ApiError, toApiError } from '@/shared/api/ApiError';
import { colors, spacing } from '@/shared/constants/theme';
import ErrorBanner from '@/shared/ui/ErrorBanner';
import PrimaryButton from '@/shared/ui/PrimaryButton';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import JerseyCard from '../components/JerseyCard';
import PublicarModal from '../components/PublicarModal';
import { borrarJersey, obtenerColeccion } from '../services/jerseyService';
import { JerseyDto } from '../types';

/** Mi colección: lista de mis jerseys con editar, eliminar y publicar / retirar. */
const ColeccionPage = () => {
  const router = useRouter();
  const [jerseys, setJerseys] = useState<JerseyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [aPublicar, setAPublicar] = useState<JerseyDto | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      setJerseys(await obtenerColeccion());
      setError(null);
    } catch (e) {
      setError(toApiError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  const eliminar = (jersey: JerseyDto) => {
    Alert.alert('Eliminar jersey', `¿Eliminar ${jersey.equipo} ${jersey.temporada}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await borrarJersey(jersey.idJersey);
            await cargar();
          } catch (e) {
            setError(toApiError(e)); // p. ej. "No puedes eliminar un jersey con una publicación activa..."
          }
        },
      },
    ]);
  };

  // La API devuelve en cada jersey el id de su publicación activa (idPublicacionActiva).
  const retirarPublicacionDe = async (jersey: JerseyDto) => {
    if (jersey.idPublicacionActiva == null) {
      setError(new ApiError('Este jersey no tiene una publicación activa.'));
      return;
    }
    try {
      await retirar(jersey.idPublicacionActiva);
      await cargar();
    } catch (e) {
      setError(toApiError(e));
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Mi colección</Text>
      <PrimaryButton label="Agregar jersey" onPress={() => router.push('/jersey/nuevo')} />

      {error ? (
        <View style={{ marginTop: spacing.lg }}>
          <ErrorBanner message={error.message} details={error.errors} />
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={jerseys}
          keyExtractor={(j) => String(j.idJersey)}
          contentContainerStyle={{ paddingTop: spacing.lg, paddingBottom: spacing.xxl }}
          ListEmptyComponent={<Text style={styles.empty}>Aún no tienes jerseys. Agrega el primero.</Text>}
          renderItem={({ item }) => (
            <JerseyCard jersey={item}>
              <PrimaryButton
                label="Editar"
                variant="secondary"
                onPress={() => router.push({ pathname: '/jersey/[id]', params: { id: String(item.idJersey) } })}
              />
              {item.disponibilidad === 'Publicado' ? (
                <PrimaryButton label="Retirar publicación" variant="secondary" onPress={() => retirarPublicacionDe(item)} />
              ) : (
                <PrimaryButton label="Publicar" onPress={() => setAPublicar(item)} />
              )}
              <PrimaryButton label="Eliminar" variant="secondary" onPress={() => eliminar(item)} />
            </JerseyCard>
          )}
        />
      )}

      <PublicarModal jersey={aPublicar} onClose={() => setAPublicar(null)} onPublicado={cargar} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, paddingTop: spacing.xxl * 2 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.xl },
});

export default ColeccionPage;
