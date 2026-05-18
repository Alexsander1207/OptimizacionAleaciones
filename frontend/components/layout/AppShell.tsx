"use client";

import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#111317]">
      <AppSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-[#111317]">
        {children}
      </div>
    </div>
  );
}
