"use client";

import { ratioPresets, selectionKey, socialPresets, type RatioSelection } from "@/lib/ratios";
import { ui } from "@/lib/ui";

export function AspectRatioSelector({
  selection,
  customWidth,
  customHeight,
  customError,
  onCustomWidth,
  onCustomHeight,
  onSelect,
  onApplyCustom,
}: {
  selection: RatioSelection;
  customWidth: string;
  customHeight: string;
  customError: string | null;
  onCustomWidth: (value: string) => void;
  onCustomHeight: (value: string) => void;
  onSelect: (selection: RatioSelection) => void;
  onApplyCustom: () => void;
}) {
  const active = selectionKey(selection);
  return (
    <div className="grid gap-4">
      <div>
        <h3 className="text-sm font-semibold text-ink">Ratio</h3>
        <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Aspect ratio">
          {ratioPresets.map((preset) => {
            const key = preset.id === "free" || preset.id === "original" ? preset.id : `preset:${preset.id}`;
            const selected = active === key;
            return (
              <button
                key={preset.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  if (preset.value === null) onSelect({ kind: "free" });
                  else if (preset.value === "original") onSelect({ kind: "original" });
                  else onSelect({ kind: "preset", id: preset.id, value: preset.value });
                }}
                className={`h-9 rounded-lg border text-xs font-semibold transition-all duration-200 ${
                  selected
                    ? "border-brand bg-brand-soft text-brand-ink shadow-sm scale-[1.02]"
                    : "border-line text-ink hover:border-brand/40 hover:bg-surface-2"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-ink">Social presets</h3>
        <p className="mt-1 text-xs leading-5 text-muted">Each preset sets an aspect ratio. Pixel sizes are not forced.</p>
        <div className="mt-2 grid gap-1.5">
          {socialPresets.map((preset) => {
            const selected = active === `social:${preset.id}`;
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect({ kind: "social", id: preset.id, value: preset.value })}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-all duration-200 ${
                  selected
                    ? "border-brand bg-brand-soft text-brand-ink shadow-sm"
                    : "border-line text-ink hover:border-brand/40 hover:bg-surface-2"
                }`}
              >
                <span>{preset.label}</span>
                <span className="text-xs text-muted">{preset.hint}</span>
              </button>
            );
          })}
        </div>
      </div>
      <form
        className="grid gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onApplyCustom();
        }}
      >
        <h3 className="text-sm font-semibold text-ink">Custom ratio</h3>
        <div className="grid grid-cols-2 gap-2">
          <label className="grid gap-1 text-xs text-muted">
            Width
            <input
              className={ui.input}
              inputMode="decimal"
              value={customWidth}
              aria-invalid={customError ? true : undefined}
              onChange={(event) => onCustomWidth(event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-xs text-muted">
            Height
            <input
              className={ui.input}
              inputMode="decimal"
              value={customHeight}
              aria-invalid={customError ? true : undefined}
              onChange={(event) => onCustomHeight(event.target.value)}
            />
          </label>
        </div>
        {customError ? (
          <p role="alert" className="text-xs text-danger">
            {customError}
          </p>
        ) : (
          <p className="text-xs text-muted">Example: 1200 and 800 locks the crop to 3:2.</p>
        )}
        <button type="submit" className={ui.secondary}>
          Apply custom ratio
        </button>
      </form>
    </div>
  );
}
