# MedEd Essentials

A public bulletin of medical-education opportunities, each tied to the issuing organization’s page:

- **News** — newest first
- **Conferences** — calls for abstracts and upcoming meetings
- **Grants** — foundation, board, and association funding
- **Awards** — prizes and nominations
- **Journal: Special Issues** — open collections and CFPs
- **Sources** — official pages used for the catalog

The first catalog was collected on 22 September 2026 from official public pages (AAMC, AMEE, ASME, IAMSE, ACGME, NBME, Macy Foundation, Gold Foundation, Intealth/FAIMER, USMLE, LCME, BMC Medical Education, and others). See [Sources](/sources) in the running site.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Refresh listings from the web

```bash
npm run collect
```

The collector fetches IAMSE and BMC Medical Education RSS feeds, then public listing pages for BMC collections and ASME awards. It identifies itself, waits between requests, and merges into `data/news.json` and `data/opportunities.json` without dropping curated records. Always confirm deadlines on the official source before applying.
