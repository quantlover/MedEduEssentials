# MedEd Essentials

A public bulletin of medical-education opportunities, each tied to the issuing organization’s page:

- **Conference** — calls for abstracts and upcoming meetings
- **Grant** — foundation, board, and association funding
- **Award** — prizes and nominations
- **Journal: special issue** — open collections and CFPs
- **News** — newest first

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
