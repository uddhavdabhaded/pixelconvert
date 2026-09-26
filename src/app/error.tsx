"use client";

import { ui } from "@/lib/ui";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-start px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">This page could not be displayed</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Refresh the view and try again. If you were editing an image, it remains in this tab unless the page was reloaded.
      </p>
      <button type="button" className={`${ui.primary} mt-6`} onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
