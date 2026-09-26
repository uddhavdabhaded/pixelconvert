export function ToolSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="rounded-2xl border border-line bg-surface px-6 py-16 text-center text-sm text-muted shadow-card">
      Preparing the tool…
    </div>
  );
}
