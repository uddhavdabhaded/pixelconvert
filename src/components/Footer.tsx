import Link from "next/link";
import { Crop } from "lucide-react";

const columns = [
  {
    title: "Tools",
    links: [
      ["/image-converter", "Image Converter"],
      ["/image-cropper", "Image Cropper"],
      ["/image-resizer", "Image Resizer"],
      ["/image-compressor", "Image Compressor"],
      ["/tools", "All tools"],
    ],
  },
  {
    title: "Convert",
    links: [
      ["/jpg-to-png", "JPG to PNG"],
      ["/png-to-jpg", "PNG to JPG"],
      ["/jpg-to-webp", "JPG to WEBP"],
      ["/png-to-webp", "PNG to WEBP"],
      ["/webp-to-jpg", "WEBP to JPG"],
      ["/webp-to-png", "WEBP to PNG"],
    ],
  },
  {
    title: "Company",
    links: [
      ["/about", "About"],
      ["/blog", "Blog"],
      ["/faq", "FAQ"],
      ["/contact", "Contact"],
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
            <span className="grid size-8 place-items-center rounded-lg bg-brand text-on-brand">
              <Crop className="size-4" aria-hidden="true" />
            </span>
            PixelConvert
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
            Your images are processed locally in your browser and are not uploaded to our servers.
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold text-ink">{column.title}</h2>
            <ul className="mt-3 grid gap-2">
              {column.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} PixelConvert. Free browser-based image tools.</p>
          <p>No account. No image storage.</p>
        </div>
      </div>
    </footer>
  );
}
