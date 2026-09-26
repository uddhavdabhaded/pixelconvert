const numberFormat = new Intl.NumberFormat("en-US");

export function formatDimensions(width: number, height: number) {
  return `${numberFormat.format(Math.round(width))} × ${numberFormat.format(Math.round(height))}`;
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function savingsLabel(before: number, after: number) {
  if (!before || !Number.isFinite(after)) return "—";
  const percent = ((before - after) / before) * 100;
  const amount = Math.abs(percent).toFixed(1);
  if (percent > 0.05) return `${amount}% smaller`;
  if (percent < -0.05) return `${amount}% larger`;
  return "About the same size";
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}
