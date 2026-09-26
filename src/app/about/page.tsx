import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About PixelConvert",
  description:
    "PixelConvert is a free browser-based image toolkit for converting, cropping, resizing, and compressing JPG, PNG, and WEBP images locally.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />
      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">About PixelConvert</h1>
      <div className="mt-5 space-y-4 text-sm leading-7 text-muted">
        <p>
          PixelConvert is a set of image tools for people who need a finished JPG, PNG, or WEBP file without sending the picture to someone else’s server. Conversion, cropping, resizing, rotation, flipping, and compression all use the browser’s Canvas API.
        </p>
        <p>
          There is no account. An image you open stays in memory for the current tab so you can move from the cropper to the resizer, compressor, and converter. Refreshing the tab clears it. PixelConvert does not write your images to a database or an upload bucket.
        </p>
        <p>
          The cropper is the center of the editor. You can drag and resize the crop, lock a ratio such as 16:9 or a custom pair like 1200 by 800, zoom, rotate, and flip, then download the result. Social presets set the aspect ratio used by common placements. They are not fixed pixel templates.
        </p>
        <p>
          Start with the <Link className="font-medium text-brand-ink" href="/tools">tool directory</Link>, or read the <Link className="font-medium text-brand-ink" href="/privacy">privacy policy</Link> for what the site does and does not collect.
        </p>
      </div>
    </article>
  );
}
