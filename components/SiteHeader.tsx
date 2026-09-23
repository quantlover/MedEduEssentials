import Link from "next/link";

const links = [
  { href: "/news", label: "News" },
  { href: "/conferences", label: "Conferences" },
  { href: "/grants", label: "Grants" },
  { href: "/awards", label: "Awards" },
  { href: "/journals", label: "Journal: Special Issues" },
  { href: "/sources", label: "Sources" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="group">
          <p className="font-serif text-2xl leading-tight text-ink group-hover:text-teal-dark">
            MedEd Essentials
          </p>
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-muted">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-teal-dark"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
