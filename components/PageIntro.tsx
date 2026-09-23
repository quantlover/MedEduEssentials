import { categoryMeta, generatedAt } from "@/lib/catalog";
import type { Category } from "@/lib/types";

export function PageIntro({
  category,
  count,
  openCount,
}: {
  category: Category;
  count: number;
  openCount: number;
}) {
  const meta = categoryMeta(category);
  return (
    <section className="mb-8 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-teal">Catalog</p>
      <h1 className="mt-2 font-serif text-4xl leading-tight">{meta.plural}</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">{meta.blurb}</p>
      <p className="mt-3 text-sm text-muted">
        {openCount} open · {count} total · collected {generatedAt}. Each card
        keeps the official source URL.
      </p>
    </section>
  );
}
