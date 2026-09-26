"use client";

import { resizePresets, type ResizePreset } from "@/lib/image/types";
import { ui } from "@/lib/ui";

export function ResizeControls({
  width,
  height,
  lock,
  onWidth,
  onHeight,
  onLock,
  onPreset,
  onPercent,
}: {
  width: string;
  height: string;
  lock: boolean;
  onWidth: (value: string) => void;
  onHeight: (value: string) => void;
  onLock: (locked: boolean) => void;
  onPreset: (preset: ResizePreset) => void;
  onPercent: (percent: number) => void;
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-ink">
          Width
          <input className={ui.input} inputMode="numeric" value={width} aria-label="Width in pixels" onChange={(event) => onWidth(event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-ink">
          Height
          <input className={ui.input} inputMode="numeric" value={height} aria-label="Height in pixels" onChange={(event) => onHeight(event.target.value)} />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input type="checkbox" checked={lock} onChange={(event) => onLock(event.target.checked)} />
        Lock aspect ratio
      </label>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          onPercent(Number(data.get("percent")));
        }}
      >
        <label className="grid gap-1 text-sm font-medium text-ink">
          Percentage
          <input name="percent" className={`${ui.input} w-32`} inputMode="numeric" defaultValue={100} aria-label="Resize percentage" />
        </label>
        <button type="submit" className={ui.secondary}>
          Apply percentage
        </button>
      </form>
      <div>
        <h3 className="text-sm font-semibold text-ink">Presets</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {resizePresets.map((preset) => (
            <button key={preset.id} type="button" className={ui.secondary} onClick={() => onPreset(preset)}>
              {preset.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-5 text-muted">
          Fit presets scale the image inside the frame and keep its aspect ratio.
        </p>
      </div>
    </div>
  );
}
