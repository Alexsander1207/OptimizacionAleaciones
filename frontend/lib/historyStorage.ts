import type { HistoryEntry } from "./types";

const KEY = "optiblend-sim-history";
const MAX = 40;

function loadRaw(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getHistory(): HistoryEntry[] {
  return loadRaw();
}

export function appendHistory(entry: Omit<HistoryEntry, "id" | "fechaISO">): HistoryEntry {
  const full: HistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    fechaISO: new Date().toISOString(),
  };
  const prev = loadRaw();
  const next = [full, ...prev].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(next));
  return full;
}

export function clearHistory(): void {
  localStorage.removeItem(KEY);
}
