# TOKI｜日本品牌選物誌

Traditional Chinese personal fashion discovery prototype for Taiwan/Hong Kong readers.

Second edition: 15 brand/label pages, including the user's nine additions and an independent THE NORTH FACE PURPLE LABEL page. Separate men/women entries, sourced real product photographs, typed brand relationships, category/budget discovery, buying links, editorial and dated FTI history.

The latest navigation revision adds a family-guide hub, a complete dated 35-entry BEAMS official-name index with 14 introductory directions, and a clearly scoped 10-store regional index for BEAMS/AURALEE. The homepage prioritizes men/women, style, budget and place. Current build generates 41 static routes.

## Run

Requires Node.js 22+. No product dependencies or package installation.

```sh
npm run build
npm run dev
```

Preview: http://127.0.0.1:3057

## Deploy at zero cost

Use the existing personal Vercel Hobby workspace. Import this GitHub repository, Framework Other, build command npm run build, output directory dist. Configuration is in vercel.json. Free vercel.app domain.

There are no runtime functions, cron, databases, paid providers, paid image optimization, analytics or third-party trackers. This is a non-commercial personal prototype with no ads or affiliate links. Do not enable Pro, trials, paid integrations or purchase a domain. Exceeding Hobby allowance may pause availability; do not automatically upgrade.

## Data and source honesty

FTI public JP histories originally observed 2026-09-11 are stored with their original dates. Search indices are normalized independently per query; they are not comparable absolute popularity scores. Stale observations show history and suppress current momentum. Missing AURALEE/SNIDEL observations remain missing. Snow Peak data includes the parent brand, including outdoor gear.

To import updated public data from an explicitly approved local FTI copy:

```sh
node scripts/import-fti.mjs /explicit/path/searchSnapshots.json
npm test
npm run build
```

The importer validates provenance and allowlists public fields. It never contacts a provider and never copies credentials. Invalid inputs preserve the existing output.

All product prices are source-linked examples, not real-time inventory or full brand price ranges. Style labels and related-brand suggestions are editorial. Official staples, editorial introductory picks and historical versions are labeled separately. Product photos embed exact official/brand-store sources and retain their attribution. The old generic AI atlas is unused by rendered pages and preserved for rollback.

The legacy automated suite was written for the five-brand first edition. It has not been rerun or updated for this release; current review evidence is manual browser inspection and successful static generation, recorded in the claim ledger and project status.

See SOURCES.md for exact URLs/observations, docs/superpowers/specs for scope and PROJECT-STATUS.md for verified delivery status.
