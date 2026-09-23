export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-4xl">About MedEd Essentials</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/90">
        <p>
          MedEd Essentials is a public catalog for people who teach, study, or
          research in medical and health professions education.
        </p>
        <p>
          Use it to scan recent news and to find open conference calls, grants,
          awards, and journal special issues. Each listing includes a link to
          the official page, so you can read the full call and apply with the
          issuing organization.
        </p>
        <p>
          We do not take applications, nominations, or payments. Deadlines,
          eligibility, and amounts can change after we record them. Always
          confirm the details on the official source before you submit.
        </p>
        <p>
          Closed items stay listed so you can see a cycle that has ended and
          watch for the next one. The Sources page names the associations,
          foundations, journals, and boards the catalog draws from.
        </p>
      </div>
    </div>
  );
}
