export function PanelSkeleton() {
  return (
    <div className="animate-pulse space-y-6 py-4">
      <div className="h-36 rounded-2xl bg-gradient-to-br from-slate-200/90 to-slate-100" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-2xl bg-slate-200/70" />
        <div className="h-80 rounded-2xl bg-slate-200/70" />
      </div>
    </div>
  );
}
