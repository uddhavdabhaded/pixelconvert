"use client";

import { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import "@/components/cropper-theme.css";
import { Alert, Status } from "@/components/Alert";
import { CropControls } from "@/components/CropControls";
import { DownloadButton } from "@/components/DownloadButton";
import { FormatSelector } from "@/components/FormatSelector";
import { ImageDimensions } from "@/components/ImageDimensions";
import { ImagePreview } from "@/components/ImagePreview";
import { ImageUploader } from "@/components/ImageUploader";
import { Pipeline } from "@/components/Pipeline";
import { QualitySlider } from "@/components/QualitySlider";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { formatBytes, formatDimensions, savingsLabel } from "@/lib/format";
import { canvasToBlob, exportCanvas } from "@/lib/image/canvas";
import { fitCropBoxToRatio, syncCropDimensions } from "@/lib/image/crop-box";
import { downloadBlob } from "@/lib/image/download";
import { mimeLabel, outputName } from "@/lib/image/mime";
import { MAX_OUTPUT_DIMENSION, toUserMessage } from "@/lib/image/validate";
import type { ImageMime, RasterImage } from "@/lib/image/types";
import {
  customRatioValue,
  normalizeDegrees,
  parsePositiveNumber,
  ratioFromSelection,
  ratioPresets,
  simplifyRatio,
  socialPresets,
  type RatioSelection,
} from "@/lib/ratios";
import { ui } from "@/lib/ui";

type Tab = "crop" | "ratio" | "zoom" | "rotate" | "flip";

function readZoom(cropper: Cropper) {
  const data = cropper.getImageData();
  if (!data.naturalWidth) return 1;
  return data.width / data.naturalWidth;
}

export function CropEditor({
  image,
  original,
  onApply,
  onReplace,
  onClear,
}: {
  image: RasterImage;
  original: RasterImage;
  onApply: (image: RasterImage) => void;
  onReplace: (file: File) => Promise<void>;
  onClear: () => void;
}) {
  const url = useObjectUrl(image.blob);
  const imgRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const naturalRatio = useRef(image.width / Math.max(1, image.height));
  const initialZoom = useRef(1);
  const selectionRef = useRef<RatioSelection>({ kind: "free" });
  const resetRef = useRef<() => void>(() => undefined);
  const stageRef = useRef<HTMLDivElement>(null);
  const animTimer = useRef<number | null>(null);

  const [selection, setSelection] = useState<RatioSelection>({ kind: "free" });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ h: false, v: false });
  const [cropSize, setCropSize] = useState({ width: image.width, height: image.height });
  const [dragMode, setDragMode] = useState<"move" | "crop">("move");
  const [tab, setTab] = useState<Tab>(() => {
    if (typeof window === "undefined") return "crop";
    const hash = window.location.hash.replace("#", "");
    if (hash === "crop" || hash === "ratio" || hash === "zoom" || hash === "rotate" || hash === "flip") return hash;
    return "crop";
  });
  const [output, setOutput] = useState<ImageMime>("image/png");
  const [quality, setQuality] = useState(82);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [limited, setLimited] = useState(false);
  const [readyVersion, setReadyVersion] = useState(0);
  const [previewTick, setPreviewTick] = useState(0);
  const [previewUpdating, setPreviewUpdating] = useState(false);
  const [dimsFlash, setDimsFlash] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [customWidth, setCustomWidth] = useState("1200");
  const [customHeight, setCustomHeight] = useState("800");
  const [customError, setCustomError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || !imgRef.current) return;
    let active = true;
    const cropper = new Cropper(imgRef.current, {
      viewMode: 1,
      dragMode: "move",
      autoCropArea: 0.86,
      responsive: true,
      background: false,
      movable: true,
      zoomable: true,
      zoomOnWheel: true,
      zoomOnTouch: true,
      rotatable: true,
      scalable: true,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: true,
      guides: true,
      center: true,
      highlight: true,
      checkOrientation: false,
      checkCrossOrigin: false,
      ready() {
        if (!active) return;
        const imageData = cropper.getImageData();
        naturalRatio.current = imageData.naturalWidth / Math.max(1, imageData.naturalHeight);
        initialZoom.current = readZoom(cropper);
        const ratio = ratioFromSelection(selectionRef.current, naturalRatio.current);
        cropper.setAspectRatio(ratio ?? Number.NaN);
        fitCropBoxToRatio(cropper, ratio);
        setCropSize(syncCropDimensions(cropper));
        setZoom(initialZoom.current);
        setRotation(0);
        setFlip({ h: false, v: false });
        setDragMode("move");
        setReadyVersion((value) => value + 1);
        setPreviewTick((value) => value + 1);
      },
      cropstart() {
        stageRef.current?.classList.remove("pc-ratio-animating");
      },
      crop(event) {
        const width = Math.max(1, Math.round(event.detail.width));
        const height = Math.max(1, Math.round(event.detail.height));
        setCropSize((previous) =>
          previous.width === width && previous.height === height ? previous : { width, height },
        );
      },
      cropend() {
        setPreviewTick((value) => value + 1);
      },
      zoom(event) {
        setZoom(event.detail.ratio);
      },
    });
    cropperRef.current = cropper;
    return () => {
      active = false;
      if (animTimer.current) window.clearTimeout(animTimer.current);
      cropper.destroy();
      cropperRef.current = null;
    };
  }, [url]);

  useEffect(() => {
    const cropper = cropperRef.current;
    if (!cropper || readyVersion === 0) return;
    let cancelled = false;
    setPreviewUpdating(true);
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const preview = cropper.getCroppedCanvas({
            maxWidth: 720,
            maxHeight: 720,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
            fillColor: output === "image/jpeg" ? "#ffffff" : "transparent",
          });
          if (!preview?.width || !preview.height) {
            throw new Error("empty preview");
          }
          const full = cropper.getCroppedCanvas({
            maxWidth: MAX_OUTPUT_DIMENSION,
            maxHeight: MAX_OUTPUT_DIMENSION,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
            fillColor: output === "image/jpeg" ? "#ffffff" : "transparent",
          });
          const previewResult = await canvasToBlob(
            preview,
            output === "image/png" ? "image/png" : output,
            quality / 100,
          );
          const fullResult = await exportCanvas(full, output, quality / 100);
          if (cancelled) return;
          const data = cropper.getData();
          setLimited(data.width > MAX_OUTPUT_DIMENSION || data.height > MAX_OUTPUT_DIMENSION);
          const size = syncCropDimensions(cropper);
          setCropSize((previous) =>
            previous.width === size.width && previous.height === size.height ? previous : size,
          );
          setPreviewBlob(previewResult);
          setOutputSize(fullResult.size);
        } catch {
          if (!cancelled) setOutputSize(null);
        } finally {
          if (!cancelled) setPreviewUpdating(false);
        }
      })();
    }, previewTick > 0 ? 120 : 280);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [cropSize.width, cropSize.height, flip, output, previewTick, quality, readyVersion, rotation, url]);

  function requireCropper() {
    const cropper = cropperRef.current;
    if (!cropper) throw new Error("The editor is still preparing this image. Wait a moment and try again.");
    return cropper;
  }

  function pulseRatioAnimation() {
    const stage = stageRef.current;
    if (!stage) return;
    stage.classList.add("pc-ratio-animating");
    if (animTimer.current) window.clearTimeout(animTimer.current);
    animTimer.current = window.setTimeout(() => {
      stage.classList.remove("pc-ratio-animating");
    }, 380);
  }

  function selectRatio(next: RatioSelection) {
    setSelection(next);
    selectionRef.current = next;
    setCustomError(null);
    const cropper = cropperRef.current;
    if (!cropper) return;

    const ratio = ratioFromSelection(next, naturalRatio.current);
    pulseRatioAnimation();
    setDimsFlash(true);
    window.setTimeout(() => setDimsFlash(false), 450);
    setPreviewUpdating(true);

    cropper.setAspectRatio(ratio ?? Number.NaN);
    // Wait one frame so Cropper applies the new constraint, then fill the frame.
    window.requestAnimationFrame(() => {
      fitCropBoxToRatio(cropper, ratio);
      const size = syncCropDimensions(cropper);
      setCropSize(size);
      setPreviewTick((value) => value + 1);
      const label =
        next.kind === "free"
          ? null
          : next.kind === "original"
            ? "original"
            : next.kind === "custom"
              ? `${next.width}:${next.height}`
              : next.kind === "preset"
                ? (ratioPresets.find((item) => item.id === next.id)?.label ?? next.id)
                : (socialPresets.find((item) => item.id === next.id)?.label ?? next.id);
      setStatus(
        next.kind === "free"
          ? "Free crop unlocked. Drag the handles to any shape."
          : `Crop locked to ${label}. Live preview updated.`,
      );
    });
  }

  function applyCustomRatio() {
    const width = parsePositiveNumber(customWidth);
    const height = parsePositiveNumber(customHeight);
    const value = width && height ? customRatioValue(width, height) : null;
    if (!width || !height || !value) {
      setCustomError("Enter a width and height greater than zero. Example: 1200 and 800.");
      return;
    }
    setCustomError(null);
    selectRatio({ kind: "custom", width, height, value });
  }

  function changeZoom(next: number) {
    const value = Math.min(3, Math.max(0.05, Number(next.toFixed(2))));
    cropperRef.current?.zoomTo(value);
    setZoom(value);
  }

  function rotateBy(delta: number) {
    const cropper = cropperRef.current;
    if (!cropper) return;
    pulseRatioAnimation();
    cropper.rotate(delta);
    setRotation(normalizeDegrees(cropper.getData().rotate || 0));
    setCropSize(syncCropDimensions(cropper));
    setPreviewTick((value) => value + 1);
  }

  function rotateTo(degrees: number) {
    const cropper = cropperRef.current;
    if (!cropper) return;
    cropper.rotateTo(degrees);
    setRotation(degrees);
    setCropSize(syncCropDimensions(cropper));
    setPreviewTick((value) => value + 1);
  }

  function toggleFlip(axis: "h" | "v") {
    const cropper = cropperRef.current;
    if (!cropper) return;
    pulseRatioAnimation();
    const data = cropper.getData();
    if (axis === "h") {
      cropper.scaleX(-(data.scaleX || 1));
      setFlip((current) => ({ ...current, h: !current.h }));
    } else {
      cropper.scaleY(-(data.scaleY || 1));
      setFlip((current) => ({ ...current, v: !current.v }));
    }
    setCropSize(syncCropDimensions(cropper));
    setPreviewTick((value) => value + 1);
  }

  function resetAll() {
    const cropper = cropperRef.current;
    if (!cropper) return;
    cropper.reset();
    const ratio = ratioFromSelection(selectionRef.current, naturalRatio.current);
    cropper.setAspectRatio(ratio ?? Number.NaN);
    fitCropBoxToRatio(cropper, ratio);
    cropper.setDragMode(dragMode);
    setRotation(0);
    setFlip({ h: false, v: false });
    setZoom(readZoom(cropper));
    setCropSize(syncCropDimensions(cropper));
    setPreviewTick((value) => value + 1);
    setStatus("Editor reset.");
    setError(null);
  }

  useEffect(() => {
    resetRef.current = resetAll;
  });

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }
      const cropper = cropperRef.current;
      if (!cropper) return;
      const step = event.shiftKey ? 24 : 8;
      const box = () => cropper.getCropBoxData();
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        cropper.setCropBoxData({ left: box().left - step });
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        cropper.setCropBoxData({ left: box().left + step });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        cropper.setCropBoxData({ top: box().top - step });
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        cropper.setCropBoxData({ top: box().top + step });
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        cropper.zoom(0.1);
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        cropper.zoom(-0.1);
      } else if (event.key === "[") {
        event.preventDefault();
        cropper.rotate(-90);
        setRotation(normalizeDegrees(cropper.getData().rotate || 0));
      } else if (event.key === "]") {
        event.preventDefault();
        cropper.rotate(90);
        setRotation(normalizeDegrees(cropper.getData().rotate || 0));
      } else if (event.key.toLowerCase() === "h") {
        event.preventDefault();
        const data = cropper.getData();
        cropper.scaleX(-(data.scaleX || 1));
        setFlip((current) => ({ ...current, h: !current.h }));
      } else if (event.key.toLowerCase() === "v") {
        event.preventDefault();
        const data = cropper.getData();
        cropper.scaleY(-(data.scaleY || 1));
        setFlip((current) => ({ ...current, v: !current.v }));
      } else if (event.key === "0") {
        event.preventDefault();
        resetRef.current();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function croppedCanvas() {
    const cropper = requireCropper();
    const canvas = cropper.getCroppedCanvas({
      maxWidth: MAX_OUTPUT_DIMENSION,
      maxHeight: MAX_OUTPUT_DIMENSION,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
      fillColor: "transparent",
    });
    if (!canvas?.width || !canvas.height) {
      throw new Error("Your browser could not process this crop. Try a smaller image.");
    }
    return canvas;
  }

  async function commit(mime: ImageMime | "session", download: boolean) {
    setBusy(true);
    setError(null);
    try {
      const canvas = await croppedCanvas();
      const exportMime: ImageMime = mime === "session" ? "image/png" : mime;
      const blob =
        exportMime === "image/png"
          ? await canvasToBlob(canvas, "image/png", 1)
          : await exportCanvas(canvas, exportMime, quality / 100);
      const sessionBlob = exportMime === "image/png" ? blob : await canvasToBlob(canvas, "image/png", 1);
      if (download) downloadBlob(blob, outputName(image.name, exportMime));
      onApply({
        blob: sessionBlob,
        width: canvas.width,
        height: canvas.height,
        mime: "image/png",
        name: image.name,
      });
      setStatus(
        download
          ? "Download started. The cropped image stays available for resize, compress, and convert."
          : "Crop applied. Continue to resize, compress, or convert without uploading again.",
      );
    } catch (cause) {
      setError(toUserMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <p className="sr-only">
        Crop editor for {image.name}. Drag the crop box or its handles. Current crop {cropSize.width} by {cropSize.height} pixels.
      </p>
      <div className="editor-grid">
        <div className="area-canvas overflow-hidden rounded-2xl bg-stage">
          <div ref={stageRef} className="pc-stage flex items-center justify-center">
            {url ? (
              <img ref={imgRef} src={url} alt="" className="block max-h-[min(70vh,760px)] max-w-full" />
            ) : null}
          </div>
        </div>
        <div className="area-controls">
          <CropControls
            tab={tab}
            onTab={setTab}
            dragMode={dragMode}
            onDragMode={(mode) => {
              setDragMode(mode);
              cropperRef.current?.setDragMode(mode);
            }}
            selection={selection}
            customWidth={customWidth}
            customHeight={customHeight}
            customError={customError}
            onCustomWidth={setCustomWidth}
            onCustomHeight={setCustomHeight}
            onSelect={selectRatio}
            onApplyCustom={applyCustomRatio}
            zoom={zoom}
            onZoom={changeZoom}
            onResetZoom={() => changeZoom(initialZoom.current || 1)}
            degrees={rotation}
            onDegrees={rotateTo}
            onRotateLeft={() => rotateBy(-90)}
            onRotateRight={() => rotateBy(90)}
            flipH={flip.h}
            flipV={flip.v}
            onFlipH={() => toggleFlip("h")}
            onFlipV={() => toggleFlip("v")}
            onReset={resetAll}
          />
        </div>
        <aside className="area-preview grid gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-ink">Preview</h2>
              <span className="text-xs tabular-nums text-muted" aria-live="polite">
                {previewUpdating ? "Updating…" : `${cropSize.width} × ${cropSize.height}`}
              </span>
            </div>
            <div
              className={`checker pc-preview-shell mt-3 grid h-48 place-items-center overflow-hidden rounded-xl ${previewUpdating ? "is-updating" : ""}`}
            >
              <ImagePreview
                key={`${previewTick}-${output}-${quality}`}
                blob={previewBlob}
                alt="Cropped image preview"
                className="max-h-48"
                animate
              />
            </div>
          </div>
          <div className={dimsFlash ? "pc-dim-pulse rounded-xl" : undefined}>
            <ImageDimensions
              rows={[
                { label: "Original", value: formatDimensions(original.width, original.height) },
                { label: "Current", value: formatDimensions(cropSize.width, cropSize.height) },
                { label: "Ratio", value: simplifyRatio(cropSize.width, cropSize.height) },
                { label: "Format", value: mimeLabel(output) },
                { label: "Original size", value: formatBytes(original.blob.size) },
                {
                  label: "Output size",
                  value: outputSize === null || previewUpdating ? "Calculating…" : formatBytes(outputSize),
                },
              ]}
            />
          </div>
          <p className="text-sm text-muted">
            {outputSize === null || previewUpdating
              ? "Updating cropped result…"
              : savingsLabel(original.blob.size, outputSize)}
          </p>
          {limited ? (
            <p className="text-xs leading-5 text-muted">The export is limited to 8,192 pixels on the long side.</p>
          ) : null}
          <FormatSelector value={output} onChange={setOutput} />
          <QualitySlider value={quality} onChange={setQuality} disabled={output === "image/png"} />
          {output === "image/jpeg" && (image.mime === "image/png" || image.mime === "image/webp") ? (
            <p className="text-xs leading-5 text-muted">Transparent areas will be filled with white in the JPG.</p>
          ) : null}
          <Pipeline />
        </aside>
      </div>
      {error ? <Alert>{error}</Alert> : null}
      {status ? <Status>{status}</Status> : null}
      <div className="sticky bottom-3 z-20 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface/95 p-3 shadow-card backdrop-blur">
        {confirmClear ? (
          <div className="flex flex-wrap items-center gap-2" role="alert">
            <span className="text-sm text-ink">Remove this image from the editor?</span>
            <button type="button" className={ui.secondary} onClick={() => setConfirmClear(false)}>
              Keep editing
            </button>
            <button type="button" className={ui.danger} onClick={onClear}>
              Remove
            </button>
          </div>
        ) : (
          <button type="button" className={ui.secondary} onClick={() => setConfirmClear(true)}>
            Cancel
          </button>
        )}
        <button type="button" className={ui.secondary} onClick={resetAll}>
          Reset
        </button>
        <button type="button" className={ui.secondary} disabled={busy} onClick={() => void commit("session", false)}>
          Apply Crop
        </button>
        <div className="ml-auto flex flex-wrap gap-2">
          <DownloadButton label="Download JPG" disabled={busy} onClick={() => void commit("image/jpeg", true)} />
          <DownloadButton label="Download PNG" disabled={busy} variant="secondary" onClick={() => void commit("image/png", true)} />
          <DownloadButton label="Download WEBP" disabled={busy} variant="secondary" onClick={() => void commit("image/webp", true)} />
        </div>
      </div>
      <div>
        <button type="button" className={ui.ghost} onClick={() => setReplacing((value) => !value)}>
          {replacing ? "Hide uploader" : "Replace image"}
        </button>
        {replacing ? (
          <div className="mt-3">
            <ImageUploader
              compact
              title="Replace the current image"
              description="The new file replaces the image in this editing session."
              onFiles={(files) => {
                const file = files[0];
                if (!file) return;
                void onReplace(file)
                  .then(() => setReplacing(false))
                  .catch((cause) => setError(toUserMessage(cause)));
              }}
              onReject={setError}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
