export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-teal">Project</p>
      <h1 className="mt-2 font-serif text-4xl">About MedEd Essentials</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/90">
        <p>
          This site is a bulletin of medical-education opportunities: conference
          calls for abstracts, grant and foundation RFPs, association awards,
          and journal special issues, plus a chronological news page.
        </p>
        <p>
          It does not replace the issuing organization. Deadlines, eligibility,
          and amounts can change; always confirm on the official source linked
          from each card. Closed cycles are kept so the catalog remains a
          historical record of what was collected.
        </p>
        <p>
          To refresh news RSS feeds and public listing pages, run{" "}
          <code className="rounded bg-line/60 px-1.5 py-0.5 text-base">
            npm run collect
          </code>{" "}
          from the project root. The script identifies itself, delays between
          fetches, and writes JSON under <code>data/</code>.
        </p>
      </div>
    </div>
  );
}
