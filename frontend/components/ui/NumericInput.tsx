"use client";

import { useEffect, useState } from "react";

/** Evita el bug "010": entrada como texto, sin ceros líderes al tipear; commit numérico en blur. */
export function NumericInput({
  value,
  onCommit,
  min,
  max,
  step = 1,
  className = "",
  id,
}: {
  value: number;
  onCommit: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  id?: string;
}) {
  const [text, setText] = useState(() =>
    Number.isFinite(value) ? String(value) : ""
  );

  useEffect(() => {
    setText(Number.isFinite(value) ? String(value) : "");
  }, [value]);

  const sanitizeTyping = (raw: string) => {
    let v = raw.replace(",", ".").replace(/^0+(?=\d)/, "");
    if (v === "" || v === "-" || v === "." || v === "-.") return v;
    return v;
  };

  const flush = () => {
    const cleaned = text.trim();
    if (cleaned === "" || cleaned === "-" || cleaned === "." || cleaned === "-.") {
      onCommit(min ?? 0);
      setText(String(min ?? 0));
      return;
    }
    let n = Number(cleaned);
    if (!Number.isFinite(n)) n = min ?? 0;
    if (min !== undefined) n = Math.max(min, n);
    if (max !== undefined) n = Math.min(max, n);
    onCommit(n);
    setText(String(n));
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={text}
      onChange={(e) => setText(sanitizeTyping(e.target.value))}
      onBlur={flush}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      className={
        className ||
        "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      }
    />
  );
}
