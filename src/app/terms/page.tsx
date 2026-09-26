import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createMetadata } from "@/lib/seo";
import { contactEmail } from "@/lib/site";

export const metadata = createMetadata({
  title: "PixelConvert Terms of Use",
  description: "Terms for using PixelConvert’s free browser-based image tools.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Terms" }]} />
      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Terms of use</h1>
      <p className="mt-3 text-sm text-muted">Updated September 26, 2026</p>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
        <p>
          PixelConvert provides free tools that convert, crop, resize, rotate, flip, and compress images in your browser. By using the site, you agree to these terms.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-ink">Your files</h2>
        <p>
          You are responsible for having the rights to any image you open. PixelConvert does not review, store, or claim ownership of those images. Because processing is local, you should keep your own copy of anything you need later.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-ink">Acceptable use</h2>
        <p>
          Do not use the site to break the law or to interfere with the service. The tools are for editing images you are allowed to use.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-ink">No warranty</h2>
        <p>
          The tools are provided as available. Output depends on your browser, the source file, and the settings you choose. PixelConvert does not guarantee that an export will meet a third party’s file rules, or that a browser will support every feature on every device.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-ink">Liability</h2>
        <p>
          To the extent the law allows, PixelConvert is not liable for lost files, lost profits, or damages arising from use of the tools. Nothing in these terms limits liability that cannot legally be limited.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-ink">Changes</h2>
        <p>
          The tools and these terms may change as the product changes. The date above shows when this page was last updated. Questions can be sent to {contactEmail}.
        </p>
      </div>
    </article>
  );
}
