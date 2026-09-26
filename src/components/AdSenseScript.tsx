import Script from "next/script";
import { adsenseClientId } from "@/lib/site";

/** Loads the Google AdSense library once for the whole site. */
export function AdSenseScript() {
  return (
    <Script
      id="adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
