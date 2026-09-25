/** Controlled tags used to filter and group catalog items. Keep ids stable. */
export const TAG_LABELS: Record<string, string> = {
  abstracts: "Abstracts",
  ai: "AI",
  assessment: "Assessment",
  cbe: "Competency-based education",
  collection: "Collection",
  communication: "Communication",
  cpd: "CPD / CME",
  disability: "Disability",
  disaster: "Disaster preparedness",
  "early-career": "Early career",
  equity: "Equity",
  "faculty-development": "Faculty development",
  "family-medicine": "Family medicine",
  fellowship: "Fellowship",
  gme: "GME",
  hpe: "Health professions education",
  humanism: "Humanism",
  humanities: "Humanities",
  innovation: "Innovation",
  lgbtq: "LGBTQ+ health",
  nursing: "Nursing",
  nutrition: "Nutrition",
  "patient-safety": "Patient safety",
  pediatrics: "Pediatrics",
  psychiatry: "Psychiatry",
  research: "Research",
  simulation: "Simulation",
  sotl: "SoTL",
  students: "Students",
  technology: "Technology",
  travel: "Travel",
  ume: "UME",
  vr: "VR / gamification",
  "well-being": "Well-being",
  workshops: "Workshops",
};

export function tagLabel(tag: string) {
  return TAG_LABELS[tag] ?? tag;
}

export function uniqueTags(items: Array<{ tags: string[] }>) {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || tagLabel(a[0]).localeCompare(tagLabel(b[0])))
    .map(([tag, count]) => ({ tag, count, label: tagLabel(tag) }));
}
