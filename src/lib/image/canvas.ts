import { MAX_OUTPUT_DIMENSION } from "./validate";
import type { ImageMime, RasterImage } from "./types";

export async function canvasToBlob(canvas: HTMLCanvasElement, mime: ImageMime, quality: number) {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), mime, mime === "image/png" ? undefined : quality);
  });
  if (!blob) {
    throw new Error("Your browser could not export this image. Try a different format.");
  }
  if (blob.type && blob.type !== mime) {
    throw new Error("Your browser could not export this image as the selected format.");
  }
  return blob;
}

export async function withImage<T>(blob: Blob, run: (image: HTMLImageElement) => Promise<T> | T) {
  const url = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () =>
        reject(new Error("This image could not be read. It may be corrupted or incomplete."));
      element.src = url;
    });
    if (!image.naturalWidth || !image.naturalHeight) {
      throw new Error("This image could not be read. It may be corrupted or incomplete.");
    }
    return await run(image);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function normalizeRotation(value: number) {
  return ((value % 360) + 360) % 360;
}

export async function exportRaster(
  source: RasterImage,
  options: {
    mime?: ImageMime;
    quality?: number;
    width?: number;
    height?: number;
    rotate?: number;
    flipH?: boolean;
    flipV?: boolean;
  } = {},
): Promise<RasterImage> {
  const mime = options.mime ?? source.mime;
  const quality = Math.min(1, Math.max(0.01, options.quality ?? 0.92));
  const rotation = normalizeRotation(options.rotate ?? 0);
  const quarterTurn = rotation % 180 !== 0;

  return withImage(source.blob, async (image) => {
    const sourceWidth = image.naturalWidth;
    const sourceHeight = image.naturalHeight;
    const outputWidth = Math.round(options.width ?? (quarterTurn ? sourceHeight : sourceWidth));
    const outputHeight = Math.round(options.height ?? (quarterTurn ? sourceWidth : sourceHeight));

    if (
      outputWidth < 1 ||
      outputHeight < 1 ||
      outputWidth > MAX_OUTPUT_DIMENSION ||
      outputHeight > MAX_OUTPUT_DIMENSION
    ) {
      throw new Error("Enter dimensions between 1 and 8,192 pixels.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not start image processing.");

    if (mime === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((rotation * Math.PI) / 180);
    context.scale(options.flipH ? -1 : 1, options.flipV ? -1 : 1);
    const drawWidth = quarterTurn ? canvas.height : canvas.width;
    const drawHeight = quarterTurn ? canvas.width : canvas.height;
    context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

    const blob = await canvasToBlob(canvas, mime, quality);
    return {
      blob,
      width: canvas.width,
      height: canvas.height,
      mime,
      name: source.name,
    };
  });
}

export async function exportCanvas(canvas: HTMLCanvasElement, mime: ImageMime, quality: number) {
  if (mime !== "image/jpeg") return canvasToBlob(canvas, mime, quality);
  const flat = document.createElement("canvas");
  flat.width = canvas.width;
  flat.height = canvas.height;
  const context = flat.getContext("2d");
  if (!context) throw new Error("Your browser could not start image processing.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, flat.width, flat.height);
  context.drawImage(canvas, 0, 0);
  return canvasToBlob(flat, mime, quality);
}

const supportCache = new Map<ImageMime, Promise<boolean>>();

export function browserSupports(mime: ImageMime) {
  const cached = supportCache.get(mime);
  if (cached) return cached;
  const pending = new Promise<boolean>((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    canvas.getContext("2d")?.fillRect(0, 0, 1, 1);
    canvas.toBlob((blob) => resolve(Boolean(blob) && blob?.type === mime), mime, 0.8);
  });
  supportCache.set(mime, pending);
  return pending;
}
