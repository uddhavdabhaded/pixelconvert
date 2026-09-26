import { ToolCard } from "@/components/ToolCard";
import { getTool } from "@/lib/tools";

export function RelatedTools({ hrefs }: { hrefs: string[] }) {
  const items = hrefs.map((href) => getTool(href)).filter((tool) => tool !== undefined);
  if (items.length === 0) return null;
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-semibold tracking-tight">Related tools</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((tool) => (
          <ToolCard key={tool.href} tool={tool} />
        ))}
      </div>
    </section>
  );
}
