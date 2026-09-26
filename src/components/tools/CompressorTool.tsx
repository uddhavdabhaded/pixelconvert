"use client";

import { useEffect, useState } from "react";
import { Alert, Status } from "@/components/Alert";
import { CompressionControls } from "@/components/CompressionControls";
import { DownloadButton } from "@/components/DownloadButton";
import { ImageDimensions } from "@/components/ImageDimensions";
import { ImageUploader } from "@/components/ImageUploader";
import { Pipeline } from "@/components/Pipeline";
import { ToolSkeleton } from "@/components/ToolSkeleton";
import { useEditorSession } from "@/context/editor-session";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { formatBytes, formatDimensions, savingsLabel } from "@/lib/format";
import { exportRaster } from "@/lib/image/canvas";
import { downloadBlob } from "@/lib/image/download";
import { mimeLabel, outputName } from "@/lib/image/mime";
import { toUserMessage } from "@/lib/image/validate";
import type { ImageMime, RasterImage } from "@/lib/image/types";
import { simplifyRatio } from "@/lib/ratios";
import { ui } from "@/lib/ui";

export function CompressorTool() {
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
        <CompressorForm
          key={`${session.revision}-${session.current.mime}`}
          image={session.current}
          original={session.original}
          onUpdate={(image) => {
            session.updateCurrent(image);
            setStatus("Compressed image saved in this session.");
            setError(null);
          }}
          onError={setError}
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

function CompressorForm({
  image,
  original,
  onUpdate,
  onError,
}: {
  image: RasterImage;
  original: RasterImage;
  onUpdate: (image: RasterImage) => void;
  onError: (message: string | null) => void;
}) {
  const [mime, setMime] = useState<ImageMime>(image.mime);
  const [quality, setQuality] = useState(80);
  const [result, setResult] = useState<RasterImage | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void exportRaster(image, { mime, quality: quality / 100 })
        .then((next) => {
          if (!cancelled) {
            setResult(next);
            onError(null);
          }
        })
        .catch((cause) => {
          if (!cancelled) onError(toUserMessage(cause));
        });
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [image, mime, onError, quality]);

  async function save(download: boolean) {
    if (!result) return;
    setBusy(true);
    try {
      if (download) downloadBlob(result.blob, outputName(image.name, result.mime));
      onUpdate(result);
    } catch (cause) {
      onError(toUserMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="grid gap-5 rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5">
        <CompareSlider before={image.blob} after={result?.blob ?? null} />
        <CompressionControls mime={mime} quality={quality} onMime={setMime} onQuality={setQuality} />
        {mime === "image/jpeg" && image.mime !== "image/jpeg" ? (
          <p className="text-xs leading-5 text-muted">Transparent areas will be filled with white in the JPG.</p>
        ) : null}
        {result && result.blob.size > image.blob.size ? (
          <p className="text-xs leading-5 text-muted">
            This export is larger than the current image. A high quality setting, or a lossless PNG, can grow a file that was already optimized.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <button type="button" className={ui.primary} disabled={busy || !result} onClick={() => void save(false)}>
            Use compressed image
          </button>
          <DownloadButton
            label={`Download ${mimeLabel(mime)}`}
            disabled={busy || !result}
            onClick={() => void save(true)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadButton label="Download JPG" variant="secondary" disabled={busy} onClick={() => void downloadAs(image, "image/jpeg", quality, onError)} />
          <DownloadButton label="Download PNG" variant="secondary" disabled={busy} onClick={() => void downloadAs(image, "image/png", quality, onError)} />
          <DownloadButton label="Download WEBP" variant="secondary" disabled={busy} onClick={() => void downloadAs(image, "image/webp", quality, onError)} />
        </div>
      </div>
      <aside className="grid h-fit gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card">
        <h2 className="text-sm font-semibold">Output</h2>
        <ImageDimensions
          rows={[
            { label: "Original", value: formatDimensions(original.width, original.height) },
            { label: "Current", value: formatDimensions(image.width, image.height) },
            { label: "Ratio", value: simplifyRatio(image.width, image.height) },
            { label: "Format", value: mimeLabel(mime) },
            { label: "Original size", value: formatBytes(original.blob.size) },
            { label: "Compressed size", value: result ? formatBytes(result.blob.size) : "Calculating…" },
          ]}
        />
        <p className="text-sm font-medium text-ink">{result ? savingsLabel(image.blob.size, result.blob.size) : "Comparing…"}</p>
        <p className="text-xs leading-5 text-muted">
          Percentage saved compares the compressed file with the image currently in the editor
          {original.blob !== image.blob ? ", which may already be cropped or resized." : "."}
        </p>
        <Pipeline />
      </aside>
    </div>
  );
}

async function downloadAs(image: RasterImage, mime: ImageMime, quality: number, onError: (message: string | null) => void) {
  try {
    const result = await exportRaster(image, { mime, quality: quality / 100 });
    downloadBlob(result.blob, outputName(image.name, mime));
    onError(null);
  } catch (cause) {
    onError(toUserMessage(cause));
  }
}

function CompareSlider({ before, after }: { before: Blob; after: Blob | null }) {
  const [position, setPosition] = useState(56);
  const beforeUrl = useObjectUrl(before);
  const afterUrl = useObjectUrl(after);
  return (
    <div>
      <div className="checker relative h-72 overflow-hidden rounded-xl">
        {afterUrl ? (
          <img src={afterUrl} alt="Compressed preview" className="absolute inset-0 h-full w-full object-contain" />
        ) : null}
        {beforeUrl ? (
          <img
            src={beforeUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${position}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs font-medium text-muted">
        <span>Before</span>
        <span>After</span>
      </div>
      <input
        className="mt-1 w-full accent-brand"
        type="range"
        min={0}
        max={100}
        value={position}
        aria-label="Before and after comparison"
        onChange={(event) => setPosition(Number(event.target.value))}
      />
    </div>
  );
}
