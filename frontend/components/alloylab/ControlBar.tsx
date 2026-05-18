"use client";

import { useRef, useState } from "react";
import { Download, Upload, Save } from "lucide-react";
import type { FormPayload } from "@/lib/types";
import * as XLSX from "xlsx";

interface ControlBarProps {
  simulationName: string;
  setSimulationName: (name: string) => void;
  marginPercent: number;
  setMarginPercent: (margin: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onSimulate: () => void;
  cargando: boolean;
  form: FormPayload;
}

export default function ControlBar({
  simulationName,
  setSimulationName,
  marginPercent,
  setMarginPercent,
  notes,
  setNotes,
  onSimulate,
  cargando,
  form,
}: ControlBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleExportXLS = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        "Nombre Simulación": simulationName,
        "Margen %": marginPercent,
        "Notas": notes,
        "Timestamp": new Date().toISOString(),
      },
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Simulación");
    XLSX.writeFile(wb, `alloylab_${simulationName}_${Date.now()}.xlsx`);
  };

  const handleImportXLS = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        console.log("Importado:", data);
        alert("Archivo importado correctamente");
      } catch (error) {
        console.error("Error al importar:", error);
        alert("Error al importar el archivo");
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-6 shadow-lg">
      <div className="grid grid-cols-12 gap-4">
        {/* Input: Nombre Simulación */}
        <div className="col-span-3">
          <label htmlFor="sim-name" className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
            Nombre Simulación
          </label>
          <input
            id="sim-name"
            type="text"
            value={simulationName}
            onChange={(e) => setSimulationName(e.target.value)}
            placeholder="Ej: Aleación Aluminio v1"
            aria-label="Nombre de la simulación"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-colors"
          />
        </div>

        {/* Input: Margen % */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
            Margen %
          </label>
          <input
            type="number"
            value={marginPercent}
            onChange={(e) => setMarginPercent(Math.max(0, parseFloat(e.target.value) || 0))}
            min="0"
            max="100"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-colors"
          />
        </div>

        {/* Input: Notas */}
        <div className="col-span-4">
          <label htmlFor="sim-notes" className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
            Notas
          </label>
          <input
            id="sim-notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observaciones o comentarios..."
            aria-label="Notas de la simulación"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-colors"
          />
        </div>

        {/* Button: Guardar/Simular */}
        <div className="col-span-2 flex items-end">
          <button
            onClick={onSimulate}
            disabled={cargando}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            {cargando ? "Simulando..." : "Simular"}
          </button>
        </div>

        {/* Button: Excel Dropdown */}
        <div className="col-span-1 flex items-end relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 border border-slate-600 text-slate-200 font-bold rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Opciones Excel"
            title="Excel"
          >
            <Download className="h-4 w-4" />
          </button>

          {isOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-2 z-10">
              <button
                onClick={handleExportXLS}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-700 rounded text-sm transition-colors"
              >
                <Download className="h-4 w-4" />
                Exportar XLSX
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-slate-700 rounded text-sm transition-colors"
              >
                <Upload className="h-4 w-4" />
                Importar XLSX
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          onChange={handleImportXLS}
          className="hidden"
        />
      </div>
    </div>
  );
}
