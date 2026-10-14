# TOKI final claim and implementation review

Reviewed 2026-10-14. Verdict: **publish**. No blocking findings in the reviewed version.

Scope: AGENTS.md, approved design and plan, SOURCES.md, catalog, imported snapshots, generator, browser script, styles, importer, server, deployment configuration and tests. Applied the TH `content-claim-auditor` skill. This was a fresh local source review: no external pages, browser tabs, dependency installs or product edits. Current commercial facts rely on the primary-source checks recorded by the implementing agent in SOURCES.md on 2026-10-14; this review does not claim a second live price or inventory check. Public production verification remains the deploying agent's next required step.

## Claim ledger

| Claim | Class | Evidence and date | Support | Action |
|---|---|---|---|---|
| “BEAMS 是選貨店，也販售海外品牌”; multiple labels/store types | current or unstable fact | https://www.beams.co.jp/ and https://www.beams.co.jp/shop/; recorded check 2026-10-14 | Recorded official references support the brand/store description; shopping advice expressly requires checking each label. | keep |
| BEAMS logo tee ¥5,170; Technical T-Shirt ¥13,200 | current or unstable fact | https://www.beams.co.jp/item/beams/t-shirt/11081083591/ and https://www.beams.co.jp/item/beams/t-shirt/11041337458/?color=21; recorded check 2026-10-14 | Supports dated individual examples, not minimum brand price or current stock; both qualifications appear publicly. | keep |
| UNITED ARROWS has own-label and selected products; group labels differ | current or unstable fact | https://store.united-arrows.co.jp/brand/ua/ and https://store.united-arrows.co.jp/brand/ua/stores/; recorded check 2026-10-14 | Official brand/store references; recommendations are identified as editorial. | keep |
| UA boat-neck tee ¥8,800; cotton tee ¥9,900 | current or unstable fact | https://store.united-arrows.co.jp/s/all/focuson/items/3/ and https://store.united-arrows.co.jp/ua_columns/all/feature/new_in/items60; recorded check 2026-10-14 | Editorial page prices only. Public sample notes and methods disclose old editorial samples and no stock guarantee. | keep |
| Snow Peak includes equipment and apparel | current or unstable fact | https://ec.snowpeak.co.jp/ and https://ec.snowpeak.co.jp/real-store-search; recorded check 2026-10-14 | Supports catalog scope. Public copy explicitly avoids inferring waterproof performance from brand name. | keep |
| Two-tee set ¥6,600, announced 2026-10-03 10:00 JST; sweatshirt ¥14,960 | current or unstable fact | https://ec.snowpeak.co.jp/item/SNP0126A3420?clr_id=101 and https://ec.snowpeak.co.jp/; recorded check 2026-10-14 | Set contents, dated launch and listed sample prices recorded; no continuing availability claim. Homepage sweatshirt evidence is less durable than a product URL. | keep |
| AURALEE material-led presentation; Tokyo/Minami-Aoyama and Isetan Shinjuku locations | current or unstable fact | https://auralee.jp/ and https://auralee.jp/store; recorded check 2026-10-14 | Official catalog/store references; visit advice requires rechecking operations and assortment. | keep |
| AURALEE L/S tee ¥19,800; sweat P/O ¥38,500 | current or unstable fact | Japanese region listing https://auralee.jp/item?category_id=507, linked products https://auralee.jp/item/detail/1_1_A00P01GT_1/2005 and https://auralee.jp/item/detail/1_1_A26AP02TU_1/1904; recorded browser check 2026-10-14 | Recorded Japan-region prices; public note identifies region and dated sample status. | keep |
| SNIDEL positioning combines street and formal elements; knit ¥9,900 | current or unstable fact | https://snidel.us/ and https://mitsui-shopping-park.com/ec/p/1620000009218; recorded check 2026-10-14 | Brand positioning and Japanese retailer sample distinguished. USAGI was inaccessible; it is offered as a destination, not represented as a live verified inventory source. | keep |
| AURALEE “Coming Soon”; “日期未公布” | current or unstable fact | https://auralee.jp/; recorded catalog observation 2026-10-14 | Limited to a dated official entry point; no product-specific release date invented. Homepage content may change. | keep |
| “三個相關日本快照取得於 2026-09-11”; AURALEE/SNIDEL absent | verified fact | data/fti-snapshots.json; https://github.com/michaelbbr/fashion-trend-index; local inspection 2026-10-14 | Three preserved observedAt timestamps and JP provider metadata; catalog has no FTI key for the two missing brands. No current ranking is rendered. | keep |
| “0–100 是該搜尋詞自己的相對指數”; Snow Peak query includes whole brand | verified fact | Imported scalingMode `query_relative_0_100`, query `スノーピーク`, same local snapshot; inspected 2026-10-14 | Supports the limitation on comparing separately normalized queries. Parent-brand search is expressly separated from apparel interest and sales. | keep |
| “超過 14 天標示歷史資料並隱藏當前升降”; partial/missing points break the graph | verified fact | src/domain.mjs and scripts/build.mjs; inspected 2026-10-14 | Implemented at build; browser also suppresses expired momentum. All supplied snapshots are already stale. | keep |
| Style categories, suitability, related-brand reasons, shopping checklists | opinion or inference | data/catalog.mjs and generated style/method/source disclosures; inspected 2026-10-14 | Explicit editorial suggestions. No invented wear test, store visit, personal experience, sales result or popularity rank. | keep |
| “風格示意 · AI”; not actual brand products | verified fact | Existing public FTI image provenance recorded in SOURCES.md; generator figcaption and SVG accessible label; inspected 2026-10-14 | Reused generic image is visibly and accessibly labeled throughout. | keep |
| Browser-side filters, shareable query; no accounts/payments/analytics; hosting/fonts third parties | verified fact | public/app.mjs, scripts/build.mjs and vercel.json; inspected 2026-10-14 | Source matches functional claims. Privacy body discloses URL queries, Vercel logs and Google Fonts; no claim of zero third-party requests. | keep |
| Zero paid dependencies/runtime functions; personal noncommercial prototype | verified fact | package.json, vercel.json, generated methods text; inspected 2026-10-14 | Static implementation supports these claims. Actual account plan, production origin and deployment result must still be verified at publication. | keep |

No first-person experiential claims or private identifying details requiring anonymization were found in the public catalog or generated copy. Repository provenance identifies an already public source.

## Implementation outcome

- Missing/stale observations: correct for supplied data. Invalid provenance is rejected, partial values are gaps, and stale observations retain history without current momentum.
- Malicious query text: query values go through form `.value`, match logic and URLSearchParams; no query-to-HTML sink. Embedded card JSON and plotted dates/query labels are escaped. External links use `noopener noreferrer`; deployment has a restrictive CSP.
- Budget bounds: `[0,5000)`, `[5000,10000)`, `[10000,30000)`, `[30000,Infinity)` match the visible wording. A displayed card sample is recalculated from the matching budget samples. Set price and sample limitations are disclosed.
- Reload/back/reset: ordinary filters and sort restore from the URL; popstate reapplies them. Reset cancels the debounce and synchronously restores all defaults. Unknown select values fall back to all.
- Mobile keyboard: native button, links and selects, visible focus, expanded state and Escape-to-close/focus restoration exist. No focus trap is needed for this nonmodal disclosure. This source review does not substitute for the parent's actual viewport/keyboard checks.
- 404: a dedicated generated 404 page and local HTTP 404 response exist; Vercel clean URLs retain a real 404 artifact. Production status and accessible recovery link must be confirmed after deployment.

The parent reports 10 passing Node tests and successful local checks for 15 normal routes, six assets and a custom HTTP 404. Those checks were inspected in source but were not rerun by this reviewer. Tests do not independently prove live commercial facts or actual deployment behavior.

## Nonblocking improvements

1. **P3 — long query reload consistency**, public/app.mjs:28 and scripts/build.mjs:30. URL hydration truncates at 160 characters while the input/application path does not. For example, a pasted value containing 160 spaces followed by `BEAMS` matches BEAMS before reload but becomes whitespace (all brands) after reload. Apply the same normalization/length limit before matching and serializing, and add `maxlength="160"` for input feedback, or remove the hydration-only limit. This is a bounded edge case, not an injection issue.
2. **P3 — mobile navigation without JavaScript**, public/styles.css:14. Mobile navigation is hidden until JS adds `.open`, so with JS unavailable its visible menu button cannot expose links. Use a progressive-enhancement class to hide the nav only once JS is ready, or supply a no-script navigation fallback. Ordinary static content and footer/home recovery links remain available.

