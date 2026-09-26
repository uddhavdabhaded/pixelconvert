"use client";

import { useEffect, useState } from "react";
import { Alert, Status } from "@/components/Alert";
import { DownloadButton } from "@/components/DownloadButton";
import { FlipControl } from "@/components/FlipControl";
import { FormatSelector } from "@/components/FormatSelector";
import { ImageDimensions } from "@/components/ImageDimensions";
import { ImagePreview } from "@/components/ImagePreview";
import { ImageUploader } from "@/components/ImageUploader";
import { Pipeline } from "@/components/Pipeline";
import { QualitySlider } from "@/components/QualitySlider";
import { ResizeControls } from "@/components/ResizeControls";
import { RotateControl } from "@/components/RotateControl";
import { ToolSkeleton } from "@/components/ToolSkeleton";
import { useEditorSession } from "@/context/editor-session";
import { useHasMounted } from "@/hooks/useHasMounted";
import { formatBytes, formatDimensions, savingsLabel } from "@/lib/format";
import { downloadBlob } from "@/lib/image/download";
import { exportRaster } from "@/lib/image/canvas";
import { mimeLabel, outputName } from "@/lib/image/mime";
import { MAX_OUTPUT_DIMENSION, parsePixelSize, toUserMessage } from "@/lib/image/validate";
import type { ImageMime, RasterImage, ResizePreset } from "@/lib/image/types";
import { simplifyRatio } from "@/lib/ratios";
import { ui } from "@/lib/ui";

function withinLimit(value: number) {
  return value >= 1 && value <= MAX_OUTPUT_DIMENSION;
}

export function ResizerTool() {
  const mounted = useHasMounted();
  const session = useEditorSession();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  if (!mounted) return <ToolSkeleton />;

  return (
    <div className="grid gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {status ? <Status>{status}</Status> : null}
      {session.current && session.original ? (
        <ResizerForm
          key={session.revision}
          image={session.current}
          original={session.original}
          onUpdate={(image) => {
            session.updateCurrent(image);
            setStatus("The edited image is ready for the next tool.");
            setError(null);
          }}
          onError={setError}
          onRevert={() => {
            session.resetToOriginal();
            setStatus("Restored the original upload.");
            setError(null);
          }}
        />
      ) : (
        <ImageUploader
          onReject={setError}
          onFiles={(files) => {
            const file = files[0];
            if (!file) return;
            void session.loadFile(file).then(() => setError(null)).catch((cause) => setError(toUserMessage(cause)));
          }}
        />
      )}
    </div>
  );
}

function ResizerForm({
  image,
  original,
  onUpdate,
  onError,
  onRevert,
}: {
  image: RasterImage;
  original: RasterImage;
  onUpdate: (image: RasterImage) => void;
  onError: (message: string | null) => void;
  onRevert: () => void;
}) {
  const [width, setWidth] = useState(String(image.width));
  const [height, setHeight] = useState(String(image.height));
  const [lock, setLock] = useState(true);
  const [mime, setMime] = useState<ImageMime>(image.mime);
  const [quality, setQuality] = useState(90);
  const [preview, setPreview] = useState<RasterImage | null>(null);
  const [busy, setBusy] = useState(false);

  const widthValue = parsePixelSize(width);
  const heightValue = parsePixelSize(height);

  useEffect(() => {
    if (!widthValue || !heightValue) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void exportRaster(image, { width: widthValue, height: heightValue, mime: "image/png", quality: 1 })
        .then((result) => {
          if (!cancelled) setPreview(result);
        })
        .catch((cause) => {
          if (!cancelled) onError(toUserMessage(cause));
        });
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [heightValue, image, onError, widthValue]);

  function updateWidth(value: string) {
    setWidth(value);
    if (!lock) return;
    const parsed = parsePixelSize(value);
    if (!parsed) return;
    const next = Math.round(parsed * (image.height / image.width));
    if (withinLimit(next)) setHeight(String(next));
  }

  function updateHeight(value: string) {
    setHeight(value);
    if (!lock) return;
    const parsed = parsePixelSize(value);
    if (!parsed) return;
    const next = Math.round(parsed * (image.width / image.height));
    if (withinLimit(next)) setWidth(String(next));
  }

  function toggleLock(next: boolean) {
    setLock(next);
    if (!next) return;
    const parsed = parsePixelSize(width);
    if (!parsed) return;
    const linked = Math.round(parsed * (image.height / image.width));
    if (withinLimit(linked)) setHeight(String(linked));
  }

  function applyPercent(percent: number) {
    if (!Number.isFinite(percent) || percent < 1 || percent > 400) {
      onError("Enter a percentage between 1 and 400.");
      return;
    }
    const nextWidth = Math.max(1, Math.round(image.width * (percent / 100)));
    const nextHeight = Math.max(1, Math.round(image.height * (percent / 100)));
    if (!withinLimit(nextWidth) || !withinLimit(nextHeight)) {
      onError("That percentage makes one side larger than 8,192 pixels.");
      return;
    }
    setWidth(String(nextWidth));
    setHeight(String(nextHeight));
    onError(null);
  }

  function applyPreset(preset: ResizePreset) {
    if (preset.kind === "percent") {
      applyPercent(preset.value);
      return;
    }
    if (preset.kind === "width") {
      const nextWidth = Math.min(preset.value, MAX_OUTPUT_DIMENSION);
      const nextHeight = lock
        ? Math.round(nextWidth * (image.height / image.width))
        : (parsePixelSize(height) ?? image.height);
      if (!withinLimit(nextHeight)) {
        onError("That width would make the height larger than 8,192 pixels. Choose a smaller width or unlock the ratio.");
        return;
      }
      setWidth(String(nextWidth));
      setHeight(String(nextHeight));
      onError(null);
      return;
    }
    const ratio = image.width / image.height;
    let nextWidth = preset.width;
    let nextHeight = Math.round(nextWidth / ratio);
    if (nextHeight > preset.height) {
      nextHeight = preset.height;
      nextWidth = Math.round(nextHeight * ratio);
    }
    setWidth(String(Math.max(1, nextWidth)));
    setHeight(String(Math.max(1, nextHeight)));
    onError(null);
  }

  async function bake(change: { rotate?: number; flipH?: boolean; flipV?: boolean }) {
    setBusy(true);
    onError(null);
    try {
      onUpdate(await exportRaster(image, { ...change, mime: "image/png", quality: 1 }));
    } catch (cause) {
      onError(toUserMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  async function save(download: ImageMime | null) {
    if (!widthValue || !heightValue) {
      onError("Width and height must be whole numbers from 1 to 8,192.");
      return;
    }
    setBusy(true);
    onError(null);
    try {
      const resized = await exportRaster(image, {
        width: widthValue,
        height: heightValue,
        mime: "image/png",
        quality: 1,
      });
      if (download) {
        const file =
          download === "image/png"
            ? resized
            : await exportRaster(resized, { mime: download, quality: quality / 100 });
        downloadBlob(file.blob, outputName(image.name, download));
      }
      onUpdate(download && download !== "image/png" ? await exportRaster(resized, { mime: download, quality: quality / 100 }) : resized);
    } catch (cause) {
      onError(toUserMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  const outputBytes = preview && mime === "image/png" ? preview.blob.size : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="grid gap-5 rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5">
        <ResizeControls
          width={width}
          height={height}
          lock={lock}
          onWidth={updateWidth}
          onHeight={updateHeight}
          onLock={toggleLock}
          onPreset={applyPreset}
          onPercent={applyPercent}
        />
        <RotateControl degrees={0} showSlider={false} onDegrees={() => undefined} onLeft={() => void bake({ rotate: -90 })} onRight={() => void bake({ rotate: 90 })} />
        <FlipControl horizontal={false} vertical={false} onHorizontal={() => void bake({ flipH: true })} onVertical={() => void bake({ flipV: true })} />
        <p className="text-xs leading-5 text-muted">Rotation and flipping are applied to the working image and kept as PNG so repeated edits do not add JPG compression.</p>
        <FormatSelector value={mime} onChange={setMime} />
        <QualitySlider value={quality} onChange={setQuality} disabled={mime === "image/png"} />
        <div className="flex flex-wrap gap-2">
          <button type="button" className={ui.primary} disabled={busy} onClick={() => void save(null)}>
            Apply resize
          </button>
          <button type="button" className={ui.secondary} disabled={busy} onClick={onRevert}>
            Revert to original
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadButton label="Download JPG" disabled={busy} onClick={() => void save("image/jpeg")} />
          <DownloadButton label="Download PNG" disabled={busy} variant="secondary" onClick={() => void save("image/png")} />
          <DownloadButton label="Download WEBP" disabled={busy} variant="secondary" onClick={() => void save("image/webp")} />
        </div>
      </div>
      <aside className="grid h-fit gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card">
        <h2 className="text-sm font-semibold">Preview</h2>
        <div className="checker grid h-56 place-items-center overflow-hidden rounded-xl">
          <ImagePreview blob={widthValue && heightValue ? (preview?.blob ?? image.blob) : image.blob} alt="Resized image preview" className="max-h-56" />
        </div>
        <ImageDimensions
          rows={[
            { label: "Original", value: formatDimensions(original.width, original.height) },
            {
              label: "Current",
              value: widthValue && heightValue ? formatDimensions(widthValue, heightValue) : "Invalid",
            },
            {
              label: "Ratio",
              value: widthValue && heightValue ? simplifyRatio(widthValue, heightValue) : "—",
            },
            { label: "Format", value: mimeLabel(mime) },
            { label: "Original size", value: formatBytes(original.blob.size) },
            { label: "Output size", value: outputBytes === null ? (mime === "image/png" ? "Calculating…" : "Shown on download") : formatBytes(outputBytes) },
          ]}
        />
        {outputBytes !== null ? <p className="text-sm text-muted">{savingsLabel(original.blob.size, outputBytes)}</p> : null}
        {mime === "image/jpeg" ? (
          <p className="text-xs leading-5 text-muted">Transparent areas will be filled with white in the JPG.</p>
        ) : null}
        <Pipeline />
      </aside>
    </div>
  );
}
