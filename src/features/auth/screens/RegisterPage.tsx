import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiError, toApiError } from '@/shared/api/ApiError';
import { colors, spacing } from '@/shared/constants/theme';
import AuthTextField from '@/shared/ui/AuthTextField';
import ErrorBanner from '@/shared/ui/ErrorBanner';
import PrimaryButton from '@/shared/ui/PrimaryButton';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const { register } = useAuth();

  // Primero los estados y después lo que los usa
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/login'));

  const canSubmit =
    nombre.trim().length >= 2 &&
    correo.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    // Mismas reglas que valida el backend (RegistroDto)
    if (!EMAIL_REGEX.test(correo.trim())) {
      setError(new ApiError('El correo no tiene un formato válido.'));
      return;
    }
    if (password.length < 6) {
      setError(new ApiError('La contraseña debe tener al menos 6 caracteres.'));
      return;
    }
    if (password !== confirmPassword) {
      setError(new ApiError('Las contraseñas no coinciden.'));
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await register({
        nombre: nombre.trim(),
        correo: correo.trim(),
        password,
      });

      Alert.alert(
        'Cuenta creada',
        'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.',
        [{ text: 'Iniciar sesión', onPress: () => goBack() }],
      );
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
          <Text style={styles.heading}>Crear cuenta</Text>
          <Text style={styles.subheading}>Regístrate para armar tu colección de jerseys</Text>

          {error && <ErrorBanner message={error.message} details={error.errors} />}

          <AuthTextField
            label="Nombre"
            placeholder="Tu nombre"
            autoCorrect={false}
            value={nombre}
            onChangeText={setNombre}
            returnKeyType="next"
          />

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
            placeholder="Mínimo 6 caracteres"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            returnKeyType="next"
          />

          <AuthTextField
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          <PrimaryButton
            label="Crear cuenta"
            onPress={handleSubmit}
            loading={submitting}
            disabled={!canSubmit}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <Pressable onPress={goBack}>
              <Text style={styles.footerLink}>Inicia sesión</Text>
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
  heading: {
    fontSize: 22,
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
