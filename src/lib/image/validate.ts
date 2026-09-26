import { mimeLabel } from "./mime";
import type { ImageMime } from "./types";

export const ACCEPT_ATTRIBUTE =
  "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_DIMENSION = 12000;
export const MAX_OUTPUT_DIMENSION = 8192;
export const MAX_BATCH = 20;
export const MAX_BATCH_BYTES = 80 * 1024 * 1024;

export function sniffMime(file: { name: string; type: string }): ImageMime | null {
  const type = file.type.toLowerCase();
  if (type === "image/jpg" || type === "image/jpeg" || type === "image/pjpeg") {
    return "image/jpeg";
  }
  if (type === "image/png") return "image/png";
  if (type === "image/webp") return "image/webp";
  const name = file.name.toLowerCase();
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  return null;
}

export function validateFile(file: File | null | undefined, allowed?: ImageMime[]) {
  if (!file) return "Choose an image to continue.";
  if (file.size === 0) return "This file is empty. Choose a JPG, PNG, or WEBP image.";
  const mime = sniffMime(file);
  if (!mime) {
    return "This file type is not supported. Use a JPG, PNG, or WEBP image.";
  }
  if (allowed && !allowed.includes(mime)) {
    const accepted = allowed.map((item) => mimeLabel(item)).join(" or ");
    return `This tool accepts ${accepted} files. ${file.name} is a ${mimeLabel(mime)} image.`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return "This image is larger than 25 MB. Choose a smaller file so your browser can process it reliably.";
  }
  return null;
}

export function parsePixelSize(value: string) {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const size = Number(trimmed);
  if (size < 1 || size > MAX_OUTPUT_DIMENSION) return null;
  return size;
}

export function toUserMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    if (/memory|allocation failed|out of memory/i.test(error.message)) {
      return "This image is too large for your browser to process. Try a smaller file.";
    }
    if (
      error.message.length < 280 &&
      !/TypeError|undefined|null|Failed to execute|SecurityError/i.test(error.message)
    ) {
      return error.message;
    }
  }
  return "Your browser could not finish processing this image. Try a smaller file or a different format.";
}
