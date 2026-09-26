import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { createMetadata } from "@/lib/seo";
import { contactEmail } from "@/lib/site";

export const metadata = createMetadata({
  title: "Contact PixelConvert",
  description: "Contact PixelConvert about the browser-based image tools. The form opens your email app and does not upload images.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <article className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />
      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>
      <p className="mt-3 text-sm leading-7 text-muted">
        Send a note to {contactEmail}. This form opens your email app. It does not upload images, and PixelConvert has no server inbox for attachments.
      </p>
      <ContactForm />
    </article>
  );
}
