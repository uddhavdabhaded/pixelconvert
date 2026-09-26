"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { inspectFile } from "@/lib/image/load";
import type { ImageMime, RasterImage } from "@/lib/image/types";

type EditorSessionValue = {
  original: RasterImage | null;
  current: RasterImage | null;
  revision: number;
  loadFile: (file: File, allowed?: ImageMime[]) => Promise<RasterImage>;
  updateCurrent: (image: RasterImage) => void;
  resetToOriginal: () => void;
  clear: () => void;
};

const EditorSessionContext = createContext<EditorSessionValue | null>(null);

export function EditorSessionProvider({ children }: { children: React.ReactNode }) {
  const [original, setOriginal] = useState<RasterImage | null>(null);
  const [current, setCurrent] = useState<RasterImage | null>(null);
  const [revision, setRevision] = useState(0);

  const value = useMemo<EditorSessionValue>(
    () => ({
      original,
      current,
      revision,
      async loadFile(file, allowed) {
        const image = await inspectFile(file, allowed);
        setOriginal(image);
        setCurrent(image);
        setRevision((item) => item + 1);
        return image;
      },
      updateCurrent(image) {
        setCurrent(image);
        setOriginal((existing) => existing ?? image);
        setRevision((item) => item + 1);
      },
      resetToOriginal() {
        setCurrent(original);
        setRevision((item) => item + 1);
      },
      clear() {
        setOriginal(null);
        setCurrent(null);
        setRevision((item) => item + 1);
      },
    }),
    [current, original, revision],
  );

  return <EditorSessionContext.Provider value={value}>{children}</EditorSessionContext.Provider>;
}

export function useEditorSession() {
  const session = useContext(EditorSessionContext);
  if (!session) throw new Error("Editor session is unavailable.");
  return session;
}
