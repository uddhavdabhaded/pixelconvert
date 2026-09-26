import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { posts } from "@/content/blog";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "PixelConvert Blog",
  description:
    "Guides on JPG, PNG, and WEBP, cropping for social media, and compressing images without unnecessary quality loss.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog" }]} />
      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">Blog</h1>
      <p className="mt-3 text-sm leading-7 text-muted">
        Practical notes on formats, framing, and file size. The tools linked from each article run in your browser.
      </p>
      <div className="mt-8 grid gap-4">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <p className="text-xs font-medium text-muted">{post.date}</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              <Link href={`/blog/${post.slug}`} className="hover:text-brand-ink">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">{post.description}</p>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex text-sm font-semibold text-brand-ink">
              Read article
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
