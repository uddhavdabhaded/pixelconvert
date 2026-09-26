"use client";

import { RotateCcw, RotateCw } from "lucide-react";

export function RotateControl({
  degrees,
  onDegrees,
  onLeft,
  onRight,
  showSlider = true,
}: {
  degrees: number;
  onDegrees: (degrees: number) => void;
  onLeft: () => void;
  onRight: () => void;
  showSlider?: boolean;
}) {
  return (
    <div id="rotate">
      <h3 className="text-sm font-semibold text-ink">Rotate</h3>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line text-sm font-medium" onClick={onLeft}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Left 90°
        </button>
        <button type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line text-sm font-medium" onClick={onRight}>
          <RotateCw className="size-4" aria-hidden="true" />
          Right 90°
        </button>
      </div>
      {showSlider ? (
        <label className="mt-3 block text-xs text-muted">
          Angle · {degrees}°
          <input
            className="mt-2 w-full accent-brand"
            type="range"
            min={-180}
            max={180}
            step={1}
            value={degrees}
            aria-label="Rotation angle"
            onChange={(event) => onDegrees(Number(event.target.value))}
          />
        </label>
      ) : null}
    </div>
  );
}
