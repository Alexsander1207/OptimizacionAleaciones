import type { DistItem } from "./types";

export type BarRow = {
  name: string;
  "Mineral 1": number;
  "Mineral 2": number;
  "Mineral 3": number;
};

export function distribucionABarrasApiladas(dist: DistItem[] | undefined): BarRow[] {
  if (!dist?.length) return [];
  const a: BarRow = { name: "Aleación A", "Mineral 1": 0, "Mineral 2": 0, "Mineral 3": 0 };
  const b: BarRow = { name: "Aleación B", "Mineral 1": 0, "Mineral 2": 0, "Mineral 3": 0 };
  for (const row of dist) {
    const k = `Mineral ${row.Mineral}` as keyof Pick<BarRow, "Mineral 1" | "Mineral 2" | "Mineral 3">;
    if (row.Aleacion === "A") a[k] += row.Toneladas;
    if (row.Aleacion === "B") b[k] += row.Toneladas;
  }
  return [a, b];
}

export function tonTooltip(value: unknown) {
  if (value != null && Number.isFinite(Number(value)))
    return `${Number(value).toLocaleString("es-ES", { maximumFractionDigits: 2 })} t`;
  return "";
}

export function pctTooltip(value: unknown) {
  if (value != null && Number.isFinite(Number(value))) return `${Number(value).toFixed(1)} %`;
  return "";
}
