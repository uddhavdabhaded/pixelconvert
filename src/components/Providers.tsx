"use client";

import { ThemeProvider } from "next-themes";
import { EditorSessionProvider } from "@/context/editor-session";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <EditorSessionProvider>{children}</EditorSessionProvider>
    </ThemeProvider>
  );
}
