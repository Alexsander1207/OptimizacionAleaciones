export type MetalKey = "I" | "II" | "III" | "IV";

export type EspecificacionAleacionForm = {
  min_I: number;
  max_I: number;
  min_II: number;
  max_II: number;
  min_III: number;
  max_III: number;
  min_IV: number;
  max_IV: number;
};

export type FormPayload = {
  disponibilidad_minerales: Array<{
    mineral_id: number;
    cantidad_maxima: number;
    costo_por_tonelada: number;
  }>;
  precios_aleaciones: { precio_a: number; precio_b: number };
  matriz_constituyentes: Record<
    "mineral_1" | "mineral_2" | "mineral_3",
    Record<MetalKey, number>
  >;
  restricciones_especificaciones: {
    aleacion_a: EspecificacionAleacionForm;
    aleacion_b: EspecificacionAleacionForm;
  };
};

export type DistItem = { Aleacion: string; Mineral: string; Toneladas: number };

export type RadarFila = {
  metal: string;
  actual: number;
  min_spec: number;
  max_spec: number;
  centro_banda: number;
};

export type SugerenciaCambio = {
  tipo: string;
  aleacion: string;
  metal: string;
  limite: string;
  valor_actual_pct: number;
  valor_sugerido_pct: number;
  delta_puntos_pct: number;
  holgura_masa: number;
  mensaje: string;
};

export type ApiResultados = {
  es_factible: boolean;
  mensaje: string | null;
  utilidad_maxima_usd: number;
  estado_optimizacion: string;
  toneladas_aleacion: { A: number; B: number };
  distribucion_toneladas: DistItem[];
  leyes_porcentaje: { A: Record<string, number>; B: Record<string, number> };
  radar: { aleacion_a: RadarFila[]; aleacion_b: RadarFila[] };
  sugerencias_cambio?: SugerenciaCambio[];
  violacion_total_relajacion?: number | null;
  resumen_relajacion?: string | null;
};

export type HistoryEntry = {
  id: string;
  fechaISO: string;
  utilidad: number;
  esFactible: boolean;
  estado: string;
};

/* AlloyLab Pro Extended Types */

export interface Material {
  id: string;
  name: string;
  costPerKg: number;
  composition: Record<string, number>;
}

export interface AlloyTarget {
  elementA: number;
  elementB: number;
  elementC: number;
  totalPercent: number;
  isExceeded: boolean;
}

export interface SimulationResult extends ApiResultados {
  costo_total_usd?: number;
  costo_por_kg?: number;
  precio_venta_usd?: number;
  error_vs_objetivo?: number;
  composicion_lograda?: Record<string, number>;
}

export interface AlloyLabSimulation {
  id: string;
  nombre: string;
  margenPorcentaje: number;
  notas: string;
  materiales: Material[];
  objetivoAleacion: AlloyTarget;
  resultados: SimulationResult | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SmartAdvisorAdvice {
  type: "error" | "warning" | "tip" | "success";
  icon: React.ReactNode;
  message: string;
  priority?: number;
}

