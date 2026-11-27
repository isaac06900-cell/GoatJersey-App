export const TIPOS_JERSEY = ['Local', 'Visitante', 'Tercero', 'Portero', 'Retro', 'Especial'] as const;
export const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export const ESTADOS = ['Nuevo', 'Excelente', 'Bueno', 'Regular'] as const;
export const VERSIONES = ['Original', 'Replica'] as const;

/** Lo que devuelve la API de un jersey (GET /api/jerseys). */
export interface JerseyDto {
  idJersey: number;
  equipo: string;
  temporada: string;
  tipo: string;
  talla: string;
  estado: string;
  version: string;
  valorEstimado: number | null;
  fotoUrl: string | null;
  disponibilidad: 'EnColeccion' | 'Publicado' | string;
  idPublicacionActiva: number | null;
  fechaAlta: string;
}

/** Lo que se envía para crear o editar un jersey (POST y PUT /api/jerseys). */
export interface JerseyRequest {
  equipo: string;
  temporada: string;
  tipo: string;
  talla: string;
  estado: string;
  version: string;
  valorEstimado: number | null;
  fotoUrl: string | null;
}

/** Resumen de la pantalla de inicio (se calcula en la app a partir de la colección). */
export interface ResumenColeccion {
  total: number;
  publicados: number;
  valorEstimado: number;
}
