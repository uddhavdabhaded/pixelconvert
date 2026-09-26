export const siteName = "PixelConvert";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixelconvert.app"
).replace(/\/$/, "");

export const contactEmail = "hello@pixelconvert.app";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
