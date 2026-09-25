import { PolicyChronicle } from "@/components/PolicyChronicle";
import { generatedAt, getPolicyUpdates } from "@/lib/catalog";

export const metadata = {
  title: "Accreditation and Policy",
};

export default function PolicyPage() {
  const items = getPolicyUpdates();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-4xl">Accreditation and Policy</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">
        Newest first. Filter by issuing body to unmix the chronicle, or leave
        the tags cleared to read everything in date order. Each item links to
        the primary source — confirm the current text there before you act on
        it.
      </p>
      <p className="mb-8 mt-2 text-sm text-muted">
        {items.length} items · collected {generatedAt}
      </p>
      <PolicyChronicle items={items} />
    </div>
  );
}
