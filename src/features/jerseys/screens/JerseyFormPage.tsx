import { ApiError, toApiError } from '@/shared/api/ApiError';
import { colors, spacing } from '@/shared/constants/theme';
import AuthTextField from '@/shared/ui/AuthTextField';
import ErrorBanner from '@/shared/ui/ErrorBanner';
import OptionSelector from '@/shared/ui/OptionSelector';
import PrimaryButton from '@/shared/ui/PrimaryButton';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import {
  actualizarJersey,
  agregarJersey,
  obtenerJersey,
  validarFormulario,
} from '../services/jerseyService';
import { ESTADOS, JerseyRequest, TALLAS, TIPOS_JERSEY, VERSIONES } from '../types';

interface JerseyFormPageProps {
  id?: number; // sin id = crear; con id = editar
}

/** Formulario para agregar o editar un jersey (RF-02). */
const JerseyFormPage = ({ id }: JerseyFormPageProps) => {
  const router = useRouter();
  const editando = id !== undefined;

  const [equipo, setEquipo] = useState('');
  const [temporada, setTemporada] = useState('');
  const [tipo, setTipo] = useState<string>('Local');
  const [talla, setTalla] = useState<string>('M');
  const [estado, setEstado] = useState<string>('Excelente');
  const [version, setVersion] = useState<string>('Original');
  const [valorEstimado, setValorEstimado] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');

  const [cargando, setCargando] = useState(editando);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // En modo edición se precarga el jersey.
  useEffect(() => {
    if (!editando) return;
    obtenerJersey(id!)
      .then((j) => {
        if (!j) {
          setError(new ApiError('El jersey no existe.'));
          return;
        }
        setEquipo(j.equipo);
        setTemporada(j.temporada);
        setTipo(j.tipo);
        setTalla(j.talla);
        setEstado(j.estado);
        setVersion(j.version);
        setValorEstimado(j.valorEstimado != null ? String(j.valorEstimado) : '');
        setFotoUrl(j.fotoUrl ?? '');
      })
      .catch((e) => setError(toApiError(e)))
      .finally(() => setCargando(false));
  }, [editando, id]);

  const handleGuardar = async () => {
    const errores = validarFormulario({ equipo, temporada, valorEstimado, fotoUrl });
    if (errores.length > 0) {
      setError(new ApiError('Revisa los datos.', errores));
      return;
    }

    const payload: JerseyRequest = {
      equipo: equipo.trim(),
      temporada: temporada.trim(),
      tipo,
      talla,
      estado,
      version,
      valorEstimado: valorEstimado.trim() ? Number(valorEstimado) : null,
      fotoUrl: fotoUrl.trim() ? fotoUrl.trim() : null,
    };

    setGuardando(true);
    setError(null);
    try {
      if (editando) await actualizarJersey(id!, payload);
      else await agregarJersey(payload);
      router.back();
    } catch (e) {
      setError(toApiError(e));
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <ActivityIndicator color={colors.primary} style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{editando ? 'Editar jersey' : 'Agregar jersey'}</Text>

      {error ? <ErrorBanner message={error.message} details={error.errors} /> : null}

      <AuthTextField label="Equipo" value={equipo} onChangeText={setEquipo} placeholder="Ej. Barcelona" />
      <AuthTextField
        label="Temporada"
        value={temporada}
        onChangeText={setTemporada}
        placeholder="Formato 2009/10"
        autoCapitalize="none"
      />
      <OptionSelector label="Tipo" options={TIPOS_JERSEY} value={tipo} onChange={setTipo} />
      <OptionSelector label="Talla" options={TALLAS} value={talla} onChange={setTalla} />
      <OptionSelector label="Estado" options={ESTADOS} value={estado} onChange={setEstado} />
      <OptionSelector label="Versión" options={VERSIONES} value={version} onChange={setVersion} />
      <AuthTextField
        label="Valor estimado (opcional)"
        value={valorEstimado}
        onChangeText={setValorEstimado}
        keyboardType="decimal-pad"
        placeholder="Ej. 1500"
      />
      <AuthTextField
        label="URL de la foto (opcional)"
        value={fotoUrl}
        onChangeText={setFotoUrl}
        autoCapitalize="none"
        keyboardType="url"
        placeholder="https://..."
      />

      <PrimaryButton label={editando ? 'Guardar cambios' : 'Guardar jersey'} onPress={handleGuardar} loading={guardando} />
      <PrimaryButton label="Cancelar" variant="secondary" onPress={() => router.back()} disabled={guardando} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingTop: spacing.xxl * 2, paddingBottom: spacing.xxl * 2 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.lg },
});

export default JerseyFormPage;
