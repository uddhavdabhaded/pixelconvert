"use client";

import { Download } from "lucide-react";
import { ui } from "@/lib/ui";

export function DownloadButton({
  label,
  onClick,
  disabled,
  variant = "primary",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}) {
  return (
    <button type="button" className={variant === "primary" ? ui.primary : ui.secondary} onClick={onClick} disabled={disabled}>
      <Download className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}
