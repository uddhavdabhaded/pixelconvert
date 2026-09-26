import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createMetadata } from "@/lib/seo";
import { contactEmail } from "@/lib/site";

export const metadata = createMetadata({
  title: "PixelConvert Privacy Policy",
  description:
    "How PixelConvert handles images locally, what hosting logs may include, and how Google AdSense may use cookies for ads.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Privacy" }]} />
      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Privacy policy</h1>
      <p className="mt-3 text-sm text-muted">Updated September 26, 2026</p>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted">
        <p>Your images are processed locally in your browser and are not uploaded to our servers.</p>
        <h2 className="pt-2 text-xl font-semibold text-ink">Images</h2>
        <p>
          Opening, cropping, resizing, rotating, flipping, compressing, converting, and downloading an image happens on your device with browser APIs. PixelConvert does not provide an upload API for those operations and does not store image contents in an account, database, or analytics tool.
        </p>
        <p>
          The edited image is held in memory for the current tab so you can move between tools. It is cleared when you refresh or close the tab. It is not written to local storage.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-ink">Pages and logs</h2>
        <p>
          Loading the website itself requests HTML, CSS, and JavaScript from the host. A hosting provider may keep standard request logs, such as IP address, user agent, and the page URL, to operate and secure the site. Those logs do not contain your images.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-ink">Advertising (Google AdSense)</h2>
        <p>
          This site may show ads served by Google AdSense. AdSense is separate from PixelConvert&apos;s core image tools: your images still stay in the browser and are not sent to AdSense as part of editing.
        </p>
        <p>
          Google AdSense may use cookies or similar technologies to serve and measure ads (including personalized or non-personalized ads, depending on your region and settings). Learn more in{" "}
          <a
            className="font-medium text-brand-ink underline-offset-2 hover:underline"
            href="https://policies.google.com/technologies/ads"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google&apos;s Advertising policies
          </a>
          .
        </p>
        <h2 className="pt-2 text-xl font-semibold text-ink">Contact</h2>
        <p>
          The contact form opens your own email application addressed to {contactEmail}. The message is sent only if you send that email. Do not attach images to it if you want them to stay on your device.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-ink">Contacting us about privacy</h2>
        <p>Email {contactEmail} if you have a question about this policy.</p>
      </div>
    </article>
  );
}
