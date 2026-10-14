export const checkedAt='2026-10-14';
export const styles=[
 {id:'city',name:'City Boy',zh:'城市日常',note:'鬆弛輪廓、層次和一點美式感。',cell:5},
 {id:'minimal',name:'Clean & Minimal',zh:'簡約質感',note:'從剪裁、觸感和自然色調開始。',cell:1},
 {id:'outdoor',name:'Outdoor',zh:'山系與機能',note:'把戶外的實用細節帶進日常。',cell:2},
 {id:'feminine',name:'City Girl',zh:'柔美城市感',note:'讓柔和線條與俐落單品一起出現。',cell:3}
];
export const brands=[
 {
 id:'beams',fti:'beams',name:'BEAMS',jp:'ビームス',aliases:['比姆斯','beams japan'],styles:['city','outdoor'],audience:['men','women'],type:'選貨店／自有品牌',cell:5,accent:'orange',
 tagline:'把日常穿得有自己的節奏。',
 intro:'從休閒服飾到設計師選品，BEAMS 是認識日本選貨店文化的入口。同一個品牌名稱下有不同標籤與店型；想找輕鬆美式感、層次搭配或城市日常，可以先看 BEAMS，再依女裝、工裝等方向細分。',
 why:'適合想先看多種穿搭、還在建立自己風格的人。編輯把它放在 City Boy 與戶外混搭入口，這是探索建議，不是品牌所有商品的固定分類。',
 look:['寬鬆 T-shirt 與襯衫層次','卡其褲、丹寧與輕便外套','逛不同標籤，比較風格與價位'],
 shopping:'先用官方店舖索引找原宿、澀谷或新宿，再確認該店販售的標籤。BEAMS 是選貨店，也販售海外品牌；購物時看商品品牌欄，能分清自有商品與選品。',
 official:'https://www.beams.co.jp/',shop:'https://www.beams.co.jp/shop/',newIn:'https://www.beams.co.jp/',
 samples:[
 {name:'BEAMS ロゴ Tシャツ ①',price:5170,category:'tops',note:'Logo T-shirt／含稅',url:'https://www.beams.co.jp/item/beams/t-shirt/11081083591/'},
 {name:'Technical T-Shirt（吸水速乾）',price:13200,category:'tops',note:'機能 T-shirt／含稅',url:'https://www.beams.co.jp/item/beams/t-shirt/11041337458/?color=21'}
 ],
 similar:[{id:'united-arrows',reason:'同樣從選貨店開始探索；可以比較休閒與較俐落的穿搭。'},{id:'snow-peak',reason:'喜歡 BEAMS 的戶外混搭，可以延伸看 Snow Peak 的服飾線。'}],
 sources:[{label:'官方商品與標籤',url:'https://www.beams.co.jp/'},{label:'官方日本店舖索引',url:'https://www.beams.co.jp/shop/'}]
 },
 {
 id:'united-arrows',fti:'united-arrows',name:'UNITED ARROWS',jp:'ユナイテッドアローズ',aliases:['UA','聯合箭牌'],styles:['minimal','city'],audience:['men','women'],type:'選貨店／自有品牌',cell:1,accent:'olive',
 tagline:'把俐落與日常，放在同一個衣櫥。',
 intro:'UNITED ARROWS 既有自有服飾，也有品牌選品。想探索較俐落的城市穿搭，可從襯衫、針織和褲裝開始看。集團下的 BEAUTY&YOUTH、green label relaxing 等有自己的定位，查價和逛店時要留意完整標籤名稱。',
 why:'適合喜歡簡潔色彩，想把日常與通勤衣櫥連起來的人。先挑用途相近的單品比較，會比只看品牌名稱更容易理解差異。',
 look:['襯衫與直筒褲的比例','質感針織與俐落外套','分清 UNITED ARROWS 與集團其他標籤'],
 shopping:'使用 UNITED ARROWS 自己的官方店舖列表，確認所在地和服務。網站中不同標籤商品會同時出現；請用店舖品牌篩選，避免把整個集團的價格當成單一品牌。',
 official:'https://store.united-arrows.co.jp/brand/ua/',shop:'https://store.united-arrows.co.jp/brand/ua/stores/',newIn:'https://store.united-arrows.co.jp/brand/ua/',
 samples:[
 {name:'ボートネックTシャツ',price:8800,category:'tops',note:'官方專題列價／含稅；庫存請見官網',url:'https://store.united-arrows.co.jp/s/all/focuson/items/3/'},
 {name:'コットンＴシャツ',price:9900,category:'tops',note:'官方專題價格樣本；以商品頁為準',url:'https://store.united-arrows.co.jp/ua_columns/all/feature/new_in/items60'}
 ],
 similar:[{id:'beams',reason:'同為選貨店，適合比較品牌組合與日常搭配方向。'},{id:'auralee',reason:'若更在意簡潔單品的材質，可延伸看獨立設計品牌 AURALEE。'}],
 sources:[{label:'官方 UNITED ARROWS 品牌頁',url:'https://store.united-arrows.co.jp/brand/ua/'},{label:'官方日本店舖列表',url:'https://store.united-arrows.co.jp/brand/ua/stores/'}]
 },
 {
 id:'snow-peak',fti:'snow-peak',name:'Snow Peak Apparel',jp:'スノーピーク アパレル',aliases:['Snow Peak','雪峰','雪諾必克'],styles:['outdoor','city'],audience:['men','women'],type:'戶外服飾',cell:2,accent:'forest',
 tagline:'從露營場景，走進每天的生活。',
 intro:'Snow Peak 同時經營戶外裝備與服飾。這裡聚焦 Apparel：從棉質上衣到具戶外細節的服裝，提供山系混搭的另一種入口。逛官方商店時，先切換至服飾分類，可避免被大量露營裝備分散注意。',
 why:'適合喜歡戶外感，也想把單品放進城市衣櫥的人。選衣服仍要看每款素材與設計，不能因為戶外品牌就推定所有服裝都有防水或其他機能。',
 look:['日常圖案 T-shirt','機能與保暖層次','服飾分類和露營裝備分開看'],
 shopping:'官方日本線上商店有獨立服飾分類與門市查詢。不同門市可能以裝備或服飾為主，旅行前確認該店的服飾品項。',
 official:'https://ec.snowpeak.co.jp/',shop:'https://ec.snowpeak.co.jp/real-store-search',newIn:'https://ec.snowpeak.co.jp/',
 samples:[
 {name:'2 Days Camping Pack Tee Set',price:6600,category:'tops',note:'兩件 T-shirt 套組／含稅；非單件價格',url:'https://ec.snowpeak.co.jp/item/SNP0126A3420?clr_id=101'},
 {name:'PIGMENT DYE LETTER SWEATSHIRT',price:14960,category:'tops',note:'官網新到服飾列價／含稅',url:'https://ec.snowpeak.co.jp/'}
 ],
 scope:'搜尋詞「スノーピーク」涵蓋整個品牌，可能包含露營裝備，不能解讀成服飾線的單獨熱度。',
 similar:[{id:'beams',reason:'想把戶外單品搭進城市日常，可比較 BEAMS 的休閒與選品。'},{id:'auralee',reason:'若更在意低調色彩和材質，可比較 AURALEE；它不是戶外機能品牌。'}],
 sources:[{label:'官方日本線上商店',url:'https://ec.snowpeak.co.jp/'},{label:'官方日本門市查詢',url:'https://ec.snowpeak.co.jp/real-store-search'}]
 },
 {
 id:'auralee',fti:null,name:'AURALEE',jp:'オーラリー',aliases:['Auralee'],styles:['minimal'],audience:['men','women'],type:'設計師品牌',cell:1,accent:'stone',
 tagline:'越簡單，越看得見材質。',
 intro:'AURALEE 的官方網站以系列造型與材質故事呈現衣服。想探索低調、重視觸感的穿搭，可以從 T-shirt、針織和褲裝觀察。它與選貨店的探索方式不同：適合沿著同一季系列，看顏色、面料和輪廓如何一起出現。',
 why:'適合願意花時間比較觸感、垂墜與輪廓的人。若預算有限，可以先從一件常穿的上衣開始，確認實際尺碼與保養方式。',
 look:['棉質與羊毛上衣的觸感','自然色調與寬鬆比例','同一系列的材質與造型故事'],
 shopping:'官方店舖頁列有南青山 AURALEE TOKYO，以及伊勢丹新宿男裝館與女裝館等據點。先查該店的男／女裝範圍和營業資訊，再安排旅程。',
 official:'https://auralee.jp/',shop:'https://auralee.jp/store',newIn:'https://auralee.jp/item?category_id=507',
 samples:[
 {name:'LUSTER PLAITING L/S TEE',price:19800,category:'tops',note:'日本地區選項顯示／含稅',url:'https://auralee.jp/item/detail/1_1_A00P01GT_1/2005'},
 {name:'SMOOTH SOFT SWEAT P/O',price:38500,category:'tops',note:'日本地區選項顯示／含稅',url:'https://auralee.jp/item/detail/1_1_A26AP02TU_1/1904'}
 ],
 similar:[{id:'united-arrows',reason:'喜歡簡潔城市穿搭，可比較選貨店較多元的商品組合。'},{id:'beams',reason:'想找更休閒的搭配素材，可從 BEAMS 的日常服飾延伸探索。'}],
 sources:[{label:'官方系列與材質故事',url:'https://auralee.jp/'},{label:'官方日本店舖列表',url:'https://auralee.jp/store'}]
 },
 {
 id:'snidel',fti:null,name:'SNIDEL',jp:'スナイデル',aliases:['Snidel','斯奈德'],styles:['feminine'],audience:['women'],type:'女裝品牌',cell:3,accent:'rose',
 tagline:'柔美線條，也可以很有城市感。',
 intro:'SNIDEL 的官方品牌定位結合街頭與正式感。探索時可以觀察針織、裙裝和洋裝的比例，用一件有細節的單品搭配簡潔配件。這裡以柔美城市穿搭作為入口，實際商品仍有不同造型方向。',
 why:'適合喜歡柔和線條，也想保留日常搭配彈性的人。網購前要看尺寸表、材質與保養資訊；有設計細節的單品，實穿輪廓比只看商品名更重要。',
 look:['帶垂墜細節的針織上衣','裙裝與簡潔配件的比例','同款不同顏色的搭配效果'],
 shopping:'可從日本 USAGI ONLINE 的 SNIDEL 專區與三井 &mall 的品牌店查看商品。官網可能依所在地切換市場；日本價格請以日本通路顯示的日圓價格為準。',
 official:'https://snidel.com/',shop:'https://usagi-online.com/brand/snidel/',newIn:'https://usagi-online.com/brand/snidel/',
 samples:[
 {name:'ドレープギャザーニットプルオーバー',price:9900,category:'tops',note:'三井 &mall SNIDEL 品牌店／含稅；以現況為準',url:'https://mitsui-shopping-park.com/ec/p/1620000009218'}
 ],
 similar:[{id:'united-arrows',reason:'想比較更簡潔的女裝與通勤方向，可以看 UNITED ARROWS。'}],
 sources:[{label:'官方品牌定位',url:'https://snidel.us/'},{label:'日本 USAGI ONLINE SNIDEL 專區',url:'https://usagi-online.com/brand/snidel/'}]
 },
 {
      id: 'freaks-store',
      name: "FREAK'S STORE",
      jp: 'フリークスストア',
      sublines: ['FREAK\'S STORE (主線/美式休閒)', 'Firsthand (永續時尚選貨店)', 'Aresense (女性質感高階支線)'],
      fitAdvice: '偏大寬鬆型（Oversized）落肩美式工裝風格，建議按正常尺碼選購即有寬鬆廓形感。'
 },
 {
      id: 'urban-research',
      name: 'URBAN RESEARCH',
      jp: 'アーバンリサーチ',
      sublines: ['URBAN RESEARCH (主線/都市簡約)', 'URBAN RESEARCH DOORS (生活休閒)', 'URBAN RESEARCH ROSSO (成熟品味女裝)', 'KBF (前衛設計女裝)', 'ITEMS (平價基本款)'],
      fitAdvice: '標準日系剪裁，符合亞洲身形，肩寬與袖長適中；若偏好層次感可選擇大一號。'
 },
 {
      id: 'journal-standard',
      name: 'JOURNAL STANDARD',
      jp: 'ジーナルスタンダード',
      sublines: ['JOURNAL STANDARD (主線/式復古工裝)', 'JOURNAL STANDARD relume (日常親民風格)', 'JOURNAL STANDARD L\'ESSAGE (高質感女裝)', 'JS HOMESTEAD (復古軍工裝)'],
      fitAdvice: '經典美式復古與工裝剪裁，布料挺括，略帶寬鬆度，按正常尺寸選擇即可。'
 },
 {
      id: 'mont-bell',
      name: 'mont-bell',
      jp: 'モンベル',
      sublines: ['mont-bell (主線/戶外機能)', 'Exclusive Line (日本限定城市機能)'],
      fitAdvice: '戶外活動標準版型，剪裁貼合俐落；若打算內搭厚實衣物建議選擇大一號。'
 },
 {
      id: 'daiwa-pier39',
      name: 'DAIWA PIER39',
      jp: 'ダイワ ピア39',
      sublines: ['DAIWA PIER39 (都市釣魚與戶外街頭機能)'],
      fitAdvice: '極致寬鬆 Oversized 版型，豐富機能口袋設計，建議可小一號或按正常尺寸穿出鬆弛廓形。'
 },
 {
      id: 'nanamica',
      name: 'nanamica',
      jp: 'ナナミカ',
      sublines: ['nanamica (主線/GORE-TEX 都市機能)', 'THE NORTH FACE PURPLE LABEL (日本限定紫標)'],
      fitAdvice: '寬鬆立體剪裁，極簡質感版型偏大且胸寬與衣長充裕，建議選擇正常或偏小尺寸。'
 },
 {
      id: 'graphpaper',
      name: 'Graphpaper',
      jp: 'グラフペーパー',
      sublines: ['Graphpaper (主線/極簡建感廓形)', 'Graphpaper Fine Wool / Thomas Mason 聯名系列'],
      fitAdvice: '標誌性 One-Size 微寬鬆無性別剪裁，垂墜感佳，適合各種身形展現極簡風格。'
 },
 {
      id: 'mila-owen',
      name: 'Mila Owen',
      jp: 'ミラ オーウェ',
      sublines: ['Mila Owen (主線/NEXT BASIC 都市女裝)'],
      fitAdvice: '為現代性打造，剪裁立體顯瘦，符合亞洲女性身形比例，建議購正常女裝尺寸。'
 },
 {
      id: 'clane',
      name: 'CLANE',
      jp: 'クラネ',
      sublines: ['CLANE (松本惠奈主理/ORIGINAL STANDARD 女性現代選品)', 'CLANE HOMME (男裝系列)'],
      fitAdvice: '獨特立體剪裁與設計感線條，落肩廓形具結構感，正常尺寸穿著即具時尚高級感。'
 }
];

export const releases=[
 {brand:'snow-peak',name:'2 Days Camping Pack Tee Set',date:'2026-10-03T10:00:00+09:00',dateLabel:'2026.10.03 · 10:00 JST',type:'官方公布發售日',note:'雪峰祭 2026 秋的兩件 T-shirt 套組。已到官方公布日期，庫存與販售狀態請看商品頁。',url:'https://ec.snowpeak.co.jp/item/SNP0126A3420?clr_id=101',price:6600},
 {brand:'auralee',name:'AURALEE Coming Soon',date:null,dateLabel:'日期未公布',type:'官方新品入口',note:'官方系列有 Coming Soon 區域；沒有確認到具體日期的品項，保留日期未公布標示。',url:'https://auralee.jp/',price:null}
];

export const articles=[
 {slug:'find-your-first-brand',title:'用日常場景，找到第一個日本品牌',eyebrow:'STYLE NOTES',intro:'先想想你每天怎麼穿，再把品牌放進來。',cell:5,readTime:'約 3 分鐘',
 sections:[
 ['從每天要去的地方開始','通勤、散步、旅行和週末聚會，對衣服的需求各不相同。選一個最常出現的場景，再挑你喜歡的輪廓與顏色，比一次追很多風格更容易找到真正會穿的單品。'],
 ['喜歡寬鬆與層次，從城市日常看起','City Boy 在本站是探索標籤：鬆弛輪廓、層次和日常混搭。可以先看 BEAMS；如果喜歡戶外細節，再看 Snow Peak Apparel。兩者的商品組合不同，進入品牌頁可查代表單品和官方來源。'],
 ['喜歡簡單，留意觸感與比例','從 UNITED ARROWS 的城市穿搭或 AURALEE 的材質故事開始，看看同樣是上衣，如何因面料、寬度和長度而改變感覺。實際價格和保養方法要以單品頁為準。'],
 ['把預算放在一件真的會穿的衣服上','本站預算篩選依據已查核的商品樣本。一件 T-shirt 的價位不能代表整個品牌；用篩選找到入口後，再去官方網站看你真正想買的商品。SNIDEL 的針織上衣和 Snow Peak 的兩件套組，也不能直接當成同類單件價格比較。']
 ],brands:['beams','united-arrows','snow-peak','auralee','snidel']},
 {slug:'japan-shopping-checklist',title:'出發前，把日本購物清單整理好',eyebrow:'JAPAN SHOPPING',intro:'品牌、店型、尺碼與預算，四件事讓逛街更從容。',cell:2,readTime:'約 3 分鐘',
 sections:[
 ['先挑 3 個真正想看的品牌','從品牌頁記下你想試穿的單品、日文名稱和官方店舖入口。把選貨店和獨立品牌都放入清單，能看到不同的商品組合；不要只憑搜尋熱度決定去哪裡。'],
 ['官方店舖列表，是路線規劃的起點','BEAMS 官方索引列有原宿、澀谷、新宿等區域；AURALEE 店舖頁列有南青山與伊勢丹新宿據點。點開官方店舖頁確認實際位置、販售標籤和營業資訊，再在你慣用的地圖安排路線。'],
 ['逛同一家公司，也要看完整標籤','UNITED ARROWS 集團中的不同標籤定位並不相同；Snow Peak 商店也可能偏重裝備或服飾。旅行前確認你要看的商品在哪個店型，會比單純搜尋公司名稱更有用。'],
 ['用日圓原價記錄預算','先比較含稅標價、商品內容和材質，再另外考慮實際換匯、運費及購買條件。本站價格是查核當日樣本，並不保證抵達店舖時的售價或庫存。退稅或跨境配送等資訊，購買當下再向店舖確認。']
 ],brands:['beams','united-arrows','auralee','snow-peak']}
];
