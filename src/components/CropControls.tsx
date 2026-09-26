"use client";

import { AspectRatioSelector } from "@/components/AspectRatioSelector";
import { FlipControl } from "@/components/FlipControl";
import { RotateControl } from "@/components/RotateControl";
import { ZoomControl } from "@/components/ZoomControl";
import type { RatioSelection } from "@/lib/ratios";
import { ui } from "@/lib/ui";

type Tab = "crop" | "ratio" | "zoom" | "rotate" | "flip";

export function CropControls({
  tab,
  onTab,
  dragMode,
  onDragMode,
  selection,
  customWidth,
  customHeight,
  customError,
  onCustomWidth,
  onCustomHeight,
  onSelect,
  onApplyCustom,
  zoom,
  onZoom,
  onResetZoom,
  degrees,
  onDegrees,
  onRotateLeft,
  onRotateRight,
  flipH,
  flipV,
  onFlipH,
  onFlipV,
  onReset,
}: {
  tab: Tab;
  onTab: (tab: Tab) => void;
  dragMode: "move" | "crop";
  onDragMode: (mode: "move" | "crop") => void;
  selection: RatioSelection;
  customWidth: string;
  customHeight: string;
  customError: string | null;
  onCustomWidth: (value: string) => void;
  onCustomHeight: (value: string) => void;
  onSelect: (selection: RatioSelection) => void;
  onApplyCustom: () => void;
  zoom: number;
  onZoom: (value: number) => void;
  onResetZoom: () => void;
  degrees: number;
  onDegrees: (degrees: number) => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  flipH: boolean;
  flipV: boolean;
  onFlipH: () => void;
  onFlipV: () => void;
  onReset: () => void;
}) {
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "crop", label: "Crop" },
    { id: "ratio", label: "Ratio" },
    { id: "zoom", label: "Zoom" },
    { id: "rotate", label: "Rotate" },
    { id: "flip", label: "Flip" },
  ];

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
      <div className="mb-4 flex gap-2 overflow-x-auto xl:hidden" role="tablist" aria-label="Editor controls">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${tab === item.id ? "bg-brand text-on-brand" : "bg-surface-2 text-muted"}`}
            onClick={() => onTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={tab === "crop" ? "grid gap-4" : "hidden xl:grid xl:gap-4"}>
        <div>
          <h3 className="text-sm font-semibold text-ink">Crop</h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            Drag the box to move it. Drag the handles to resize. Drag the photo to reposition it.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label="Drag mode">
            <button type="button" aria-pressed={dragMode === "move"} className={dragMode === "move" ? ui.primary : ui.secondary} onClick={() => onDragMode("move")}>
              Move image
            </button>
            <button type="button" aria-pressed={dragMode === "crop"} className={dragMode === "crop" ? ui.primary : ui.secondary} onClick={() => onDragMode("crop")}>
              Draw crop
            </button>
          </div>
        </div>
        <button type="button" className={ui.secondary} onClick={onReset}>
          Reset
        </button>
      </div>
      <div className={`mt-4 xl:mt-5 ${tab === "ratio" ? "block" : "hidden xl:block"}`}>
        <AspectRatioSelector
          selection={selection}
          customWidth={customWidth}
          customHeight={customHeight}
          customError={customError}
          onCustomWidth={onCustomWidth}
          onCustomHeight={onCustomHeight}
          onSelect={onSelect}
          onApplyCustom={onApplyCustom}
        />
      </div>
      <div className={`mt-4 xl:mt-5 ${tab === "zoom" ? "block" : "hidden xl:block"}`}>
        <ZoomControl value={zoom} onChange={onZoom} onReset={onResetZoom} />
      </div>
      <div className={`mt-4 xl:mt-5 ${tab === "rotate" ? "block" : "hidden xl:block"}`}>
        <RotateControl degrees={degrees} onDegrees={onDegrees} onLeft={onRotateLeft} onRight={onRotateRight} />
      </div>
      <div className={`mt-4 xl:mt-5 ${tab === "flip" ? "block" : "hidden xl:block"}`}>
        <FlipControl horizontal={flipH} vertical={flipV} onHorizontal={onFlipH} onVertical={onFlipV} />
      </div>
      <p className="mt-4 hidden text-xs leading-5 text-muted xl:block">
        Keyboard: arrows move the crop, + and − zoom, [ and ] rotate, H and V flip, 0 resets.
      </p>
    </div>
  );
}
