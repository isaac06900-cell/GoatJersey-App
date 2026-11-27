import JerseyFormPage from '@/features/jerseys/screens/JerseyFormPage';
import { useLocalSearchParams } from 'expo-router';

export default function EditarJersey() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <JerseyFormPage id={Number(id)} />;
}
