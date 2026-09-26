import Link from "next/link";
import { ui } from "@/lib/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-start px-4 py-20 sm:px-6">
      <p className="text-sm font-semibold text-brand-ink">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page is not available</h1>
      <p className="mt-3 text-sm leading-6 text-muted">The link may be outdated. The image tools are still on the tools page.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/" className={ui.primary}>
          Go home
        </Link>
        <Link href="/tools" className={ui.secondary}>
          Explore Tools
        </Link>
      </div>
    </div>
  );
}
