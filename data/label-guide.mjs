import fs from 'node:fs';
const snapshot=JSON.parse(fs.readFileSync(new URL('./beams-label-index.json',import.meta.url),'utf8'));
export const labelCheckedAt=snapshot.checkedAt;
export const labelIndexSource=snapshot.source;
const names={beams:'BEAMS',beamsplus:'BEAMS PLUS',raybeams:'Ray BEAMS',beamsboy:'BEAMS BOY',maai:'MAAI',beamsf:'BEAMS F',brilla_per_il_gusto:'Brilla per il gusto',demiluxebeams:'Demi-Luxe BEAMS',effebeams:'EFFE BEAMS',bsfw:'BEAMS Selection for Women',vermeerist:'Vermeerist BEAMS',international_gallery_beams:'International Gallery BEAMS',beamsheart:'BEAMS HEART',kodomobeams:'こども BEAMS',beamsmini:'BEAMS mini',merrierbeams:'Merrier BEAMS',beamsgolf:'BEAMS GOLF',beamst:'BEAMS T',fennica:'fennica',beams_japan:'BEAMS JAPAN',calling:'Calling',beamsplanets:'BEAMS Planets',beamscouture:'BEAMS COUTURE',bjirushi_market:'B印MARKET',beamscultuart:'BEAMS CULTUART',tokyocultuart:'TOKYO CULTUART by BEAMS',beamsmangart:'BEAMS MANGART',bprbeams:'bPr BEAMS',bgallery:'B GALLERY',beamsrecords:'BEAMS RECORDS',mmts:'mmts',carolinaglaser:'CAROLINA GLASER',pilgrimsurfsupply:'Pilgrim Surf+Supply',billwallleather:'Bill Wall Leather',bming:'B:MING by BEAMS'};
// Short editorial routes into verified official concepts. No unverified price bands.
const guides={
 beams:['casual','日常男裝','想從日常 T-shirt、襯衫與休閒搭配開始。','男裝休閒主標籤。'],
 beamsplus:['casual','美式復古','喜歡美式制服、工裝和復古基本款。','以美式服裝傳統為設計基礎。'],
 beamsheart:['casual','價格較易入門','希望先看價格較容易入手的休閒衣服。','官方以較容易入手的商品定位介紹，男／女裝分款。'],
 raybeams:['women','流行女裝','想看當季女裝與基本款的混搭。','BEAMS 首個女裝標籤。'],
 beamsboy:['women','中性・工裝女裝','喜歡男裝細節、工裝和層次穿搭。','將男裝細節放進女裝；BOY 是女裝標籤。'],
 demiluxebeams:['women','俐落日常・通勤','想從乾淨基本款整理日常與通勤衣櫥。','面向女性的基本款與當季設計。'],
 effebeams:['women','講究材質與輪廓','想看較精緻的女裝輪廓和經典細節。','官方介紹為高品質女裝線。'],
 maai:['women','放鬆的城市女裝','喜歡放鬆基本款，也在意色彩與輪廓。','以 RELAX BASIC 為概念的女裝品牌。'],
 beamsf:['dress','經典男裝・正裝','想找西裝、襯衫與歐洲經典男裝方向。','BEAMS 的男裝正裝標籤。'],
 brilla_per_il_gusto:['dress','成熟・精緻男裝','想看成熟男裝與較講究的休閒搭配。','官方定位為精緻、奢華感的男裝風格。'],
 international_gallery_beams:['culture','設計師選品','想探索國內外設計師與較前衛的選品。','設計師選貨範圍；店內他牌各自保有身份。'],
 beamst:['culture','圖像 T-shirt','喜歡藝術、漫畫與圖像設計的 T-shirt。','以 T-shirt 與藝術文化合作為主。'],
 beams_japan:['culture','日本服飾與生活選物','旅行時想一起看服飾、工藝和日本生活選物。','涵蓋多種內容的日本文化企劃／選物入口。'],
 pilgrimsurfsupply:['culture','城市與自然','喜歡戶外活動，也想看城市日常搭配。','官方索引收錄的紐約選貨店；獨立完整名稱。'],
};
export const beamsLabels=snapshot.entries.map(r=>({...r,name:r.name || names[r.id] || r.jp,...(guides[r.id]?{group:guides[r.id][0],mood:guides[r.id][1],start:guides[r.id][2],concept:guides[r.id][3]}:{})}));
export const labelGroups=[
 {id:'casual',title:'日常休閒，先看這幾條。',note:'男裝日常、美式復古，或先從較容易入手的服裝開始。'},
 {id:'women',title:'女裝，依穿著方向選。',note:'流行混搭、中性工裝、通勤基本款與講究的女裝輪廓。'},
 {id:'dress',title:'想穿得正式一些。',note:'從經典正裝與成熟男裝開始看。'},
 {id:'culture',title:'設計師、圖像與生活選物。',note:'選貨、文化企劃和服裝標籤各有不同範圍。'},
];
export const familyGuides={
 beams:{title:'BEAMS 的標籤怎麼選？',summary:'PLUS、BOY、F、Ray 差在哪？按穿著方向認識主要標籤。',hint:'14 個入門選擇 · 35 項官方索引',next:'看 BEAMS 標籤指南'},
 'united-arrows':{title:'UNITED ARROWS 與同集團品牌',summary:'主品牌、BEAUTY&YOUTH 與 green label relaxing 分開看。',hint:'已整理 2 個同集團品牌',next:'看同集團品牌',suggestion:'先開啟三個完整品牌的官方入口，看自己常穿的同類上衣；用款式與價格比較。'},
 'freaks-store':{title:'FREAK’S STORE 與同公司品牌',summary:'Firsthand、Aresense 的關係，以及歷史門市資訊。',hint:'同公司 · 歷史狀態',next:'看品牌與通路',suggestion:'先確認商品品牌欄是 FREAK’S STORE 或 Firsthand，再看該品牌官方商品。Aresense 的歷史資料不當成現行店舖推薦。'},
 'urban-research':{title:'URBAN RESEARCH 的品牌與標籤',summary:'DOORS、ROSSO、KBF、ITEMS 各自有商品範圍。',hint:'4 個品牌／標籤 · 1 個面料名稱',next:'看品牌與標籤',suggestion:'從想穿的同類衣服開始，分別查看完整標籤的商品與尺寸。THOMAS MASON 出現在面料關係中。'},
 'journal-standard':{title:'JOURNAL STANDARD 的完整名稱',summary:'主品牌、relume、L’ESSAGE、J.S.Homestead 分開辨識。',hint:'已整理 3 個品牌／標籤',next:'看標籤區別',suggestion:'商品寫哪個完整標籤，就在哪個標籤的官方入口看款式；同公司關係不代表各線衣服或售價相同。'},
 nanamica:{title:'nanamica 與 PURPLE LABEL',summary:'了解合作關係，辨認兩邊的實際商品。',hint:'合作線 · 兩個獨立商品入口',next:'看合作關係',suggestion:'先看衣服完整品牌名：nanamica 自有款與 THE NORTH FACE PURPLE LABEL 合作線各有自己的商品頁。'},
 graphpaper:{title:'Graphpaper 的面料與系列名稱',summary:'THOMAS MASON、Fine Wool 是什麼？',hint:'面料／系列 · 非獨立服飾品牌',next:'看名稱怎麼讀',suggestion:'先確認成衣是 Graphpaper，再看面料名稱與具體系列。用材質、剪裁和每款尺寸比較。'},
};
