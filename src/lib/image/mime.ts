import type { ImageMime } from "./types";

export function mimeLabel(mime: ImageMime) {
  if (mime === "image/jpeg") return "JPG";
  if (mime === "image/png") return "PNG";
  return "WEBP";
}

export function mimeExtension(mime: ImageMime) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  return "webp";
}

export const outputMimes: ImageMime[] = ["image/jpeg", "image/png", "image/webp"];

export function outputName(base: string, mime: ImageMime) {
  const cleaned = base.replace(/[^\w.-]+/g, "-").replace(/^\.+/, "") || "image";
  const stem = cleaned.replace(/\.(jpe?g|png|webp)$/i, "");
  return `${stem}.${mimeExtension(mime)}`;
}
