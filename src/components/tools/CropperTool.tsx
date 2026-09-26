"use client";

import { useState } from "react";
import { Alert } from "@/components/Alert";
import { CropEditor } from "@/components/CropEditor";
import { ImageUploader } from "@/components/ImageUploader";
import { ToolSkeleton } from "@/components/ToolSkeleton";
import { useEditorSession } from "@/context/editor-session";
import { useHasMounted } from "@/hooks/useHasMounted";
import { toUserMessage } from "@/lib/image/validate";

export function CropperTool() {
  const mounted = useHasMounted();
  const session = useEditorSession();
  const [error, setError] = useState<string | null>(null);

  if (!mounted) return <ToolSkeleton />;

  if (!session.current || !session.original) {
    return (
      <div className="grid gap-3">
        {error ? <Alert>{error}</Alert> : null}
        <ImageUploader
          onReject={setError}
          onFiles={(files) => {
            const file = files[0];
            if (!file) {
              setError("Choose an image to continue.");
              return;
            }
            void session.loadFile(file).then(() => setError(null)).catch((cause) => setError(toUserMessage(cause)));
          }}
        />
      </div>
    );
  }

  return (
    <CropEditor
      image={session.current}
      original={session.original}
      onApply={session.updateCurrent}
      onClear={session.clear}
      onReplace={async (file) => {
        await session.loadFile(file);
      }}
    />
  );
}
