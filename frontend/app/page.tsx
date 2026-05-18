import Link from "next/link";
import { FlaskConical, BarChart3, History, ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Optimización LP en tiempo real",
    description:
      "Motor PuLP + CBC Solver procesa tu matriz de minerales y especificaciones al instante.",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: Shield,
    title: "Analítica prescriptiva",
    description:
      "Cuando el modelo principal no es factible, el sistema sugiere relajaciones óptimas automáticamente.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: TrendingUp,
    title: "Asesor inteligente",
    description:
      "Recomendaciones en tiempo real basadas en pureza objetivo, costo y restricciones de composición.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const stats = [
  { value: "3", label: "Minerales simultáneos" },
  { value: "4", label: "Elementos traza" },
  { value: "∞", label: "Simulaciones" },
  { value: "<1s", label: "Tiempo de solución" },
];

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col min-h-screen bg-[#111317] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden flex-1 flex flex-col justify-center">
        {/* Background gradient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-orange-600/5 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-[400px] w-[400px] rounded-full bg-indigo-600/5 blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-8 py-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-300">
              OptiBlend Industrial SaaS
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl mb-6">
            Simulador de aleaciones
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              con optimización LP
            </span>
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-slate-400 mb-10">
            Programación lineal sobre inventarios de minerales, especificaciones de pureza y precios
            de mercado — con analítica prescriptiva cuando el modelo principal no es factible.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-16">
            <Link
              href="/simulator"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-orange-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-orange-900/30 transition-all duration-200 hover:bg-orange-400 hover:shadow-orange-900/50 hover:-translate-y-0.5"
            >
              <FlaskConical className="h-4 w-4" />
              Abrir Simulador
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/historial"
              className="inline-flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-800/50 px-8 py-4 text-sm font-semibold text-slate-200 backdrop-blur transition-all duration-200 hover:bg-slate-800 hover:border-slate-600"
            >
              <History className="h-4 w-4" />
              Ver historial
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-6 mb-16 border-t border-b border-slate-800 py-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className={`rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${bg}`}
              >
                <div className={`mb-3 ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-200 mb-2">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="border-t border-slate-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600">
          <BarChart3 className="h-3.5 w-3.5" />
          <span className="text-[11px] font-medium">Motor PuLP · CBC · FastAPI · Next.js</span>
        </div>
        <span className="text-[11px] text-slate-600">OptiBlend v2.1.0</span>
      </div>
    </div>
  );
}
