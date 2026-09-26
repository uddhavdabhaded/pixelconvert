import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { homeFaqs } from "@/content/faq";
import { getTool, popularTools } from "@/lib/tools";
import { absoluteUrl } from "@/lib/site";
import { ui } from "@/lib/ui";

const popular = popularTools.map((href) => getTool(href)).filter((tool) => tool !== undefined);

export default function HomePage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "PixelConvert",
      url: absoluteUrl("/"),
      description:
        "Free browser-based image tools for converting, cropping, resizing and compressing JPG, PNG and WEBP images.",
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "PixelConvert",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      url: absoluteUrl("/"),
      description:
        "Convert, crop, resize, rotate, flip, and compress JPG, PNG, and WEBP images in the browser. Images are not uploaded.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: homeFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:py-20">
        <div>
          <p className="inline-flex rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
            100% Browser-Based • No Upload Required
          </p>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-ink sm:text-6xl sm:leading-[1.05]">
            Convert, Crop & Optimize Images Online
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
            Free browser-based image tools for converting, cropping, resizing and compressing JPG, PNG and WEBP images.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/image-cropper" className={ui.primary}>
              Start Editing
            </Link>
            <Link href="/tools" className={ui.secondary}>
              Explore Tools
            </Link>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-6 text-muted">
            Your images are processed locally in your browser and are not uploaded to our servers.
          </p>
        </div>
        <div className="rounded-3xl border border-line bg-surface p-3 shadow-card" aria-hidden="true">
          <div className="overflow-hidden rounded-2xl bg-stage p-4 text-white">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>Example crop</span>
              <span>1:1</span>
            </div>
            <div className="relative mx-auto mt-4 aspect-square w-full max-w-sm rounded-xl bg-[linear-gradient(145deg,#3558c7,#8ea6ef)]">
              <div className="absolute inset-[12%] rounded-md border border-white/90">
                <div className="absolute left-1/3 top-0 h-full w-px bg-white/35" />
                <div className="absolute left-2/3 top-0 h-full w-px bg-white/35" />
                <div className="absolute left-0 top-1/3 h-px w-full bg-white/35" />
                <div className="absolute left-0 top-2/3 h-px w-full bg-white/35" />
                <span className="absolute -left-1.5 -top-1.5 size-3 rounded-sm bg-white" />
                <span className="absolute -right-1.5 -top-1.5 size-3 rounded-sm bg-white" />
                <span className="absolute -bottom-1.5 -left-1.5 size-3 rounded-sm bg-white" />
                <span className="absolute -bottom-1.5 -right-1.5 size-3 rounded-sm bg-white" />
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg bg-white/10 px-3 py-2">
                <dt className="text-white/60">Original</dt>
                <dd className="mt-1 font-medium">1920 × 1080</dd>
              </div>
              <div className="rounded-lg bg-white/10 px-3 py-2">
                <dt className="text-white/60">Current</dt>
                <dd className="mt-1 font-medium">1080 × 1080</dd>
              </div>
              <div className="rounded-lg bg-white/10 px-3 py-2">
                <dt className="text-white/60">Format</dt>
                <dd className="mt-1 font-medium">PNG</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Popular tools</h2>
          <Link href="/tools" className="text-sm font-semibold text-brand-ink">
            View all tools
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold">Private by design</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Canvas processing runs on your device. PixelConvert has no image upload endpoint and does not keep a copy of your files.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">One image, every tool</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Crop, choose a ratio, resize, compress, convert, and download without uploading the image again during the visit.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Precise framing</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Drag the crop box, lock 16:9 or a custom ratio, zoom in, rotate, and flip before you export JPG, PNG, or WEBP.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
        <div className="mt-5">
          <FAQ items={homeFaqs} />
        </div>
        <p className="mt-5 text-sm">
          <Link href="/faq" className="font-semibold text-brand-ink">
            Read more questions
          </Link>
        </p>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl border border-line bg-surface px-6 py-10 shadow-card sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight">Edit an image without creating an account</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Start in the cropper, or open the converter if you already know the format you need.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/image-cropper" className={ui.primary}>
              Start Editing
            </Link>
            <Link href="/image-converter" className={ui.secondary}>
              Open converter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
