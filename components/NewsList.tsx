import { formatDate } from "@/lib/dates";
import type { NewsItem } from "@/lib/types";

export function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <ol className="relative space-y-0 border-l border-line pl-6">
      {items.map((item) => (
        <li key={item.id} className="relative pb-8">
          <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-teal bg-card" />
          <time className="text-xs uppercase tracking-[0.16em] text-gold">
            {formatDate(item.publishedAt)}
          </time>
          <h2 className="mt-1 font-serif text-xl leading-snug">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-dark"
            >
              {item.title}
            </a>
          </h2>
          <p className="mt-1 text-sm text-muted">{item.organization}</p>
          <p className="mt-2 leading-relaxed text-ink/85">{item.summary}</p>
          <p className="mt-2 text-sm text-muted">
            Source:{" "}
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line underline-offset-4 hover:text-ink"
            >
              {item.sourceName}
            </a>
          </p>
        </li>
      ))}
    </ol>
  );
}
