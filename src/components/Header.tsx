"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Crop, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ui } from "@/lib/ui";

const links = [
  { href: "/tools", label: "Tools" },
  { href: "/image-converter", label: "Converter" },
  { href: "/image-cropper", label: "Cropper" },
  { href: "/image-resizer", label: "Resizer" },
  { href: "/image-compressor", label: "Compressor" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenPath(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-ink">
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-on-brand">
            <Crop className="size-4" aria-hidden="true" />
          </span>
          PixelConvert
        </Link>
        <nav aria-label="Primary" className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href || (link.href === "/blog" && pathname.startsWith("/blog"));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${active ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link href="/image-cropper" className={`${ui.primary} hidden sm:inline-flex`}>
            Start Editing
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-surface lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenPath(open ? null : pathname)}
          >
            {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-surface px-4 py-3 lg:hidden">
          <ul className="grid gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-2">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/image-cropper" className={`${ui.primary} mt-2 w-full`}>
                Start Editing
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
