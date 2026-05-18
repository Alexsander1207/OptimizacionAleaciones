"use client";

import { useState, useMemo } from "react";
import type { FormPayload } from "@/lib/types";
import { motion } from "framer-motion";

interface TargetAlloyPanelProps {
  form?: FormPayload;
  setForm?: (form: FormPayload) => void;
}

export default function TargetAlloyPanel({}: TargetAlloyPanelProps = {}) {
  const [percentA, setPercentA] = useState(80);
  const [percentB, setPercentB] = useState(15);
  const [percentC, setPercentC] = useState(5);

  const totalPercent = useMemo(() => percentA + percentB + percentC, [percentA, percentB, percentC]);
  const isExceeded = totalPercent > 100;

  const handleSliderChange = (element: string, value: number) => {
    if (element === "A") setPercentA(value);
    if (element === "B") setPercentB(value);
    if (element === "C") setPercentC(value);
  };

  return (
    <div className="bg-[#1A1D24] border border-slate-800 rounded-xl p-6 shadow-lg space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-orange-500"></div>
          Aleación Objetivo
        </h2>
      </div>

      {/* Sliders */}
      <div className="space-y-5">
        {/* Slider A */}
        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="slider-a" className="text-sm font-semibold text-slate-300">% A</label>
            <motion.span
              className="text-sm font-bold text-orange-500"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              key={percentA}
            >
              {percentA.toFixed(1)}%
            </motion.span>
          </div>
          <input
            id="slider-a"
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={percentA}
            onChange={(e) => handleSliderChange("A", parseFloat(e.target.value))}
            aria-label="Porcentaje A"
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Slider B */}
        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="slider-b" className="text-sm font-semibold text-slate-300">% B</label>
            <motion.span
              className="text-sm font-bold text-orange-500"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              key={percentB}
            >
              {percentB.toFixed(1)}%
            </motion.span>
          </div>
          <input
            id="slider-b"
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={percentB}
            onChange={(e) => handleSliderChange("B", parseFloat(e.target.value))}
            aria-label="Porcentaje B"
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Slider C */}
        <div>
          <div className="flex justify-between mb-2">
            <label htmlFor="slider-c" className="text-sm font-semibold text-slate-300">% C</label>
            <motion.span
              className="text-sm font-bold text-orange-500"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              key={percentC}
            >
              {percentC.toFixed(1)}%
            </motion.span>
          </div>
          <input
            id="slider-c"
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={percentC}
            onChange={(e) => handleSliderChange("C", parseFloat(e.target.value))}
            aria-label="Porcentaje C"
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-400">Suma % Objetivo</span>
          <motion.span
            className={`text-sm font-bold transition-colors ${
              isExceeded ? "text-red-500" : "text-green-500"
            }`}
            animate={{ scale: isExceeded ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {totalPercent.toFixed(1)}%
          </motion.span>
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full transition-colors ${
              isExceeded ? "bg-red-500" : "bg-green-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(totalPercent, 100)}%` }}
            transition={{ type: "spring", damping: 15 }}
          />
        </div>
        {isExceeded && (
          <motion.p
            className="text-xs text-red-400 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠️ Exceso: {(totalPercent - 100).toFixed(1)}%
          </motion.p>
        )}
      </div>

      {/* Summary */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 space-y-1">
        <div>A: {percentA.toFixed(1)}%</div>
        <div>B: {percentB.toFixed(1)}%</div>
        <div>C: {percentC.toFixed(1)}%</div>
      </div>
    </div>
  );
}
