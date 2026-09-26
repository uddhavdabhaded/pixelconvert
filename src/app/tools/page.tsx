import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/lib/tools";
import { createMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = createMetadata({
  title: "Image Tools — Convert, Crop, Resize, and Compress",
  description:
    "Browse PixelConvert tools for converting, cropping, resizing, and compressing JPG, PNG, and WEBP images in your browser.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "PixelConvert tools",
          url: absoluteUrl("/tools"),
          description:
            "Browse PixelConvert tools for converting, cropping, resizing, and compressing JPG, PNG, and WEBP images in your browser.",
        }}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Tools" }]} />
      <header className="mt-5 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Image tools</h1>
        <p className="mt-3 text-base leading-7 text-muted">
          Every tool runs in your browser. Crop an image, then resize, compress, or convert it from the same session. Rotation and flipping are built into the cropper and resizer.
        </p>
      </header>
      <h2 className="mt-10 text-xl font-semibold">All tools</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.href} tool={tool} heading="h3" />
        ))}
      </div>
    </div>
  );
}
