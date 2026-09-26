export function ImageDimensions({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return (
    <dl className="grid grid-cols-2 gap-2">
      {rows.map((row) => (
        <div key={row.label} className="rounded-xl bg-surface-2 px-3 py-2.5">
          <dt className="text-xs text-muted">{row.label}</dt>
          <dd className="mt-1 text-sm font-semibold text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
