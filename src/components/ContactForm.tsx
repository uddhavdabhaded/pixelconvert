"use client";

import { FormEvent, useState } from "react";
import { Alert, Status } from "@/components/Alert";
import { contactEmail } from "@/lib/site";
import { ui } from "@/lib/ui";

export function ContactForm() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (name.length < 2) {
      setError("Enter your name.");
      setSent(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      setSent(false);
      return;
    }
    if (message.length < 10) {
      setError("Enter a message of at least 10 characters. Do not attach images. This form cannot receive files.");
      setSent(false);
      return;
    }

    const href = `mailto:${contactEmail}?subject=${encodeURIComponent(`PixelConvert message from ${name}`)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`)}`;
    window.location.href = href;
    setError(null);
    setSent(true);
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={onSubmit} noValidate>
      {error ? <Alert>{error}</Alert> : null}
      {sent ? (
        <Status>
          Your email app should open with this message. If it does not, send it to {contactEmail}. PixelConvert does not receive the form on a server.
        </Status>
      ) : null}
      <label className="grid gap-1 text-sm font-medium" htmlFor="contact-name">
        Name
        <input id="contact-name" name="name" autoComplete="name" className={ui.input} aria-invalid={error?.includes("name") ? true : undefined} />
      </label>
      <label className="grid gap-1 text-sm font-medium" htmlFor="contact-email">
        Email
        <input id="contact-email" name="email" type="email" autoComplete="email" className={ui.input} aria-invalid={error?.includes("email") ? true : undefined} />
      </label>
      <label className="grid gap-1 text-sm font-medium" htmlFor="contact-message">
        Message
        <textarea id="contact-message" name="message" rows={6} className={`${ui.input} h-auto py-2`} aria-invalid={error?.includes("message") ? true : undefined} />
      </label>
      <button type="submit" className={ui.primary}>
        Send email
      </button>
    </form>
  );
}
