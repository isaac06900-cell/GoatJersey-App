import { publicar, validarPublicacion } from '@/features/publicaciones/services/publicacionService';
import { TIPOS_PUBLICACION } from '@/features/publicaciones/types';
import { ApiError, toApiError } from '@/shared/api/ApiError';
import { colors, radius, spacing } from '@/shared/constants/theme';
import AuthTextField from '@/shared/ui/AuthTextField';
import ErrorBanner from '@/shared/ui/ErrorBanner';
import OptionSelector from '@/shared/ui/OptionSelector';
import PrimaryButton from '@/shared/ui/PrimaryButton';
import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { JerseyDto } from '../types';

interface PublicarModalProps {
  jersey: JerseyDto | null; // null = cerrado
  onClose: () => void;
  onPublicado: () => void;
}

/** Ventana para publicar un jersey de mi colección (venta, intercambio o ambos). */
const PublicarModal = ({ jersey, onClose, onPublicado }: PublicarModalProps) => {
  const [tipo, setTipo] = useState<string>('Venta');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const conVenta = tipo === 'Venta' || tipo === 'Ambos';

  const cerrar = () => {
    Keyboard.dismiss();
    setTipo('Venta');
    setPrecio('');
    setDescripcion('');
    setError(null);
    onClose();
  };

  const handlePublicar = async () => {
    if (!jersey) return;
    Keyboard.dismiss();
    const errores = validarPublicacion(tipo, precio);
    if (errores.length > 0) {
      setError(new ApiError('Revisa los datos.', errores));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await publicar(jersey.idJersey, tipo, precio, descripcion);
      cerrar();
      onPublicado();
    } catch (e) {
      setError(toApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={jersey !== null} transparent animationType="slide" onRequestClose={cerrar}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Tocar fuera de la ventana cierra el teclado */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.flexSpacer} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
          >
            {/* Tocar un espacio vacío de la ventana también cierra el teclado */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View>
                <Text style={styles.title}>Publicar {jersey?.equipo}</Text>

                {error ? <ErrorBanner message={error.message} details={error.errors} /> : null}

                <OptionSelector label="Tipo" options={TIPOS_PUBLICACION} value={tipo} onChange={setTipo} />
                {conVenta ? (
                  <AuthTextField
                    label="Precio (MXN)"
                    value={precio}
                    onChangeText={setPrecio}
                    keyboardType="decimal-pad"
                    placeholder="Ej. 1500"
                  />
                ) : null}
                <AuthTextField
                  label="Descripción (opcional)"
                  value={descripcion}
                  onChangeText={setDescripcion}
                  multiline
                  maxLength={500}
                  placeholder="Estado, detalles, forma de entrega..."
                />

                <PrimaryButton label="Publicar" onPress={handlePublicar} loading={loading} />
                <PrimaryButton label="Cancelar" variant="secondary" onPress={cerrar} disabled={loading} />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  flexSpacer: { flex: 1 },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.xl,
    maxHeight: '85%',
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: spacing.lg },
});

export default PublicarModal;
