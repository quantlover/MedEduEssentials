export type Category = "conference" | "grant" | "award" | "journal";

export type OpportunityStatus = "open" | "upcoming" | "closed" | "rolling";

export type Opportunity = {
  id: string;
  category: Category;
  title: string;
  organization: string;
  description: string;
  deadline?: string;
  deadlineNote?: string;
  eventStart?: string;
  eventEnd?: string;
  location?: string;
  region: string;
  amount?: string;
  eligibility?: string;
  status: OpportunityStatus;
  url: string;
  sourceName: string;
  sourceUrl: string;
  collectedAt: string;
  tags: string[];
};

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  organization: string;
  url: string;
  sourceName: string;
  sourceUrl: string;
  collectedAt: string;
};

export type Source = {
  id: string;
  name: string;
  organization: string;
  url: string;
  kind: "association" | "foundation" | "journal" | "accreditor" | "exam" | "university";
  collects: Array<"conference" | "grant" | "award" | "journal" | "news" | "policy">;
  notes: string;
};

export type PolicyUpdate = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  effectiveDate?: string;
  organization: string;
  bodies: string[];
  url: string;
  sourceName: string;
  sourceUrl: string;
  collectedAt: string;
};

export type CatalogFile<T> = {
  generatedAt: string;
  methodology: string;
  items: T[];
};
