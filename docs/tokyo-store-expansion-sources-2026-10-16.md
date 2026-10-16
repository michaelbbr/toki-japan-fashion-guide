# 東京新增門市來源

查核：2026-10-16。資料 `data/tokyo-stores.mjs`，本次增加10個具名據點；東京共22個，其中男裝20個／女裝16個，並非東京全部門市名錄。既有32筆全數保留，總數42。品牌資料仍為150個品牌／標籤，店家數不作品牌數。

| 門市 | 官方來源 | 已核對事實／限制 |
| --- | --- | --- |
| BEAMS PLUS 原宿 | https://www.beams.co.jp/shop/bph/ | 神宮前3-25-12 1F；男裝、BEAMS PLUS；與主標籤分開 |
| COMOLI 青山 | https://www.comoli.jp/shop | 南青山6-1-3 COLLEZIONE2F；保留現行店表，非公司地址 |
| FREAK’S STORE 澀谷 | https://www.daytona-park.com/store/ | 神南1-13-1；官方列 MEN WOMEN；不把全部網店品牌推定當店有售 |
| UNITED ARROWS 澀谷 Scramble Square | https://store.united-arrows.co.jp/brand/ua/stores/usys.html | 澀谷2-24-12 8F；官方男女標籤分列；部分品牌僅部分商品 |
| DSM GINZA | https://ginza.doverstreetmarket.com/pages/contact ／ https://ginza.doverstreetmarket.com/pages/floorguide | 銀座6-9-5西館；樓層指南支持CDG／sacai／Supreme等各自品牌，非同公司／支線關係。款式與尺寸不保證現貨 |
| UNIQLO 銀座 | https://map.uniqlo.com/jp/ja/detail/10101397 ／ https://www.fastretailing.com/employment/ja/uniqlo/jp/lp/ginza/ | 銀座6-9-5東館1–12F；不可與DSM西館混淆；不宣稱日本較便宜 |
| 無印良品 銀座 | https://www.muji.com/jp/ja/shop/detail/046604 | 銀座3-3-5；現行商品類別列紳士、婦人服與MUJI Labo。本導覽只介紹服飾 |
| ATON AOYAMA | https://aton-tokyo.com/pages/store-stockist | 北青山3-6-27；官方列週一休息（國定假日除外），出發當日仍另查 |
| Nike Harajuku | https://www.nike.com/jp/retail/s/nike-harajuku | **現行神宮前1-13-14 原宿Quest1F**。舊招聘資料與舊部落格1-13-12未沿用；現行品牌門市頁優先 |
| Patagonia 東京・澀谷 | https://www.patagonia.jp/patagonia-shibuya-japan/store_924604555.html ／ https://www.patagonia.jp/store-locator/ | 神宮前6-16-8；官方門市與店表，非額外收費的地圖或資料API |

## 主張與圖片界線

- 差別、先看什麼、街區分組屬編輯建議，不是人氣排名、價格最低保證或親自逛店心得。
- 代表單品沿用已核實的具名圖片、款式、日期與樣本價格，不宣稱所有分店現貨。
- 穿搭沿用已有來源的男女方向；無對應性別圖時顯示整理中，不挪用另一性別照片。
- LP採AURALEE男裝、CLANE女裝的既有官方照片；各有可見來源與性別標示。屬風格示例，不是銷量／熱門排名或商業置入。
- Graphpaper直營店存在可由官方stockist核對，但本次未補成具體地址門市資料；不拿搜尋印象補上未核對地址。

## 配對修正

原問題為預設 `starter`，原宿三店經男裝篩選只剩二家。本次預設 `all`，包括無district參數的既有直連。只有使用者主動選「只看入門建議」才縮小；該選擇會明確寫入網址，重新整理及歷史導覽可還原。城市入口直接定位結果，街區縮小選項保留。
