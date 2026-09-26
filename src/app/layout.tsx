import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PixelConvert — Convert, Crop & Optimize Images Online",
    template: "%s",
  },
  description:
    "Free browser-based image tools for converting, cropping, resizing and compressing JPG, PNG and WEBP images.",
  applicationName: "PixelConvert",
  authors: [{ name: "PixelConvert" }],
  creator: "PixelConvert",
  openGraph: {
    type: "website",
    siteName: "PixelConvert",
    title: "PixelConvert — Convert, Crop & Optimize Images Online",
    description:
      "Free browser-based image tools for converting, cropping, resizing and compressing JPG, PNG and WEBP images.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelConvert — Convert, Crop & Optimize Images Online",
    description:
      "Free browser-based image tools for converting, cropping, resizing and compressing JPG, PNG and WEBP images.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e13" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg font-sans text-ink">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
