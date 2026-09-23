import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import Parser from "rss-parser";
import type { CatalogFile, NewsItem, Opportunity } from "../lib/types";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "data");
const USER_AGENT =
  "MedEdEssentialsBot/1.0 (+https://github.com/; medical-education public catalog; respectful delay)";
const TODAY = (() => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
})();

const rss = new Parser({
  headers: { "User-Agent": USER_AGENT },
  timeout: 20_000,
});

async function main() {
  await mkdir(DATA, { recursive: true });
  const opportunities = await readCatalog<Opportunity>("opportunities.json");
  const news = await readCatalog<NewsItem>("news.json");

  const collectedNews: NewsItem[] = [];
  const collectedOpps: Opportunity[] = [];

  collectedNews.push(...(await collectIamseFeed()));
  await sleep(1500);
  collectedNews.push(...(await collectBmcArticleFeed()));
  await sleep(1500);
  collectedOpps.push(...(await collectBmcCollections()));
  await sleep(1500);
  collectedOpps.push(...(await collectAsmeAwards()));

  news.items = mergeNews(news.items, collectedNews);
  opportunities.items = mergeOpportunities(opportunities.items, collectedOpps);
  news.generatedAt = TODAY;
  opportunities.generatedAt = TODAY;

  await writeCatalog("news.json", news);
  await writeCatalog("opportunities.json", opportunities);
  console.log(
    `Collected ${collectedNews.length} news items and ${collectedOpps.length} listing updates. Catalog now has ${news.items.length} news + ${opportunities.items.length} opportunities.`,
  );
}

async function collectIamseFeed(): Promise<NewsItem[]> {
  const feed = await safeRss("https://www.iamse.org/feed/");
  if (!feed) return [];
  return (feed.items ?? []).slice(0, 12).flatMap((item) => {
    const url = item.link ? cleanUrl(item.link.trim()) : undefined;
    const title = item.title?.trim();
    if (!url || !title) return [];
    return [
      {
        id: `rss-iamse-${slug(url)}`,
        title,
        summary: stripHtml(item.contentSnippet || item.content || title),
        publishedAt: toDay(item.isoDate || item.pubDate) ?? TODAY,
        organization: "International Association of Medical Science Educators",
        url,
        sourceName: "IAMSE RSS",
        sourceUrl: "https://www.iamse.org/feed/",
        collectedAt: TODAY,
      },
    ];
  });
}

async function collectBmcArticleFeed(): Promise<NewsItem[]> {
  const feed = await safeRss(
    "https://bmcmededuc.biomedcentral.com/articles/latest.rss",
  );
  if (!feed) return [];
  return (feed.items ?? []).slice(0, 8).flatMap((item) => {
    const url = item.link ? cleanUrl(item.link.trim()) : undefined;
    const title = item.title?.trim();
    if (!url || !title) return [];
    return [
      {
        id: `rss-bmc-${slug(url)}`,
        title: `New in BMC Medical Education: ${title}`,
        summary: stripHtml(item.contentSnippet || item.content || title).slice(
          0,
          420,
        ),
        publishedAt: toDay(item.isoDate || item.pubDate) ?? TODAY,
        organization: "BMC Medical Education",
        url,
        sourceName: "BMC Medical Education latest RSS",
        sourceUrl: "https://bmcmededuc.biomedcentral.com/articles/latest.rss",
        collectedAt: TODAY,
      },
    ];
  });
}

async function collectBmcCollections(): Promise<Opportunity[]> {
  const sourceUrl =
    "https://bmcmededuc.biomedcentral.com/articles/collections";
  const html = await safeHtml(sourceUrl);
  if (!html) return [];
  const $ = cheerio.load(html);
  const items: Opportunity[] = [];

  $("h2, h3").each((_, heading) => {
    const title = $(heading).text().replace(/\s+/g, " ").trim();
    if (!title || title.length < 8 || title.length > 160) return;
    const block = $(heading).parent();
    const text = `${block.text()} ${block.next().text()}`;
    const open = /submission status[:\s]*open/i.test(text);
    if (!open) return;
    const deadline = parseEnglishDate(text.match(
      /submission deadline[:\s]*([0-9]{1,2}\s+\w+\s+20[0-9]{2})/i,
    )?.[1]);
    const href =
      $(heading).find("a").attr("href") ||
      $(heading).closest("a").attr("href") ||
      sourceUrl;
    items.push({
      id: `bmc-${slug(title)}`,
      category: "journal",
      title,
      organization: "BMC Medical Education",
      description: `Open collection / call for papers at BMC Medical Education. Confirm guest editors and article types on the collection page.`,
      deadline,
      region: "International",
      status: "open",
      url: absoluteUrl(href, sourceUrl),
      sourceName: "BMC Medical Education collections",
      sourceUrl,
      collectedAt: TODAY,
      tags: ["collection", "call for papers"],
    });
  });

  return items;
}

async function collectAsmeAwards(): Promise<Opportunity[]> {
  const sourceUrl = "https://www.asme.org.uk/awards/";
  const html = await safeHtml(sourceUrl);
  if (!html) return [];
  const $ = cheerio.load(html);
  const pageText = $("body").text().replace(/\s+/g, " ");
  const items: Opportunity[] = [];

  const patterns = [
    [
      "The Clinical Teacher ‘New Voices in Health Professions Education’ Award",
      "award",
    ],
    ["Group Innovation Prize", "award"],
    ["Individual Innovation Prize", "award"],
    ["ASME PhD/Doctoral Grants", "grant"],
    ["ASME Gold Medal", "award"],
    ["Mindfulness in Medical Education Research Award", "award"],
    ["ASME President’s Medal", "award"],
  ] as const;

  for (const [title, category] of patterns) {
    const idx = pageText.indexOf(title.replace("’", "'"));
    if (idx < 0) continue;
    const slice = pageText.slice(Math.max(0, idx), idx + 500);
    const close = parseEnglishDate(
      slice.match(/Closing Date\s+([0-9]{1,2}(?:st|nd|rd|th)?\s+\w+\s+20[0-9]{2})/i)?.[1],
    );
    items.push({
      id: `asme-${slug(title)}`,
      category,
      title,
      organization: "Association for the Study of Medical Education",
      description:
        "Listed on the ASME awards page at collection time. Confirm current closing date and eligibility on the official page before applying.",
      deadline: close,
      region: "International",
      status: close ? undefinedStatus(close) : "open",
      url: sourceUrl,
      sourceName: "ASME Awards",
      sourceUrl,
      collectedAt: TODAY,
      tags: ["ASME"],
    });
  }
  return items;
}

function undefinedStatus(deadline: string): Opportunity["status"] {
  return deadline >= TODAY ? "open" : "closed";
}

async function readCatalog<T>(file: string): Promise<CatalogFile<T>> {
  const raw = await readFile(path.join(DATA, file), "utf8");
  return JSON.parse(raw) as CatalogFile<T>;
}

async function writeCatalog<T>(file: string, catalog: CatalogFile<T>) {
  await writeFile(
    path.join(DATA, file),
    `${JSON.stringify(catalog, null, 2)}\n`,
    "utf8",
  );
}

async function safeRss(url: string) {
  try {
    return await rss.parseURL(url);
  } catch (error) {
    console.warn(`RSS skipped (${url}):`, error instanceof Error ? error.message : error);
    return null;
  }
}

async function safeHtml(url: string) {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.text();
  } catch (error) {
    console.warn(`HTML skipped (${url}):`, error instanceof Error ? error.message : error);
    return null;
  }
}

function mergeNews(existing: NewsItem[], incoming: NewsItem[]) {
  const map = new Map<string, NewsItem>();
  for (const item of [...existing, ...incoming]) {
    map.set(item.url, item);
  }
  return [...map.values()].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

function mergeOpportunities(existing: Opportunity[], incoming: Opportunity[]) {
  const map = new Map<string, Opportunity>();
  for (const item of existing) map.set(opportunityKey(item), item);
  for (const item of incoming) {
    const match =
      map.get(opportunityKey(item)) ??
      [...map.values()].find((prior) => titlesOverlap(prior.title, item.title));
    if (match) {
      map.set(opportunityKey(match), {
        ...match,
        deadline: item.deadline ?? match.deadline,
        status: item.status,
        url: item.url || match.url,
        sourceUrl: item.sourceUrl || match.sourceUrl,
        collectedAt: item.collectedAt,
      });
    } else {
      map.set(opportunityKey(item), item);
    }
  }
  return [...map.values()];
}

function opportunityKey(item: Opportunity) {
  return `${item.category}:${normalizeTitle(item.title)}`;
}

function titlesOverlap(a: string, b: string) {
  const left = normalizeTitle(a);
  const right = normalizeTitle(b);
  return left.includes(right) || right.includes(left);
}

function normalizeTitle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/The post .* appeared first on .*$/i, "")
    .replace(/\s*Read more »?\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(
      (key) => parsed.searchParams.delete(key),
    );
    return parsed.toString();
  } catch {
    return url;
  }
}

function toDay(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

function parseEnglishDate(value?: string) {
  if (!value) return undefined;
  const cleaned = value.replace(/(\d+)(st|nd|rd|th)/i, "$1");
  const date = new Date(`${cleaned} UTC`);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

function absoluteUrl(href: string, base: string) {
  try {
    return new URL(href, base).toString();
  } catch {
    return base;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
