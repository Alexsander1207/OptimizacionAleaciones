"use client";

import { useEffect, useState } from "react";
import { clearHistory, getHistory } from "@/lib/historyStorage";
import type { HistoryEntry } from "@/lib/types";

export function HistoryTable() {
  const [rows, setRows] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setRows(getHistory());
  }, []);

  const refresh = () => setRows(getHistory());

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/90 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Historial de simulaciones</h2>
          <p className="mt-1 text-sm text-slate-500">
            Últimas ejecuciones guardadas en este navegador (localStorage).
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearHistory();
            refresh();
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Limpiar historial
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-6 py-4">Fecha / hora</th>
              <th className="px-6 py-4">Utilidad (USD)</th>
              <th className="px-6 py-4">Factible</th>
              <th className="px-6 py-4">Estado solver</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                  Aún no hay simulaciones. Ejecute el motor desde <strong>Simulador</strong>.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 transition hover:bg-indigo-50/40">
                  <td className="px-6 py-4 font-mono text-slate-800">
                    {new Date(r.fechaISO).toLocaleString("es-ES", {
                      dateStyle: "short",
                      timeStyle: "medium",
                    })}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    ${r.utilidad.toLocaleString("es-ES", { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        r.esFactible
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-orange-100 text-orange-900"
                      }`}
                    >
                      {r.esFactible ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{r.estado}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
