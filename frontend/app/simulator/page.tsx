"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import { deepCloneForm } from "@/lib/formDefaults";
import type { ApiResultados, SimulationResult, FormPayload } from "@/lib/types";
import { API_OPTIMIZAR } from "@/lib/api";
import { appendHistory } from "@/lib/historyStorage";
import TopBar from "@/components/alloylab/TopBar";
import MaterialsPanel from "@/components/alloylab/MaterialsPanel";
import TargetAlloyPanel from "@/components/alloylab/TargetAlloyPanel";
import ControlBar from "@/components/alloylab/ControlBar";
import KPIsPanel from "@/components/alloylab/KPIsPanel";
import SmartAdvisor from "@/components/alloylab/SmartAdvisor";
import CompositionChart from "@/components/alloylab/CompositionChart";
import Ingot3D from "@/components/alloylab/Ingot3D";

export interface SimulationState {
  materials: { name: string; costPerKg: number; composition: Record<string, number> }[];
  targetAlloy: Record<string, number>;
  simulationName: string;
  marginPercent: number;
  notes: string;
  results: SimulationResult | null;
}

export default function SimulatorPage() {
  const [form, setForm] = useState<FormPayload>(() => deepCloneForm());
  const [resultados, setResultados] = useState<SimulationResult | null>(null);
  const [cargando, setCargando] = useState(false);
  const [simulationName, setSimulationName] = useState("Simulación 1");
  const [marginPercent, setMarginPercent] = useState(20);
  const [notes, setNotes] = useState("");

  const simular = async () => {
    setCargando(true);
    try {
      const { data } = await axios.post<SimulationResult>(API_OPTIMIZAR, form);
      setResultados(data);
      appendHistory({
        utilidad: data.utilidad_maxima_usd,
        esFactible: data.es_factible,
        estado: data.estado_optimizacion,
      });
    } catch (e: unknown) {
      console.error(e);
      let msg = "No se pudo contactar el backend en :8000.";
      if (axios.isAxiosError(e) && e.response?.data?.detail) {
        const d = e.response.data.detail;
        msg = typeof d === "string" ? d : JSON.stringify(d);
      }
      alert(msg);
    } finally {
      setCargando(false);
    }
  };

  const simulationState: SimulationState = useMemo(
    () => ({
      materials: [],
      targetAlloy: {},
      simulationName,
      marginPercent,
      notes,
      results: resultados,
    }),
    [simulationName, marginPercent, notes, resultados]
  );

  return (
    <div className="min-h-screen bg-[#111317] text-slate-200">
      {/* FILA 1: Top Bar */}
      <TopBar />

      <main className="mx-auto max-w-full px-6 py-8 space-y-8" style={{maxWidth: "1600px"}}>
        {/* FILA 2: Inputs Dinámicos (70% / 30%) */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Materiales (Col-span-8) */}
          <div className="col-span-8">
            <MaterialsPanel form={form} setForm={setForm} />
          </div>

          {/* Right: Aleación Objetivo (Col-span-4) */}
          <div className="col-span-4">
            <TargetAlloyPanel form={form} setForm={setForm} />
          </div>
        </div>

        {/* FILA 3: Barra de Control y Exportación */}
        <ControlBar
          simulationName={simulationName}
          setSimulationName={setSimulationName}
          marginPercent={marginPercent}
          setMarginPercent={setMarginPercent}
          notes={notes}
          setNotes={setNotes}
          onSimulate={simular}
          cargando={cargando}
          form={form}
        />

        {/* FILA 4: Motor Guía y KPIs */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <KPIsPanel resultados={resultados} />
          </div>
          <div className="col-span-4">
            <SmartAdvisor resultados={resultados} form={form} />
          </div>
        </div>

        {/* FILA 5: Visualización Avanzada (Gráficos y 3D) */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-6">
            <CompositionChart resultados={resultados} />
          </div>
          <div className="col-span-6">
            <Ingot3D resultados={resultados} />
          </div>
        </div>
      </main>
    </div>
  );
}
