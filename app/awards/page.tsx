import { OpportunityBrowser } from "@/components/OpportunityBrowser";
import { PageIntro } from "@/components/PageIntro";
import { getOpenCount, getOpportunities } from "@/lib/catalog";

export const metadata = {
  title: "Award",
};

export default function AwardsPage() {
  const items = getOpportunities("award");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageIntro
        category="award"
        count={items.length}
        openCount={getOpenCount("award")}
      />
      <OpportunityBrowser items={items} />
    </div>
  );
}
