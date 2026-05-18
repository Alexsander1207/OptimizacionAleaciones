import { HistoryTable } from "@/components/history/HistoryTable";

export default function HistorialPage() {
  return (
    <div className="flex-1 bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">Auditoría</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Historial</h1>
          <p className="mt-2 text-slate-600">Registro local de ejecuciones del solver.</p>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <HistoryTable />
      </div>
    </div>
  );
}
