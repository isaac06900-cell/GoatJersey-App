import { colors, radius, spacing } from '@/shared/constants/theme';
import { Image, StyleSheet, Text, View } from 'react-native';
import { JerseyDto } from '../types';

interface JerseyCardProps {
  jersey: JerseyDto;
  children?: React.ReactNode; // botones de acción
}

const JerseyCard = ({ jersey, children }: JerseyCardProps) => {
  const publicado = jersey.disponibilidad === 'Publicado';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {jersey.fotoUrl ? <Image source={{ uri: jersey.fotoUrl }} style={styles.photo} /> : null}
        <View style={styles.info}>
          <Text style={styles.title}>{jersey.equipo}</Text>
          <Text style={styles.text}>
            {jersey.temporada} · {jersey.tipo} · Talla {jersey.talla}
          </Text>
          <Text style={styles.text}>
            {jersey.version} · {jersey.estado}
          </Text>
          {jersey.valorEstimado != null ? (
            <Text style={styles.text}>Valor estimado: ${jersey.valorEstimado.toFixed(2)}</Text>
          ) : null}
        </View>
      </View>
      <Text style={[styles.badge, publicado ? styles.badgePublicado : styles.badgeColeccion]}>
        {publicado ? 'Publicado' : 'En colección'}
      </Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: { flexDirection: 'row', gap: spacing.md },
  photo: { width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.border },
  info: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  text: { fontSize: 14, color: colors.textSecondary },
  badge: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  badgePublicado: { backgroundColor: colors.primary, color: colors.textOnPrimary },
  badgeColeccion: { backgroundColor: colors.border, color: colors.text },
});

export default JerseyCard;
