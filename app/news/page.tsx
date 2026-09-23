import { NewsList } from "@/components/NewsList";
import { generatedAt, getNews } from "@/lib/catalog";

export const metadata = {
  title: "News",
};

export default function NewsPage() {
  const items = getNews();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-teal">Desk</p>
      <h1 className="mt-2 font-serif text-4xl">News</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">
        Newest first. Items are dated announcements from accreditors, exam
        programs, associations, and journals — each with a source link.
      </p>
      <p className="mb-8 mt-2 text-sm text-muted">
        {items.length} items · collected {generatedAt}
      </p>
      <NewsList items={items} />
    </div>
  );
}
