"use client";

import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { ACCEPT_ATTRIBUTE } from "@/lib/image/validate";
import { cn } from "@/lib/ui";

type DropZoneProps = {
  multiple?: boolean;
  accept?: string;
  title: string;
  description: string;
  onFiles: (files: File[]) => void;
  onReject?: (message: string) => void;
  compact?: boolean;
};

export function DropZone({
  multiple = false,
  accept = ACCEPT_ATTRIBUTE,
  title,
  description,
  onFiles,
  onReject,
  compact = false,
}: DropZoneProps) {
  const [active, setActive] = useState(false);

  function take(list: FileList | null | undefined, emptyMessage: string) {
    const files = Array.from(list ?? []);
    if (files.length === 0) {
      onReject?.(emptyMessage);
      return;
    }
    onFiles(multiple ? files : files.slice(0, 1));
  }

  return (
    <label
      className={cn(
        "relative block cursor-pointer rounded-2xl border border-dashed border-line bg-surface text-center transition-colors",
        compact ? "px-4 py-5" : "px-6 py-14",
        active && "border-brand bg-brand-soft",
      )}
      onDragEnter={(event) => {
        event.preventDefault();
        setActive(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={(event) => {
        event.preventDefault();
        setActive(false);
        take(event.dataTransfer.files, "No file was received. Drop a JPG, PNG, or WEBP image.");
      }}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        aria-label={title}
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(event) => {
          take(event.target.files, "Choose an image to continue.");
          event.target.value = "";
        }}
      />
      <span className="pointer-events-none flex flex-col items-center">
        <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand-ink">
          <ImagePlus className="size-5" aria-hidden="true" />
        </span>
        <span className="mt-3 text-sm font-semibold text-ink">{title}</span>
        <span className="mt-1 max-w-md text-sm text-muted">{description}</span>
      </span>
    </label>
  );
}
