import Link from "next/link";

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return <span key={`${keyPrefix}-${index}`}>{part}</span>;
    const [, label, href] = match;
    if (!href.startsWith("/") && !href.startsWith("https://")) {
      return <span key={`${keyPrefix}-${index}`}>{label}</span>;
    }
    if (href.startsWith("/")) {
      return (
        <Link key={`${keyPrefix}-${index}`} href={href} className="font-medium text-brand-ink underline-offset-2 hover:underline">
          {label}
        </Link>
      );
    }
    return (
      <a key={`${keyPrefix}-${index}`} href={href} className="font-medium text-brand-ink underline-offset-2 hover:underline">
        {label}
      </a>
    );
  });
}

export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.trim().split(/\n\n+/);
  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const key = `block-${index}`;
        if (block.startsWith("## ")) {
          return (
            <h2 key={key} className="mt-8 text-xl font-semibold tracking-tight text-ink">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.split("\n").every((line) => line.startsWith("- "))) {
          return (
            <ul key={key} className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              {block.split("\n").map((line) => (
                <li key={line}>{renderInline(line.slice(2), line)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={key} className="mt-4 text-sm leading-7 text-muted first:mt-0">
            {renderInline(block.replace(/\n/g, " "), key)}
          </p>
        );
      })}
    </div>
  );
}
