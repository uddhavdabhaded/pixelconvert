import { sniffMime, validateFile, MAX_DIMENSION } from "./validate";
import { withImage } from "./canvas";
import type { ImageMime, RasterImage } from "./types";

async function readDimensions(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    if (size.width > 0 && size.height > 0) return size;
  } catch {
    // Fall through to an HTMLImageElement decode for browsers that reject the file.
  }
  return withImage(file, (image) => ({
    width: image.naturalWidth,
    height: image.naturalHeight,
  }));
}

export async function inspectFile(file: File, allowed?: ImageMime[]): Promise<RasterImage> {
  const message = validateFile(file, allowed);
  if (message) throw new Error(message);
  const mime = sniffMime(file);
  if (!mime) throw new Error("This file type is not supported. Use a JPG, PNG, or WEBP image.");

  let size: { width: number; height: number };
  try {
    size = await readDimensions(file);
  } catch {
    throw new Error("This image could not be read. It may be corrupted or incomplete.");
  }

  if (size.width < 1 || size.height < 1) {
    throw new Error("This image could not be read. It may be corrupted or incomplete.");
  }
  if (size.width > MAX_DIMENSION || size.height > MAX_DIMENSION) {
    throw new Error(
      "This image is too large to process in the browser. Use an image under 12,000 pixels on each side.",
    );
  }

  const name = file.name.replace(/\.[^.]+$/, "") || "image";
  return { blob: file, width: size.width, height: size.height, mime, name };
}
