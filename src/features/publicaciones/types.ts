import { JerseyDto } from '@/features/jerseys/types';

export const TIPOS_PUBLICACION = ['Venta', 'Intercambio', 'Ambos'] as const;

/** Lo que se envía para publicar (POST /api/publicaciones). */
export interface PublicarRequest {
  idJersey: number;
  tipo: string;
  precio: number | null;
  descripcion: string | null;
}

export interface VendedorDto {
  idUsuario: number;
  nombre: string;
  correo: string;
}

/** Publicación con su jersey y su vendedor. */
export interface PublicacionDto {
  idPublicacion: number;
  tipo: string;
  precio: number | null;
  descripcion: string | null;
  estatus: 'Activa' | 'Retirada' | string;
  fechaPublicacion: string;
  jersey: JerseyDto;
  vendedor: VendedorDto;
}
