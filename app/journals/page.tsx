import { OpportunityBrowser } from "@/components/OpportunityBrowser";
import { PageIntro } from "@/components/PageIntro";
import { getOpenCount, getOpportunities } from "@/lib/catalog";

export const metadata = {
  title: "Journal: special issue",
};

export default function JournalsPage() {
  const items = getOpportunities("journal");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageIntro
        category="journal"
        count={items.length}
        openCount={getOpenCount("journal")}
      />
      <OpportunityBrowser items={items} />
    </div>
  );
}
