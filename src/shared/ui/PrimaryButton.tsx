import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '@/shared/constants/theme';

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const PrimaryButton = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: PrimaryButtonProps) => {
  const isSecondary = variant === 'secondary';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.button, isSecondary ? styles.buttonSecondary : styles.buttonPrimary, isDisabled && styles.buttonDisabled]}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.primary : colors.textOnPrimary} />
      ) : (
        <Text style={[styles.label, isSecondary ? styles.labelSecondary : styles.labelPrimary]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  labelPrimary: {
    color: colors.textOnPrimary,
  },
  labelSecondary: {
    color: colors.primary,
  },
});

export default PrimaryButton;
