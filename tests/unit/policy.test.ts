import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  filterPolicyByBodies,
  groupPolicyByYear,
  policyUpdateIsComplete,
  sortPolicyUpdates,
} from "../../lib/policy";
import type { CatalogFile, PolicyUpdate } from "../../lib/types";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const catalog = JSON.parse(
  readFileSync(path.join(root, "data/policy.json"), "utf8"),
) as CatalogFile<PolicyUpdate>;

const header = readFileSync(
  path.join(root, "components/SiteHeader.tsx"),
  "utf8",
);

test("each policy update is a dated summary with a primary https source", () => {
  assert.ok(catalog.items.length >= 5);
  for (const item of catalog.items) {
    assert.equal(policyUpdateIsComplete(item), true, item.id);
  }
});

test("policy updates sort newest first", () => {
  const sorted = sortPolicyUpdates(catalog.items);
  const dates = sorted.map((item) => item.publishedAt);
  assert.deepEqual(
    dates,
    [...dates].sort((a, b) => b.localeCompare(a)),
  );
});

test("catalog covers LCME, ACGME, AAMC, NBME/USMLE, and international bodies", () => {
  const blob = catalog.items
    .map((item) => `${item.organization} ${item.title} ${item.summary}`)
    .join(" ")
    .toLowerCase();
  for (const token of ["lcme", "acgme", "aamc", "usmle", "wfme", "milestones", "core epas"]) {
    assert.match(blob, new RegExp(token));
  }
});

test("nav places Accreditation and Policy between journal special issues and sources", () => {
  const hrefs = [...header.matchAll(/href: "([^"]+)"/g)].map((match) => match[1]);
  const journals = hrefs.indexOf("/journals");
  const policy = hrefs.indexOf("/policy");
  const sources = hrefs.indexOf("/sources");
  assert.ok(journals !== -1 && policy !== -1 && sources !== -1);
  assert.equal(policy, journals + 1);
  assert.equal(sources, policy + 1);
  assert.match(header, /label: "Accreditation and Policy"/);
});

test("year groups stay newest first and keep items boxed by year", () => {
  const groups = groupPolicyByYear(catalog.items);
  const years = groups.map((group) => group.year);
  assert.deepEqual(years, [...years].sort((a, b) => b.localeCompare(a)));
  for (const group of groups) {
    assert.ok(group.items.length > 0);
    assert.ok(group.items.every((item) => item.publishedAt.startsWith(group.year)));
  }
});

test("body filter keeps matching items in chronicle order", () => {
  const sorted = sortPolicyUpdates(catalog.items);
  const filtered = filterPolicyByBodies(sorted, ["lcme"]);
  assert.ok(filtered.length >= 1);
  assert.ok(filtered.every((item) => item.bodies.includes("lcme")));
  const mixed = filterPolicyByBodies(sorted, ["lcme", "wfme"]);
  assert.ok(mixed.some((item) => item.bodies.includes("lcme")));
  assert.ok(mixed.some((item) => item.bodies.includes("wfme")));
  const dates = mixed.map((item) => item.publishedAt);
  assert.deepEqual(
    dates,
    [...dates].sort((a, b) => b.localeCompare(a)),
  );
});
