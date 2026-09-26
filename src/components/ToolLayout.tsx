import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { PrivacyNote } from "@/components/PrivacyNote";
import { RelatedTools } from "@/components/RelatedTools";
import type { FaqItem } from "@/content/faq";
import { absoluteUrl } from "@/lib/site";

export function ToolLayout({
  crumbs,
  heading,
  description,
  path,
  lead,
  howTo,
  faqs,
  related,
  children,
}: {
  crumbs: Crumb[];
  heading: string;
  description: string;
  path: string;
  lead: string;
  howTo: string[];
  faqs: FaqItem[];
  related: string[];
  children: React.ReactNode;
}) {
  const app = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `PixelConvert ${heading}`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: absoluteUrl(path),
    description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <JsonLd data={[app, faq]} />
      <Breadcrumbs items={crumbs} />
      <header className="mt-5 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{heading}</h1>
        <p className="mt-3 text-base leading-7 text-muted">{lead}</p>
      </header>
      <div className="mt-6">
        <PrivacyNote />
      </div>
      <div className="mt-6">{children}</div>
      <section className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">How to use</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted">
          {howTo.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
        <div className="mt-4">
          <FAQ items={faqs} />
        </div>
      </section>
      <RelatedTools hrefs={related} />
    </article>
  );
}
