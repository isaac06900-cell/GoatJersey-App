import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/shared/constants/theme';

interface OptionSelectorProps {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}

/** Fila de opciones tipo "chip" para campos con valores fijos (talla, tipo, estado...). */
const OptionSelector = ({ label, options, value, onChange }: OptionSelectorProps) => {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 14, color: colors.text },
  chipTextSelected: { color: colors.textOnPrimary, fontWeight: '600' },
});

export default OptionSelector;
