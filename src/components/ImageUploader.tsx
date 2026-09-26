"use client";

import { DropZone } from "@/components/DropZone";
import { PrivacyNote } from "@/components/PrivacyNote";

type ImageUploaderProps = {
  multiple?: boolean;
  accept?: string;
  title?: string;
  description?: string;
  onFiles: (files: File[]) => void;
  onReject?: (message: string) => void;
  compact?: boolean;
};

export function ImageUploader({
  multiple = false,
  title = "Drop an image here, or browse",
  description = "JPG, PNG, and WEBP. Processing stays in this browser tab.",
  compact = false,
  ...props
}: ImageUploaderProps) {
  return (
    <div className="grid gap-3">
      <DropZone multiple={multiple} title={title} description={description} compact={compact} {...props} />
      {compact ? null : <PrivacyNote />}
    </div>
  );
}
