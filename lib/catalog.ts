import opportunitiesFile from "@/data/opportunities.json";
import newsFile from "@/data/news.json";
import policyFile from "@/data/policy.json";
import sourcesFile from "@/data/sources.json";
import {
  computedStatus,
  daysUntil,
} from "./dates";
import { sortPolicyUpdates } from "./policy";
import type {
  CatalogFile,
  Category,
  NewsItem,
  Opportunity,
  PolicyUpdate,
  Source,
} from "./types";

const opportunitiesCatalog = opportunitiesFile as CatalogFile<Opportunity>;
const newsCatalog = newsFile as CatalogFile<NewsItem>;
const policyCatalog = policyFile as CatalogFile<PolicyUpdate>;
const sourcesCatalog = sourcesFile as CatalogFile<Source>;

export const generatedAt = opportunitiesCatalog.generatedAt;
export const methodology = opportunitiesCatalog.methodology;

export function getOpportunities(category?: Category): Opportunity[] {
  const items = opportunitiesCatalog.items.map((item) => ({
    ...item,
    status: computedStatus(item),
  }));
  const filtered = category
    ? items.filter((item) => item.category === category)
    : items;
  return filtered.sort(byDeadlineThenTitle);
}

export function getOpenCount(category?: Category) {
  return getOpportunities(category).filter(
    (item) => item.status === "open" || item.status === "rolling",
  ).length;
}

export function getUpcomingDeadlines(limit = 6) {
  return getOpportunities()
    .filter((item) => item.status === "open" && item.deadline)
    .sort(byDeadlineThenTitle)
    .slice(0, limit);
}

export function getNews(): NewsItem[] {
  return [...newsCatalog.items].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export function getPolicyUpdates(): PolicyUpdate[] {
  return sortPolicyUpdates(policyCatalog.items);
}

export function getSources(): Source[] {
  return [...sourcesCatalog.items].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function categoryMeta(category: Category) {
  switch (category) {
    case "conference":
      return {
        href: "/conferences",
        label: "Conferences",
        plural: "Conferences",
        blurb:
          "Calls for abstracts, workshops, and sessions at health professions education meetings.",
      };
    case "grant":
      return {
        href: "/grants",
        label: "Grants",
        plural: "Grants",
        blurb:
          "Calls for proposals from foundations, boards, and associations that fund medical education work.",
      };
    case "award":
      return {
        href: "/awards",
        label: "Awards",
        plural: "Awards",
        blurb:
          "Nominations and prizes recognizing teachers, scholars, students, and institutions.",
      };
    case "journal":
      return {
        href: "/journals",
        label: "Journal: Special Issues",
        plural: "Journal: Special Issues",
        blurb:
          "Open collections and special issues inviting papers in medical and health professions education.",
      };
  }
}

function byDeadlineThenTitle(a: Opportunity, b: Opportunity) {
  const aOpen = a.status === "open" || a.status === "rolling" ? 0 : 1;
  const bOpen = b.status === "open" || b.status === "rolling" ? 0 : 1;
  if (aOpen !== bOpen) return aOpen - bOpen;
  const aDays = daysUntil(a.deadline) ?? 9_999;
  const bDays = daysUntil(b.deadline) ?? 9_999;
  if (aDays !== bDays) return aDays - bDays;
  return a.title.localeCompare(b.title);
}
