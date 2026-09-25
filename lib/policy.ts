import type { PolicyUpdate } from "./types";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export const POLICY_BODIES = [
  { id: "lcme", label: "LCME" },
  { id: "acgme", label: "ACGME" },
  { id: "aamc", label: "AAMC" },
  { id: "usmle", label: "USMLE" },
  { id: "nbme", label: "NBME" },
  { id: "wfme", label: "WFME" },
  { id: "intealth", label: "Intealth" },
] as const;

export type PolicyBodyId = (typeof POLICY_BODIES)[number]["id"];

const BODY_LABELS = Object.fromEntries(
  POLICY_BODIES.map((body) => [body.id, body.label]),
) as Record<string, string>;

export function policyBodyLabel(id: string): string {
  return BODY_LABELS[id] ?? id;
}

export function sortPolicyUpdates(items: PolicyUpdate[]): PolicyUpdate[] {
  return [...items].sort((a, b) => {
    const byDate = b.publishedAt.localeCompare(a.publishedAt);
    if (byDate !== 0) return byDate;
    return a.title.localeCompare(b.title);
  });
}

export function filterPolicyByBodies(
  items: PolicyUpdate[],
  selected: string[],
): PolicyUpdate[] {
  if (selected.length === 0) return items;
  return items.filter((item) =>
    selected.some((body) => item.bodies.includes(body)),
  );
}

export function groupPolicyByYear(
  items: PolicyUpdate[],
): Array<{ year: string; items: PolicyUpdate[] }> {
  const groups: Array<{ year: string; items: PolicyUpdate[] }> = [];
  for (const item of sortPolicyUpdates(items)) {
    const year = item.publishedAt.slice(0, 4);
    const current = groups[groups.length - 1];
    if (current && current.year === year) {
      current.items.push(item);
    } else {
      groups.push({ year, items: [item] });
    }
  }
  return groups;
}

export function uniquePolicyBodies(items: PolicyUpdate[]) {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const body of new Set(item.bodies)) {
      counts.set(body, (counts.get(body) ?? 0) + 1);
    }
  }
  return POLICY_BODIES.filter((body) => counts.has(body.id)).map((body) => ({
    id: body.id,
    label: body.label,
    count: counts.get(body.id) ?? 0,
  }));
}

export function isPrimarySourceUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function issuingBodiesIn(items: PolicyUpdate[]): string[] {
  return [...new Set(items.map((item) => item.organization))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function policyUpdateIsComplete(item: PolicyUpdate): boolean {
  const knownBodies = new Set(POLICY_BODIES.map((body) => body.id));
  return (
    DATE.test(item.publishedAt) &&
    (!item.effectiveDate || DATE.test(item.effectiveDate)) &&
    item.title.trim().length > 0 &&
    item.summary.trim().length > 0 &&
    item.bodies.length > 0 &&
    item.bodies.every((body) => knownBodies.has(body as PolicyBodyId)) &&
    isPrimarySourceUrl(item.url) &&
    isPrimarySourceUrl(item.sourceUrl)
  );
}
