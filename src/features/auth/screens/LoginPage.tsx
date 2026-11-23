import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError, toApiError } from '@/shared/api/ApiError';
import { colors, radius, spacing } from '@/shared/constants/theme';
import AuthTextField from '@/shared/ui/AuthTextField';
import ErrorBanner from '@/shared/ui/ErrorBanner';
import PrimaryButton from '@/shared/ui/PrimaryButton';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const canSubmit = correo.trim().length > 0 && password.length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setError(null);
    setSubmitting(true);
    try {
      // Si sale bien, el guard del _layout raíz cambia solo a la pantalla principal
      await login(correo.trim(), password);
    } catch (e) {
      setError(toApiError(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.brandBlock}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandEmoji}>⚽</Text>
            </View>
            <Text style={styles.brandTitle}>Goat Jersey</Text>
            <Text style={styles.brandSubtitle}>Colecciona, publica e intercambia jerseys</Text>
          </View>

          <Text style={styles.heading}>Iniciar sesión</Text>
          <Text style={styles.subheading}>Entra con tu correo y contraseña</Text>

          {error && <ErrorBanner message={error.message} details={error.errors} />}

          <AuthTextField
            label="Correo"
            placeholder="tu@correo.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={correo}
            onChangeText={setCorreo}
            returnKeyType="next"
          />

          <AuthTextField
            label="Contraseña"
            placeholder="********"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          <PrimaryButton
            label="Iniciar sesión"
            onPress={handleSubmit}
            loading={submitting}
            disabled={!canSubmit}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.footerLink}>Regístrate</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    justifyContent: 'center',
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  brandIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brandEmoji: {
    fontSize: 28,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subheading: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
});
