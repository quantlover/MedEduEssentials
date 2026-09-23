import type { Opportunity } from "@/lib/types";
import {
  deadlineUrgency,
  daysUntil,
  formatDate,
  formatRange,
  statusLabel,
} from "@/lib/dates";
import { categoryMeta } from "@/lib/catalog";

export function OpportunityCard({ item }: { item: Opportunity }) {
  const remaining = daysUntil(item.deadline);
  const urgency = deadlineUrgency(item.deadline);
  const meta = categoryMeta(item.category);

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-5 shadow-[0_1px_0_rgba(28,42,34,0.04)]">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em]">
        <span className="rounded-full bg-teal/10 px-2 py-1 text-teal-dark">
          {meta.label}
        </span>
        <StatusChip status={item.status} urgency={urgency} remaining={remaining} />
      </div>
      <div>
        <h2 className="font-serif text-xl leading-snug text-ink">{item.title}</h2>
        <p className="mt-1 text-sm text-muted">{item.organization}</p>
      </div>
      <p className="text-[15px] leading-relaxed text-ink/85">{item.description}</p>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        {item.deadline ? (
          <Fact
            label="Deadline"
            value={`${formatDate(item.deadline)}${item.deadlineNote ? ` · ${item.deadlineNote}` : ""}`}
          />
        ) : null}
        {formatRange(item.eventStart, item.eventEnd) ? (
          <Fact label="Meeting" value={formatRange(item.eventStart, item.eventEnd) ?? ""} />
        ) : null}
        {item.location ? <Fact label="Location" value={item.location} /> : null}
        {item.amount ? <Fact label="Amount" value={item.amount} /> : null}
        {item.eligibility ? <Fact label="Eligibility" value={item.eligibility} /> : null}
        <Fact label="Region" value={item.region} />
      </dl>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2 text-sm">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-teal-dark underline decoration-teal/30 underline-offset-4 hover:decoration-teal"
        >
          Official call
        </a>
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-ink"
          title="Page used at collection time"
        >
          Source: {item.sourceName}
        </a>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function StatusChip({
  status,
  urgency,
  remaining,
}: {
  status: Opportunity["status"];
  urgency: ReturnType<typeof deadlineUrgency>;
  remaining: number | null;
}) {
  const label =
    status === "open" && remaining !== null
      ? remaining === 0
        ? "Due today"
        : `${remaining} day${remaining === 1 ? "" : "s"} left`
      : statusLabel(status);

  const className =
    urgency === "urgent"
      ? "bg-urgent/10 text-urgent"
      : status === "closed"
        ? "bg-line text-muted"
        : "bg-gold/15 text-gold";

  return <span className={`rounded-full px-2 py-1 ${className}`}>{label}</span>;
}
