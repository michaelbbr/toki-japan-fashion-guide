# 旅行購衣入門改版

## 目標
使用者確認：服務不熟悉日本服飾、準備去日本旅行的人。從性別、每件預算、目的地與穿衣喜好，建立可理解的品牌逛店清單。

## 實作順序
1. 修正男女裝分類：只提供該頁有品牌的分類，移除混合性別與店型的探索方向；舊連結有效正規化。
2. 首頁與 /start 放入四步引導，圖片及白話問題兩種風格選法；保留跳過、返回、重新開始、分享網址。
3. 結果顯示符合原因、實際單品、具名價格及官方購物入口。只以性別已確認、非歷史單品的價格配對預算。
4. 目的地提供已核實門市與官方查店入口，不把尚未收錄誤當不存在。不以兩品牌的地理資料排除其餘品牌。
5. 保留 50 品牌、BEAMS 標籤、實物圖及來源。免費靜態建置、GitHub 與既有 Vercel Hobby。
6. 建置、人工檢查正常／無結果／返回／舊網址／男女入口／手機、公開頁，記錄限制與證據。

## 發布前主張清單
| Claim | Class | Evidence and date | Support | Action |
|---|---|---|---|---|
| 不熟日本服飾的旅客是主要讀者 | 使用者確認 | 本對話 2026-10-15 | 完整 | keep |
| 四步配對是編輯探索建議，不是人氣、庫存或折扣保證 | opinion or inference | 本站規則及公開單品欄位 | 完整 | qualify |
| 圖片為該品牌具名真實單品 | verified fact | data/catalog.mjs、editorial.mjs、expanded-catalog.json 各 source/image/sku；2026-10-14 | 完整，不代表整品牌造型 | cite |
| 單件預算是已核實單品價格，非全品牌價帶 | current or unstable fact | 同上各 price/priceNote；2026-10-14 | 部分：可能調價、停售 | qualify |
| BEAMS 官方可按地區查店 | current or unstable fact | https://www.beams.co.jp/shop/ 2026-10-15 重讀 | 完整，營業狀態另確認 | cite |
| 地區收錄 3 城市、2 品牌、10 個據點 | verified fact | data/areas.mjs；2026-10-14 | 僅為本站收錄範圍 | qualify |
| GU／MUJI／SNIDEL 的官方購物入口 | current or unstable fact | https://www.gu-global.com/jp/ja/ 、https://www.muji.com/jp/ja/store 、https://snidel.com/ 2026-10-15 重讀 | 支持入口，不保證現貨或日本限定 | cite |

Verdict: publish after fixes。完成介面、限制標示與人工檢查後發布；不增加暢銷、最便宜、日本限定或實穿主張。


## 實作及人工檢查後結論
Verdict: publish。建置77路由／50品牌，四步選擇、男女圖例、舊男裝連結恢復、結果重整、無結果與放寬、分批品牌及390px手機版已人工確認。價格／地區限制已在對應步驟和結果列出。沒有加入庫存、人氣、最便宜或親身實訪主張。公開部署後另記狀態。
