"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  History,
  Download,
  Activity,
  Settings,
  ChevronRight,
  Cpu,
  Zap,
} from "lucide-react";

const navSections = [
  {
    title: "Principal",
    items: [
      {
        href: "/",
        label: "Inicio",
        icon: LayoutDashboard,
        description: "Dashboard general",
      },
      {
        href: "/simulator",
        label: "Simulador",
        icon: FlaskConical,
        description: "Optimización LP",
        badge: "Live",
        badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      },
    ],
  },
  {
    title: "Análisis",
    items: [
      {
        href: "/historial",
        label: "Historial",
        icon: History,
        description: "Simulaciones pasadas",
      },
      {
        href: "/exportacion",
        label: "Exportación",
        icon: Download,
        description: "Reportes y datos",
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-[#0D0F14] border-r border-slate-800/60">
      {/* Logo Header */}
      <div className="px-5 py-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 shadow-lg shadow-orange-900/40">
            <FlaskConical className="h-5 w-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0D0F14]" />
          </div>
          <div>
            <p className="text-[13px] font-black tracking-tight text-white">
              OptiBlend
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-orange-400/80">
              Industrial Suite
            </p>
          </div>
        </div>
      </div>

      {/* System Status Bar */}
      <div className="mx-4 mt-4 rounded-lg bg-slate-800/40 border border-slate-700/50 px-3 py-2.5 flex items-center gap-2.5">
        <Activity className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-slate-300 truncate">Motor CBC · FastAPI</p>
          <p className="text-[9px] text-emerald-400 font-medium">Operativo</p>
        </div>
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon, description, badge, badgeColor }) => {
                const active =
                  href === "/"
                    ? pathname === "/"
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 ${
                      active
                        ? "bg-orange-500/10 text-orange-400 shadow-sm"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    {/* Active indicator */}
                    <span
                      className={`h-4 w-0.5 rounded-full transition-all ${
                        active ? "bg-orange-500 opacity-100" : "opacity-0"
                      }`}
                    />
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
                        active
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-slate-800/60 text-slate-500 group-hover:bg-slate-700/60 group-hover:text-slate-300"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-semibold truncate">{label}</span>
                        {badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badgeColor}`}>
                            {badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">
                        {description}
                      </p>
                    </div>
                    <ChevronRight
                      className={`h-3 w-3 shrink-0 transition-all ${
                        active ? "opacity-60 text-orange-400" : "opacity-0 group-hover:opacity-40"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Stats */}
      <div className="mx-4 mb-4 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-800/30 border border-slate-700/50 p-3 space-y-2">
        <div className="flex items-center gap-2 text-slate-400">
          <Cpu className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-[10px] font-semibold text-slate-300">Capacidad del Motor</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] text-slate-500">
            <span>PuLP / CBC Solver</span>
            <span className="text-emerald-400 font-semibold">Activo</span>
          </div>
          <div className="h-1 w-full rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-0.5">
          <Zap className="h-3 w-3 text-yellow-400" />
          <span className="text-[9px] text-slate-500">v2.1.0 · Optimización LP</span>
        </div>
      </div>

      {/* Settings Link */}
      <div className="px-3 pb-4 border-t border-slate-800/60 pt-3">
        <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-800/60 hover:text-slate-300 transition-all duration-150 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-800/60 group-hover:bg-slate-700/60 transition-colors">
            <Settings className="h-3.5 w-3.5" />
          </div>
          <span className="text-[12px] font-semibold">Configuración</span>
        </button>
      </div>
    </aside>
  );
}
