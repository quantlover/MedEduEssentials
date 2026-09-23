import { OpportunityBrowser } from "@/components/OpportunityBrowser";
import { PageIntro } from "@/components/PageIntro";
import { getOpenCount, getOpportunities } from "@/lib/catalog";

export const metadata = {
  title: "Grants",
};

export default function GrantsPage() {
  const items = getOpportunities("grant");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageIntro
        category="grant"
        count={items.length}
        openCount={getOpenCount("grant")}
      />
      <OpportunityBrowser items={items} />
    </div>
  );
}
