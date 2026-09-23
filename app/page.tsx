import Link from "next/link";
import {
  categoryMeta,
  generatedAt,
  getNews,
  getOpenCount,
  getOpportunities,
  getUpcomingDeadlines,
} from "@/lib/catalog";
import { daysUntil, formatDate } from "@/lib/dates";
import type { Category } from "@/lib/types";

const categories: Category[] = ["conference", "grant", "award", "journal"];

export default function HomePage() {
  const deadlines = getUpcomingDeadlines(6);
  const news = getNews().slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-teal">
          Sourced from associations, foundations, journals, and boards
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          Calls, funding, and news for medical education — with the original source on every item.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          MedEd Essentials collects public calls for abstracts, grant proposals,
          awards, and journal special issues, plus a newest-first news desk.
          Nothing is listed without a verifiable source URL.
        </p>
        <p className="mt-3 text-sm text-muted">
          Catalog dated {generatedAt}. Refresh with{" "}
          <code className="rounded bg-line/60 px-1.5 py-0.5 text-[13px]">
            npm run collect
          </code>
          .
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const meta = categoryMeta(category);
          const open = getOpenCount(category);
          const total = getOpportunities(category).length;
          return (
            <Link
              key={category}
              href={meta.href}
              className="rounded-2xl border border-line bg-card p-5 transition hover:border-teal/40 hover:shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-teal">
                {meta.label}
              </p>
              <p className="mt-3 font-serif text-4xl">{open}</p>
              <p className="text-sm text-muted">open of {total}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">
                {meta.blurb}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-serif text-2xl">Nearest open deadlines</h2>
            <Link href="/conferences" className="text-sm text-teal-dark hover:underline">
              Browse all
            </Link>
          </div>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
            {deadlines.map((item) => {
              const remaining = daysUntil(item.deadline);
              return (
                <li key={item.id} className="px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">
                    {categoryMeta(item.category).label}
                    {remaining !== null ? ` · ${remaining} days` : ""}
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block font-medium hover:text-teal-dark"
                  >
                    {item.title}
                  </a>
                  <p className="text-sm text-muted">
                    {item.organization}
                    {item.deadline ? ` · ${formatDate(item.deadline)}` : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-serif text-2xl">News</h2>
            <Link href="/news" className="text-sm text-teal-dark hover:underline">
              Newest first
            </Link>
          </div>
          <ul className="space-y-5">
            {news.map((item) => (
              <li key={item.id}>
                <time className="text-xs uppercase tracking-[0.16em] text-gold">
                  {formatDate(item.publishedAt)}
                </time>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block font-serif text-lg leading-snug hover:text-teal-dark"
                >
                  {item.title}
                </a>
                <p className="mt-1 text-sm text-muted">{item.organization}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
