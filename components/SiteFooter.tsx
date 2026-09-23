import Link from "next/link";
import { generatedAt } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Catalog last collected {generatedAt}. Every listing links to its
          issuing organization.
        </p>
        <div className="flex gap-4">
          <Link href="/sources" className="hover:text-teal-dark">
            Sources
          </Link>
          <Link href="/about" className="hover:text-teal-dark">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
