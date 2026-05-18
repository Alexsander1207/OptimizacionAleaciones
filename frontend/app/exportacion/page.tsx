import Link from "next/link";

export default function ExportacionPage() {
  return (
    <div className="flex-1 bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">Datos</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Exportación</h1>
          <p className="mt-2 text-slate-600">
            Conectores enterprise (Excel, Power BI, API batch) — en roadmap.
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-inner">
          <p className="text-lg font-semibold text-slate-800">Módulo en preparación</p>
          <p className="mt-2 text-slate-600">
            Aquí podrá exportar planes óptimos y series temporales de simulaciones.
          </p>
          <Link
            href="/simulator"
            className="mt-8 inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-500"
          >
            Volver al simulador
          </Link>
        </div>
      </div>
    </div>
  );
}
