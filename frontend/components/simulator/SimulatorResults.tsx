"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ApiResultados } from "@/lib/types";
import { distribucionABarrasApiladas, pctTooltip, tonTooltip } from "@/lib/charts";

const COL_MIN = ["#4f46e5", "#059669", "#d97706"] as const;
const COL_MIN_SOFT = ["#c7d2fe", "#a7f3d0", "#fde68a"] as const;

export function SimulatorResults({
  resultados,
  cargando,
}: {
  resultados: ApiResultados | null;
  cargando: boolean;
}) {
  const chartDataBar = useMemo(
    () => distribucionABarrasApiladas(resultados?.distribucion_toneladas),
    [resultados]
  );

  if (cargando || !resultados) return null;

  const factible = resultados.es_factible === true;

  return (
    <>
      {!factible ? (
        <div className="space-y-6">
          <div
            role="alert"
            className="animate-fade-in rounded-2xl border-2 border-red-300/80 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 p-6 shadow-xl"
          >
            <div className="flex flex-wrap items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-xl font-bold text-white shadow-lg">
                !
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-black text-red-950">Plan no factible o sin rentabilidad</h3>
                <p className="mt-2 font-medium leading-relaxed text-red-950/90">
                  Las restricciones de pureza actuales hacen que el modelo sea infactible o su producción sea
                  cero. Ajuste mínimos/máximos o la matriz de minerales.
                </p>
                {resultados.mensaje ? (
                  <p className="mt-3 rounded-xl border border-orange-200 bg-white/90 p-4 text-sm text-slate-800 shadow-inner">
                    <span className="font-semibold text-orange-800">Diagnóstico:</span> {resultados.mensaje}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {(resultados.sugerencias_cambio && resultados.sugerencias_cambio.length > 0) ||
          resultados.resumen_relajacion ? (
            <div className="animate-fade-in rounded-2xl border border-amber-300/90 bg-gradient-to-br from-amber-50 via-yellow-50 to-white p-6 shadow-xl shadow-amber-900/5 ring-1 ring-amber-200/80">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-lg text-white shadow-md">
                  ◇
                </span>
                <div className="min-w-0 flex-1 space-y-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-800">
                      Inteligencia operativa
                    </p>
                    <h4 className="mt-1 text-lg font-bold text-amber-950">Relajación de restricciones (goal programming)</h4>
                    {resultados.violacion_total_relajacion != null ? (
                      <p className="mt-2 text-sm text-amber-900/80">
                        Holgura mínima agregada en el modelo auxiliar:{" "}
                        <strong>{resultados.violacion_total_relajacion}</strong> (masa · toneladas coherente con el PL).
                      </p>
                    ) : null}
                    {resultados.resumen_relajacion ? (
                      <p className="mt-3 text-sm leading-relaxed text-amber-950">{resultados.resumen_relajacion}</p>
                    ) : null}
                  </div>
                  <ul className="space-y-3">
                    {(resultados.sugerencias_cambio ?? []).map((s, i) => (
                      <li
                        key={`${s.aleacion}-${s.metal}-${s.limite}-${i}`}
                        className="rounded-xl border border-amber-200/80 bg-white/90 p-4 text-sm leading-relaxed text-slate-800 shadow-sm"
                      >
                        <span className="font-semibold text-amber-900">({i + 1})</span> {s.mensaje}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {factible ? (
        <section className="animate-fade-in space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Resultados</h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-900 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              {resultados.estado_optimizacion}
            </span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 p-8 text-white shadow-2xl sm:p-10">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-200/90">
              Utilidad máxima del plan
            </p>
            <p className="mt-2 font-mono text-5xl font-black tracking-tight sm:text-6xl">
              ${resultados.utilidad_maxima_usd.toLocaleString("es-ES", { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-4 flex flex-wrap gap-6 text-sm text-emerald-100/90">
              <span>
                Producción A:{" "}
                <strong className="text-white">
                  {resultados.toneladas_aleacion.A.toLocaleString("es-ES", { maximumFractionDigits: 2 })} t
                </strong>
              </span>
              <span>
                Producción B:{" "}
                <strong className="text-white">
                  {resultados.toneladas_aleacion.B.toLocaleString("es-ES", { maximumFractionDigits: 2 })} t
                </strong>
              </span>
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900">Asignación de minerales (t)</h3>
              <div className="mt-6 h-80 min-h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataBar} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                    <RechartsTooltip
                      cursor={{ fill: "#f8fafc" }}
                      formatter={(v) => tonTooltip(v)}
                      contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: 16 }} />
                    <Bar dataKey="Mineral 1" stackId="s" fill={COL_MIN[0]} />
                    <Bar dataKey="Mineral 2" stackId="s" fill={COL_MIN[1]} />
                    <Bar dataKey="Mineral 3" stackId="s" fill={COL_MIN[2]} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900">Leyes vs especificación — A</h3>
              <div className="mt-4 h-72 min-h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="52%" outerRadius={100} data={resultados.radar.aleacion_a}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="metal" tick={{ fill: "#334155", fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Resultado" dataKey="actual" stroke="#4f46e5" fill="#818cf8" fillOpacity={0.35} strokeWidth={2} />
                    <Radar name="Mín." dataKey="min_spec" stroke="#059669" fill="none" strokeWidth={1.5} strokeDasharray="5 5" />
                    <Radar name="Máx." dataKey="max_spec" stroke="#94a3b8" fill="none" strokeWidth={1.5} strokeDasharray="3 3" />
                    <Legend wrapperStyle={{ paddingTop: 8 }} />
                    <RechartsTooltip formatter={(v) => pctTooltip(v)} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Leyes vs especificación — B</h3>
            <div className="mt-4 h-72 min-h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="52%" outerRadius={100} data={resultados.radar.aleacion_b}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="metal" tick={{ fill: "#334155", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Resultado" dataKey="actual" stroke="#7c3aed" fill="#c4b5fd" fillOpacity={0.35} strokeWidth={2} />
                  <Radar name="Mín." dataKey="min_spec" stroke="#059669" fill="none" strokeWidth={1.5} strokeDasharray="5 5" />
                  <Radar name="Máx." dataKey="max_spec" stroke="#94a3b8" fill="none" strokeWidth={1.5} strokeDasharray="3 3" />
                  <Legend wrapperStyle={{ paddingTop: 8 }} />
                  <RechartsTooltip formatter={(v) => pctTooltip(v)} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <h3 className="font-bold text-slate-900">Flujos mineral → aleación</h3>
            </div>
            <ul className="divide-y divide-slate-100">
              {resultados.distribucion_toneladas.length === 0 ? (
                <li className="px-6 py-8 text-center text-slate-500">Sin envíos positivos.</li>
              ) : (
                resultados.distribucion_toneladas.map((row, i) => (
                  <li
                    key={`${row.Aleacion}-${row.Mineral}-${i}`}
                    className="flex flex-wrap items-center justify-between gap-2 px-6 py-3.5 text-sm hover:bg-slate-50"
                  >
                    <span className="font-medium text-slate-700">
                      Mineral <span className="text-indigo-700">{row.Mineral}</span>
                      <span className="mx-1 text-slate-400">→</span>
                      Aleación <span className="text-emerald-800">{row.Aleacion}</span>
                    </span>
                    <span
                      className="rounded-lg px-3 py-1 font-mono text-sm font-bold text-slate-900"
                      style={{
                        backgroundColor: COL_MIN_SOFT[Number(row.Mineral) - 1] ?? "#e2e8f0",
                      }}
                    >
                      {row.Toneladas.toLocaleString("es-ES", { maximumFractionDigits: 2 })} t
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
