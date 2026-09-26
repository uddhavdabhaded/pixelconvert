"use client";

import { mimeLabel, outputMimes } from "@/lib/image/mime";
import type { ImageMime } from "@/lib/image/types";

export function FormatSelector({
  value,
  onChange,
  allowed,
  disabled,
}: {
  value: ImageMime;
  onChange: (mime: ImageMime) => void;
  allowed?: ImageMime[];
  disabled?: ImageMime[];
}) {
  const options = allowed ?? outputMimes;
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">Format</legend>
      <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Output format">
        {options.map((mime) => {
          const selected = value === mime;
          const isDisabled = disabled?.includes(mime);
          return (
            <button
              key={mime}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={isDisabled}
              onClick={() => onChange(mime)}
              className={`h-10 rounded-lg border text-sm font-semibold ${
                selected ? "border-brand bg-brand-soft text-brand-ink" : "border-line bg-surface text-ink"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {mimeLabel(mime)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
