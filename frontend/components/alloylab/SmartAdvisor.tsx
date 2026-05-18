"use client";

import { useMemo } from "react";
import type { SimulationResult, FormPayload } from "@/lib/types";
import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, TrendingDown } from "lucide-react";

interface SmartAdvisorProps {
  resultados: SimulationResult | null;
  form: FormPayload;
}

interface Advice {
  type: "error" | "warning" | "tip";
  icon: React.ReactNode;
  message: string;
}

export default function SmartAdvisor({ resultados, form }: SmartAdvisorProps) {
  const advices = useMemo<Advice[]>(() => {
    const recommendations: Advice[] = [];

    if (!resultados) {
      recommendations.push({
        type: "tip",
        icon: <Lightbulb className="h-5 w-5 text-blue-400" />,
        message: "💡 Inicia simulación para recibir recomendaciones personalizadas.",
      });
      return recommendations;
    }

    // Regla 1: Infactibilidad
    if (!resultados.es_factible) {
      recommendations.push({
        type: "error",
        icon: <AlertTriangle className="h-5 w-5 text-red-400" />,
        message:
          "❌ Imposible alcanzar pureza objetivo. Sugerencia: Aumente el límite de %C en la aleación objetivo o importe un Material con mayor pureza.",
      });
    }

    // Regla 2: Costo alto
    if (resultados.costo_total_usd > 5000) {
      recommendations.push({
        type: "warning",
        icon: <TrendingDown className="h-5 w-5 text-yellow-400" />,
        message:
          "💡 Consejo: El Material 2 es muy caro. Intente relajar las restricciones de %B para usar más Material 1.",
      });
    }

    // Regla 3: Error alto vs objetivo
    if (resultados.error_vs_objetivo > 10) {
      recommendations.push({
        type: "warning",
        icon: <Lightbulb className="h-5 w-5 text-yellow-400" />,
        message:
          "🔧 Optimización subóptima: El error vs objetivo es alto. Intente ajustar los límites de composición.",
      });
    }

    // Regla 4: Éxito
    if (
      resultados.es_factible &&
      resultados.error_vs_objetivo < 2 &&
      resultados.costo_total_usd < 3000
    ) {
      recommendations.push({
        type: "tip",
        icon: <Lightbulb className="h-5 w-5 text-green-400" />,
        message:
          "✅ Excelente optimización. La mezcla está dentro de especificaciones y el costo es competitivo.",
      });
    }

    return recommendations;
  }, [resultados, form]);

  const typeStyles = {
    error: "border-red-500/30 bg-red-500/5",
    warning: "border-yellow-500/30 bg-yellow-500/5",
    tip: "border-blue-500/30 bg-blue-500/5",
  };

  return (
    <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
        Asesor Inteligente
      </h2>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {advices.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            Sin recomendaciones disponibles
          </div>
        ) : (
          advices.map((advice, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-3 rounded-lg border ${typeStyles[advice.type]} space-y-2`}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">{advice.icon}</div>
                <p className="text-sm text-slate-300 leading-relaxed">{advice.message}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer hint */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 italic">
          🤖 Recomendaciones actualizadas en tiempo real basadas en tus datos.
        </p>
      </div>
    </div>
  );
}
