"use client";

import { useState, useCallback, memo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface EditableGridProps {
  materials: Array<{
    id: string;
    name: string;
    costPerKg: number;
    composition: Record<string, number>;
  }>;
  onMaterialsChange: (materials: typeof materials) => void;
  elements: string[];
  onElementsChange: (elements: string[]) => void;
}

interface InputProps {
  value: number | string;
  onChange: (val: string) => void;
  onBlur: (val: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  className?: string;
}

/**
 * NumericInputField: Input controlado que previene el bug de "010"
 * - En focus: permite vaciar el campo
 * - En blur: formatea correctamente sin ceros a la izquierda
 */
const NumericInputField = memo(function NumericInputField({
  value,
  onChange,
  onBlur,
  placeholder = "0",
  className = "",
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.trim();
    // Parse float para eliminar ceros a la izquierda, valida 0 como default
    const formatted = rawValue === "" ? "0" : String(parseFloat(rawValue) || 0);
    onBlur(formatted);
    setIsFocused(false);
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={isFocused ? value : value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={`w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-slate-200 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-colors ${className}`}
    />
  );
});

/**
 * EditableGrid: Grid interactivo de materiales
 * Permite agregar/editar materiales y sus composiciones
 */
export default function EditableGrid({
  materials,
  onMaterialsChange,
  elements,
  onElementsChange,
}: EditableGridProps) {
  const addMaterial = useCallback(() => {
    const newMaterial = {
      id: `mat_${Date.now()}`,
      name: `Material ${materials.length + 1}`,
      costPerKg: 0,
      composition: Object.fromEntries(elements.map((e) => [e, 0])),
    };
    onMaterialsChange([...materials, newMaterial]);
  }, [materials, elements, onMaterialsChange]);

  const addElement = useCallback(() => {
    const newElement = `E${elements.length + 1}`;
    onElementsChange([...elements, newElement]);
    const updatedMaterials = materials.map((m) => ({
      ...m,
      composition: { ...m.composition, [newElement]: 0 },
    }));
    onMaterialsChange(updatedMaterials);
  }, [elements, materials, onMaterialsChange, onElementsChange]);

  const updateMaterial = useCallback(
    (id: string, field: string, value: any) => {
      const updated = materials.map((m) => {
        if (m.id === id) {
          if (field === "name" || field === "costPerKg") {
            return { ...m, [field]: value };
          } else {
            // Field es elemento de composición
            return {
              ...m,
              composition: { ...m.composition, [field]: value },
            };
          }
        }
        return m;
      });
      onMaterialsChange(updated);
    },
    [materials, onMaterialsChange]
  );

  const removeMaterial = useCallback(
    (id: string) => {
      onMaterialsChange(materials.filter((m) => m.id !== id));
    },
    [materials, onMaterialsChange]
  );

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-orange-500 bg-slate-800/50 border border-slate-700">
                Material
              </th>
              <th className="px-3 py-2 text-center font-semibold text-orange-500 bg-slate-800/50 border border-slate-700">
                $/kg
              </th>
              {elements.map((el) => (
                <th
                  key={el}
                  className="px-3 py-2 text-center font-semibold text-orange-500 bg-slate-800/50 border border-slate-700"
                >
                  %{el}
                </th>
              ))}
              <th className="px-3 py-2 text-center font-semibold text-orange-500 bg-slate-800/50 border border-slate-700">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material, idx) => (
              <motion.tr
                key={material.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-3 py-2 border border-slate-700">
                  <input
                    type="text"
                    value={material.name}
                    onChange={(e) => updateMaterial(material.id, "name", e.target.value)}
                    aria-label="Nombre del material"
                    placeholder="Nombre"
                    className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                  />
                </td>
                <td className="px-3 py-2 border border-slate-700">
                  <NumericInputField
                    value={material.costPerKg}
                    onChange={(v) => updateMaterial(material.id, "costPerKg", v)}
                    onBlur={(v) => updateMaterial(material.id, "costPerKg", parseFloat(v) || 0)}
                  />
                </td>
                {elements.map((el) => (
                  <td key={`${material.id}_${el}`} className="px-3 py-2 border border-slate-700">
                    <NumericInputField
                      value={material.composition[el]}
                      onChange={(v) => updateMaterial(material.id, el, v)}
                      onBlur={(v) =>
                        updateMaterial(material.id, el, Math.min(100, parseFloat(v) || 0))
                      }
                    />
                  </td>
                ))}
                <td className="px-3 py-2 border border-slate-700 text-center">
                  <button
                    onClick={() => removeMaterial(material.id)}
                    className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    aria-label={`Eliminar ${material.name}`}
                    title="Eliminar material"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={addMaterial}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-500 hover:bg-orange-500/20 font-medium text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          + Elemento
        </button>
        <button
          onClick={addElement}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-200 hover:bg-slate-700 font-medium text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          + Material
        </button>
      </div>
    </div>
  );
}
