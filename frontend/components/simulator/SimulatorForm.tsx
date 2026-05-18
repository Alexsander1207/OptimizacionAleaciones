"use client";

import { useState } from "react";
import type { FormPayload } from "@/lib/types";
import { NumericInput } from "@/components/ui/NumericInput";

type TabId = "disp" | "precios" | "matriz" | "limites";

const TABS: { id: TabId; title: string; hint: string }[] = [
  { id: "disp", title: "Disponibilidad", hint: "Tope de inventario y costos de compra" },
  { id: "precios", title: "Precios", hint: "Precios de venta por tonelada de aleación" },
  { id: "matriz", title: "Constituyentes", hint: "Leyes % de metales I–IV por mineral" },
  { id: "limites", title: "Pureza", hint: "Mínimos y máximos por metal y aleación" },
];

export function SimulatorForm({
  form,
  setForm,
  cargando,
  onSimular,
  onCargarLibro,
}: {
  form: FormPayload;
  setForm: React.Dispatch<React.SetStateAction<FormPayload>>;
  cargando: boolean;
  onSimular: () => void;
  onCargarLibro: () => void;
}) {
  const [tab, setTab] = useState<TabId>("disp");

  const setDisp = (idx: number, field: "cantidad_maxima" | "costo_por_tonelada", val: number) => {
    setForm((f) => {
      const next = { ...f, disponibilidad_minerales: [...f.disponibilidad_minerales] };
      next.disponibilidad_minerales[idx] = {
        ...next.disponibilidad_minerales[idx],
        [field]: val,
      };
      return next;
    });
  };

  const setPrecio = (k: "precio_a" | "precio_b", val: number) => {
    setForm((f) => ({
      ...f,
      precios_aleaciones: { ...f.precios_aleaciones, [k]: val },
    }));
  };

  const setMat = (
    mineral: "mineral_1" | "mineral_2" | "mineral_3",
    metal: "I" | "II" | "III" | "IV",
    val: number
  ) => {
    setForm((f) => ({
      ...f,
      matriz_constituyentes: {
        ...f.matriz_constituyentes,
        [mineral]: { ...f.matriz_constituyentes[mineral], [metal]: val },
      },
    }));
  };

  const setSpec = (
    al: "aleacion_a" | "aleacion_b",
    key: keyof FormPayload["restricciones_especificaciones"]["aleacion_a"],
    val: number
  ) => {
    setForm((f) => ({
      ...f,
      restricciones_especificaciones: {
        ...f.restricciones_especificaciones,
        [al]: { ...f.restricciones_especificaciones[al], [key]: val },
      },
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Parámetros del modelo</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            Configure el blending por pestañas. Los valores se envían como JSON al resolver PuLP.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-100 pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs font-medium text-indigo-600">
        {TABS.find((x) => x.id === tab)?.hint}
      </p>

      <div className="mt-6 min-h-[280px] space-y-6">
        {tab === "disp" && (
          <div className="space-y-5">
            {form.disponibilidad_minerales.map((d, i) => (
              <div
                key={d.mineral_id}
                className="rounded-2xl border border-slate-100 bg-slate-50/80 p-6 ring-1 ring-slate-100"
              >
                <p className="text-sm font-bold text-slate-900">Mineral {d.mineral_id}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-600">Cantidad máxima (t)</span>
                    <NumericInput
                      value={d.cantidad_maxima}
                      onCommit={(n) => setDisp(i, "cantidad_maxima", n)}
                      min={0}
                      max={500000}
                      step={10}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-600">Costo ($/t)</span>
                    <NumericInput
                      value={d.costo_por_tonelada}
                      onCommit={(n) => setDisp(i, "costo_por_tonelada", n)}
                      min={0}
                      max={100000}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "precios" && (
          <div className="grid gap-6 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Precio aleación A (USD/t)
              </span>
              <NumericInput
                value={form.precios_aleaciones.precio_a}
                onCommit={(n) => setPrecio("precio_a", n)}
                min={0}
                max={500000}
                className="mt-2 w-full rounded-xl border border-indigo-200 bg-white px-3 py-3 text-lg font-semibold focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-900">
                Precio aleación B (USD/t)
              </span>
              <NumericInput
                value={form.precios_aleaciones.precio_b}
                onCommit={(n) => setPrecio("precio_b", n)}
                min={0}
                max={500000}
                className="mt-2 w-full rounded-xl border border-indigo-200 bg-white px-3 py-3 text-lg font-semibold focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
              />
            </label>
          </div>
        )}

        {tab === "matriz" && (
          <div className="space-y-5">
            {(["mineral_1", "mineral_2", "mineral_3"] as const).map((mk, idx) => (
              <div key={mk} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-slate-900">Mineral {idx + 1}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(["I", "II", "III", "IV"] as const).map((metal) => (
                    <label key={metal} className="block">
                      <span className="text-xs text-slate-600">Metal {metal} %</span>
                      <NumericInput
                        value={form.matriz_constituyentes[mk][metal]}
                        onCommit={(n) => setMat(mk, metal, n)}
                        min={0}
                        max={100}
                        step={0.5}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "limites" && (
          <div className="space-y-8">
            {(["aleacion_a", "aleacion_b"] as const).map((al) => (
              <div
                key={al}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6"
              >
                <p className="text-sm font-bold text-slate-900">
                  Aleación {al === "aleacion_a" ? "A" : "B"} — % en masa
                </p>
                <div className="mt-4 space-y-4">
                  {(
                    [
                      ["I", "min_I", "max_I"],
                      ["II", "min_II", "max_II"],
                      ["III", "min_III", "max_III"],
                      ["IV", "min_IV", "max_IV"],
                    ] as const
                  ).map(([label, mn, mx]) => (
                    <div
                      key={label}
                      className="grid grid-cols-1 gap-3 border-b border-slate-200/80 pb-4 last:border-0 sm:grid-cols-3 sm:items-end"
                    >
                      <span className="text-sm font-medium text-slate-700">Metal {label}</span>
                      <label className="block">
                        <span className="text-xs text-slate-500">Mínimo</span>
                        <NumericInput
                          value={form.restricciones_especificaciones[al][mn]}
                          onCommit={(n) => setSpec(al, mn, n)}
                          min={0}
                          max={100}
                          step={0.5}
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs text-slate-500">Máximo</span>
                        <NumericInput
                          value={form.restricciones_especificaciones[al][mx]}
                          onCommit={(n) => setSpec(al, mx, n)}
                          min={0}
                          max={100}
                          step={0.5}
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
        <button
          type="button"
          onClick={onCargarLibro}
          className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-950 shadow-sm transition hover:bg-amber-100"
        >
          Cargar datos del libro (caso base)
        </button>
        <button
          type="button"
          onClick={onSimular}
          disabled={cargando}
          className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-3.5 text-base font-bold text-white shadow-lg transition hover:from-indigo-500 hover:to-indigo-700 disabled:opacity-50"
        >
          {cargando ? "Ejecutando motor…" : "Simular / Optimizar"}
        </button>
      </div>
    </div>
  );
}
