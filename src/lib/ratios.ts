export type RatioPreset = {
  id: string;
  label: string;
  value: number | "original" | null;
};

export type SocialPreset = {
  id: string;
  label: string;
  hint: string;
  value: number;
};

export type RatioSelection =
  | { kind: "free" }
  | { kind: "original" }
  | { kind: "preset"; id: string; value: number }
  | { kind: "social"; id: string; value: number }
  | { kind: "custom"; width: number; height: number; value: number };

export const ratioPresets: RatioPreset[] = [
  { id: "free", label: "Free", value: null },
  { id: "original", label: "Original", value: "original" },
  { id: "1:1", label: "1:1", value: 1 },
  { id: "4:3", label: "4:3", value: 4 / 3 },
  { id: "3:4", label: "3:4", value: 3 / 4 },
  { id: "3:2", label: "3:2", value: 3 / 2 },
  { id: "2:3", label: "2:3", value: 2 / 3 },
  { id: "16:9", label: "16:9", value: 16 / 9 },
  { id: "9:16", label: "9:16", value: 9 / 16 },
  { id: "21:9", label: "21:9", value: 21 / 9 },
];

export const socialPresets: SocialPreset[] = [
  { id: "ig-square", label: "Instagram Square", hint: "1:1", value: 1 },
  { id: "ig-portrait", label: "Instagram Portrait", hint: "4:5", value: 4 / 5 },
  { id: "ig-landscape", label: "Instagram Landscape", hint: "1.91:1", value: 1.91 },
  { id: "ig-story", label: "Instagram Story", hint: "9:16", value: 9 / 16 },
  { id: "ig-reel", label: "Instagram Reel", hint: "9:16", value: 9 / 16 },
  { id: "yt-thumb", label: "YouTube Thumbnail", hint: "16:9", value: 16 / 9 },
  { id: "yt-cover", label: "YouTube Cover", hint: "16:9", value: 16 / 9 },
  { id: "fb-post", label: "Facebook Post", hint: "1.91:1", value: 1.91 },
  { id: "fb-cover", label: "Facebook Cover", hint: "2.63:1", value: 820 / 312 },
  { id: "li-post", label: "LinkedIn Post", hint: "1.91:1", value: 1.91 },
  { id: "li-cover", label: "LinkedIn Cover", hint: "4:1", value: 4 },
  { id: "x-post", label: "Twitter/X Post", hint: "16:9", value: 16 / 9 },
  { id: "wa-profile", label: "WhatsApp Profile", hint: "1:1", value: 1 },
];

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const next = y;
    y = x % y;
    x = next;
  }
  return x || 1;
}

export function simplifyRatio(width: number, height: number) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return "—";
  }
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const divisor = gcd(w, h);
  const rw = w / divisor;
  const rh = h / divisor;
  if (rw > 30 || rh > 30) {
    const value = w / h;
    return value >= 1 ? `${value.toFixed(2)}:1` : `1:${(h / w).toFixed(2)}`;
  }
  return `${rw}:${rh}`;
}

export function parsePositiveNumber(value: string) {
  const trimmed = value.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  const number = Number(trimmed);
  if (!Number.isFinite(number) || number <= 0 || number > 100000) return null;
  return number;
}

export function customRatioValue(width: number, height: number) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }
  return width / height;
}

export function ratioFromSelection(selection: RatioSelection, naturalRatio: number) {
  if (selection.kind === "free") return null;
  if (selection.kind === "original") return naturalRatio > 0 ? naturalRatio : 1;
  return selection.value;
}

export function selectionKey(selection: RatioSelection) {
  if (selection.kind === "preset" || selection.kind === "social") {
    return `${selection.kind}:${selection.id}`;
  }
  return selection.kind;
}

export function normalizeDegrees(value: number) {
  let degrees = value % 360;
  if (degrees > 180) degrees -= 360;
  if (degrees < -180) degrees += 360;
  return Math.round(degrees);
}
