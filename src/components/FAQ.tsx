import type { FaqItem } from "@/content/faq";
import { RichText } from "@/components/RichText";

export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {items.map((item) => (
        <details key={item.question} className="group px-5 py-4">
          <summary className="cursor-pointer list-none font-medium text-ink [&::-webkit-details-marker]:hidden">
            <span className="flex items-start justify-between gap-4">
              {item.question}
              <span aria-hidden="true" className="text-muted group-open:rotate-45">+</span>
            </span>
          </summary>
          <div className="pt-2">
            <RichText text={item.answer} />
          </div>
        </details>
      ))}
    </div>
  );
}
