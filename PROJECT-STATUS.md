# TOKI project status

## 150-guide edition — 2026-10-15

- 150 distinct brand/label guides, including all previous 70 IDs. Restored the 7 names missed from the legacy FTI brand index: COS, ZARA, Miu Miu, The Row, Coach, Arc’teryx and Salomon. Legacy item brands and explicit SHINYAKOZUKA / 山と道 requests are retained. The 82-ID recovery union is recorded in data/brand-retention.json and enforced at build time; FTI runtime remains removed.
- Scope is clothing brands available in Japan, regardless of origin. Added 80 guides with named genuine products, exact image/source/identifier and dated Japan prices where verified. Global USD values are not relabeled as JPY. Existing 70 guides preserved.
- 150 default outfit entries and 125 male outfit entries. Men’s directory, wizard, brand links, detail hero, introductory pick and product/price rows keep male context; no female-photo fallback. Women’s photos are used only when separately supported. Some dual-audience women’s outfit images remain pending and are clearly shown as pending, without deleting those brands.
- Athleisure, Street and Outdoor separated. Men’s Athleisure includes Nike, adidas, PUMA, Champion, lululemon and On; GU and BEAMS are excluded. Wizard uses lululemon as the male example. Added shoe and bag categories/budgets and recognized hoodie names in the upper-body category.
- LP retains one main start action and shows all 150 in its secondary entry. Every outfit card reserves a matching frame; mobile directory is one column. Exact-name index and gender-aware links keep the full catalog accessible.
- Local manual checks: 1280px men’s Athleisure shows 6 brands, result heading at y=115 after a style shortcut; COS link retains ?gender=men and the correct source. Wizard men → T-shirt/sweatshirt → unlimited → Hokkaido → Athleisure returns 4 brands, result title focused at y=140. Region list includes all 47 prefectures and unlimited, including Hokkaido/Fukuoka. Mobile 390px LP and SHINYAKOZUKA / 山跟道 search inspected with no horizontal overflow; menu Escape inspected. Margaret Howell male detail hides the female sample.
- Build: 177 routes / 150 guides / 0 runtime functions. No automated tests added or run. Existing non-commercial Vercel Hobby only; no spending, subscription, paid API, domain or upgrade.
- Public release check is recorded below after deployment. Source ledger: docs/150-brand-image-ledger-2026-10-15.md. Known limits: external images may change, unverified Japan prices remain unknown, and detailed regional store records still cover only the earlier selected shops.

# TOKI progress — 2026-10-14

## 50-guide edition — published and inspected

- Responds to user feedback that 15 brands were too few. Original 15 retained; 35 new product-bound guides bring catalog to 50, with 76 static routes / 0 functions. BEAMS 35-name label index remains a separate guide.
- New names cover GU, UNIQLO, MUJI, Adastria brands, TOKYO brands, ATON/YOKE/ssstein/COMOLI/MARKAWARE/NEEDLES/EG, Goldwin/GRAMICCI/TAION/DANTON/and wander, and MASH women/homewear brands. Exact complete names in data/expanded-catalog.json.
- Each new identity has guide copy, original product name, item identifier, real official/brand-store photo, source/date and honest market/classification limits. Some products have unconfirmed sex and are excluded from gender-specific category/budget matches. No fake popularity or sizing advice.
- Directory uses six shelf shortcuts, direct name index, existing search/style/type/budget/gender filters and batches of 12. Initial 12, final 50, shelf 8, under ¥5,000 women 3, YOKE search 1 and reset inspected manually. Build success; desktop no horizontal overflow. See docs/brand-expansion-audit-2026-10-14.md for exact limits and source ledger.
- Published content commit 496d4a29eca568f37951f49171a17f38bbf2c731; Vercel deployment 6vg2z3yWgfMm9TgmNtYty4mdkP4X shows Ready / Production in the existing RENT Hobby team. Public manifest/catalog/CSS HTTP 200, 50 distinct IDs, 76 routes, 50 piece photos, 0 runtime functions. CSP allows only named observed image origins.
- All 50 photographs loaded on the public site (six shelves: 8 + 5 + 4 + 12 + 11 + 10), with nonzero natural width and no browser warning/error. Public desktop width 1280 / document 1265. Evidence stays ignored in evidence/expansion-public-photo-review.json. Screenshot ../outputs/toki-japan-fashion-guide/expanded-brands-2026-10-14.jpg. This edition does not claim a fresh 390px manual review; temporary viewport override was reset.
- Existing Hobby/static hosting; no money spent, no paid service/domain/API/provider. Regional index still covers only the previously verified 10 stores, not all 50 brands.

## Clear entry points and full BEAMS index — 2026-10-14

- User feedback: the old relationship page was not intuitive, BEAMS BOY alone misrepresented the available labels, and the site gave no obvious start. This version replaces the long all-brand list with seven family entry cards and dedicated family guides.
- BEAMS official index fully checked: 35 names, including 14 introductory directions, 20 additional entries and B:MING explicitly marked ended. Canonical names independently checked against all 35 official page titles. Official index entries include clothing labels, stores, projects and partner brands; not all called owned subbrands.
- BEAMS guide groups casual, women, dress and design/lifestyle; provides outfit direction, official scope and item links. 14 official label photographs loaded locally with named label credit. Existing 15 representative product photos retain actual SKU/source matching.
- Homepage first screen uses clear men/women choices and style/budget/area links, with BEAMS/SNIDEL real items. Snow Peak is no longer the single homepage hero. BEAMS main guide links directly to the full label guide.
- Added partial regional index: Tokyo/Osaka/Kyoto, 10 verified stores/counters across BEAMS/AURALEE; scope is explicit. City/district/brand filters, URL reload, reset and map-search links work without a paid API.
- Local build success: 41 static routes, 15 existing brand identities, 0 runtime functions. Desktop 1280px and mobile 390px homepage/family/BEAMS/Graphpaper/area layout manually inspected without horizontal overflow. Existing knitwear/¥5,000–10,000 filter returns 1 brand; regional Osaka 3 / Umeda+AURALEE 1 / reset 10 checked. BEAMS section anchor and complete/history expansions checked; browser warnings/errors empty.
- No automated tests added or run. Plan docs/discovery-navigation-plan-2026-10-14.md; publication verdict publish in docs/navigation-and-label-audit-2026-10-14.md. Source research saved in SOURCES.md; raw third-party source content remains ignored.
- Production verified: content commit 72dedfe97a3124b8001dc91b1942484dc28f1f3c, Vercel deployment 6VGoaPuyuuAZ2wNn3f24DhPSgQXN, RENT Hobby / Ready. Public manifest HTTP 200 shows 41 routes / 15 brands / 0 runtime functions; discovery.css HTTP 200. Live homepage five entry links and full BEAMS guide confirmed.
- All 14 official label images loaded on Production without browser warning/error; ended B:MING accordion visible. Public Osaka/Umeda/AURALEE filter returned the exact women's Hankyu counter and address. Screenshot ../outputs/toki-japan-fashion-guide/intuitive-home-2026-10-14.jpg and intuitive-beams-2026-10-14.jpg. No automated suite run; 390px evidence is local.
- All changes retain the existing non-commercial free Hobby, with no paid provider, upgrade, image generation, map API or domain. Regional coverage remains partial and explicitly labeled; third-party sources may change.

## V2 implementation — 2026-10-14

- Latest work supersedes the design-only state below. User edits fetched through 696b0f3 and merged without losing their nine added brands. Build entry repaired after it had been replaced with configuration JSON.
- 15 complete brand/label entries, separate men/women, category/budget discovery, real product photos, representative-piece index, typed relationships and shopping/comparison pages. Homepage hierarchy and desktop/mobile card layouts refined.
- All 15 principal product photos loaded in the local browser. Each matches an official/brand-store item or explicitly dated feature. PURPLE LABEL 2020 photo's SKU and clothing classification remain unconfirmed and are marked accordingly. Other historical years and unknown Japan prices stay explicit.
- Relationships and public copy audited; verdict publish after corrections. Ledger docs/brand-and-photo-audit-2026-10-14.md. Original unsupported universal fit/sizing claims removed; relationships use full names and source links.
- Build success: 32 static routes, 0 runtime functions. Manual 390px layout inspection on homepage/index/men/women and four brand/relationship pages found no horizontal overflow. Menu Escape, category + budget filtering and gender reset inspected. Category-only knitwear returns AURALEE and SNIDEL, including unknown Japan price; ¥5,000–10,000 narrows to SNIDEL. No browser warnings/errors observed locally.
- No automated tests were added or run for this release. The first-edition test results below are historical and do not cover this change.
- Production verified: https://toki-japan-fashion-guide.vercel.app/ . Vercel RENT Hobby showed Ready for content commit b8a0810, deployment BJz1fUw9jySkqwBpKFjnywffZdDG. Public manifest lists 32 routes / 15 brands / 0 runtime functions; homepage HTTP 200 and intended image-source policy are active.
- All 15 primary photos loaded on the public /pieces page; no browser warning/error observed. Public knitwear + ¥5,000–10,000 filter returned SNIDEL; women under ¥5,000 returned FREAK’S STORE, and reset retained /women. Public 848px and 1280px views had no horizontal overflow; the 390px evidence above is local. Screenshot ../outputs/toki-japan-fashion-guide/optimized-home-2026-10-14.jpg.
- No purchase, upgrade, trial, paid service, paid image generation or new domain. Keep existing non-commercial Hobby constraints; third-party image availability and changing prices remain limitations.

## V2 design — 2026-10-14
- User confirmed brand understanding/comparison/Japan shopping direction and requested representative items. Completed written information architecture and visual design preview: docs/superpowers/specs/2026-10-14-toki-discovery-v2-design.md and ../outputs/toki-japan-fashion-guide/design-v2.html.
- Men/women are distinct entry experiences with one shared brand identity; items retain their actual labels and clothing scope. Added planned pieces/comparison/shopping page structures and five sourced sample picks.
- Representative items distinguish official staples, editorial introductory picks and seasonal items. No claim that all picks are official signature/bestsellers. Unreadable SNIDEL skirt source remains pending. AURALEE Japan price remains unchecked for the new knit example.
- This is a design deliverable; no production code edited, automated product tests run, public push or deployment performed in this phase. 390px design preview inspected with no horizontal overflow; screenshots saved under ../outputs/toki-japan-fashion-guide/. No paid services used.
- Next: review concrete design, then create implementation plan for approved page changes and staged catalog expansion. V1 remains live.

- User authorized direct GitHub and Vercel deployment; budget ¥0 / NT$0 / HK$0 / US$0.
- Read FTI architecture, existing observations and provenance checks. BEAMS/UNITED ARROWS/Snow Peak JP snapshots observed 2026-09-11; AURALEE/SNIDEL missing. Old snapshots will remain dated history.
- Design/implementation plan prepared and reviewed against prior approved five-brand scope. New independent static project; no FTI source or refresh credentials modified.
- Task 1 complete: catalog with checked source links, 3 allowlisted public JP histories and fixture/stale guards.
- Task 2 complete: 16 generated HTML routes (15 content pages plus 404), 0 product dependencies/functions. 10 Node tests green. Local HTTP checks: 15 routes, 6 assets, custom 404 pass.
- Desktop/mobile browser: combined filters, matched sample price, Chinese style search, Japanese brand alias, URL reload, empty/reset and Escape menu verified. All 5 brand pages, trends, releases and article at 390×844 have no horizontal overflow; browser warnings/errors empty.
- Fresh reviewer verdict: publish, no blockers. Minor consistency improvements applied: query limit 160 in input/matching/URL and mobile no-JS navigation fallback. Review ledger docs/claim-audit.md.
- Complete: public GitHub repository https://github.com/michaelbbr/toki-japan-fashion-guide and live Production https://toki-japan-fashion-guide.vercel.app/ . Vercel RENT dashboard explicitly showed Hobby, Ready and source commit 556c3c4; no upgrade, paid service or domain purchase performed.
- Production HTTP checks passed for 15 content routes, 6 assets and custom HTTP 404. Public browser combined budget/style filters, back and reset passed; no browser warnings/errors. Screenshot: ../outputs/toki-japan-fashion-guide/home-desktop.jpg. Local detailed test evidence remains ignored under evidence/.
- Future zero-cost constraint persists in AGENTS.md: personal noncommercial Hobby only. No functions, database, paid API, analytics or scheduled collectors. FTI has 3 dated histories and 2 missing brands; no current popularity ranking claimed.
- Next editorial work: broaden the brand catalog using the retained planning shortlist and dated official sources. No paid expansion authorized.


## 旅行新手引導改版 — 2026-10-15
- 定位更新為給不熟日本服飾的台港旅客，出發前挑想逛的品牌。首頁與 /start 提供服裝類型、單件日圓預算、目的地、穿衣喜好四步引導；可跳過、返回、圖選／問題選、保存結果網址、分批顯示與零結果放寬。
- 移除把性別／居家服／店型混合的 shelf 公開篩選；男女頁只列該服裝範圍有品牌的風格。舊 /men?shelf=women 自動正規化到正常男裝清單（38 個、首批 12 個）。全站保留 50 品牌，建置 77 路由、0 函式。
- 結果依已確認性別的非歷史單品價格配對；不限預算仍可找缺價格品牌。地區僅優先已收錄當地據點，不把未收錄視為沒有門市。門市範圍仍是 3 城市／2 品牌／10 據點。
- 人工檢查：男裝四步→低於5000／東京／寬鬆休閒為 GU；結果重整保留。女裝圖例 GU／MUJI／and wander／SNIDEL 均載入；低於5000／柔和細節為0結果，放寬後49品牌，更多6→12成功。鍵盤空白鍵可選，修正步驟聚焦造成的平滑滾動點選干擾。390×844 步驟、結果、圖片選擇無橫向溢出，手機滑鼠選項可選。
- 人工檢查使用獨立 Edge 任務分頁，未接管既有分頁。未新增或執行自動測試。建置成功；公開部署已完成。
- 圖片證據：../outputs/toki-japan-fashion-guide/travel-mobile-2026-10-15.png。來源與主張清單：docs/travel-finder-plan-2026-10-15.md。
- 正式部署：Vercel Production Ready，內容提交 0969d2d，部署 8kcxLKYU2LFES228RAMKciTe2fBm；https://toki-japan-fashion-guide.vercel.app/start 。首頁、引導頁、兩個新資源及公開 manifest 均 HTTP 200。
- 公開人工驗收：女裝／不限預算／東京／簡單素色得到29品牌、首批6個，重整保留條件；四張女裝示例圖均載入，圖選與問題選正常。舊 /men?shelf=women 正規化到 /men，38品牌，風格沒有女裝選項、種類顯示「褲裝」。桌面無橫向溢出。公開畫面 ../outputs/toki-japan-fashion-guide/travel-live-style-2026-10-15.png。
- 沿用現有免費 Hobby，未購買、升級、啟用付費服務或建立新網域。下一步為擴充已查證門市與適合旅客的品牌內容，不能把目前部分據點當成完整購物地圖。

## 2026-10-15 首頁層級與穿搭照改版
- 使用者要求首頁一眼理解用途與下一步，功能依情境分頁；完成單一主要CTA、三步用途說明、底部探索工具，新增 /guide 集中單品／支線／比較／購物／文章／新品／歷史入口。四步表單保留 /start。
- 風格捷徑改成直接篩選並聚焦 #brand-results，桌面與390px手機第一排品牌均直接可見；完整目錄取消12筆上限，全50品牌顯示。歷史品牌未缺少，BEAMS 35項官方名稱索引另頁保留。
- 50品牌均加入獨立真人穿搭照片與來源，代表商品實品照片保留；另補MUJI、and wander、nanamica的女裝方向圖例。歷史照片明示年份，整套造型不代表同品牌或同價。
- 本機人工驗收完成：50主圖載入、手機圖片引導、直連／點選結果位置、零結果清除、選單Escape、無橫向溢出。未新增或執行自動測試；建置78靜態路由／50品牌／0函式。
- 詳細計畫／來源 docs/landing-revision-2026-10-15.md、docs/outfit-sources-2026-10-15.md；免費Hobby限制持續，未購買或開啟付費服務。
- 正式站驗收完成：Production Ready a86853d，部署 EidyJmAHSCrvcf9iH8EbCZUy1vSG。公開首頁、品牌、指南、引導、樣式與manifest均HTTP200，自訂404為404。公開目錄50品牌／50張穿搭主圖全部載入，無站點圖片錯誤；瀏覽器擴充功能警告與本站無關。
- 正式站1280px分類點選／直連第一排品牌163px可見；390px男裝點選城市風格32品牌全部顯示，第一張161px、無橫向溢出。公開截圖 ../outputs/toki-japan-fashion-guide/landing-live-revision-2026-10-15.png、brands-style-live-revision-2026-10-15.png、brands-style-mobile-live-2026-10-15.png。

## 2026-10-15 品類與預算、地區、風格及品牌擴充
- 已實作五步引導，品類對應單件預算；歷史／套組排除，結果列具名配對商品。
- 47都道府縣與不限、12風格（男裝10）、70個品牌與服裝標籤指南；舊50筆保留。新增北海道札幌與福岡天神BEAMS，詳細門市12筆；地址不足時仍提供官方入口。
- 品牌卡3:4固定框＋40px圖說，手機風格圖固定比例；移除公開台灣／香港與FTI。
- 已建置97靜態路由、0函式；人工核對男裝外套4萬以上配對2品牌、T-shirt／衛衣3000以下為GU與WEGO、女裝12風格、47地區、北海道具名地址、沖繩未建檔官方入口、重整保留、手機無橫向溢出。未新增或執行自動測試。
- 來源 docs/new-brand-sources-2026-10-15.md；執行計畫 docs/discovery-correction-2026-10-15.md。尚待提交部署及公開驗收。

- 正式站完成：內容提交 3ed55a8，最後圖片／歷史價格修正 c23b27c；Vercel Production success，部署 HT68Syti3F2NU4gjvTfYgoJKH7Sw。https://toki-japan-fashion-guide.vercel.app/ 。97靜態路由／70指南／0函式。
- 公開人工驗收：70張品牌主圖全部載入、無失敗；1280px品牌卡約495px同高、40px圖說；風格索引12張皆368px。390px手機12種女裝／10種男裝、全47都道府縣、褲子專屬預算及福岡結果正常，手機結果先顯示品牌名，無橫向溢出。男裝褲子／不限預算／福岡得到3個已收錄單品品牌。
- 公開撤除確認：首頁無台灣／香港或FTI文案；/trends為308轉向/brands，FTI快照404，本機研究頁404。未新增或執行自動測試。
- 公開畫面：../outputs/toki-japan-fashion-guide/brands-70-live-2026-10-15.png、category-budget-mobile-live-2026-10-15.png。維持既有免費Hobby，無新增付費服務。
- 範圍限制：地址目前只涵蓋BEAMS／AURALEE部分12據點，不是全國門市名冊；價錢和品類依具名已收錄樣本，沒有價格資料的品牌只能在不限預算時顯示。下一步擴充同品類價格與官方門市資料。

### Production verification — 2026-10-15

- Content commit 2456fbcede17ff67634d7de8900adf96b6f6817b pushed to main. Vercel deployment FAmFd9JQtD1LKjpnaxsm4ZR6TZdz completed successfully in the existing rent22 project.
- Public https://toki-japan-fashion-guide.vercel.app/build-manifest.json and /data/catalog.json returned HTTP 200: 150 guides / 177 routes / 0 functions. COS, SHINYAKOZUKA and yamatomichi IDs present. FTI snapshot and private research page returned 404.
- Live homepage shows the single guided entry and 150-brand link. Live men’s Athleisure shows exactly 6 entries, with all 6 photos loaded and matching 455px image heights; GU and BEAMS absent. Public SHINYAKOZUKA search returns 1 and its outfit photo loaded; 山跟道 search returns 1.
- Browser log warnings observed were from a separately installed browser extension; no TOKI source warning/error observed in that log sample. This is a bounded manual inspection, not a claim to automated or exhaustive browser coverage.
- Screenshot: ../outputs/toki-japan-fashion-guide/brands-150-home-live-2026-10-15.png. Existing static Hobby deployment retained; no paid plan, domain, provider, API or purchase added. Some women-specific outfit photos and full nationwide store coverage remain explicitly pending.

## 城市購物入口 — 2026-10-16
- 首頁改為選旅行城市，六大城市東京／大阪／京都／福岡／名古屋／札幌；宇都宮 ARKnets 與鎌倉山と道另放目的型逛店。完整150品牌／標籤保留，8個城市獨立頁，共32個具名門市／櫃位。
- 城市先顯示少量入門起點，每店有穿搭、差異、先看什麼、地址、官方與免費地圖入口。東京深入街區選項收合；代表單品展開才出現真實照片、款名、樣本價格與原查核日。
- 引導目的地收斂為已有具名內容的8個目的地與不限；指定地區只配對有已核對當地門市的品牌。品牌頁與引導互連城市地址；保留服裝性別與舊地區網址相容。
- 官方查證：山と道鎌倉現址為由比濱2-5-19，現列金土日11–18。ARKnets依ARK／RIPE／Pier Lounge／DEAR分開，女裝篩選只出DEAR。富山Goldwin公司／研發背景未當作可逛門市，未知零售資訊留收合說明。
- 本機人工檢查：一般桌機首頁→東京→青山直接定位COS與AURALEE；390×844手機首頁、東京男裝結果、真實單品圖與來源。結果頂端y≈137，頁寬375／內容375無橫向溢出。女裝神宮前無結果→保留女裝恢復全城7店；舊hokkaido+goldwin+men網址導至札幌1店；東京引導只找到10個有據點的品牌／標籤。頁面error log空。
- 建置185靜態路由／150指南／0函式；未新增或執行自動化測試。使用者免費條件維持；公開部署檢查待本節後續紀錄。規劃與查證見docs/city-shopping-plan-2026-10-16.md、docs/city-shopping-sources-2026-10-16.md。

### 城市版公開完成
- GitHub內容提交9209d9f3d87636e72b2c3478fb917d302b1fd29c，Vercel success，部署4wjULd8uKzvHJ9Kceo6w5JjzadVB。正式首頁 https://toki-japan-fashion-guide.vercel.app/ 與東京頁 https://toki-japan-fashion-guide.vercel.app/areas/tokyo 已人工查看；青山選擇直接定位COS與AURALEE，兩張真人照成功呈現，地址／地圖／來源可見，error log空。
- 正式建置資訊185路由／150品牌與標籤／8城市頁／0函式。截圖evidence/city-shopping-production-tokyo-2026-10-16.png（本機證據，不公開入庫）。無付費功能、購買或升級。
- 限制：32筆具名據點並非各城市完整門市名錄；樣本不保證現貨。尚無來源的女裝穿搭維持整理中，沒有借用男裝圖。富山Goldwin零售行程尚未核實，不提供公司地址作購物導航。

## LP 四種探索方式 — 2026-10-16
- 使用者最新要求取代首頁單一路線：用途說明＋按地區逛店、按預算找衣服、不知道怎麼選（逐步問答）、認識更多品牌四入口。首頁不再展開城市或地方選貨清單。
- 新增/budget：服裝類別→品類→同品類單件日圓預算，使用既有budgetOptions與品牌篩選，進入結果直接定位；男裝不提供裙裝／洋裝。150指南、8城市、32據點與五步引導保留。
- 本機人工檢視：桌機四入口2×2；390×844手機單欄四入口都在初始畫面可見，內容375px／頁寬375px無橫向溢出。男裝T-shirt選3000-6000進入/men?category=tshirt&budget=3000-6000#brand-results，找到1個有核實樣本的品牌。價格樣本不代表全品牌價帶或現貨。
- 建置186路由／150指南／0函式。未新增或執行自動化測試；無新增依賴、付費API或服務。規劃docs/landing-four-entries-2026-10-16.md；公開頁檢查另記。

### LP 四入口已上線
- 內容提交14c33a45592774b479e1b514486db027a545334d；Vercel部署7aoRMqtCCH69sKBsVAMGrEGifpjD success。正式首頁已人工確認四個入口，1440px無橫向溢出。公開/budget選外套後顯示低於10000／10000-20000／20000-40000／40000以上的日圓單件預算，error log空。
- 正式畫面證據evidence/landing-four-entries-production-2026-10-16.png（本機保存）。網址https://toki-japan-fashion-guide.vercel.app/ 。維持原免費靜態專案；150品牌與標籤完整保留。

## 東京完整結果與 LP 主視覺 — 2026-10-16
- 修正東京男裝預設只剩2店根因：starter改為all；無district參數的舊直連會列完整符合結果。只看入門需主動選，寫入district=starter，重新整理後仍保留。城市入口直接定位結果。
- 10個新具名東京門市：BEAMS PLUS、COMOLI、FREAK’S STORE、UNITED ARROWS、DSM、UNIQLO、MUJI、ATON、Nike、Patagonia。東京22據點／男裝20／女裝16；總42，既有32保留，150品牌指南全數保留。Nike採現行官網1-13-14原宿Quest1F。來源docs/tokyo-store-expansion-sources-2026-10-16.md。
- LP保留四入口，改左右編輯構圖、真人男女穿搭、等高430px照片與來源、清楚層次；手機先看四選項，照片接續在下方。
- 本機人工檢查：/areas/tokyo?gender=men#city-results直接20店，焦點在結果、y≈137；自選starter→2店→重新整理保留→切all回20。桌機兩張官方照片成功載入且等高；390×844手機四入口在初始畫面可見。186路由／150指南／0函式建置成功；未新增或執行自動化測試。公開檢查另記。

### 東京與編輯式首頁已上線
- 內容提交5f356c869db1699f913781593641054086fae85e；Vercel部署4oiBJPK5nhVj4pBy9P21cpiUUpFS success。正式首頁已人工確認四入口、AURALEE男裝與CLANE女裝真人照均成功載入、等高430px。
- 正式/areas/tokyo?gender=men#city-results顯示「找到20個已整理逛店起點・男裝」，全城預設已選中；具名店卡、差異、地址與地圖可見。該次瀏覽error log空。東京全服裝22據點，並非東京完整門市名錄。
- 證據：evidence/editorial-landing-production-2026-10-16.png、evidence/tokyo-men-20-production-2026-10-16.png（本機保存）。150指南、42據點、186靜態路由、0函式；沿用既有免費託管，沒有購買、升級或新增付費服務。

## 整趟購衣預算 — 2026-10-16
- /budget改為兩步：整趟日圓總額→多買幾件／少買買好一點／特別單品，第二步可指定服裝分類。品類留到結果才選；首頁入口文案及頁面資料同步。
- 總額依3／2／1件作平均分配示例，已明示區間採上限；超過60,000填確切金額。配對原有日本價格的具名服飾，保留角色、促銷／預約註記、原查核日與來源；不保證整籃或現貨，不推定全品牌價帶。
- 桌機／手機人工檢視：30,000／多件／男裝5個樣本品牌；同額／特別單品／男裝36個；80,000／少量／女裝26個。未知總額仍探索完整150，更多9→18。針織無樣本可恢復不限品類；直連／重新整理可保留選擇，結果可直接定位。性別圖不互相回退。
- 390×844內容寬375px，無橫向溢出；結果收起入口介紹，首屏可見品牌照片。頁面error log空。186路由／150指南／0函式建置成功；未新增或執行自動化測試。沒有新增依賴、購買或付費服務。詳見docs/travel-budget-2026-10-16.md，正式部署另記。

### 整趟預算正式完成
- 內容提交96a608c5aaaf8c9115c0d4cba6e06aef76105d95，Vercel部署4d4AKWfaGRRMZZKA1rq8ZY8ikawJ success。正式/budget已人工操作總額→買法→結果，30,000／多件／男裝5個樣本品牌、每件分配10,000；error log空。首頁預算入口已顯示整趟購衣說明。
- 正式網址https://toki-japan-fashion-guide.vercel.app/budget 。證據evidence/travel-budget-entry-production-2026-10-16.png、travel-budget-buying-way-production-2026-10-16.png、travel-budget-result-production-2026-10-16.png（本機保存）。維持186路由／150指南／0函式與免費靜態服務。有限預算只配對已收錄樣本；不代表所有可買商品或即時庫存。

## Luxury／Editorial 視覺 — 2026-10-16
- 套用使用者提供的Luxury／Editorial參考。集中主題editorial-luxury.css：暖白#F9F8F6、炭黑#1A1A1A、taupe與少量金；Playfair Display／Inter搭配繁中Noto字型。大字標題、細線、四條背景格線、紙感顆粒、慢速影像、金色滑入按鈕與炭黑頁尾。
- LP保持用途與四入口，改7/5非對稱構圖、細線入口、等高真人男女穿搭的炭黑版面與直排旁註。預算、城市、品牌、支線與文章共用元件樣式；沒有改價格、地址、分類及推薦資料。
- 圖片預設黑白，hover／focus顯原色；頁首可鍵盤／觸控切原色並保留本次瀏覽偏好。來源及原圖不變。無JS時顯原色；減少動態偏好取消動畫，按鈕至少48px、輸入保留焦點。
- 本機人工檢視：桌機LP兩圖載入且同高405px，390×844手機375px無溢出，四入口下緣y708。原色Enter可切、換頁保留；手機選單可開。SHINYAKOZUKA長標題與真實商品圖無溢出；東京男裝20、運動休閒6、30,000多件男裝5樣本品牌，問答入口可見。error log空。
- 186靜態路由／150指南／0函式建置成功，未新增或執行自動化測試；沒有安裝框架、依賴或付費服務。規劃docs/luxury-editorial-plan-2026-10-16.md；正式部署另記。

### Luxury／Editorial 正式完成
- 內容提交0309b0158b13e0a07fd8ea716f67af851a3016a2，Vercel部署6vQXDSEpbB7CJZZeA2vdt4LxpTx7 success。正式首頁人工確認黑白主視覺、四入口、等高405px兩圖成功載入；原色按鈕切換並跨頁保留，預算頁標題和東京男裝20店仍正常，error log空。
- 正式390×844手機四入口下緣y708，內容375px無橫向溢出。截圖evidence/luxury-editorial-home-production-2026-10-16.png、evidence/luxury-editorial-mobile-production-2026-10-16.png；瀏覽器預覽尺寸已恢復。
- 正式https://toki-japan-fashion-guide.vercel.app/ 。186路由／150品牌指南／42具名據點／0函式維持；沒有新增購買、升級或付費服務。這是有限範圍人工檢視，未新增或執行自動化測試。

## 常駐品牌搜尋／彩色照片 — 2026-10-16
- 按使用者最新要求，全站頂部加入常駐品牌搜尋，英文／日文／別名建議可直接進指南，Enter看完整結果；無JS或建議索引失敗仍有原生GET表單。手機搜尋列直接展開。
- 移除背景格線DOM／樣式與首頁裝飾線。照片預設原色，hover改輕微提亮／增色及縮放；黑白模式、原色按鈕與舊偏好模組撤除。照片與來源不變。
- 本機人工檢視：兩圖成功載入且filter=none；BEAMS建議8／顯示6，ArrowDown及Esc可用、Enter完整8品牌；山跟道別名1個，直達山と道。捲動後頁首top0／sticky；390×844手機375px無溢出、四入口下緣y757。沒有改150指南、42據點或預算／城市規則。
- 186路由／150指南／0函式建置成功，未新增或執行自動化測試，無新增依賴／購買／付費服務。詳docs/sticky-brand-search-2026-10-16.md，正式檢查另記。
