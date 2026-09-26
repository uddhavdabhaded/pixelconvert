"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Alert, Status } from "@/components/Alert";
import { DownloadButton } from "@/components/DownloadButton";
import { FormatSelector } from "@/components/FormatSelector";
import { ImagePreview } from "@/components/ImagePreview";
import { ImageUploader } from "@/components/ImageUploader";
import { Pipeline } from "@/components/Pipeline";
import { QualitySlider } from "@/components/QualitySlider";
import { ToolSkeleton } from "@/components/ToolSkeleton";
import { useEditorSession } from "@/context/editor-session";
import { useHasMounted } from "@/hooks/useHasMounted";
import { formatBytes, formatDimensions } from "@/lib/format";
import { exportRaster } from "@/lib/image/canvas";
import { downloadBlob } from "@/lib/image/download";
import { inspectFile } from "@/lib/image/load";
import { mimeLabel, outputName } from "@/lib/image/mime";
import { MAX_BATCH, MAX_BATCH_BYTES, toUserMessage } from "@/lib/image/validate";
import { zipBlobs } from "@/lib/image/zip";
import type { ImageMime, RasterImage } from "@/lib/image/types";
import { ui } from "@/lib/ui";

type Item = {
  id: string;
  source: RasterImage;
  status: "ready" | "converting" | "done" | "error";
  error?: string;
  result?: RasterImage;
};

const acceptFor: Record<ImageMime, string> = {
  "image/jpeg": "image/jpeg,.jpg,.jpeg",
  "image/png": "image/png,.png",
  "image/webp": "image/webp,.webp",
};

export function ConverterTool({
  lockedInput,
  defaultOutput,
}: {
  lockedInput?: ImageMime[];
  defaultOutput: ImageMime;
}) {
  const mounted = useHasMounted();
  const session = useEditorSession();
  const [records, setRecords] = useState<Item[]>([]);
  const [dismissedSession, setDismissedSession] = useState(false);
  const [output, setOutput] = useState<ImageMime>(defaultOutput);
  const [quality, setQuality] = useState(82);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sessionImage = mounted ? session.current : null;
  const sessionItem =
    sessionImage && !dismissedSession && (!lockedInput || lockedInput.includes(sessionImage.mime))
      ? (records.find((item) => item.id === "session" && item.source === sessionImage) ?? {
          id: "session",
          source: sessionImage,
          status: "ready" as const,
        })
      : null;
  const items = [...(sessionItem ? [sessionItem] : []), ...records.filter((item) => item.id !== "session")];

  if (!mounted) return <ToolSkeleton />;

  async function addFiles(files: File[]) {
    if (items.length + files.length > MAX_BATCH) {
      setError(`You can convert up to ${MAX_BATCH} images at a time.`);
      return;
    }
    const incoming = files.reduce((sum, file) => sum + file.size, 0);
    const existing = items.reduce((sum, item) => sum + item.source.blob.size, 0);
    if (incoming + existing > MAX_BATCH_BYTES) {
      setError("These images are too large to convert together. Convert fewer images or use smaller files.");
      return;
    }
    const next: Item[] = [];
    const problems: string[] = [];
    for (const file of files) {
      try {
        next.push({ id: crypto.randomUUID(), source: await inspectFile(file, lockedInput), status: "ready" });
      } catch (cause) {
        problems.push(toUserMessage(cause));
      }
    }
    if (next.length > 0) {
      setRecords((current) => [...current, ...next].slice(0, MAX_BATCH));
      setStatus(null);
    }
    setError(problems[0] ?? null);
  }

  async function convertItem(item: Item, mime: ImageMime, level: number) {
    setRecords((current) => {
      const existing = current.some((entry) => entry.id === item.id);
      const base = existing || item.id !== "session" ? current : [...current, item];
      return base.map((entry) => (entry.id === item.id ? { ...entry, status: "converting", error: undefined } : entry));
    });
    try {
      const result = await exportRaster(item.source, { mime, quality: level / 100 });
      setRecords((current) => {
        const existing = current.some((entry) => entry.id === item.id);
        const base = existing || item.id !== "session" ? current : [...current, item];
        return base.map((entry) => (entry.id === item.id ? { ...entry, status: "done", result } : entry));
      });
      return result;
    } catch (cause) {
      const message = toUserMessage(cause);
      setRecords((current) => {
        const existing = current.some((entry) => entry.id === item.id);
        const base = existing || item.id !== "session" ? current : [...current, item];
        return base.map((entry) => (entry.id === item.id ? { ...entry, status: "error", error: message } : entry));
      });
      return null;
    }
  }

  async function convertAll() {
    if (items.length === 0) {
      setError("Choose an image to continue.");
      return;
    }
    setBusy(true);
    setError(null);
    for (const item of items) {
      await convertItem(item, output, quality);
      await new Promise((resolve) => window.setTimeout(resolve, 0));
    }
    setBusy(false);
    setStatus("Conversion finished on this device.");
  }

  async function downloadAll() {
    if (items.length === 0) {
      setError("Choose an image to continue.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const files: Array<{ name: string; blob: Blob }> = [];
      for (const item of items) {
        const result =
          item.result && item.result.mime === output ? item.result : await convertItem(item, output, quality);
        if (!result) continue;
        files.push({ name: outputName(item.source.name, output), blob: result.blob });
      }
      if (files.length === 0) {
        setError("None of the images could be converted.");
        return;
      }
      const zip = await zipBlobs(files);
      downloadBlob(zip, "pixelconvert-images.zip");
      if (files.length === 1) session.updateCurrent(await exportRaster(items[0].source, { mime: output, quality: quality / 100 }));
      setStatus(files.length === items.length ? "ZIP download started." : "ZIP download started for the images that converted.");
    } catch (cause) {
      setError(toUserMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  const accept = lockedInput?.length === 1 ? acceptFor[lockedInput[0]] : undefined;
  const showTransparency = output === "image/jpeg" && items.some((item) => item.source.mime !== "image/jpeg");

  return (
    <div className="grid gap-4">
      {error ? <Alert>{error}</Alert> : null}
      {status ? <Status>{status}</Status> : null}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid gap-4">
          <ImageUploader
            multiple
            accept={accept}
            compact={items.length > 0}
            title={items.length > 0 ? "Add more images" : "Drop images here, or browse"}
            description={
              lockedInput
                ? `This page accepts ${lockedInput.map((mime) => mimeLabel(mime)).join(" and ")} files.`
                : "JPG, PNG, and WEBP. Add up to 20 images."
            }
            onFiles={(files) => void addFiles(files)}
            onReject={setError}
          />
          {items.length > 0 ? (
            <ul className="grid gap-3">
              {items.map((item) => (
                <li key={item.id} className="rounded-2xl border border-line bg-surface p-3 shadow-card">
                  <QueueRow
                    item={item}
                    busy={busy}
                    onRemove={() => {
                      if (item.id === "session") setDismissedSession(true);
                      setRecords((current) => current.filter((entry) => entry.id !== item.id));
                    }}
                    onDownload={() => {
                      void (async () => {
                        setBusy(true);
                        const result =
                          item.result && item.result.mime === output
                            ? item.result
                            : await convertItem(item, output, quality);
                        if (result) {
                          downloadBlob(result.blob, outputName(item.source.name, result.mime));
                          session.updateCurrent(result);
                        }
                        setBusy(false);
                      })();
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <aside className="grid h-fit gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card">
          <h2 className="text-sm font-semibold">Output</h2>
          <FormatSelector value={output} onChange={setOutput} />
          <QualitySlider value={quality} onChange={setQuality} disabled={output === "image/png"} />
          {showTransparency ? (
            <p className="text-xs leading-5 text-muted">Transparent areas will be filled with white in the JPG.</p>
          ) : null}
          <button type="button" className={ui.primary} disabled={busy || items.length === 0} onClick={() => void convertAll()}>
            {busy ? "Converting…" : "Convert"}
          </button>
          <DownloadButton label="Download all" disabled={busy || items.length === 0} onClick={() => void downloadAll()} />
          <p className="text-xs leading-5 text-muted">Download all packs the converted files into a ZIP created in your browser.</p>
          <Pipeline />
        </aside>
      </div>
    </div>
  );
}

function QueueRow({
  item,
  busy,
  onRemove,
  onDownload,
}: {
  item: Item;
  busy: boolean;
  onRemove: () => void;
  onDownload: () => void;
}) {
  const preview = item.result?.blob ?? item.source.blob;
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="checker grid h-20 w-full place-items-center overflow-hidden rounded-lg sm:w-20">
        <ImagePreview blob={preview} alt="" className="max-h-20" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{item.source.name}</p>
        <p className="mt-1 text-xs text-muted">
          {formatDimensions(item.source.width, item.source.height)} · {mimeLabel(item.source.mime)} · {formatBytes(item.source.blob.size)}
          {item.result ? ` → ${mimeLabel(item.result.mime)} · ${formatBytes(item.result.blob.size)}` : ""}
        </p>
        <p className="mt-1 text-xs text-muted">
          {item.status === "converting" ? "Converting…" : null}
          {item.status === "done" ? "Ready to download" : null}
          {item.status === "ready" ? "Waiting" : null}
          {item.status === "error" ? item.error : null}
        </p>
      </div>
      <div className="flex gap-2">
        <DownloadButton label="Download" variant="secondary" disabled={busy} onClick={onDownload} />
        <button type="button" className={ui.ghost} aria-label={`Remove ${item.source.name}`} disabled={busy} onClick={onRemove}>
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
