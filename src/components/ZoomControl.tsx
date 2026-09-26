"use client";

import { Minus, Plus } from "lucide-react";

export function ZoomControl({
  value,
  onChange,
  onReset,
}: {
  value: number;
  onChange: (value: number) => void;
  onReset: () => void;
}) {
  const shown = Math.min(3, Math.max(0.05, value));
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 id="zoom-label" className="text-sm font-semibold text-ink">
          Zoom
        </h3>
        <span className="text-xs tabular-nums text-muted">{Math.round(value * 100)}%</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button type="button" className="grid size-9 place-items-center rounded-lg border border-line" aria-label="Zoom out" onClick={() => onChange(shown - 0.1)}>
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <input
          className="w-full accent-brand"
          type="range"
          min={0.05}
          max={3}
          step={0.01}
          value={shown}
          aria-labelledby="zoom-label"
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <button type="button" className="grid size-9 place-items-center rounded-lg border border-line" aria-label="Zoom in" onClick={() => onChange(shown + 0.1)}>
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
      <button type="button" className="mt-2 text-xs font-semibold text-brand-ink" onClick={onReset}>
        Reset zoom
      </button>
    </div>
  );
}
