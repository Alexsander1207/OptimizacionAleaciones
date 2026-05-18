"use client";

import type { SimulationResult } from "@/lib/types";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface KPIsPanelProps {
  resultados: SimulationResult | null;
}

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  status?: "success" | "warning" | "error";
  delay?: number;
}

function KPICard({ icon, label, value, unit, status, delay = 0 }: KPICardProps) {
  const statusColors = {
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <div className={`${status ? statusColors[status] : "text-orange-500"}`}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-200">{value}</span>
        {unit && <span className="text-sm text-slate-400">{unit}</span>}
      </div>
    </motion.div>
  );
}

export default function KPIsPanel({ resultados }: KPIsPanelProps) {
  const totalCost = resultados?.costo_total_usd ?? 0;
  const costPerKg = resultados?.costo_por_kg ?? 0;
  const sellPrice = resultados?.precio_venta_usd ?? 0;
  const errorVsTarget = resultados?.error_vs_objetivo ?? 0;
  const isFeasible = resultados?.es_factible ?? false;

  return (
    <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
        Motor de Optimización & KPIs
      </h2>

      <div className="grid grid-cols-4 gap-4">
        <KPICard
          icon={<DollarSign className="h-5 w-5" />}
          label="Costo Total Lote"
          value={totalCost.toFixed(2)}
          unit="USD"
          delay={0}
        />
        <KPICard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Costo por kg"
          value={costPerKg.toFixed(2)}
          unit="USD/kg"
          delay={0.1}
        />
        <KPICard
          icon={<DollarSign className="h-5 w-5" />}
          label="Precio Venta"
          value={sellPrice.toFixed(2)}
          unit="USD"
          delay={0.2}
        />
        <KPICard
          icon={
            isFeasible ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )
          }
          label="Error vs Objetivo"
          value={errorVsTarget.toFixed(2)}
          unit="%"
          status={isFeasible ? "success" : "error"}
          delay={0.3}
        />
      </div>

      {!isFeasible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <p className="text-xs text-red-400 font-semibold">
            ⚠️ Solución NO factible. Revise los parámetros de restricción.
          </p>
        </motion.div>
      )}
    </div>
  );
}
