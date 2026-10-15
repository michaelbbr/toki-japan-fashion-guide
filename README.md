# TOKI｜日本品牌選物誌

A Traditional Chinese clothing discovery guide for people planning a Japan trip.

- 70 individually named brand and clothing-label guides; all previous 50 retained.
- Five-step finder: clothing scope, item category, category-specific JPY budget, destination, style.
- 12 editorial style directions, with picture and plain-language choices.
- 47 prefectures plus an unrestricted destination. Detailed addresses currently cover 12 BEAMS/AURALEE locations in five prefectures; official lookup links cover brands without recorded addresses.
- Real official outfit imagery for discovery, separate exact-item photos and provenance for product examples. Fixed image frames and captions.
- A separate 35-name BEAMS index, with 14 introductory label directions; names are not inflated into the guide count.
- 97 static routes and zero runtime functions. All catalogue cards are visible by default; guided results show six at a time with a total and a continuation button.

## Run

Node.js 22+; no package installation or product dependencies.

```sh
npm run build
npm run dev
```

Local preview: http://127.0.0.1:3057

## Zero-cost deployment

Use the existing personal Vercel Hobby project and free vercel.app domain. Framework Other, build `npm run build`, output `dist`; configuration is in `vercel.json`.

No runtime functions, cron, database, paid provider, paid image optimization, analytics, ads or affiliate links. Do not enable paid plans, trials or integrations, or buy a domain. If free allowances are exhausted, do not automatically upgrade.

## Sources and scope

Prices belong to named items, dates and purchase units. The budget filter requires the same category and confirmed clothing scope, and excludes historical items and sets. Unknown Japanese prices remain unknown; international prices are not converted into a Japanese price claim.

Styles are editorial discovery aids. Outfit photographs may include other brands and do not establish an entire outfit's ownership, price or availability. Exact-item photographs retain product names, identifiers and source links. Staples require official evidence; editorial and historical examples are labeled.

Public FTI pages, snapshots, charts and browser calculations were removed on 2026-10-15. `/trends` redirects to `/brands`. Internal historical files are retained for provenance; the separate original FTI project is unchanged.

This release uses manual browser review and static generation. No automated tests were added or run. See `PROJECT-STATUS.md`, `SOURCES.md`, and `docs/new-brand-sources-2026-10-15.md` for evidence and limitations.
