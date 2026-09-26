"use client";

import { FlipHorizontal2, FlipVertical2 } from "lucide-react";

export function FlipControl({
  horizontal,
  vertical,
  onHorizontal,
  onVertical,
}: {
  horizontal: boolean;
  vertical: boolean;
  onHorizontal: () => void;
  onVertical: () => void;
}) {
  return (
    <div id="flip">
      <h3 className="text-sm font-semibold text-ink">Flip</h3>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          aria-pressed={horizontal}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-medium ${horizontal ? "border-brand bg-brand-soft text-brand-ink" : "border-line"}`}
          onClick={onHorizontal}
        >
          <FlipHorizontal2 className="size-4" aria-hidden="true" />
          Horizontal
        </button>
        <button
          type="button"
          aria-pressed={vertical}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-medium ${vertical ? "border-brand bg-brand-soft text-brand-ink" : "border-line"}`}
          onClick={onVertical}
        >
          <FlipVertical2 className="size-4" aria-hidden="true" />
          Vertical
        </button>
      </div>
    </div>
  );
}
