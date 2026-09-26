"use client";

export function QualitySlider({
  value,
  onChange,
  disabled = false,
  hint,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="quality-slider" className="text-sm font-semibold text-ink">
          Quality
        </label>
        <span className="text-sm tabular-nums text-muted">{disabled ? "Lossless" : value}</span>
      </div>
      <input
        id="quality-slider"
        className="mt-3 w-full accent-brand disabled:opacity-40"
        type="range"
        min={1}
        max={100}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <p className="mt-2 text-xs leading-5 text-muted">
        {hint ?? "Applies to JPG and WEBP. PNG export stays lossless."}
      </p>
    </div>
  );
}
