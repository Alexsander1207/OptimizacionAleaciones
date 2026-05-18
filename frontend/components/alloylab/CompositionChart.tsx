"use client";

import type { SimulationResult } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface CompositionChartProps {
  resultados: SimulationResult | null;
}

const COLORS = ["#ea580c", "#10b981", "#3b82f6"] as const;

export default function CompositionChart({ resultados }: CompositionChartProps) {
  const data =
    resultados && resultados.composicion_lograda
      ? [
          {
            name: "Objetivo",
            A: 80,
            B: 15,
            C: 5,
          },
          {
            name: "Logrado",
            A: resultados.composicion_lograda.A || 0,
            B: resultados.composicion_lograda.B || 0,
            C: resultados.composicion_lograda.C || 0,
          },
        ]
      : [
          {
            name: "Objetivo",
            A: 80,
            B: 15,
            C: 5,
          },
          {
            name: "Logrado",
            A: 0,
            B: 0,
            C: 0,
          },
        ];

  return (
    <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
        Composición: Objetivo vs Logrado
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" label={{ value: "%", angle: -90, position: "insideLeft" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1d24",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#e2e8f0",
            }}
            labelStyle={{ color: "#e2e8f0" }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Bar dataKey="A" stackId="a" fill={COLORS[0]} name="% A" />
          <Bar dataKey="B" stackId="a" fill={COLORS[1]} name="% B" />
          <Bar dataKey="C" stackId="a" fill={COLORS[2]} name="% C" />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend Info */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500"></div>
          <span className="text-slate-300">Elemento A</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-slate-300">Elemento B</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-slate-300">Elemento C</span>
        </div>
      </div>
    </div>
  );
}
