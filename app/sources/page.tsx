import { generatedAt, getSources } from "@/lib/catalog";

export const metadata = {
  title: "Sources",
};

export default function SourcesPage() {
  const sources = getSources();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-teal">Provenance</p>
      <h1 className="mt-2 font-serif text-4xl">Sources</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">
        Listings are gathered from public pages of medical education
        associations, foundations, journals, accreditors, and exam boards.
        The collector prefers RSS feeds and official listing pages, waits
        between requests, and stores the source URL on every record.
      </p>
      <p className="mb-8 mt-2 text-sm text-muted">Last catalog date {generatedAt}</p>
      <ul className="space-y-4">
        {sources.map((source) => (
          <li key={source.id} className="rounded-2xl border border-line bg-card p-5">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-xl hover:text-teal-dark"
            >
              {source.name}
            </a>
            <p className="mt-1 text-sm text-muted">
              {source.organization} · {source.kind} · collects{" "}
              {source.collects.join(", ")}
            </p>
            <p className="mt-2 leading-relaxed">{source.notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
