import Link from "next/link";
import { NewsList } from "@/components/NewsList";
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
  const news = getNews();
  const headlines = news.slice(0, 6);
  const deadlines = getUpcomingDeadlines(5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="max-w-3xl">
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
          News in medical education
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Newest first, then open conferences, grants, awards, and journal
          special issues. Every item links to its official source.
        </p>
      </section>

      <section className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
        <div>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl">Latest</h2>
            <Link href="/news" className="text-sm text-teal-dark hover:underline">
              All news
            </Link>
          </div>
          <NewsList items={headlines} />
        </div>

        <aside>
          <h2 className="mb-4 font-serif text-2xl">Open now</h2>
          <ul className="grid gap-3">
            <li>
              <Link
                href="/news"
                className="block rounded-2xl border border-line bg-card p-4 transition hover:border-teal/40"
              >
                <p className="text-sm text-muted">News</p>
                <p className="mt-1 font-serif text-3xl">{news.length}</p>
                <p className="text-sm text-muted">items, newest first</p>
              </Link>
            </li>
            {categories.map((category) => {
              const meta = categoryMeta(category);
              const open = getOpenCount(category);
              const total = getOpportunities(category).length;
              return (
                <li key={category}>
                  <Link
                    href={meta.href}
                    className="block rounded-2xl border border-line bg-card p-4 transition hover:border-teal/40"
                  >
                    <p className="text-sm text-muted">{meta.label}</p>
                    <p className="mt-1 font-serif text-3xl">{open}</p>
                    <p className="text-sm text-muted">open of {total}</p>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <h2 className="mb-3 font-serif text-2xl">Closing soon</h2>
            <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
              {deadlines.map((item) => {
                const remaining = daysUntil(item.deadline);
                return (
                  <li key={item.id} className="px-4 py-3">
                    <p className="text-xs text-muted">
                      {categoryMeta(item.category).label}
                      {remaining !== null
                        ? ` · ${remaining} ${remaining === 1 ? "day" : "days"}`
                        : ""}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-sm font-medium hover:text-teal-dark"
                    >
                      {item.title}
                    </a>
                    <p className="text-sm text-muted">
                      {item.deadline ? formatDate(item.deadline) : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </section>

      <p className="mt-10 text-sm text-muted">Catalog dated {generatedAt}.</p>
    </div>
  );
}
