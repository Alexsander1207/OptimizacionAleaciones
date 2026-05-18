import type { FormPayload } from "./types";

export const CASO_LIBRO: FormPayload = {
  disponibilidad_minerales: [
    { mineral_id: 1, cantidad_maxima: 1000, costo_por_tonelada: 30 },
    { mineral_id: 2, cantidad_maxima: 2000, costo_por_tonelada: 40 },
    { mineral_id: 3, cantidad_maxima: 3000, costo_por_tonelada: 50 },
  ],
  precios_aleaciones: { precio_a: 200, precio_b: 300 },
  matriz_constituyentes: {
    mineral_1: { I: 30, II: 40, III: 22, IV: 8 },
    mineral_2: { I: 35, II: 28, III: 25, IV: 12 },
    mineral_3: { I: 18, II: 22, III: 35, IV: 25 },
  },
  restricciones_especificaciones: {
    aleacion_a: {
      min_I: 85,
      max_I: 90,
      min_II: 2,
      max_II: 8,
      min_III: 2,
      max_III: 10,
      min_IV: 0,
      max_IV: 5,
    },
    aleacion_b: {
      min_I: 96,
      max_I: 99,
      min_II: 1,
      max_II: 3,
      min_III: 0,
      max_III: 5,
      min_IV: 0,
      max_IV: 3,
    },
  },
};

export function deepCloneForm(): FormPayload {
  return JSON.parse(JSON.stringify(CASO_LIBRO)) as FormPayload;
}
