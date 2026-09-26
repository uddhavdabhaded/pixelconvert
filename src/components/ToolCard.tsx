import Link from "next/link";
import { ArrowRight, Crop, FileImage, Minimize2, RefreshCw, Scaling } from "lucide-react";
import type { ToolInfo } from "@/lib/tools";

const icons = {
  convert: RefreshCw,
  crop: Crop,
  resize: Scaling,
  compress: Minimize2,
  file: FileImage,
};

export function ToolCard({ tool, heading = "h3" }: { tool: ToolInfo; heading?: "h2" | "h3" }) {
  const Icon = icons[tool.icon];
  const Title = heading;
  return (
    <Link
      href={tool.href}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-colors hover:border-brand"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand-ink">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <Title className="mt-4 text-base font-semibold text-ink">{tool.title}</Title>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{tool.description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
        Open Tool
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
