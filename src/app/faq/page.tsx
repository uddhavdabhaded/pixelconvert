import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { faqPage } from "@/content/faq";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "PixelConvert FAQ",
  description:
    "Answers about local image processing, supported formats, aspect ratios, compression, file limits, and privacy on PixelConvert.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqPage.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "FAQ" }]} />
      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Frequently asked questions</h1>
      <p className="mt-3 text-sm leading-7 text-muted">
        Short answers about formats, cropping, compression, and what happens to your files.
      </p>
      <div className="mt-6">
        <FAQ items={faqPage} />
      </div>
    </article>
  );
}
