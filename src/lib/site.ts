export const siteName = "PixelConvert";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://pixelconvert.app"
).replace(/\/$/, "");

export const contactEmail = "hello@pixelconvert.app";

/** Google AdSense client ID (`ca-pub-…`). Override with NEXT_PUBLIC_ADSENSE_CLIENT_ID. */
export const adsenseClientId =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-8596915110717000";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
