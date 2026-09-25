"use client";

import { useMemo, useState } from "react";
import { formatDate } from "@/lib/dates";
import {
  filterPolicyByBodies,
  groupPolicyByYear,
  policyBodyLabel,
  uniquePolicyBodies,
} from "@/lib/policy";
import type { PolicyUpdate } from "@/lib/types";

export function PolicyChronicle({ items }: { items: PolicyUpdate[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const bodies = uniquePolicyBodies(items);
  const visible = useMemo(
    () => filterPolicyByBodies(items, selected),
    [items, selected],
  );
  const years = groupPolicyByYear(visible);

  function toggleBody(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((body) => body !== id)
        : [...current, id],
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm text-muted">Filter by body</p>
          {selected.length > 0 ? (
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-sm text-teal-dark hover:underline"
            >
              Show all
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Issuing body">
          {bodies.map((body) => {
            const active = selected.includes(body.id);
            return (
              <button
                key={body.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleBody(body.id)}
                className={`rounded-full px-3 py-1.5 text-sm outline-none ring-teal/30 focus-visible:ring-2 ${
                  active
                    ? "bg-teal text-paper"
                    : "border border-line bg-card text-muted hover:text-ink"
                }`}
              >
                {body.label}
                <span className="ml-1 opacity-70">{body.count}</span>
              </button>
            );
          })}
        </div>
      </div>
      {years.length === 0 ? (
        <p className="rounded-2xl border border-line bg-card p-5 text-muted">
          No updates for the selected bodies.
        </p>
      ) : (
        <div className="space-y-10">
          {years.map((group) => (
            <section key={group.year} aria-labelledby={`year-${group.year}`}>
              <h2
                id={`year-${group.year}`}
                className="mb-4 font-serif text-2xl text-ink"
              >
                {group.year}
              </h2>
              <ol className="space-y-4">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <PolicyCard
                      item={item}
                      activeBodies={selected}
                      onBodyClick={toggleBody}
                    />
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function PolicyCard({
  item,
  activeBodies,
  onBodyClick,
}: {
  item: PolicyUpdate;
  activeBodies: string[];
  onBodyClick: (id: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-line bg-card p-5 shadow-[0_1px_0_rgba(28,42,34,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <time className="text-sm text-gold">{formatDate(item.publishedAt)}</time>
        <ul className="flex flex-wrap gap-1.5">
          {item.bodies.map((body) => {
            const active = activeBodies.includes(body);
            return (
              <li key={body}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onBodyClick(body)}
                  className={`rounded-full px-2 py-0.5 text-sm outline-none ring-teal/30 focus-visible:ring-2 ${
                    active
                      ? "bg-teal text-paper"
                      : "bg-teal/10 text-teal-dark hover:bg-teal/15"
                  }`}
                >
                  {policyBodyLabel(body)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <h3 className="mt-3 font-serif text-xl leading-snug">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-teal-dark"
        >
          {item.title}
        </a>
      </h3>
      <p className="mt-1 text-sm text-muted">{item.organization}</p>
      {item.effectiveDate ? (
        <p className="mt-1 text-sm text-muted">
          Takes effect {formatDate(item.effectiveDate)}
        </p>
      ) : null}
      <p className="mt-3 leading-relaxed text-ink/85">{item.summary}</p>
      <p className="mt-3 text-sm text-muted">
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
    </article>
  );
}
