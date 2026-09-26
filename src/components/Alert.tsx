export function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="rounded-xl border border-line bg-danger-soft px-4 py-3 text-sm text-danger">
      {children}
    </div>
  );
}

export function Status({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" className="rounded-xl border border-line bg-ok-soft px-4 py-3 text-sm text-ok">
      {children}
    </div>
  );
}
