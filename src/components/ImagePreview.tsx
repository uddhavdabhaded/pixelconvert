"use client";

import { useObjectUrl } from "@/hooks/useObjectUrl";
import { cn } from "@/lib/ui";

export function ImagePreview({
  blob,
  alt,
  className,
  animate = false,
}: {
  blob: Blob | null | undefined;
  alt: string;
  className?: string;
  animate?: boolean;
}) {
  const url = useObjectUrl(blob);
  if (!url) {
    return <div className={cn("checker min-h-40 rounded-xl", className)} aria-hidden="true" />;
  }

  return (
    <img
      key={url}
      src={url}
      alt={alt}
      className={cn("max-h-full max-w-full object-contain", animate && "pc-preview-fade is-visible", className)}
    />
  );
}
