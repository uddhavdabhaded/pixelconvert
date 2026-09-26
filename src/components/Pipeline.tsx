"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pipeline } from "@/lib/tools";

export function Pipeline() {
  const pathname = usePathname();
  return (
    <nav aria-label="Editing steps">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Continue editing</p>
      <ol className="mt-2 flex flex-wrap gap-2">
        {pipeline.map((step, index) => {
          const active = pathname === step.href;
          return (
            <li key={step.href}>
              <Link
                href={step.href}
                aria-current={active ? "step" : undefined}
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                  active ? "bg-brand text-on-brand" : "bg-surface-2 text-ink"
                }`}
              >
                {index + 1}. {step.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
