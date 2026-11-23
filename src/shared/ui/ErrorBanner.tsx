import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/constants/theme';

interface ErrorBannerProps {
  message: string;
  details?: string[];
}

const ErrorBanner = ({ message, details = [] }: ErrorBannerProps) => {
  return (
    <View style={styles.banner}>
      <Text style={styles.message}>{message}</Text>
      {details.map((detail, index) => (
        <Text key={`${index}-${detail}`} style={styles.detail}>
          • {detail}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.dangerBackground,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  message: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  detail: {
    color: colors.danger,
    fontSize: 13,
    marginTop: spacing.xs,
  },
});

export default ErrorBanner;
