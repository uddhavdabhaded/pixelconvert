import { ShieldCheck } from "lucide-react";

export function PrivacyNote() {
  return (
    <p className="flex items-start gap-2.5 rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm leading-6 text-muted">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-ink" aria-hidden="true" />
      <span>Your images are processed locally in your browser and are not uploaded to our servers.</span>
    </p>
  );
}
