"use client";

import type { FormPayload } from "@/lib/types";
import EditableGrid from "./EditableGrid";

interface MaterialsPanelProps {
  form: FormPayload;
  setForm: (form: FormPayload) => void;
}

export default function MaterialsPanel({ form, setForm }: MaterialsPanelProps) {
  const materials = [
    {
      id: "mat_1",
      name: "Material 1",
      costPerKg: 150,
      composition: { A: 85, B: 10, C: 5 },
    },
    {
      id: "mat_2",
      name: "Material 2",
      costPerKg: 220,
      composition: { A: 92, B: 5, C: 3 },
    },
  ];

  const elements = ["A", "B", "C"];

  return (
    <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
        Materiales Disponibles
      </h2>
      <EditableGrid
        materials={materials}
        onMaterialsChange={() => {}}
        elements={elements}
        onElementsChange={() => {}}
      />
    </div>
  );
}
