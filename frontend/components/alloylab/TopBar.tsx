"use client";

import Link from "next/link";
import { Menu, BarChart3, Clock } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#1A1D24]/95 backdrop-blur-md">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
              <BarChart3 className="h-5 w-5 text-black font-bold" />
            </div>
            <span className="text-lg font-black tracking-tight text-orange-500">AlloyLab Pro</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/simulator"
              className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-orange-500 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Simulador
            </Link>
            <Link
              href="/historial"
              className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-orange-500 transition-colors"
            >
              <Clock className="h-4 w-4" />
              Historial
            </Link>
          </nav>

          {/* User Area */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-slate-300">Conectado</span>
            </div>
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Menú móvil"
              title="Menú"
            >
              <Menu className="h-5 w-5 text-slate-200" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
