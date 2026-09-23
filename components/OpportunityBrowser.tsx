"use client";

import { useMemo, useState } from "react";
import type { Opportunity, OpportunityStatus } from "@/lib/types";
import { uniqueTags } from "@/lib/tags";
import { OpportunityCard } from "./OpportunityCard";

const statuses: Array<{ id: "all" | OpportunityStatus; label: string }> = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "upcoming", label: "Upcoming" },
  { id: "closed", label: "Closed" },
];

export function OpportunityBrowser({ items }: { items: Opportunity[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | OpportunityStatus>("open");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const tags = uniqueTags(items);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const statusMatch =
        status === "all" ||
        item.status === status ||
        (status === "open" && item.status === "rolling");
      if (!statusMatch) return false;
      if (
        selectedTags.length > 0 &&
        !selectedTags.every((tag) => item.tags.includes(tag))
      ) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        item.title,
        item.organization,
        item.description,
        item.location,
        item.region,
        item.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query, selectedTags, status]);

  function toggleTag(tag: string) {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="block flex-1">
          <span className="sr-only">Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, organization, region, tag…"
            className="w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setStatus(option.id)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                status === option.id
                  ? "bg-teal text-paper"
                  : "border border-line bg-card text-muted hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {tags.length > 0 ? (
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              Tags
            </p>
            {selectedTags.length > 0 ? (
              <button
                type="button"
                onClick={() => setSelectedTags([])}
                className="text-sm text-teal-dark hover:underline"
              >
                Clear tags
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag, count, label }) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    active
                      ? "bg-teal text-paper"
                      : "border border-line bg-card text-muted hover:text-ink"
                  }`}
                >
                  {label}
                  <span className="ml-1 opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      <p className="mb-4 text-sm text-muted">
        {visible.length} listing{visible.length === 1 ? "" : "s"}
        {selectedTags.length > 0 ? " in selected tags" : ""}
      </p>
      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-8 text-muted">
          No listings match these filters. Try “All” or clear the tags.
        </p>
      ) : (
        <div className="grid gap-4">
          {visible.map((item) => (
            <OpportunityCard
              key={item.id}
              item={item}
              onTagClick={toggleTag}
              activeTags={selectedTags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
