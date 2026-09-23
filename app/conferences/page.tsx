import { OpportunityBrowser } from "@/components/OpportunityBrowser";
import { PageIntro } from "@/components/PageIntro";
import { getOpenCount, getOpportunities } from "@/lib/catalog";

export const metadata = {
  title: "Conference",
};

export default function ConferencesPage() {
  const items = getOpportunities("conference");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageIntro
        category="conference"
        count={items.length}
        openCount={getOpenCount("conference")}
      />
      <OpportunityBrowser items={items} />
    </div>
  );
}
