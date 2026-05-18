/* ============================================================
   AlloyLab Pro - Configuración de Ejemplo
   ============================================================
   Este archivo contiene ejemplos de datos para pruebas
   y demostración del simulador. Úsalo para ver cómo
   funciona cada componente sin conectar al backend.
============================================================ */

// Materiales de ejemplo
export const EXAMPLE_MATERIALS = [
  {
    id: "mat_1",
    name: "Aluminio Puro",
    costPerKg: 150,
    composition: { A: 98, B: 1, C: 1 },
  },
  {
    id: "mat_2",
    name: "Bronce de Cobre",
    costPerKg: 220,
    composition: { A: 85, B: 12, C: 3 },
  },
  {
    id: "mat_3",
    name: "Titanio Aleado",
    costPerKg: 350,
    composition: { A: 70, B: 20, C: 10 },
  },
];

// Elementos químicos disponibles
export const AVAILABLE_ELEMENTS = ["A", "B", "C"];

// Resultados de ejemplo para pruebas
export const EXAMPLE_RESULTS_SUCCESS = {
  es_factible: true,
  mensaje: "Optimización exitosa",
  utilidad_maxima_usd: 12500,
  costo_total_usd: 8500,
  costo_por_kg: 85,
  precio_venta_usd: 25000,
  error_vs_objetivo: 1.2,
  estado_optimizacion: "OPTIMAL",
  composicion_lograda: { A: 81.2, B: 15.5, C: 3.3 },
  toneladas_aleacion: { A: 100, B: 100 },
  distribucion_toneladas: [
    { Aleacion: "A", Mineral: "Aluminio Puro", Toneladas: 80.2 },
    { Aleacion: "A", Mineral: "Bronce de Cobre", Toneladas: 19.8 },
  ],
  leyes_porcentaje: {
    A: { A: 98, B: 1, C: 1 },
    B: { A: 85, B: 12, C: 3 },
  },
  radar: {
    aleacion_a: [
      { metal: "A", actual: 81.2, min_spec: 80, max_spec: 82, centro_banda: 81 },
      { metal: "B", actual: 15.5, min_spec: 15, max_spec: 16, centro_banda: 15.5 },
      { metal: "C", actual: 3.3, min_spec: 3, max_spec: 4, centro_banda: 3.5 },
    ],
    aleacion_b: [],
  },
};

export const EXAMPLE_RESULTS_ERROR = {
  es_factible: false,
  mensaje: "Solución infactible: No se pueden cumplir especificaciones",
  utilidad_maxima_usd: 0,
  costo_total_usd: 10000,
  costo_por_kg: 100,
  precio_venta_usd: 25000,
  error_vs_objetivo: 15.8,
  estado_optimizacion: "INFEASIBLE",
  composicion_lograda: null,
  toneladas_aleacion: { A: 0, B: 0 },
  distribucion_toneladas: [],
  leyes_porcentaje: { A: {}, B: {} },
  radar: {
    aleacion_a: [
      { metal: "A", actual: 75, min_spec: 80, max_spec: 82, centro_banda: 81 },
      { metal: "B", actual: 22, min_spec: 15, max_spec: 16, centro_banda: 15.5 },
      { metal: "C", actual: 3, min_spec: 3, max_spec: 4, centro_banda: 3.5 },
    ],
    aleacion_b: [],
  },
};

// Configuración de UI
export const UI_CONFIG = {
  COLORS: {
    background: "#111317",
    cardBg: "#1A1D24",
    border: "#475569",
    text: "#e2e8f0",
    accent: "#ea580c",
    success: "#10b981",
    warning: "#eab308",
    error: "#dc2626",
  },
  
  ANIMATIONS: {
    staggerDelay: 0.1,
    duration: 0.3,
    springDamping: 15,
  },

  BREAKPOINTS: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1600,
  },
};

// Valores por defecto
export const DEFAULTS = {
  simulationName: "Simulación 1",
  marginPercent: 20,
  notes: "Sin notas",
  targetComposition: {
    A: 80,
    B: 15,
    C: 5,
  },
};

// Validaciones
export const VALIDATORS = {
  /**
   * Valida que la suma de porcentajes no exceda 100%
   */
  validateCompositionSum: (composition: Record<string, number>): boolean => {
    const sum = Object.values(composition).reduce((a, b) => a + b, 0);
    return sum <= 100;
  },

  /**
   * Valida que todos los valores sean positivos
   */
  validatePositiveValues: (values: Record<string, number>): boolean => {
    return Object.values(values).every((v) => v >= 0);
  },

  /**
   * Formatea un número sin ceros a la izquierda
   */
  formatNumber: (value: string | number): number => {
    return parseFloat(String(value)) || 0;
  },
};

// Mensajes de asesor inteligente
export const ADVISOR_MESSAGES = {
  INFEASIBLE:
    "❌ Imposible alcanzar pureza objetivo. Sugerencia: Aumente el límite de %C en la aleación objetivo o importe un Material con mayor pureza.",
  HIGH_COST:
    "💡 Consejo: El Material 2 es muy caro. Intente relajar las restricciones de %B para usar más Material 1.",
  HIGH_ERROR:
    "🔧 Optimización subóptima: El error vs objetivo es alto. Intente ajustar los límites de composición.",
  SUCCESS:
    "✅ Excelente optimización. La mezcla está dentro de especificaciones y el costo es competitivo.",
  WAITING: "💡 Inicia simulación para recibir recomendaciones personalizadas.",
};

// Configuración de 3D
export const INGOT_3D_CONFIG = {
  materials: {
    success: {
      color: 0xc0a080, // Bronce dorado
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x2a2a2a,
    },
    warning: {
      color: 0x4a4a4a, // Gris oscuro
      metalness: 0.6,
      roughness: 0.7,
      emissive: 0x1a0000,
    },
    error: {
      color: 0x8b0000, // Rojo oscuro
      metalness: 0.3,
      roughness: 0.95,
      emissive: 0x4a0000,
    },
  },
  
  lights: {
    ambient: { intensity: 0.6 },
    point1: { position: [10, 10, 10], intensity: 1.2, color: 0xffffff },
    point2: { position: [-10, -10, -10], intensity: 0.8, color: 0xff6600 },
  },
  
  controls: {
    autoRotate: true,
    autoRotateSpeed: 2,
    enableZoom: true,
    enablePan: true,
    dampingFactor: 0.05,
  },
};

// Exportación en XLSX - estructura
export const XLSX_SHEET_STRUCTURE = {
  columns: ["Campo", "Valor"],
  data: [
    ["Nombre Simulación", ""],
    ["Margen %", ""],
    ["Notas", ""],
    ["Timestamp", ""],
    ["Factible", ""],
    ["Costo Total (USD)", ""],
    ["Error vs Objetivo (%)", ""],
  ],
};
