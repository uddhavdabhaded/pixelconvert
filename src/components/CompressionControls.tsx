"use client";

import { FormatSelector } from "@/components/FormatSelector";
import { QualitySlider } from "@/components/QualitySlider";
import type { ImageMime } from "@/lib/image/types";

export function CompressionControls({
  mime,
  quality,
  onMime,
  onQuality,
}: {
  mime: ImageMime;
  quality: number;
  onMime: (mime: ImageMime) => void;
  onQuality: (quality: number) => void;
}) {
  return (
    <div className="grid gap-5">
      <FormatSelector value={mime} onChange={onMime} />
      <QualitySlider
        value={quality}
        onChange={onQuality}
        disabled={mime === "image/png"}
        hint={
          mime === "image/png"
            ? "PNG export is lossless, so this slider does not change it. Choose JPG or WEBP to reduce file size."
            : "Lower values make a smaller file. Check the preview before you download."
        }
      />
    </div>
  );
}
