# 男裝圖片、運動休閒分類與150品牌收錄

## 本輪要求與執行順序

1. 男裝目錄、男裝引導、男裝風格圖例必須使用男裝官方穿搭照片；性別入口不再回退到另一服裝方向的共用主圖。個別穿搭圖保留官方出處與收錄範圍。
2. 運動休閒 Athleisure、街頭 Street、戶外 Outdoor 分開。GU／BEAMS 等綜合品牌不因販售衛衣就整個歸入運動休閒；Athleisure入口需有具體服飾系列與官方來源。
3. 收錄以在日本可購買為準，涵蓋國際品牌及日本小眾品牌。COS、SHINYAKOZUKA、山と道必收。
4. 先建立舊版本品牌聯集與逐項對照，再擴充至至少150個具名品牌／服裝標籤指南；現有70筆不刪除，未完整核實的欄位明示待補，不把名稱索引灌入完整指南數。
5. 新增指南保留官方／日本品牌銷售通路、具體商品、實物圖片、貨號、穿搭來源；價格未知就不猜，實際店舖與庫存不從線上商品推定。
6. 完成資料、版面與人工檢查後提交GitHub並部署既有免費Vercel Hobby；不新增付費服務、不啟用付費圖片或資料API、不新增或執行自動測試。

## 找回的漏項

舊 `fti/fashion-trend-index/src/lib/ui/visualCatalog.ts` 與 `assets/registry.ts` 明列但上版未接回的品牌：Miu Miu、The Row、Coach、COS、Zara、Arc'teryx、Salomon。舊單品另涉及adidas、Puma、Onitsuka Tiger、New Balance、ASICS，均列入本輪。

原始FTI僅用作品牌名稱復原依據，不恢復網站FTI資料、指標或圖表。

## 主張稽核

| Claim | Class | Evidence and date | Support | Action |
|---|---|---|---|---|
| 男裝只顯示男裝穿搭 | verified fact | 逐張官方男裝來源與人工圖像核對，2026-10-15 | 不用另一服裝方向圖片回退 | research |
| Athleisure與街頭／戶外不同 | editorial classification | 具名運動生活／訓練與日常服飾系列來源 | 非全品牌定義或永久屬性 | qualify |
| 在日本買得到 | current or unstable fact | 日本官網、官方日本門市或品牌日本銷售通路 | 不保證單店現貨 | cite |
| 舊品牌完整保留 | verified fact | Git資料、舊FTI品牌與單品品牌聯集 | 逐項列出、不以當前網站清單作唯一基準 | research |
| 150個品牌指南 | verified fact | 完整具名條目及來源 | 未完成時不得宣稱完成 | research |

發布判定：publish。150 個指南與 125 個男裝穿搭來源已建檔，本機人工流程與版面檢查完成；雙性別品牌尚未核實的女裝穿搭明示整理中。正式部署結果記入 PROJECT-STATUS.md。

## 已完成的資料與人工檢查

完整恢復聯集見 `data/brand-retention.json`；150 份穿搭來源與限制見 [圖片紀錄](150-brand-image-ledger-2026-10-15.md)。本輪未新增或執行自動測試；正常建置與本機桌面／手機互動檢查記入專案狀態。
