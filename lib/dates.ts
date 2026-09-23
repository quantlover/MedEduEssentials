import type { Opportunity, OpportunityStatus } from "./types";

export function todayStamp() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

const TODAY = todayStamp();

export function parseDay(value?: string) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value?: string) {
  const date = parseDay(value);
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatRange(start?: string, end?: string) {
  const startLabel = formatDate(start);
  const endLabel = formatDate(end);
  if (startLabel && endLabel && start !== end) return `${startLabel} – ${endLabel}`;
  return startLabel ?? endLabel;
}

export function daysUntil(value?: string, today = TODAY) {
  const deadline = parseDay(value);
  const now = parseDay(today);
  if (!deadline || !now) return null;
  return Math.round((deadline.getTime() - now.getTime()) / 86_400_000);
}

export function computedStatus(
  item: Pick<Opportunity, "deadline" | "eventStart" | "status">,
  today = TODAY,
): OpportunityStatus {
  if (item.status === "rolling") return "rolling";
  if (item.status === "upcoming") return "upcoming";
  const remaining = daysUntil(item.deadline, today);
  if (remaining !== null) return remaining >= 0 ? "open" : "closed";
  const eventRemaining = daysUntil(item.eventStart, today);
  if (eventRemaining !== null && eventRemaining >= 0) return "upcoming";
  return item.status;
}

export function statusLabel(status: OpportunityStatus) {
  switch (status) {
    case "open":
      return "Open";
    case "upcoming":
      return "Upcoming";
    case "closed":
      return "Closed";
    case "rolling":
      return "Rolling";
  }
}

export function deadlineUrgency(deadline?: string) {
  const remaining = daysUntil(deadline);
  if (remaining === null) return "none" as const;
  if (remaining < 0) return "past" as const;
  if (remaining <= 7) return "urgent" as const;
  if (remaining <= 30) return "soon" as const;
  return "ok" as const;
}
