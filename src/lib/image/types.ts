export type ImageMime = "image/jpeg" | "image/png" | "image/webp";

export type RasterImage = {
  blob: Blob;
  width: number;
  height: number;
  mime: ImageMime;
  name: string;
};

export type ResizePreset =
  | { id: string; label: string; kind: "percent"; value: number }
  | { id: string; label: string; kind: "width"; value: number }
  | { id: string; label: string; kind: "box"; width: number; height: number };

export const resizePresets: ResizePreset[] = [
  { id: "25", label: "25%", kind: "percent", value: 25 },
  { id: "50", label: "50%", kind: "percent", value: 50 },
  { id: "75", label: "75%", kind: "percent", value: 75 },
  { id: "150", label: "150%", kind: "percent", value: 150 },
  { id: "w1080", label: "1080 wide", kind: "width", value: 1080 },
  { id: "w1280", label: "1280 wide", kind: "width", value: 1280 },
  { id: "w1920", label: "1920 wide", kind: "width", value: 1920 },
  { id: "fit-square", label: "Fit in 1080 × 1080", kind: "box", width: 1080, height: 1080 },
  { id: "fit-hd", label: "Fit in 1920 × 1080", kind: "box", width: 1920, height: 1080 },
];
