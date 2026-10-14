// TOKI V6 All-in-One 完整建置腳本 (scripts/build.mjs) — 88 大品牌百科全書版
// 全選複製此程式碼，貼上覆蓋 GitHub 的 scripts/build.mjs 並按 Commit changes 即可完成部署！
import fs from 'node:fs';
import path from 'node:path';

const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const yen = n => '¥' + Number(n).toLocaleString('en-US');
const twd = n => '約 NT$' + Math.round(n * 0.215).toLocaleString('en-US');
const root = process.cwd(), out = path.join(root, 'dist');

// 內建單品與穿搭 SVG 視覺引擎（100% 符合 vercel.json CSP img-src 'self' data: 規範，零外部圖片被擋問題）
function drawGarment(type, c1='#3a4a5e', c2='#e8e4dc') {
  const g = {
    shirt: `<path d="M26,12 L54,12 L68,28 L58,37 L51,25 L51,66 L29,66 L29,25 L22,37 L12,28 Z" fill="${c1}" stroke="#222" stroke-width="2"/><path d="M33,12 L40,23 L47,12" fill="#fff" stroke="#222" stroke-width="1.8"/><line x1="40" y1="23" x2="40" y2="66" stroke="#fff" stroke-width="1.5"/>`,
    coat: `<path d="M26,10 L54,10 L66,30 L56,36 L51,22 L55,70 L25,70 L29,22 L24,36 L14,30 Z" fill="${c1}" stroke="#222" stroke-width="2"/><path d="M33,10 L40,26 L47,10" fill="${c2}" stroke="#222" stroke-width="1.8"/><line x1="40" y1="26" x2="40" y2="70" stroke="#222" stroke-width="1.5"/>`,
    jacket: `<path d="M26,12 L54,12 L68,28 L58,36 L52,24 L52,64 L28,64 L28,24 L22,36 L12,28 Z" fill="${c1}" stroke="#222" stroke-width="2"/><line x1="40" y1="12" x2="40" y2="64" stroke="${c2}" stroke-width="2"/><rect x="31" y="38" width="7" height="9" fill="none" stroke="${c2}" stroke-width="1.4"/><rect x="42" y="38" width="7" height="9" fill="none" stroke="${c2}" stroke-width="1.4"/>`,
    tee: `<path d="M24,15 L56,15 L68,29 L58,38 L52,28 L52,65 L28,65 L28,28 L22,38 L12,29 Z" fill="${c1}" stroke="#222" stroke-width="2"/><circle cx="40" cy="36" r="7" fill="${c2}"/>`,
    pants: `<path d="M26,11 L54,11 L60,69 L43,69 L40,30 L37,69 L20,69 Z" fill="${c1}" stroke="#222" stroke-width="2"/><line x1="26" y1="17" x2="54" y2="17" stroke="${c2}" stroke-width="1.5"/>`,
    cargo: `<path d="M25,11 L55,11 L61,69 L43,69 L40,30 L37,69 L19,69 Z" fill="${c1}" stroke="#222" stroke-width="2"/><rect x="20" y="34" width="8" height="12" fill="${c2}" stroke="#222" stroke-width="1.4"/><rect x="52" y="34" width="8" height="12" fill="${c2}" stroke="#222" stroke-width="1.4"/>`,
    dress: `<path d="M30,11 L50,11 L47,27 L63,69 L17,69 L33,27 Z" fill="${c1}" stroke="#222" stroke-width="2"/><line x1="32" y1="27" x2="48" y2="27" stroke="${c2}" stroke-width="2"/>`,
    skirt: `<path d="M28,16 L52,16 L62,66 L18,66 Z" fill="${c1}" stroke="#222" stroke-width="2"/><line x1="35" y1="16" x2="31" y2="66" stroke="${c2}" stroke-width="1.2"/><line x1="45" y1="16" x2="49" y2="66" stroke="${c2}" stroke-width="1.2"/>`,
    shoe: `<path d="M12,50 L32,34 L54,40 L68,50 L68,60 L12,60 Z" fill="${c1}" stroke="#222" stroke-width="2"/><rect x="12" y="55" width="56" height="6" fill="#fff" stroke="#222" stroke-width="1.5"/><line x1="28" y1="42" x2="46" y2="55" stroke="${c2}" stroke-width="3"/>`,
    bag: `<path d="M30,24 C30,11 50,11 50,24" fill="none" stroke="#222" stroke-width="2.5"/><rect x="19" y="24" width="42" height="38" rx="6" fill="${c1}" stroke="#222" stroke-width="2"/><rect x="26" y="34" width="12" height="14" fill="${c2}" stroke="#222" stroke-width="1.4"/>`
  };
  return g[type] || g.jacket;
}

const itemThumbSvg = (type, c1='#3a4a5e', c2='#f0ede6') => `<svg class="item-photo-thumb" viewBox="0 0 80 80" role="img" aria-label="單品圖示"><rect width="80" height="80" rx="8" fill="#f4f1ea"/>${drawGarment(type, c1, c2)}</svg>`;

// 8 大日本穿搭風格公式（內建三件式穿搭組合視覺圖鑑）
const styles = [
  {id:'city', gender:'men,women', name:'City Boy 寬鬆日常', zh:'POPEYE 美式休閒混搭', bg:'#ebe4d6', parts:[['shirt','#6b8cae','#fff','① 寬版牛津襯衫'],['pants','#c9b694','#fff','② 打褶寬卡其褲'],['shoe','#8c9298','#fff','③ 復古灰慢跑鞋']], items:['寬版牛津襯衫','重磅白Tee','打褶寬卡其褲','復古慢跑鞋'], note:'以大一號 Polo / BEAMS 牛津襯衫疊穿重磅白 Tee，下身搭寬版卡其褲與復古灰慢跑鞋，乾淨不費力。', brands:'BEAMS · Ralph Lauren · FREAK’S STORE · UNIQLO'},
  {id:'minimal', gender:'men,women', name:'Clean & Minimal 極簡', zh:'南青山高級面料剪裁', bg:'#e6e3dc', parts:[['coat','#b8afa1','#222','① 落肩長版大衣'],['shirt','#f5f5f0','#222','② 埃及棉寬襯衫'],['pants','#2e302d','#888','③ 立體打褶寬褲']], items:['落肩長版大衣','埃及棉寬襯衫','立體打褶寬褲','分趾鞋/德比鞋'], note:'全身零大 Logo，靠頂級長絨棉、尾州羊毛光澤與 SHINYAKOZUKA / AURALEE 的立體寬褲輪廓決勝。', brands:'AURALEE · COMOLI · SHINYAKOZUKA · COS · PLST'},
  {id:'outdoor', gender:'men,women', name:'UL & Gorpcore 山系機能', zh:'超輕量登山與都市防水', bg:'#dde4dc', parts:[['jacket','#2f4f3e','#d8e2dc','① 水沢羽絨/硬殼衣'],['cargo','#4a5240','#b5bfa1','② 山と道 5口袋褲'],['shoe','#2b2d2f','#ff7900','③ 越野防水鞋']], items:['防水硬殼/水沢羽絨','UL 超輕量襯衫','5-Pocket 機能褲','Salomon 越野鞋'], note:'從「山と道」超輕量登山褲、Goldwin 與 DESCENTE 水沢羽絨到 mont-bell，兼具極致機能與都市剪裁。', brands:'山と道 · Goldwin · DESCENTE · mont-bell · TEATORA'},
  {id:'street', gender:'men', name:'Ura-Harajuku 裏原宿軍工', zh:'重磅街頭與六袋軍褲', bg:'#e4dfd5', parts:[['jacket','#b57c3c','#222','① 底特律工裝夾克'],['tee','#ffffff','#c8102e','② 重磅竹節棉T'],['cargo','#3b4432','#6b755e','③ 六袋軍裝長褲']], items:['底特律工裝外套','重磅圖案短Tee','六袋軍裝長褲','復古滑板鞋'], note:'東京裏原宿與中目黑街頭公式：水洗工裝夾克或夏威夷衫，搭配 WTAPS 六袋軍褲與重磅短 Tee。', brands:'HUMAN MADE · WTAPS · WACKO MARIA · Supreme · #FR2'},
  {id:'denim', gender:'men,women', name:'Amekaji 岡山丹寧職人', zh:'赤耳原牛與刺子藍染', bg:'#dce2ea', parts:[['jacket','#1e324a','#e0a96d','① 岡山丹寧夾克'],['shirt','#3c5a78','#fff','② 劍道刺子藍染衫'],['pants','#162538','#d99b26','③ 14oz 赤耳原牛']], items:['岡山赤耳丹寧夾克','藍染刺子外套','14oz 原色牛仔褲','手工皮革靴'], note:'以岡山兒島赤耳丹寧（KAPITAL / 桃太郎）與 Porter Classic 刺し子藍染為核心，越穿越有色落靈魂。', brands:'KAPITAL · 桃太郎ジーンズ · Porter Classic · visvim · Levi’s JP'},
  {id:'ivy', gender:'men,women', name:'Japanese Ivy 美式學院', zh:'金釦西外與常春藤混搭', bg:'#e2dfd9', parts:[['coat','#1b2a4a','#d4af37','① 海軍藍金釦西外'],['shirt','#d8e4f0','#fff','② 小馬/條紋牛津衫'],['pants','#8c7a6b','#fff','③ 九分打褶西褲']], items:['海軍藍金釦西外','小馬牛津襯衫','九分打褶卡其褲','復古樂福鞋'], note:'日本選貨店最推崇的常春藤學院風（Trad/Ivy）：金釦西外混搭 Polo Ralph Lauren、Tommy 與 Brooks Brothers。', brands:'Ralph Lauren · Brooks Brothers · Tommy · UA · SHIPS'},
  {id:'feminine', gender:'women', name:'Otona-Kawaii 日雜顯瘦女裝', zh:'高腰魚尾裙與約會洋裝', bg:'#f2e6e8', parts:[['dress','#e8ccd1','#5e3a43','① 高腰顯瘦長洋裝'],['shirt','#faf5f6','#5e3a43','② 立體澎袖針織'],['skirt','#4a353b','#e8ccd1','③ 高腰修身魚尾裙']], items:['高腰抓皺長洋裝','立體澎袖針織','顯瘦高腰魚尾裙','方頭低跟短靴'], note:'專為亞洲女生比例設計：利用高腰線剪裁、微露鎖骨澎袖針織與魚尾裙擺，視覺拉長雙腿、溫柔顯瘦。', brands:'SNIDEL · Mila Owen · Lily Brown · Deuxième Classe'},
  {id:'mode', gender:'women', name:'Mode & Avant-Garde 前衛層次', zh:'解構百褶與時髦剪裁', bg:'#e5e2de', parts:[['coat','#222222','#888','① 異材質拼接外套'],['dress','#6e655f','#fff','② 3D編織/立體洋裝'],['pants','#1a1a1a','#666','③ 皺褶/喇叭神褲']], items:['異材質百褶外套','3D立體輪廓上衣','高腰顯瘦喇叭褲','金屬釦分趾鞋'], note:'從 sacai、三宅一生、山本耀司、CFCL 到 CLANE 與 Ameri VINTAGE，以立體剪裁與異材質拼接穿出東京氣場。', brands:'sacai · 三宅一生 · 山本耀司 · CFCL · CLANE · Ameri'}
];

function styleLookbookSvg(s) {
  return `<svg class="style-lookbook-svg" viewBox="0 0 600 210" role="img" aria-label="${e(s.name)} 穿搭單品圖鑑"><rect width="600" height="210" fill="${s.bg}"/>${s.parts.map((p, idx) => `<g transform="translate(${18 + idx*192}, 14)"><rect width="180" height="182" rx="10" fill="#fff" opacity=".9" stroke="#d5cfc2" stroke-width="1.5"/><g transform="translate(50, 10) scale(1.02)">${drawGarment(p[0], p[1], p[2])}</g><text x="90" y="122" text-anchor="middle" fill="#111" font-size="13" font-weight="800">${e(p[3])}</text><text x="90" y="143" text-anchor="middle" fill="#666" font-size="11">${e(s.items[idx] || '')}</text><rect x="35" y="155" width="110" height="12" rx="6" fill="${p[1]}" opacity=".22"/></g>`).join('')}</svg>`;
}

// 6 大日本城市（預設第 1 個為東京 Tokyo）
const cities = [
  {id:'tokyo', name:'東京 Tokyo', tag:'預設首選・旗艦店最齊全', summary:'東京是全品牌大本營！買潮牌、戶外與表參道國際旗艦店（Ralph Lauren / Goldwin / Salomon）去「原宿・表參道・澀谷」；買日本小眾設計（SHINYAKOZUKA / AURALEE / COMOLI / DESCENTE / 1LDK）去「南青山・代官山・中目黑」；百貨一次退稅買齊去「新宿 LUMINE / 伊勢丹與丸之內」。', zones:[['① 原宿・表參道・澀谷神南','Ralph Lauren 表參道、Goldwin 原宿、BEAMS、HUMAN MADE、WTAPS、Salomon、Supreme。'],['② 南青山・代官山・中目黑','DESCENTE 代官山、AURALEE、COMOLI、SHINYAKOZUKA、1LDK、visvim、WACKO MARIA。'],['③ 新宿 LUMINE / 伊勢丹 / 丸之內','伊勢丹男裝館（小眾神牌最齊）、新宿 LUMINE 1/2（女裝選貨）、丸之內（Goldwin / DESCENTE / 12層 UNIQLO）。']]},
  {id:'fukuoka', name:'福岡 Fukuoka', tag:'九州首選・天神大名超集中', summary:'徒步 15 分鐘走完「大名街區潮牌機能路面店」與「天神四大百貨（福岡 PARCO / 岩田屋 / VIORO / SOLARIA）」，搭地鐵 5 分鐘達「博多站 AMU PLAZA 與 LaLaport」。', zones:[['① 大名・今泉・赤坂路面街區','DESCENTE 福岡、HUMAN MADE、WTAPS、Supreme、nanamica、KAPITAL、BIOTOP、mont-bell。'],['② 天神百貨群 (PARCO/岩田屋/VIORO)','福岡 PARCO 與 VIORO 聚集 BEAMS、UA、SNIDEL；岩田屋有 sacai、三宅一生、Margiela、CLANE。'],['③ 博多站 AMU PLAZA & LaLaport','AMU PLAZA 有 TOMORROWLAND、PLST、SHIPS、Snow Peak；LaLaport 有大型 UNIQLO、GU。']]},
  {id:'osaka', name:'大阪 Osaka', tag:'關西核心・梅田與橘街', summary:'北區鎖定「梅田三大百貨（LUCUA 1100 / GRAND FRONT / 阪急）」，南區鎖定「心齋橋 PARCO 與南船場・堀江（Orange Street 橘街）」。', zones:[['① 梅田 GRAND FRONT / LUCUA / 阪急','GRAND FRONT 有 DESCENTE、Goldwin、mont-bell、nanamica；LUCUA 與阪急聚集所有選貨與設計師牌。'],['② 南船場・堀江 Orange Street','HUMAN MADE、WTAPS、Supreme、Carhartt WIP、KAPITAL、BIOTOP 大阪路面店。'],['③ 心齋橋 PARCO / 御堂筋','心齋橋 PARCO（Ground Y / Kolor / Porter）與御堂筋國際名牌街，退稅超集中。']]},
  {id:'kyoto', name:'京都 Kyoto', tag:'町家別注・山と道/Goldwin京都', summary:'集中在「四條河原町（藤井大丸 / 京都 BAL）」與「烏丸御池（新風館）」，周邊還有「山と道 KYOTO」、「Goldwin 京都」與「nanamica 京都」町家直營店！', zones:[['① 四條河原町・藤井大丸・京都 BAL','藤井大丸（DESCENTE / Needles / 各大選貨）與京都 BAL（TOMORROWLAND / Bshop / MHL.）。'],['② 烏丸御池・六角通・富小路町家群','Goldwin 京都町家店、nanamica 京都、Graphpaper 京都、PORTER KYOTO、新風館（BEAMS / 小狐狸）。'],['③ 下京區・山と道 KYOTO','「山と道 KYOTO」直營店（京都少數能現場試穿 5-Pocket Pants 與背包的聖地）！']]},
  {id:'sapporo', name:'札幌 Sapporo', tag:'防寒機能・札站大通連通', summary:'從「札幌站 STELLAR PLACE / 大丸」走地下街到「大通 PARCO」，DESCENTE 水沢羽絨、Goldwin、mont-bell 等頂級防寒裝備一次買齊。', zones:[['① 札幌站 STELLAR PLACE / 大丸','聚集 Goldwin、DESCENTE、BEAMS、FREAK\'S STORE、UA、TOMORROWLAND、PLST、SNIDEL。'],['② 大通札幌 PARCO','有 HUMAN MADE 札幌、三宅一生、川久保玲、鬼塚虎、Ground Y。'],['③ 戶外旗艦專區','mont-bell 札幌赤煉瓦店、Patagonia 與 NANGA 經銷專櫃防寒裝備最齊。']]},
  {id:'nagoya', name:'名古屋 Nagoya', tag:'中部核心・榮與名站商圈', summary:'集中在「榮 Sakae（名古屋 PARCO / LACHIC / 松坂屋）」與「名古屋站（高島屋 Gate Tower）」。', zones:[['① 榮 Sakae：PARCO & LACHIC','名古屋 PARCO（小眾與女裝最齊）與 LACHIC（DESCENTE、UA、BEAMS、TOMORROWLAND、Bshop）。'],['② 名古屋站：高島屋 Gate Tower','出站直達，PLST、Theory、Polo Ralph Lauren、各大選貨店齊全。'],['③ 矢場町路面街區','WTAPS、Carhartt WIP、KAPITAL、1LDK annex 等潮流買手名店集中於矢場町。']]}
];

const TIER_META = {
  mass: ['🇯🇵 國民平價與迅銷','平價高CP值'],
  select: ['🇯🇵 日本代表選貨店','人氣選貨與買手店'],
  outdoor: ['⛰️ 日本頂級山系機能','UL登山與都市機能'],
  niche: ['🎨 日本小眾與設計師','極簡・解構・前衛時裝'],
  street: ['🛹 裏原宿・丹寧・鞋包','街頭潮牌與職人丹寧'],
  global: ['🌍 國際品牌日本買','別注限定與匯率價差'],
  women: ['👗 日本人氣女裝','日雜顯瘦與時髦女裝']
};

// 88 大品牌組完整資料庫（涵蓋 120+ 品牌：含 SHINYAKOZUKA、DESCENTE、山と道、Goldwin、Ralph Lauren、Tommy、COS、PLST 等）
const PIPE_DATA = [
  // ① 國民平價與迅銷集團 (mass)
  "uniqlo|UNIQLO|ユニクロ (:C / U 系列)|mass|city,minimal|both|99|48500|日本定價約台灣7折＋退稅，:C與U設計師聯名必掃|#c8102e|想用台灣7折入手基礎服與寬版神褲|銀座12層旗艦·原宿·新宿本店|天神Mina大型店·LaLaport·運河城|心齋橋筋·梅田LINKS大型店|四條河原町·京都站Avanti|札幌Tokyu大型店|榮旗艦店·JR Gate Tower|合身至微寬|3990|UNIQLO U 寬版降落傘褲 / 重磅T|UNIQLO :C 打褶寬褲 / 澎袖襯衫|pants|pants|www.uniqlo.com/jp/ja/",
  "gu|GU|ジーユー|mass|city,feminine|both|92|22400|Barrel Leg 錐形氣球牛仔褲日本買不到台幣五百|#0a1e5e|想用極低預算包色流行氣球寬褲與重磅帽T|澀谷店·新宿Flags·銀座店|天神Mina大型店·運河城·LaLaport|心齋橋店·梅田LINKS|四條河原町·京都站|札幌Tokyu店|名古屋Gate Tower·榮|偏寬鬆流行|2990|Heavyweight 重磅寬版連帽衫|Barrel Leg 錐形氣球牛仔寬褲|tee|pants|www.gu-global.com/jp/ja/",
  "plst|PLST|プラステ (迅銷集團高階通勤)|mass|minimal,ivy,feminine|both|78|12800|UNIQLO 高階姊妹牌！Warm Reserve 美腿西褲日本OL與上班族必買|#1e293b|覺得UNIQLO太休閒、想買修身免燙西裝褲與針織的人|東京八重洲·新宿京王·銀座マロニエ|博多AMU PLAZA 4F·天神百貨|梅田GRAND FRONT·難波高島屋|京都高島屋S.C.·四條|札幌大丸·札站|名古屋JR Gate Tower·松坂屋|修身顯瘦美腿|9990|PLUS STYLE 防皺彈性修身西褲|PLUS STYLE 美腿錐形褲 / 針織套裝|pants|pants|www.plst.com/jp/ja/",
  "muji-labo|MUJI Labo|ムジラボ (無印良品高階實驗線)|mass|minimal,city|both|68|9400|無印僅在旗艦店販售的高階支線，尾州羊毛與高密度棉剪裁極佳|#7f0019|喜歡無印風但追求更挺括尾州羊毛與設計師版型|銀座世界旗艦店·新宿靖國通·青山|天神大名整棟旗艦店·博多運河城|難波·梅田GRAND FRONT|京都BAL旗艦店|札幌PARCO·札站|名古屋名鐵·LACHIC|中性寬鬆盒型|9990|再生羊毛混紡寬版立領夾克|高密度有機棉無領長版襯衫|jacket|shirt|www.muji.com/jp/ja/",
  "workman-plus|WORKMAN Plus|ワークマンプラス (FieldCore 男裝機能)|mass|outdoor,city|men|80|15600|專攻男士戶外露營與防寒機能！防潑水外套與工裝褲皆 ¥1,900–¥3,900|#1b2420|想用幾百塊台幣買到男士耐操防潑水釣魚外套與露營褲的男生|立川ららぽーと·池袋太陽城·晴空塔|福岡和白店·原田店·運河城男裝區|EXPOCITY·難波City|京都站Avanti店|札幌苗穗店·アリオ|名古屋榮矢場町店|男士標準微寬|2900|FieldCore Inarem 防潑水透氣衝鋒衣||jacket|cargo|www.workman.co.jp/",
  "workman-colors|Workman Colors|#ワークマン女子 (女裝戶外日常)|mass|outdoor,feminine|women|76|11200|由 #ワークマン女子 升級的女性店型！防潑水A字長裙與防風外套超便宜|#8a3b58|想買平價防潑水A字長裙、露營穿搭與高CP防曬外套的女生|東急歌舞伎町塔·池袋太陽城·銀座|博多運河城店 (#ワークマン女子)|心齋橋筋路面店·難波City|京都站Avanti店|札幌アリオ店|榮矢場町店|女性合身顯瘦|2500||防潑水高彈力百褶A字露營長裙|skirt|dress|www.workman.co.jp/",
  "global-work|GLOBAL WORK|グローバルワーク|mass|city,minimal,feminine|both|83|34200|Adastria 集團銷量冠軍！Urban Slacks 城市免燙神褲日本國民人手一件|#2c3e50|想用平價入手版型比擬選貨店的免燙神褲與日常男女裝|澀谷旗艦店·新宿·池袋太陽城|博多運河城·LaLaport福岡|梅田LINKS·心齋橋筋·難波Parks|京都車站Porta·桂川|札幌STELLAR PLACE|名古屋mozo·榮|亞洲友善微寬|4950|Urban Slacks 免燙垂墜修身神褲|輕量絨毛連帽外套 / 顯瘦A字裙|pants|coat|www.dot-st.com/globalwork/",
  "niko-and|niko and ...|ニコアンド|mass|city,outdoor,feminine|both|84|31500|日本年輕人最愛雜貨＋寬鬆服飾！原宿 TOKYO 旗艦店必逛|#3d352e|喜歡日系微復古寬鬆穿搭、古著感工裝與日本生活雜貨|原宿明治通全球旗艦店·新宿·澀谷|LaLaport福岡·博多運河城·天神|梅田HEP FIVE·心齋橋筋·難波|京都站AEON·四條|札幌STELLAR PLACE|名古屋榮·名站|大寬版放鬆|5500|寬版落肩條紋牛津襯衫 / 工裝寬褲|2WAY 水洗丹寧吊帶工裝裙|shirt|dress|www.dot-st.com/nikoand/",

  // ② 日本頂級山系與 UL 機能 (outdoor)
  "yamatomichi|山と道 (Yamatomichi)|ヤマトミチ (日本UL超輕量登山神牌)|outdoor|outdoor,city|both|86|6400|日本 UL 超輕量登山界天花板！5-Pocket Pants 與 MINI 背包一上架就秒殺，京都與鎌倉直營店必朝聖|#2d4a3e|想買被譽為「穿過就回不去」的 5-Pocket 超輕量快乾登山褲與 UL 襯衫的山系玩家|東京豐島區大塚山と道材木座/特約店|福岡天神イムズ周邊UL戶外名店(Grips等)|大阪梅田ALBi / 機能戶外選品店|【必逛】山と道 KYOTO 直營店 (京都下京區四條)|札幌秀岳莊等頂級UL戶外店|名古屋榮UL戶外選品店|立體活動剪裁(分男女碼)|17500|5-Pocket Pants 五口袋超輕快乾長褲|UL Shirt 超輕量防風快乾登山襯衫|cargo|shirt|www.yamatomichi.com/",
  "goldwin|Goldwin (含 Goldwin 0)|ゴールドウイン (日本高階機能美學)|outdoor|outdoor,minimal,city|both|85|24500|代理日本北臉的母公司自有旗艦品牌！將頂級 GORE-TEX 滑雪科技融入極簡剪裁，One Tuck 錐形褲是神作|#1b2a2f|覺得一般登山服太運動、想買極簡高質感 GORE-TEX 外套與神級機能西褲的人|原宿旗艦店·丸之內仲通旗艦店|福岡天神/大名機能選貨與百貨專櫃|梅田GRAND FRONT大阪直營店|【絕美】Goldwin KYOTO 京都町家直營店|札幌STELLAR PLACE直營店|榮LACHIC周邊專櫃|極簡立體修身微寬|26400|One Tuck Tapered Stretch 機能錐形神褲|GORE-TEX Hooded 極簡防水連帽外套|pants|jacket|www.goldwin.co.jp/goldwin/",
  "descente|DESCENTE ALLTERRAIN|デサント オルテライン (水沢ダウン)|outdoor|outdoor,minimal|both|88|39200|日本岩手縣水澤工廠職人手作「水沢ダウン (MIZUSAWA DOWN)」無縫熱壓防水羽絨與 CREAS 硬殼外套，機能界勞斯萊斯|#111827|想買日本國寶級「水澤防水羽絨外套 (Mountaineer)」與 CREAS 硬殼防風外套的人|代官山直營店 (DESCENTE BLANC)·丸之內·六本木|福岡天神西通直營店 (DESCENTE BLANC 福岡)|梅田GRAND FRONT大阪·心齋橋大丸|京都藤井大丸直營專櫃|札幌STELLAR PLACE直營店|榮LACHIC直營店|立體修身防風(建議試穿)|121000|MIZUSAWA DOWN MOUNTAINEER 水澤羽絨|HARD SHELL JACKET CREAS 硬殼外套|jacket|jacket|allterrain.descente.com/",
  "mont-bell|mont-bell|モンベル|outdoor|outdoor,city|both|96|62000|台灣人赴日機能王！GORE-TEX 風雨衣與超輕羽絨約台灣 6 折，登山傘必買|#003865|想買防風防水外套、超輕羽絨、登山雨傘與機能包的人|京橋東京店·澀谷整棟旗艦店·新宿南口|福岡天神店 (西通大名旁)·博多Mark Is|難波City·梅田GRAND FRONT|四條河原町·京都站前|札幌赤煉瓦旗艦店|榮矢場町·名古屋站|亞洲標準合身|28600|Storm Cruiser GORE-TEX 防水外套|Superior Down 超輕圓領羽絨外套|jacket|jacket|www.montbell.jp/",
  "tnf-purple|TNF Purple Label|北臉紫標 (日本獨佔限定)|outdoor|outdoor,city|both|91|33800|全球僅限日本販售！由 nanamica 操刀設計，65/35 風衣與紫標小包必搶|#4a2c6d|想買只有日本買得到的「北臉紫標」風衣與斜背包的人|代官山nanamica Mountain·原宿TNF|福岡大名nanamica直營店·福岡PARCO|梅田GRAND FRONT (TNF+)·堀江|京都六角通nanamica·藤井大丸|札幌STELLAR PLACE|榮LACHIC|寬鬆山系日常|39600|65/35 Mountain Parka 經典風衣|紫標防潑水圓筒斜背小包 / 抓絨衣|jacket|bag|www.nanamica.com/",
  "daiwa-pier39|DAIWA PIER39|ダイワピア39|outdoor|outdoor,city|men|72|12900|日本釣具大廠結合 City Boy 大寬版剪裁，多口袋獵裝與防風夾克極帥|#1f3327|喜歡寬鬆 City Boy 又想要防潑水多口袋外套的機能玩家|表參道Bshop·原宿BEAMS·新宿伊勢丹|福岡PARCO (BEAMS/FREAK'S)·大名Bshop|梅田LUCUA 1100·GRAND FRONT|藤井大丸·京都BAL|札幌STELLAR PLACE|名古屋PARCO·LACHIC|極寬大 (建議小一號)|31900|Tech Loose 2B 多口袋寬版獵裝外套|Tech 抽繩機能六袋寬褲|jacket|cargo|daiwapier39.jp/",
  "nanamica|nanamica|ナナミカ|outdoor|outdoor,minimal,city|men|68|10500|代官山高階海洋機能品牌，把 GORE-TEX 藏進優雅卡其大衣，店內同步賣北臉紫標|#0f2537|想買外觀像質感風衣卻能直接當雨衣穿的 GORE-TEX 大衣的男生|代官山直營本店 (DAIKANYAMA)|福岡大名直營店 (大名2丁目庭園路面店)|神戶直營店·梅田GRAND FRONT|京都六角通直營町家店|札幌STELLAR PLACE|榮LACHIC|微寬日系輪廓|29700|GORE-TEX 巴爾瑪肯防水長版大衣|ALPHADRY 快乾打褶寬褲|coat|pants|www.nanamica.com/",
  "teatora|TEATORA|テアトラ (旅人與商務機能神牌)|outdoor|outdoor,minimal|men|61|7400|千駄谷直營名店！專為「搭飛機與數位游牧」設計，口袋能裝下 iPad 且久坐不皺的 Wallet Pants 神褲|#18181b|討厭背包包出門、想買隱藏超大防盜口袋且極致舒適的機能西裝與神褲|千駄谷直營本店 (TEATORA SENDAGAYA)·伊勢丹男裝|福岡大名/天神高階買手店|梅田阪急男裝館·南船場Silver and Gold|京都BAL / Loftman選貨店|札幌MaW選貨店|名古屋榮選貨店|寬鬆立體機能|39600|Wallet Pants Resort 旅人防盜機能寬褲|Device Coat 多口袋收納機能風衣|pants|coat|teatora.jp/",
  "nanga|NANGA|ナンガ (滋賀國產頂級羽絨)|outdoor|outdoor,city|both|79|36800|日本滋賀縣職人羽絨睡袋起家！Aurora Down 防潑水羽絨外套保暖度驚人且價格僅歐美名牌一半|#7f1d1d|冬天去北海道或日本賞雪，想買一件 100% 日本製防潑水頂級羽絨外套的人|原宿旗艦店·目黑碑文谷本店·丸之內|福岡天神/大名直營店 (NANGA SHOP FUKUOKA)|大阪堀江直營店·梅田GRAND FRONT|京都四條/河原町戶外選品|札幌秀岳莊·北廣島直營店|名古屋榮直營店|立體保暖合身微寬|44000|Aurora Tex Down 防潑水連帽羽絨外套|Takibi 難燃焚火羽絨外套 / 羽絨圍巾|jacket|jacket|nanga.jp/",
  "snow-peak|Snow Peak Apparel|スノーピーク|outdoor|outdoor,minimal|both|73|38000|新潟燕三條露營名牌，服飾線主打難燃焚火背心與輕量保暖內膽外套|#2b2b2b|熱愛露營山系、想用日本原產地價入手焚火背心與保暖服|表參道旗艦店·新宿LUMINE 1|博多站AMU PLAZA 3F·油山福岡營地|梅田LUCUA 1100·心齋橋PARCO|藤井大丸·嵐山體驗店|札幌STELLAR PLACE|榮久屋大通公園旗艦店|中性微寬鬆|22000|Takibi 難燃防潑水多口袋焚火背心|Flexible Insulated 輕量保暖開襟衫|jacket|jacket|ec.snowpeak.co.jp/",
  "and-wander|and wander|アンドワンダー|outdoor|outdoor,mode|both|64|9100|前川三宅一生設計團隊創立，標誌性夜間反光縫線與立體剪裁極少撞衫|#2d3436|覺得傳統登山服太老氣，想找時裝感最強的小眾山系品牌|丸之內·澀谷宮下公園·新宿伊勢丹|福岡岩田屋·天神選貨店|梅田阪急·GRAND FRONT|京都BAL·藤井大丸|札幌STELLAR PLACE|榮LACHIC|立體拼接微合身|14300|PERTEX 夜間反光縫線防風連帽外套|Sil Sacoche 超輕防潑水隨身斜背包|jacket|bag|www.andwander.com/",
  "fce-meanswhile|F/CE. / meanswhile|エフシーイー / ミーンズワイル|outdoor|outdoor,city|both|56|8200|東京機能設計大獎雙璧！F/CE. 的 Cordura 多隔層機能後背包與 meanswhile 解構風衣內行必收|#3f4e4f|想買日本設計師操刀的頂規機能後背包、Sacoche 與解構機能外套|代官山NORDISK Camp Supply Store·澀谷宮下公園·駒澤|福岡大名/今泉選貨店|梅田LUCUA·南船場選貨|京都藤井大丸|札幌選貨店|名古屋PARCO|寬鬆機能層次|24200|F/CE. 950 Travel 機能旅行後背包|meanswhile 解構防風機能夾克|bag|jacket|fce.tools/",

  // ③ 日本小眾設計師與前衛時裝 (niche)
  "shinyakozuka|SHINYAKOZUKA|シンヤコヅカ (小塚信哉)|niche|minimal,mode,city|men|62|4800|中央聖馬丁畢業設計師小塚信哉主理！招牌「BAGGY」立體雙打褶超寬褲在東京潮人圈人手一條，版型神級修飾|#2b2d42|想買日本最紅神級寬褲「BAGGY」（有棉質、丹寧、西裝毛料多種材質）與手繪感針織的行家|南青山直營店「Small Trades」·原宿STUDIOUS·代官山O|福岡PARCO (STUDIOUS / 選貨店)·今泉買手店|梅田LUCUA (STUDIOUS)·南船場/堀江買手店|京都藤井大丸 (STUDIOUS)|札幌STELLAR PLACE (STUDIOUS)|名古屋PARCO (STUDIOUS)|極寬大立體打褶 (S/M碼)|24200|BAGGY 經典立體打褶超寬版長褲|HIS SHIRT 寬版落肩手繪感襯衫|pants|shirt|shinyakozuka.com/",
  "auralee|AURALEE|オーラリー|niche|minimal,city|both|79|16800|巴黎時裝週日本極簡天花板！不靠大 Logo，以獨家埃及長絨棉與羊毛征服全球買手|#8c7a6b|追求零大 Logo、極致親膚面料與低飽和色彩的行家|南青山直營本店·新宿伊勢丹男女裝館|福岡岩田屋·福岡VIORO (UA/Bshop)|梅田阪急·LUCUA 1100|京都BAL (Bshop/Edition)|札幌STELLAR PLACE|榮LACHIC (UA/Bshop)|微寬垂墜輪廓|33000|Washed Finx 埃及長絨棉寬版襯衫|Super Fine 頂級美麗諾羅紋針織衫|shirt|shirt|auralee.jp/",
  "comoli|COMOLI|コモリ|niche|minimal,city|men|67|11400|日本極簡男裝私房神牌！從不打廣告，專注空氣感鬆弛剪裁，南青山本店永遠在排隊|#2b2d2f|喜歡不費力鬆弛感、自然皺褶高支數棉襯衫與低調職人男裝的男生|南青山直營本店·新宿伊勢丹男裝|福岡大名Bshop·福岡VIORO (UA)|梅田GRAND FRONT (Bshop)|京都BAL (Bshop)|札幌Bshop|榮LACHIC (Bshop)|寬鬆空氣感 (1-3號)|28600|Comoli 經典空氣感寬鬆白襯衫|5-Pocket 寬版丹寧長褲|shirt|pants|www.comoli.jp/",
  "apresse|A.PRESSE|アプレッセ (日本買手店秒殺王)|niche|minimal,denim,ivy|men|63|6900|近年日本極簡復古界最難搶的神牌！把美式古著軍褲、牛津襯衫用頂級面料重新詮釋，一上架即完售|#3d405b|懂穿 COMOLI 與 AURALEE，想找更高階水洗質感軍褲、卡其褲與復古襯衫的頂尖玩家|新宿伊勢丹男裝館·中目黑1LDK·南青山BIOTOP|福岡赤坂BIOTOP·今泉/大名頂尖買手店|大阪堀江BIOTOP·梅田阪急男裝館|京都BAL (Edition) / Loftman|札幌MaW選貨店|名古屋榮LACHIC (Edition)|復古寬鬆微錐形|41800|USAF Hemmed Bottoms 復古寬版軍褲|Washed Denim Wide 水洗寬版丹寧褲|cargo|pants|www.instagram.com/a.presse_/",
  "maatee-nhoolywood|MAATEE&SONS / HEUGN / N.HOOLYWOOD|マーティー＆サンズ / ユーゲン / エヌハリ|niche|minimal,ivy,mode|men|57|9200|東京伊勢丹男裝館與青山三大頂流日本設計師男裝！俺のチノパン(神級卡其褲)與尾花大輔軍裝解構必收|#2c302e|已經買遍 AURALEE 與 COMOLI，想進階東京頂尖買手店最推的職人西褲、襯衫與解構軍裝|南青山N.HOOLYWOOD本店·新宿伊勢丹男裝館·六本木|福岡岩田屋·大名/今泉頂尖買手店|梅田阪急男裝館·南船場選貨|京都BAL / Loftman|札幌選貨店|名古屋榮選貨店|立體垂墜職人剪裁|38500|MAATEE&SONS 俺のチノパン / N.HOOLYWOOD 軍裝襯衫|HEUGN 經典 Rob 條紋立領襯衫|pants|shirt|n-hoolywood.com/",
  "graphpaper|Graphpaper|グラフペーパー|niche|minimal,city|men|59|8600|南貴之主理建築感極簡神牌，把店鋪做成美術館，Broad 超長絨棉寬襯衫與主廚褲是招牌|#495057|喜歡挺括建築感 Oversized 襯衫與免繫皮帶主廚褲的男生|參宮橋畫廊本店·表參道店|福岡大名選貨店·福岡VIORO|南船場路面店|京都富小路通町家直營店|札幌選貨店|名古屋矢場町店|建築感 Free Size|28600|Broad Oversized 超長絨棉寬版襯衫|Scale Off 羊毛免繫皮帶主廚寬褲|shirt|pants|graphpaper-tokyo.com/",
  "stein-yoke|stein / YOKE|シュタイン / ヨーク|niche|minimal,mode|men|55|7200|東京當紅小眾極簡雙子星！以當代藝術色彩漸層針織（YOKE）與極致垂墜大衣（stein）聞名|#343a40|想找東京買手店最推的小眾藝術感馬海毛針織與大廓形西裝大衣的行家|表參道Carol (stein直營)·中目黑1LDK·新宿伊勢丹|福岡今泉/大名設計師選貨店|大阪南船場/堀江選貨店|京都藤井大丸周邊選貨|札幌設計師選貨店|名古屋矢場町選貨店|極致落肩大廓形|36300|YOKE 藝術漸層馬海毛寬版開襟針織|stein 雙排釦垂墜長版風衣|shirt|coat|ssstein.com/",
  "markaware|MARKAWARE / marka|マーカウェア (中目黑PARKING)|niche|minimal,city|men|54|7800|石川俊介主理，堅持全日本製與巴塔哥尼亞有機羊毛，Pegtop 錐形打褶西褲與寬褲剪裁一絕|#3a3835|喜歡中目黑河畔質感男裝、想買有機羊毛免燙打褶褲與質感襯衫的男生|中目黑直營本店「PARKING」·新宿伊勢丹男裝|福岡大名/今泉選貨店|梅田LUCUA·南船場選貨|京都藤井大丸|札幌選貨店|名古屋PARCO周邊|修身錐形至微寬|29700|Organic Wool Pegtop 有機羊毛打褶錐形褲|Comfort Fit 寬鬆有機棉襯衫|pants|shirt|markaware.jp/",
  "cullni|CULLNI|クルニ (代官山金釦拼接)|niche|minimal,mode|both|58|8900|日本偶像與日劇造型師最愛！標誌性「金色拉鍊／金釦斜口袋」與雙色異材質拼接襯衫，辨識度極高|#1f2937|喜歡微華麗極簡風、想買一件剪裁垂墜且帶金釦設計感的襯衫或風衣|代官山直營本店·原宿/新宿STUDIOUS|福岡PARCO (STUDIOUS)|梅田LUCUA (STUDIOUS)·心齋橋|京都藤井大丸 (STUDIOUS)|札幌STELLAR PLACE (STUDIOUS)|名古屋PARCO (STUDIOUS)|垂墜修長微寬|27500|Tie Locken 金釦斜口袋綁帶襯衫|雙色拼接垂墜感打褶寬褲|shirt|pants|cullni.com/",
  "needles|Needles (NEPENTHES)|ニードルス (蝴蝶褲 / 澀谷本店)|niche|street,mode|both|84|32500|清水慶三主理！左腿「蝴蝶刺繡運動褲 (Track Pants)」與馬海毛開襟衫紅遍全球，澀谷與博多 NEPENTHES 本店必朝聖|#581c87|想買日本原產地限定配色 Needles 蝴蝶運動長褲、法蘭絨重建拼接襯衫與馬海毛毛衣的人|澀谷神宮前「NEPENTHES TOKYO」直營本店·STUDIOUS|【九州必逛】博多「NEPENTHES HAKATA」直營店·福岡PARCO|大阪韌本町「NEPENTHES OSAKA」直營店·梅田|京都Loftman·藤井大丸|札幌「SOUTH2 WEST8」直營店|名古屋榮選貨店|微寬直筒/窄管/H.D.氣球褲|23100|Track Pant 經典蝴蝶刺繡直筒/H.D.氣球運動褲|Mohair Cardigan 復古圖騰馬海毛開襟衫|pants|shirt|nepenthes.co.jp/",
  "engineered-garments|Engineered Garments|エンジニアド ガーメンツ (青山本店)|niche|denim,outdoor,ivy|men|64|15400|NEPENTHES 旗下鈴木大器主理，將美式軍裝、獵裝與常春藤西外完美融合，Bedford Jacket 是傳奇神作|#2e3a23|著迷美式復古軍工裝混搭、多口袋獵裝西外與不對稱拼接設計的穿搭老手|南青山「ENGINEERED GARMENTS TOKYO」直營本店|博多「NEPENTHES HAKATA」直營店|大阪韌本町「NEPENTHES OSAKA」|京都Loftman選貨店|札幌「SOUTH2 WEST8」|名古屋LACHIC選貨|美式寬鬆層次|42900|Bedford Jacket 四口袋工裝獵裝西外|Fatigue Pant 經典軍綠烘焙麵包工作褲|jacket|cargo|nepenthes.co.jp/",
  "porter-classic|Porter Classic|ポータークラシック (銀座劍道刺子藍染)|niche|denim,street|men|60|11200|吉田包創辦人么子吉田克幸創立！銀座本店宛如藍染博物館，Kendo 劍道服、Sashiko 刺子與超級尼龍包堪稱藝術品|#1e3a5f|預算充裕、想收藏日本國寶級「刺し子藍染外套」或 Indigo 藍染尼龍包的職人玩家|銀座本店 (Porter Classic GINZA)·新宿伊勢丹男裝館|福岡岩田屋/天神頂級選貨|大阪梅田阪急男裝館|京都烏丸直營店 (Porter Classic KYOTO)|札幌選貨店|名古屋榮選貨|寬鬆大輪廓圓潤剪裁|49500|Super Nylon 職人藍染水洗尼龍斜背包|Roll Up Shirt 經典格紋寬版捲袖襯衫|bag|shirt|porterclassic.com/",
  "visvim|visvim|ビズビム (中目黑/表參道殿堂)|niche|denim,street|men|73|18900|中村世紀主理日本殿堂級品牌！結合奄美大島泥染、天然藍染與印地安手工鞋，東京中目黑與表參道店如博物館|#4a3b2c|追求極致天然染色工藝、想朝聖 101 丹寧夾克、FBT 流蘇鞋與 Christo 拖鞋的頂級收藏家|中目黑直營本店 (WMV)·表參道GYRE·銀座DSM|福岡天神/大名頂尖選品|大阪南船場F.I.L.直營店|京都河原町F.I.L. KYOTO直營店|札幌選貨|名古屋F.I.L. NAGOYA|手工復古剪裁|68000|Social Sculpture 岡山手工破壞赤耳丹寧|Skagway 經典手工硫化帆布鞋|pants|shoe|www.visvim.tv/",
  "sacai|sacai|サカイ (阿部千登勢)|niche|mode,minimal|both|83|27400|國際時裝週殿堂品牌！MA-1 尼龍異材質百褶拼接外套與上衣，日本退稅買省上萬元|#1a1a1a|想用日本原產地退稅價入手殿堂級異材質解構拼接服飾|南青山旗艦店·新宿伊勢丹·銀座DSM·澀谷PARCO|福岡岩田屋本館 2F/3F 專櫃|梅田阪急·心齋橋PARCO|京都BAL專櫃|札幌丸井今井|榮松坂屋·名古屋高島屋|立體解構拼接|38500|Sponge Sweat × MA-1 尼龍拼接連帽衫|異材質雪紡百褶拼接短袖 T-Shirt|jacket|dress|www.sacai.jp/",
  "issey-miyake|ISSEY MIYAKE|イッセイミヤケ (Homme Plissé / BAO BAO)|niche|mode,minimal|both|90|45200|三宅一生男裝皺褶褲 Homme Plissé 與女裝 Pleats Please / BAO BAO 鑽石包，日本買價差極大|#222222|想買速乾免燙、穿十年不變形的三宅一生皺褶長褲或 BAO BAO 幾何托特包|南青山Homme Plissé旗艦店·銀座松屋·新宿伊勢丹|福岡岩田屋本館·博多阪急|梅田阪急·心齋橋PARCO·南船場路面店|四條烏丸歷史町家直營店·京都高島屋|札幌丸井今井·札幌PARCO|榮松坂屋·名古屋高島屋|高彈力立體皺褶|30800|Homme Plissé JF150 經典直筒皺褶長褲|BAO BAO 經典 6×6 三角幾何托特包|pants|bag|www.isseymiyake.com/",
  "cdg-play|COMME des GARÇONS|コム デ ギャルソン (PLAY / Homme Plus)|niche|mode,city,minimal|both|89|47500|川久保玲紅心眼睛標誌與青山本店限定包！日本定價約台灣 65 折，羊毛開襟衫必搶|#111111|想用台灣 65 折入手川久保玲紅心/黑心羊毛開襟衫、條紋 Tee 與青山限定包|南青山本店·丸之內·新宿伊勢丹·銀座DSM|福岡博多阪急·岩田屋旁直營店|梅田阪急·心齋橋御堂筋直營店|京都藤井大丸·京都高島屋|札幌PARCO·丸井今井|榮LACHIC·名古屋高島屋|PLAY偏小建議大一號|16500|PLAY 雙紅心刺繡條紋長袖 Tee|PLAY 經典紅心純羊毛針織開襟外套|tee|shirt|www.comme-des-garcons.com/",
  "yohji-groundy|Yohji Yamamoto / Ground Y|ヨウジヤマモト / グラウンド ワイ (山本耀司)|niche|mode|both|78|21600|黑色詩人山本耀司！旗下年輕支線「Ground Y」與「Y's」在澀谷與心齋橋 PARCO 極受歡迎，萬元日幣起即可入手全黑垂墜神褲|#09090b|著迷全黑暗黑美學、想買山本耀司招牌垂墜感寬褲（Hakama 劍道裙褲）與長版風衣的人|南青山本店·澀谷PARCO (Ground Y)·銀座松屋·新宿伊勢丹|福岡岩田屋本館 (Yohji / Y's)|心齋橋PARCO (Ground Y 旗艦)·梅田阪急|京都高島屋·京都伊勢丹|札幌丸井今井·札幌PARCO|名古屋PARCO (Ground Y)·松坂屋|極致寬大垂墜全黑|26400|Ground Y 經典ギャバジン垂墜感裙褲/寬褲|Y's 不對稱領口長版黑色風衣 / 圖案T|pants|coat|theshopyohjiyamamoto.jp/",
  "kolor-toga|kolor / TOGA ARCHIVES|カラー / トーガ (南青山與原宿先鋒設計)|niche|mode,city|both|66|14800|阿部潤一主理 kolor（撞色羅紋領針織與猿人褲）與古田泰子 TOGA（西部金屬馬蹄釦皮鞋與涼鞋），日本退稅超划算|#3f2e21|想買不撞衫的 kolor 不對稱拼接針織，或日本潮人腳上一雙的 TOGA 金屬釦樂福鞋與涼鞋|南青山kolor旗艦店·原宿TOGA本店·澀谷PARCO·伊勢丹|福岡岩田屋本館專櫃|心齋橋PARCO (kolor)·梅田阪急 (TOGA)|京都高島屋·藤井大丸|札幌丸井今井|名古屋PARCO·高島屋|立體撞色解構|36300|kolor 經典撞色異材質拼接羅紋領運動衫|TOGA PULLA 西部金屬馬蹄釦皮革樂福鞋|shirt|shoe|www.kolor.jp/",
  "cfcl-mame|CFCL / Mame Kurogouchi|シーエフシーエル / マメ クロゴウチ|niche|mode,feminine|women|69|9500|東京時裝週雙驕！CFCL 以 3D 電腦立體編織「花瓶裙 (Pottery Skirt)」轟動全球；Mame 則是日本女生夢幻曲袖洋裝|#1d3557|想買可機洗不皺的 CFCL 3D 立體針織花瓶裙、羅紋托特包，或 Mame 殿堂級洋裝的品味女生|表參道GYRE (CFCL直營)·南青山Mame本店·新宿伊勢丹·六本木|福岡岩田屋本館專櫃|梅田阪急百貨直營櫃|京都BAL / 京都高島屋|札幌丸井今井|名古屋高島屋|立體高彈力雕塑剪裁|39600||CFCL Pottery Skirt 3D立體編織花瓶長裙 / 針織包|skirt|dress|cfcl.jp/",
  "beautiful-hender|beautiful people / Hender Scheme|ビューティフルピープル / エンダースキーマ|niche|minimal,mode|both|68|16200|青山與惠比壽文青最愛！beautiful people 縮水騎士皮衣與編織包，搭 Hender Scheme 淺草手工植鞣小豬皮托特包|#78350f|想買日本文青人手一顆的手工絨面豬皮包（Pig Bag）、大Logo帆布托特包或手工皮件的人|惠比壽「スキマ」本店·南青山beautiful people·澀谷宮下公園|福岡岩田屋·大名選貨店|南船場「スキマ大阪」·梅田阪急|京都BAL·四條選貨店|札幌STELLAR PLACE|榮LACHIC|精緻中性剪裁|17600|Hender Scheme Pig Bag M 絨面豬皮托特包|beautiful people 經典Logo帆布包 / 騎士皮衣|bag|bag|henderscheme.com/",

  // ④ 日本代表選貨店與高質感買手店 (select)
  "beams|BEAMS|ビームス (Plus / Boy / Japan)|select|city,ivy,feminine|both|93|54000|日本選貨店霸主！男裝 BEAMS PLUS 美式學院、女裝 BEAMS BOY 與新宿/京都 BEAMS JAPAN 別注必逛|#e85d04|第一次逛日本選貨店、想買寬鬆襯衫與別注球鞋的人|原宿BEAMS整條街·新宿BEAMS JAPAN|福岡PARCO本館1-2F·博多AMU PLAZA|梅田LUCUA 1100·心齋橋大丸|新風館 (BEAMS JAPAN)·藤井大丸|札幌STELLAR PLACE|名古屋PARCO·高島屋|微寬 City Boy|16500|BEAMS 百褶寬版卡其褲 / 牛津襯衫|BEAMS BOY 吊帶工裝長裙 / 條紋衫|shirt|dress|www.beams.co.jp/",
  "united-arrows|UNITED ARROWS|ユナイテッドアローズ (B&Y / H B&Y)|select|minimal,ivy,feminine|both|86|49000|日本輕熟男女首選，青山「H BEAUTY&YOUTH」潮流感最強，green label relaxing 平價好穿|#1f2421|想從平價品牌升級質感大衣、金釦西外與西裝寬褲的人|原宿本店·南青山H B&Y·新宿LUMINE 1/2|福岡VIORO 1-2F·福岡PARCO·博多站|梅田LUCUA 1100·GRAND FRONT|京都BAL·藤井大丸|札幌STELLAR PLACE|榮LACHIC·高島屋|俐落修身微寬|24200|BEAUTY&YOUTH 羊毛雙面呢大衣|green label 金釦西裝外套 / 寬褲|coat|coat|store.united-arrows.co.jp/",
  "tomorrowland|TOMORROWLAND|トゥモローランド (含 CABaN)|select|minimal,ivy,feminine|both|81|38500|日本高階選貨店天花板！旗下 CABaN 喀什米爾雙口袋開襟衫與頂級羊毛大衣是日劇主角最愛|#1a2634|預算較充裕、追求比 UA 更精緻的頂級面料大衣與 CABaN 撞色口袋針織的人|澀谷本店·丸之內·新宿伊勢丹·新宿LUMINE|福岡岩田屋·博多AMU PLAZA·天神VIORO|梅田阪急·LUCUA 1100·GRAND FRONT|京都BAL (超大旗艦店)·京都高島屋|札幌STELLAR PLACE|榮LACHIC·名古屋高島屋|精緻修身優雅|39600|TOMORROWLAND 頂級梅爾頓羊毛大衣|CABaN 喀什米爾雙口袋撞色開襟衫|coat|shirt|store.tomorrowland.co.jp/",
  "1ldk|1LDK|ワンエルディーケー (中目黑極簡選貨聖地)|select|minimal,city|both|65|5900|日本極簡與 Clean Fit 選貨店鼻祖！中目黑本店旁賞櫻必逛，自有品牌 UNIVERSAL PRODUCTS 與 MY___ 帆布包超受歡迎|#334155|喜歡南青山與中目黑極簡鬆弛感、想在一家店逛齊 DAIWA、stein、AURALEE 與 1LDK 托特包的人|中目黑直營本店 (1LDK apartments.)·青山店|福岡今泉/大名特約選品|大阪南船場周邊買手店|京都烏丸御池「新風館」1F 直營店|札幌選貨|名古屋榮矢場町 (1LDK annex)|極簡寬鬆日常|16500|UNIVERSAL PRODUCTS 經典寬版牛津襯衫|1LDK 經典刺繡重磅帆布托特包 / MY___ 針織|shirt|bag|1ldkshop.com/",
  "biotop|BIOTOP|ビオトープ (白金台/福岡/大阪複合選貨)|select|minimal,mode,feminine|both|66|6800|結合綠植花園、咖啡廳與頂級選品（AURALEE / COMOLI / Lemaire / Hanes 別注白T）的日本最美複合選貨店|#2d3a2e|想在超美建築裡邊喝咖啡邊逛 AURALEE、Lemaire 與 BIOTOP 限定別注款的人|白金台本店·南青山店|【福岡必朝聖】福岡赤坂/大濠公園旁 BIOTOP FUKUOKA|【大阪必逛】南船場/堀江橘街旁 BIOTOP OSAKA|京都BAL周邊|札幌選貨|名古屋選貨|高質感設計師版型|19800|BIOTOP 別注 Hanes 雙包裝純棉T / 設計師寬褲|yo BIOTOP 極簡絲質削肩背心 / 針織長裙|tee|dress|www.biotop.jp/",
  "freaks-store|FREAK’S STORE|フリークスストア|select|city,outdoor,feminine|both|87|41200|日本大學生最熱選貨店！Nautica JP 與三穿 M-65 魚尾軍大衣 CP 值極高|#1a3a2a|喜歡美式復古、City Boy 大寬版且預算萬元日幣內的人|澀谷神南旗艦店·新宿LUMINE EST|福岡PARCO本館3F·博多AMU PLAZA|梅田LUCUA·難波Parks|京都站Porta|札幌STELLAR PLACE|名古屋PARCO·高島屋|大寬版 Oversized|14993|M-65 附絎縫內膽三穿魚尾軍大衣|インド綿 抓皺荷葉領層次長洋裝|coat|dress|www.daytona-park.com/",
  "journal-standard|JOURNAL STANDARD|ジャーナルスタンダード (含 relume)|select|city,denim,outdoor|both|79|44600|Baycrew’s 王牌選貨！relume 支線平價，Barbour 與 Levi’s 別注款每季搶翻|#2f2922|想買日本別注款 Barbour 油布外套與美式復古丹寧的人|表參道旗艦店·澀谷·新宿Flags|福岡PARCO 1F·博多AMU PLAZA|梅田LUCUA 1100·難波Parks|藤井大丸·四條通|札幌STELLAR PLACE|榮LACHIC·高島屋|微寬鬆落肩|19800|別注 Barbour 寬版油布風衣外套|relume 復古刷色寬版牛仔外套|coat|jacket|baycrews.jp/",
  "urban-research|URBAN RESEARCH|アーバンリサーチ (DOORS / KBF)|select|minimal,city,feminine|both|75|46800|質感穩健的都會選貨店，DOORS 有機棉麻與 SENSE OF PLACE 平價支線極好入手|#2b303a|想要溫和日系無印感、實穿風衣與高 CP 洋裝的人|表參道·新宿LUMINE·澀谷|福岡PARCO·博多AMU PLAZA (DOORS)|梅田LUCUA 1100·難波City|藤井大丸·京都站Porta|札幌STELLAR PLACE|名古屋PARCO·LACHIC|亞洲友善微寬|15400|DOORS 防潑水連帽輕便風衣|KBF 異材質拼接高腰長洋裝|coat|dress|www.urban-research.jp/",
  "ships|SHIPS|シップス|select|ivy,minimal|both|71|36200|日本老牌御三家選貨店，低調穩健，常春藤學院風與海島棉針織極佳|#00205b|喜歡乾淨牛津襯衫、風衣與微正式常春藤學院風的人|銀座本店·澀谷神南·新宿LUMINE|福岡VIORO 3F·博多AMU PLAZA 3F|梅田GRAND FRONT·難波Parks|藤井大丸·京都站|札幌STELLAR PLACE|榮松坂屋·高島屋|合身俐落|23100|SHIPS 撥水巴爾瑪肯格紋內裡風衣|金釦海軍藍針織開襟外套|coat|shirt|www.shipsltd.co.jp/",
  "nano-ciaopanic|NANO universe / CIAOPANIC|ナノ・ユニバース / チャオパニック|select|minimal,city,outdoor|both|73|39400|NANO 主打西川羽絨與俐落通勤；CIAOPANIC TYPY 主打寬鬆美式戶外休閒，萬元日幣內超好買|#22252a|想買萬元日幣內高 CP 值日系羽絨外套、防風夾克與情侶日常服|新宿LUMINE·澀谷神南·新宿Flags|福岡PARCO·博多AMU PLAZA·LaLaport|梅田LUCUA·HEP FIVE·難波|京都藤井大丸·京都站|札幌STELLAR PLACE|名古屋LACHIC·榮|合身至寬鬆皆有|14300|西川ダウン 羽絨夾克 / Franklin 多口袋外套|修身針織連身洋裝 / 絎縫軍裝外套|jacket|dress|store.nanouniverse.jp/",
  "bshop|Bshop|ビショップ|select|minimal,denim,ivy|both|69|18400|日本文青死忠選貨店！代理 DANTON、ORCIVAL 海魂衫、Gymphlex 與 Brady 包|#1e2f23|喜歡法式工裝、條紋海魂衫與乾淨文青日常穿搭的人|新宿LUMINE 1·丸之內·吉祥寺|福岡天神警固公園旁路面店·博多站|梅田GRAND FRONT·心齋橋大丸|京都BAL 4F 大型店|札幌STELLAR PLACE|榮LACHIC 4F|法式微寬箱型|14850|ORCIVAL 法式重磅條紋海魂衫|Gymphlex 刺繡小獅頭寬版格紋襯衫|shirt|shirt|bshop-inc.com/",
  "studious|STUDIOUS / UNITED TOKYO|ステュディオス / ユナイテッドトウキョウ|select|mode,minimal|both|67|14200|堅持 100% 日本製！一次逛齊 SHINYAKOZUKA、Needles、CULLNI 與高 CP 值日本製西裝褲|#111111|想在一家店試穿所有當紅日本小眾設計師品牌且直接退稅的人|原宿本店·表參道·新宿LUMINE·澀谷PARCO|福岡PARCO本館 1-2F|梅田LUCUA 1100·南船場·心齋橋|京都藤井大丸店|札幌STELLAR PLACE|榮名古屋PARCO|修身時裝剪裁|22000|UNITED TOKYO 日本製免燙西裝寬褲|不對稱雙色百褶拼接長裙|pants|skirt|studious.co.jp/",

  // ⑤ 國際品牌日本買 (global)
  "ralph-lauren|Polo Ralph Lauren|ポロ ラルフ ローレン (表參道旗艦+日本別注)|global|ivy,city|both|91|68000|日本 City Boy 穿搭靈魂！表參道旗艦店（附設 Ralph's Coffee）極美，且每季與 BEAMS 推出日本獨佔 Big Fit 別注款|#0f2042|想買 POPEYE 雜誌風寬版小馬牛津襯衫、麻花毛衣、老帽與 BEAMS 日本限定別注款的人|表參道旗艦店 (附設 Ralph's Coffee)·新宿伊勢丹·銀座|福岡岩田屋本館·博多阪急·鳥栖Outlet|心齋橋路面店·梅田阪急·臨空城Outlet|京都BAL (附設 Ralph's Coffee)·高島屋|札幌大丸·北廣島Outlet|名古屋高島屋·榮松坂屋·長島Outlet|Classic/Big Fit 寬鬆|22000|Big Fit 經典小馬刺繡寬版牛津襯衫|Cable-Knit 經典小馬麻花針織毛衣 / 老帽|shirt|shirt|www.ralphlauren.co.jp/",
  "tommy-hilfiger|Tommy Hilfiger|トミー ヒルフィガー (表參道旗艦+日本Outlet超香)|global|ivy,city|both|80|43200|表參道東急 Plaza 大型旗艦店款式極齊，且在日本百貨退稅或三井／御殿場 Outlet 入手價差高達 5 折|#1d2d50|喜歡美式學院風連帽衫、撞色防風夾克、針織衫，或想在東京與日本 Outlet 掃貨的人|表參道旗艦店 (Harajuku)·新宿·銀座·木更津Outlet|福岡博多運河城·天神岩田屋·鳥栖Outlet|心齋橋筋旗艦店·梅田·臨空城Outlet|京都高島屋·四條河原町|札幌大丸·北廣島三井Outlet|名古屋高島屋·長島Outlet|美式合身至微寬|15400|經典三色Logo防風立領夾克 / 重磅帽T|美式學院風V領麻花針織衫 / 牛仔裙|jacket|shirt|japan.tommy.com/",
  "lacoste-fredperry|Lacoste / Fred Perry Japan|ラコステ / フレッドペリー (日本別注限定)|global|ivy,city|both|79|39500|歐洲兩大運動學院傳奇，但在日本每年與 BEAMS、SHIPS 推出超帥「日本限定寬版開襟衫與 Polo 衫」|#14532d|想買台灣買不到的日本選貨店別注款「月桂冠／鱷魚刺繡」寬版針織衫與運動外套|原宿Fred Perry全球旗艦店·澀谷Lacoste·新宿|福岡PARCO·博多AMU PLAZA|梅田LUCUA·南船場路面店·難波Parks|京都藤井大丸|札幌STELLAR PLACE|榮名古屋PARCO·LACHIC|日本別注寬版|19800|日本別注寬版鹿子棉 Polo 衫 / 運動夾克|Fred Perry 馬海毛月桂冠刺繡開襟衫|shirt|shirt|www.fredperry.jp/",
  "brooks-levis|Brooks Brothers / Levi's JP|ブルックスブラザーズ / リーバイス (日本製赤耳)|global|ivy,denim,city|both|77|52000|原宿 Levi's 亞洲最大旗艦店擁有「Made in Japan 日本製赤耳 501」；青山 Brooks Brothers 則是金釦西外鼻祖|#1e3a8a|想在東京原宿買一件日本職人織布的「Made in Japan 501 牛仔褲」或正統金釦紺ブレ西外|原宿Levi's三層旗艦店·表參道Brooks Brothers|福岡天神路面店·福岡PARCO·博多站|大阪心齋橋旗艦店·梅田|京都四條河原町·高島屋|札幌STELLAR PLACE·大丸|榮路面店·名古屋高島屋|經典直筒 / 合身|26400|Levi's Made in Japan 日本製1980s 501赤耳丹寧|Brooks Brothers 經典金釦海軍藍西裝外套|pants|coat|www.levi.jp/",
  "cos|COS|コス (H&M 集團高階建築極簡)|global|minimal,mode|both|82|8900|台灣門市少且貴！東京南青山、銀座與橫濱門市款式極齊，建築感羊毛大衣、雲朵包與重磅白T退稅超好買|#222222|喜歡北歐極簡建築線條、雲朵包（Quilted Bag）與高磅數純白 T-Shirt 的人|南青山表參道店 (整棟絕美門市)·銀座·橫濱NEWoMan|九州建議於官網或東京/大阪/名古屋門市選購|大阪心齋橋/梅田周邊百貨|京都四條周邊/大阪門市順路逛|札幌極簡選品|名古屋榮周邊|歐美微寬建築感|13500|Heavyweight 290g 重磅純棉白 Tee|Quilted 雲朵斜背包 / 羊毛長大衣|tee|bag|www.cos.com/ja-jp/",
  "theory|Theory Japan|セオリー (迅銷集團日本限定版型)|global|minimal,ivy|both|74|19500|迅銷集團旗下紐約極簡名牌，日本專櫃擁有專為亞洲身形打造的剪裁，定價與退稅比台灣划算許多|#111111|追求極致俐落剪裁西裝、大衣與高品質通勤男女裝的都會人士|青山旗艦店·新宿伊勢丹·銀座三越·六本木|福岡岩田屋本館·博多阪急|梅田阪急·大丸心齋橋·難波高島屋|京都高島屋·大丸京都|札幌大丸·丸井今井|名古屋高島屋·松坂屋|俐落都會修身|29700|Precision Ponte 高彈力機能西裝外套|Admiral Crepe 垂墜感寬褲 / 羊毛大衣|coat|coat|www.theory.co.jp/",
  "apc|A.P.C.|アーペーセー (代官山/大名直營)|global|denim,minimal,ivy|both|77|28900|法國極簡丹寧神牌，在日本代官山、青山與福岡大名皆有直營店，赤耳原牛與半月包退稅價差大|#1b263b|想買 Petit New Standard 赤耳原色牛仔褲、Logo 托特包與法式極簡夾克|代官山直營店·青山店·新宿伊勢丹·日比谷|福岡大名路面店 (天神西通旁)·博多阪急|難波Parks·梅田阪急·南船場|京都四條藤井大丸·京都BAL|札幌STELLAR PLACE|榮LACHIC·名古屋高島屋|法式修身直筒|29700|Petit New Standard 經典赤耳原色丹寧褲|Demi-Lune 經典皮革半月斜背包 / 丹寧托特|pants|bag|www.apcjp.com/",
  "maison-kitsune|Maison Kitsuné|メゾン キツネ (法日混血小狐狸)|global|city,ivy,feminine|both|80|26400|法國音樂人與日本建築師共同創立！小狐狸刺繡開襟衫、短 Tee 與 Café Kitsuné 咖啡廳必朝聖|#263849|喜歡雙狐狸／Chillax Fox 刺繡 T-Shirt、針織開襟衫與法日輕奢休閒風|南青山旗艦店 (附Café)·代官山·新宿伊勢丹·澀谷|福岡岩田屋本館·天神選貨專櫃|梅田阪急·心齋橋大丸·南船場|京都烏丸御池「新風館」1F (附絕美咖啡廳)|札幌丸井今井|名古屋高島屋|法式微合身至微寬|17600|Fox Head 經典狐狸刺繡純棉短 Tee|Fox Head 羊毛針織開襟衫 / 托特包|tee|shirt|maisonkitsune.com/jp/",
  "mhl|MHL. / Margaret Howell|マーガレット・ハウエル (日本獨佔支線)|global|minimal,ivy,denim|both|74|21300|英國極簡大師，但日本擁有全球最完整獨佔支線！重磅帆布托特包與工裝襯衫是日本文青制服|#3d3b37|喜歡自然亞麻與高密度棉、低飽和大地色與耐用重磅帆布包的人|神南澀谷旗艦店 (附Cafe)·青山·新宿LUMINE 1|福岡天神路面店·博多AMU PLAZA|梅田GRAND FRONT·心齋橋大丸|京都BAL·四條通|札幌STELLAR PLACE|榮LACHIC·名古屋高島屋|英日微寬箱型|16500|MHL. 高密度水洗棉工裝襯衫|MHL. Heavy Cotton 經典重磅帆布托特包|shirt|bag|www.margarethowell.jp/",
  "margiela-lemaire|Maison Margiela / Lemaire|マルジェラ / ルメール (惠比壽/表參道)|global|mode,minimal|both|86|34800|時裝控赴日退稅首選！惠比壽擁有 Lemaire 與 Margiela 獨立路面店，Tabi 分趾鞋、牛角包與 MM6 價差動輒省萬元|#27272a|想趁日幣匯率＋百貨10%退稅入手 Margiela 分趾鞋、MM6 托特包或 Lemaire 牛角包的人|惠比壽路面店·表參道GYRE·新宿伊勢丹·銀座DSM|福岡岩田屋本館 2F/3F 直營櫃|梅田阪急·心齋橋PARCO·大丸|京都伊勢丹·京都高島屋|札幌丸井今井|榮松坂屋·名古屋高島屋|先鋒建築感剪裁|59400|Maison Margiela 經典八號數字Logo純棉T / 皮夾|Tabi 分趾平底鞋 / Lemaire 可頌牛角斜背包|tee|bag|www.maisonmargiela.com/ja-jp/",
  "acne-ami|Acne Studios / AMI Paris|アクネ ストゥディオズ / アミ パリス|global|mode,minimal,city|both|81|29400|北歐 Acne 格紋羊駝圍巾、1981 寬褲與法國 AMI 紅心針織衫，東京青山與新宿伊勢丹退稅買極划算|#9d8189|想買冬日必備 Acne 格紋圍巾、毛帽或 AMI 愛心刺繡針織開襟衫的人|南青山旗艦店·表參道·新宿伊勢丹·澀谷PARCO|福岡岩田屋本館 3F 直營專櫃|心齋橋御堂筋旗艦店·梅田阪急|京都BAL·京都高島屋|札幌丸井今井|榮松坂屋·名古屋高島屋|寬鬆時髦輪廓|38500|Acne 1981 寬版水洗丹寧褲 / AMI 愛心衛衣|Acne Mohair 格紋流蘇圍巾 / 愛心開襟毛衣|pants|shirt|www.acnestudios.com/jp/ja/",
  "barbour|Barbour Japan|バブアー (日本別注無油版)|global|ivy,outdoor,denim|both|76|27500|英國百年皇室油布外套，但在日本推出專屬「無油感防潑水材質」與 Oversized 短版別注款，轟動全日本|#1f3629|想買沒有傳統油味、適合台灣氣候且版型寬鬆時髦的日本限定 Bedale / Transport 外套|原宿貓街直營店·代官山·新宿LUMINE 1|福岡PARCO (選貨別注)·岩田屋|梅田LUCUA 1100 直營店·難波Parks|京都藤井大丸·京都BAL|札幌STELLAR PLACE|榮LACHIC·名古屋高島屋|日本限定寬短版|48400|Transport / Bedale 日本限定無油寬版夾克|Barbour × 選貨店別注格紋內裡短版風衣|jacket|coat|www.japan.barbour.com/",
  "arcteryx-patagonia|Arc'teryx / Patagonia / DANTON|アークテリクス / パタゴニア / ダントン|global|outdoor,city|both|90|55000|戶外三大神牌！原宿始祖鳥旗艦店、澀谷 Patagonia 與日本國民化的法國 DANTON 菱格紋外套退稅超香|#8b1e24|想趁日幣低點入手始祖鳥 Mantis 背包、Patagonia Retro-X 抓絨與 DANTON 外套|原宿始祖鳥旗艦店·澀谷神南Patagonia·丸之內|福岡天神西通Patagonia·Mark Is始祖鳥·警固Bshop|心齋橋始祖鳥·梅田GRAND FRONT|四條烏丸Patagonia·京都BAL (Bshop)|札幌北口Patagonia·STELLAR PLACE|榮Patagonia·LACHIC|亞洲友善戶外剪裁|24200|Arc'teryx Mantis 26 背包 / Patagonia 抓絨|DANTON 法式圓領輕量羽絨 / 菱格紋夾克|bag|jacket|arcteryx.jp/",
  "carhartt-stussy-supreme|Supreme / Stüssy / Carhartt WIP|シュプリーム / ステューシー / カーハート|global|street,city|men|89|49000|美系街頭三巨頭在日本直營店超集中！原宿、澀谷、大阪堀江與福岡大名一條街就能同時逛完三家直營店|#c87d28|想朝聖日本 Supreme 直營店、買 Stüssy 日本巡迴 Tee 與 Carhartt 日本限定工裝的潮人|原宿/澀谷/代官山直營旗艦店|【大名神街】福岡大名三家直營路面店相距僅3分鐘！|【大阪橘街】南船場/堀江三家直營路面店林立|京都四條河原町 (Carhartt/Stüssy)|札幌南一條路面店|名古屋榮矢場町直營店|美式寬版街頭|29700|Carhartt Detroit 底特律外套 / Supreme Box Tee|Stüssy 日本限定巡迴短 Tee / 寬版工裝褲|jacket|tee|carhartt-wip.jp/",
  "salomon|Salomon Sportstyle|サロモン (XT-6 機能神鞋)|global|outdoor,city,mode|both|88|37600|東京澀谷與原宿街頭穿搭率第 1 名的機能越野鞋！XT-6 與 ACS Pro 在日本直營店配色最齊|#1a1a1a|想買一雙在日本日行兩萬步不腳痠、又極好搭寬褲與長裙的 XT-6 機能鞋|澀谷宮下公園直營店·原宿路面旗艦店·新宿|福岡天神選貨店 (BEAMS/UA/Billy's大名)|心齋橋路面店·梅田GRAND FRONT|京都藤井大丸·河原町Billy's|札幌STELLAR PLACE|榮名古屋PARCO|鞋版包覆建議大半號|28600|XT-6 GORE-TEX 防水機能越野慢跑鞋|ACS Pro / XT-6 奶油白銀配色慢跑鞋|shoe|shoe|salomon.jp/",
  "llbean-jp|L.L.Bean Japan Edition|エルエルビーン (日本獨佔Japan Edition)|global|city,outdoor,ivy|both|78|31500|美國百年老牌由日本前 BEAMS 買手操刀「日本獨佔 Japan Edition」寬短版型，Windy Ridge 風衣在日本爆紅|#14532d|想買專為日本 City Boy 改造的寬短版 Bean's 獵裝外套與 Boat and Tote 刺繡帆布包|吉祥寺旗艦店·新宿·自由之丘·原宿BEAMS/Bshop|福岡天神/博多AMU PLAZA·大名選貨|梅田LUCUA·難波Parks|京都四條/藤井大丸|札幌STELLAR PLACE|名古屋榮·名站|日本獨佔寬短箱型|24200|Japan Edition Windy Ridge 寬短版防潑水夾克|Boat and Tote 經典重磅帆布托特包 (可客製刺繡)|jacket|bag|www.llbean.co.jp/",
  "champion-jp|Champion Japan (日本直營限定)|チャンピオン (日本線 Reverse Weave)|global|city,street|both|81|54000|日本擁有獨立設計權！原宿與福岡大名直營店販售「日本限定版型 Reverse Weave 重磅衛衣」與復刻線|#1e293b|想買比美版更合亞洲身形、領口洗不鬆的日本直營店限定重磅連帽衫與短 Tee|原宿キャットストリート旗艦店·澀谷·新宿LUMINE EST|【大名路面店】Champion 福岡大名直營店·博多站|大阪堀江Orange Street直營店·梅田LUCUA|京都四條河原町直營店|札幌STELLAR PLACE直營店|名古屋榮PARCO直營店|日本線微寬落肩|12980|Reverse Weave 11.5oz 青標重磅連帽衛衣|T1011 重磅純棉口袋短袖 T-Shirt|tee|tee|www.hanesbrandsinc.jp/champion/",
  "newbalance-thouse|New Balance (T-HOUSE / 原宿旗艦)|ニューバランス (東京設計工作室 TDS)|global|city,outdoor,minimal|both|92|68000|東京日本橋「T-HOUSE 古民家概念店」與原宿四層樓全球旗艦店，獨賣 Tokyo Design Studio 與日本限定配色|#52525b|想朝聖全球唯一的日本橋 T-HOUSE 概念店，或入手日本限定配色 990v6 / 1906R 與服飾線|日本橋浜町「T-HOUSE New Balance」·原宿全球旗艦·銀座|福岡天神路面旗艦店 (天神西通)|大阪四ツ橋/心齋橋旗艦店·梅田GRAND FRONT|京都藤井大丸·四條河原町|札幌大通旗艦店|榮久屋大通公園旗艦店|標準D/2E楦頭皆有|22000|Tokyo Design Studio (TDS) 限定鞋款 / 1906R|990v6 / 2002R 元祖灰復古慢跑鞋|shoe|shoe|shop.newbalance.jp/",
  "agnesb-paulsmith|agnès b. / Paul Smith Japan|アニエスベー / ポール・スミス (日本專櫃支線)|global|minimal,ivy,feminine|both|76|44500|兩大歐洲名牌在日本擁有全球最大專櫃網與日本獨佔平價支線（To b. by agnès b.），日幣退稅價約台灣 6 折|#18181b|想趁日幣低點入手 agnès b. 經典珍珠釦開襟衫、尼龍包或 Paul Smith 彩條皮夾襯衫|青山旗艦店·銀座松屋·澀谷·新宿伊勢丹/小田急|福岡岩田屋本館·博多阪急·天神VIORO|梅田阪急·大丸心齋橋·難波高島屋|京都BAL (agnès b. 旗艦含Cafe)·三条Paul Smith|札幌大丸·丸井今井|名古屋高島屋·榮松坂屋|法英合身優雅|20900|agnès b. Cardigan Pressions 經典法國製開襟衫|agnès b. 經典Logo防潑水尼龍肩背包 / 貝雷帽|shirt|bag|www.agnesb.co.jp/",

  // ⑥ 裏原宿街頭、岡山丹寧與日本職人鞋包 (street)
  "onitsuka-asics-mizuno|Onitsuka Tiger / ASICS / Mizuno|鬼塚虎 / アシックス / ミズノ (日本三大潮鞋)|street|city,outdoor,feminine|both|97|64000|日本三大復古機能潮鞋！鬼塚虎 Mexico 66、ASICS KAYANO 14 與美津濃 Wave Prophecy 在日本買款式最齊且價差大|#d4a000|去日本必買一雙好走又時髦的 Mexico 66 金底、ASICS 銀色復古跑鞋或美津濃機能鞋|表參道鬼塚虎整棟旗艦·原宿ASICS旗艦·澀谷Mizuno|福岡大名鬼塚虎路面店·福岡PARCO·博多運河城|心齋橋三大品牌旗艦店齊聚·梅田GRAND FRONT|四條河原町路面店|札幌PARCO店|榮路面旗艦店|鞋版建議大半號|18700|ASICS GEL-KAYANO 14 / Mizuno Wave Prophecy|Onitsuka Tiger MEXICO 66 SD 金底/瑪莉珍鞋|shoe|shoe|www.onitsukatiger.com/jp/ja-jp/",
  "human-made|HUMAN MADE|ヒューマンメイド (NIGO)|street|street,city|men|95|29500|NIGO 主理愛心與飛鴨標誌！每週六發售日東京原宿、福岡大名與京都店必排隊|#b81d13|想買日本限定愛心竹節棉 T-Shirt、鴨子帽與托特包的潮人|原宿OFFLINE STORE·澀谷PARCO·新宿|福岡大名直營路面店 (OFFLINE STORE)|心齋橋PARCO·南船場直營店|京都1928直營店 (結合藍瓶咖啡)|札幌PARCO直營店|榮名古屋PARCO店|美式竹節棉微合身|12100|Heart 經典紅心竹節棉短 Tee|飛鴨刺繡棒球帽 / 帆布托特包|tee|bag|humanmade.jp/",
  "wtaps-nbhd|WTAPS / NEIGHBORHOOD|ダブルタップス / ネイバーフッド|street|street,outdoor|men|78|24600|裏原宿軍工裝教父雙雄，六袋軍褲、重磅工作襯衫與線香座是硬派男生死忠收藏|#25291c|著迷重磅軍事工裝、六袋軍褲（Jungle Stock）與硬派街頭的男生|青山W_Lab·原宿NBHD本店·澀谷PARCO|福岡大名HOODS FUKUOKA (大名1丁目)|南船場HOODS OSAKA (橘街旁)|四條河原町藤井大丸|札幌專賣店|名古屋矢場町HOODS|寬大硬挺軍裝|35200|Jungle 六袋軍裝長褲 / 交叉骨重磅T|Savage 水洗破壞丹寧外套|cargo|jacket|www.wtaps.com/",
  "wacko-undercover-ce|WACKO MARIA / UNDERCOVER / C.E|ワコマリア / アンダーカバー / シーイー|street|street,mode|men|73|25400|中目黑夏威夷衫 WACKO MARIA、青山高橋盾 UNDERCOVER 與 Sk8thing 主理賽博街頭 C.E (Cav Empt)|#1f1924|喜歡日本次文化音樂藝術、天絲夏威夷襯衫、C.E 水洗圖案衛衣與高辨識度街頭男裝|中目黑PARADISE TOKYO·南青山C.E與UNDERCOVER本店|福岡大名選貨名店·福岡岩田屋|梅田阪急男裝館·心齋橋PARCO·堀江|京都藤井大丸·四條選貨店|札幌PARCO周邊選貨|名古屋矢場町選貨店|寬短盒型/垂墜街頭|33000|WACKO MARIA 夏威夷衫 / C.E 水洗臂章重磅衛衣|UNDERCOVER 漢堡燈與暗黑解構圖案T|shirt|tee|wackomaria.co.jp/",
  "fr2-bape|#FR2 / A BATHING APE (BAPE)|エフアールツー / ア ベイシング エイプ|street|street|both|82|38900|原宿與福岡大名超人氣潮牌！#FR2 在東京、京都（紫兔）、福岡與柳川皆有「城市限定配色兔子 Tee」|#eab308|想收集 #FR2 各城市限定色 Smoking Kills 兔子短 Tee，或 BAPE 鯊魚連帽衫的潮人|原宿#FR2本店·表參道/澀谷BAPE旗艦店|福岡大名#FR2 FUKUOKA & BAPE 福岡店 (同條街！)|心齋橋筋#FR2 OSAKA·堀江BAPE|【京都限定紫兔】四條河原町 #FR2撫子 (町家店)|札幌狸小路/PARCO周邊|名古屋榮矢場町 #FR2 NAGOYA|街頭標準微寬|11000|#FR2 城市限定色 Smoking Kills 兔子短 Tee|BAPE 經典猿人頭迷彩短T / 鯊魚連帽外套|tee|jacket|fr2.tokyo/",
  "kapital|KAPITAL|キャピタル (岡山兒島丹寧)|street|denim,street|men|80|19200|岡山兒島丹寧藝術神牌！歐美潮人專程赴日掃貨 Boro 襤褸拼接與笑臉單品|#3d2b1f|想買岡山手工刷色牛仔褲、刺子外套與高辨識度笑臉單品的人|惠比壽三家直營店·六本木Hills|福岡大名直營路面店 (大名2丁目老宅)|阪急梅田男裝館·難波Parks|京都富小路通直營店|札幌大丸對面路面店|名古屋榮路面店|特殊解構寬鬆|29700|14oz 岡山赤耳丹寧褲 / 笑臉開襟衫|Boro 刺子拼接丹寧背心|pants|jacket|www.kapital.jp/",
  "momotaro-evisu|Momotaro Jeans / EVISU|桃太郎ジーンズ / エヴィス (岡山赤耳丹寧)|street|denim|men|74|22800|日本丹寧迷朝聖雙雄！岡山兒島「桃太郎（出陣二本線赤耳原牛）」與大阪發源「EVISU 手繪海鷗標牛仔褲」|#172554|想買一條可以養十年色落的 15.7oz 辛巴威棉岡山原色赤耳牛仔褲與丹寧外套|青山桃太郎旗艦店·高圓寺·表參道EVISU|福岡大名Denim專賣與選貨店|心齋橋筋EVISU與桃太郎直營店·梅田|京都新京極/四條河原町桃太郎直營店|札幌丹寧專賣店|名古屋榮丹寧選貨|經典直筒/修身錐形|30800|桃太郎 出陣 15.7oz 二本線赤耳原色丹寧褲|EVISU 經典手繪海鷗標 No.1 赤耳丹寧褲|pants|pants|www.momotarojeans.com/",
  "porter-mspc|PORTER (吉田包) / master-piece|ポーター / マスターピース (全日本製包袋)|street|city,outdoor,minimal|both|86|61000|全日本製國民包袋雙璧！吉田包 TANKER 飛行尼龍包與大阪堀江發源 MSPC 皮革機能拼接後背包|#1c1c1c|去日本想買一顆可以用十年的全日本製尼龍斜背包、公事包或防水後背包|表參道PORTER旗艦·澀谷PARCO·銀座MSPC|福岡PARCO 1F·博多AMU PLAZA|梅田GRAND FRONT·南船場MSPC大阪旗艦本店|京都富小路通PORTER町家店·中京區MSPC京都|札幌STELLAR PLACE|榮LACHIC·名古屋PARCO|包袋全尺寸|26400|PORTER TANKER 2WAY 飛行尼龍斜背公事包|MSPC Potential 防水皮革拼接機能後背包|bag|bag|www.yoshidakaban.com/",

  // ⑦ 日本人氣女裝全系列 (women)
  "snidel|SNIDEL|スナイデル|women|feminine|women|90|46000|日本女裝搜尋霸主！最懂亞洲女生顯瘦比例的高腰魚尾裙、碎花洋裝與澎袖針織|#8a4f5a|想買穿上立刻顯高顯瘦的約會長洋裝與魚尾裙的女生|新宿LUMINE 2·澀谷PARCO·表參道|福岡PARCO本館2F·博多阪急·岩田屋|梅田阪急·LUCUA·心齋橋大丸|藤井大丸·京都高島屋|札幌STELLAR PLACE|名古屋高島屋·PARCO|高腰修身顯瘦|16940||Sustainable 高腰顯瘦碎花長洋裝 / 魚尾裙|dress|dress|snidel.com/",
  "mila-owen|Mila Owen / FRAY I.D|ミラオーウェン / フレイアイディー|women|feminine,ivy|women|78|38200|日本輕熟通勤女神牌！金釦西裝外套與成套穿搭（Set-up）CP 值極高|#6e5a4f|想買百搭金釦西裝外套、成套針織裙與上班約會服的女生|新宿LUMINE 1/2·表參道·銀座|福岡PARCO 2F·岩田屋·博多阪急|梅田LUCUA·阪急·難波高島屋|藤井大丸·京都高島屋|札幌STELLAR PLACE|名古屋高島屋·LACHIC|俐落修長大人感|17600||金釦雙排釦西裝外套 / 成套針織長裙|coat|coat|milaowen.com/",
  "lilybrown-celford|Lily Brown / CELFORD|リリーブラウン / セルフォード|women|feminine|women|75|31400|USAGI ONLINE 旗下兩大王牌：Lily Brown 主打復古千金古著感；CELFORD 則是日劇財閥千金與正式場合洋裝首選|#9f5f66|喜歡復古小香風毛呢外套、宮廷袖襯衫或微正式千金感剪裁洋裝的女生|新宿LUMINE EST / LUMINE 2·澀谷·銀座三越|福岡PARCO本館·博多阪急·岩田屋|梅田阪急·EST·心齋橋大丸|京都藤井大丸·高島屋|札幌STELLAR PLACE·大丸|名古屋PARCO·高島屋|修身顯腰身比例|17930||復古金釦毛呢短版外套 / 千金感收腰長洋裝|coat|dress|lily-brw.com/",
  "clane-etre|CLANE / ETRÉ TOKYO|クラネ / エトレトウキョウ|women|mode,feminine|women|76|19800|松本惠奈主理 CLANE 與 ETRÉ TOKYO，立體弧形袖針織與大輪廓大衣是日本 IG 博主最愛|#3d312a|喜歡日本 IG 穿搭博主立體剪裁或時髦大人感不撞衫的女生|新宿LUMINE 2·表參道·澀谷|福岡岩田屋 3F (CLANE)·博多阪急|梅田LUCUA·阪急·心齋橋|京都高島屋·河原町|札幌大丸/札站選貨|名古屋高島屋·PARCO|立體時髦微寬|22000||CLANE 立體弧形澎袖針織 / 高腰繭型寬褲|shirt|dress|clane-design.com/",
  "todayful-ameri|TODAYFUL / Ameri VINTAGE|トゥデイフル / アメリヴィンテージ|women|mode,minimal,feminine|women|79|24500|東京時髦女生私服霸主！代官山 TODAYFUL 的鬆弛感羊毛大衣，與黑石奈央子 Ameri 的異材質拼接風衣極少撞衫|#4a3f35|不想穿甜美日雜風、追求東京代官山與表參道時尚編輯般率性層次感的女生|代官山TODAYFUL本店·表參道/新宿LUMINE 2 Ameri|福岡天神/大名直營與選貨·博多阪急|梅田LUCUA 1100·心齋橋路面店·堀江|京都藤井大丸周邊|札幌選貨專櫃|名古屋PARCO·榮|率性大廓形長版|27500||Ameri 異材質百褶拼接風衣 / TODAYFUL 羊毛大衣|coat|dress|amerivintage.co.jp/",
  "kastane-mystic|Kastane / mystic|カスタネ / ミスティック|women|mode,feminine,city|women|75|26400|PAL 集團超人氣年輕女裝！擅長透膚多層次疊穿、兩件式針織與微復古工裝裙|#5c4d42|喜歡日系多層次混搭、透膚上衣與高腰顯腿長寬褲的年輕女生|新宿LUMINE EST·澀谷·池袋·立川|福岡SOLARIA PLAZA·福岡PARCO|梅田HEP FIVE·難波City·天王寺|京都河原町OPA·京都站Porta|札幌STELLAR PLACE|名古屋PARCO·近鐵Pass'e|多層次修身微寬|7590||2WAY 鏤空多層次綁帶針織上衣 / 工裝長裙|shirt|dress|www.palcloset.jp/kastane/",
  "deuxieme-iena-plage|Deuxième Classe / IÉNA / Plage|ドゥーズィエム クラス / イエナ / プラージュ|women|minimal,ivy,feminine|women|77|39800|Baycrew’s 高階法式女裝三姊妹！丸之內與新宿貴婦、輕熟 OL 人手一件的法式針織與風衣|#4a443f|追求法式優雅鬆弛感、頂級親膚針織衫與修長風衣的輕熟女生|新宿LUMINE 1/2·丸之內·青山·代官山Plage|福岡PARCO / SOLARIA (IÉNA)·博多AMU PLAZA|梅田LUCUA 1100·GRAND FRONT·難波|京都四條通直營店·藤井大丸|札幌STELLAR PLACE|榮LACHIC·名古屋高島屋|法式優雅修長|24200||IÉNA 法式金釦羅紋針織開襟衫 / 垂墜長裙|shirt|coat|baycrews.jp/",
  "lowrys-earth|LOWRYS FARM / earth music|ローリーズファーム / アース|women|feminine,city|women|81|43500|日本平價百搭女裝代表！價格幾乎都在 ¥3,000–¥6,000，短版針織與高腰寬褲小資女必逛|#525e54|想用平價預算一次買齊整季實穿針織衫、長裙與日系日常女裝|新宿ミロード·澀谷·池袋太陽城·原宿|福岡PARCO·博多AMU EST·LaLaport|梅田LINKS / HEP FIVE·難波City·心齋橋|京都車站Porta·四條河原町|札幌STELLAR PLACE·大通|名古屋Gate Tower·榮|亞洲女生友善版型|4950||短版毛絨開襟針織衫 / 高腰打褶寬褲|shirt|skirt|www.dot-st.com/lowrysfarm/",
  "moussy-sly|MOUSSY / SLY|マウジー / スライ|women|mode,denim,feminine|women|77|31200|號稱「穿上腿長加 5 公分」的神級女裝牛仔褲（MVS FLARE 喇叭褲）與辣妹短版皮衣|#1c1917|想買日本女生公認最顯瘦、最修飾假跨寬的 MVS 喇叭牛仔褲與個性短版外套的女生|澀谷109旗艦店·新宿LUMINE EST·原宿|福岡PARCO本館·博多運河城|梅田EST·心齋橋筋·難波City|京都河原町OPA·京都站Avanti|札幌PARCO|名古屋PARCO·近鐵Pass'e|極致顯腿長高腰修身|18480||MVS FLARE 日本製高腰顯瘦微喇叭牛仔褲|pants|pants|www.moussy.ne.jp/"
];

const brands = PIPE_DATA.map((line, i) => {
  const r = line.split('|');
  const tm = TIER_META[r[3]] || TIER_META.select;
  const fti = Number(r[6]), rakuten = Number(r[7]);
  const rakutenScore = Math.min(100, Math.round(Math.log10(Math.max(100, rakuten)) * 20));
  const sc = Math.round(fti * 0.65 + rakutenScore * 0.35);
  const lv = sc>=88?'s-fire':sc>=75?'a-hot':sc>=62?'b-steady':'c-niche';
  const tierName = sc>=88?'🔥 S級・現象級熱門':sc>=75?'📈 A級・主流高人氣':sc>=62?'🌿 B級・質感常青款':'💎 C級・小眾行家牌';
  return {
    id:r[0], name:r[1], jp:r[2], origin:tm[0], tier:r[3], type:tm[1],
    styles:r[4].split(','), aud:r[5], accent:['olive','rust','slate','sand'][i%4],
    heat:{score:sc, fti, rakuten, level:lv, badge:`${tierName} (${sc}°)`, verdict:r[8]},
    color:r[9], bestFor:r[10], intro:`${r[10]}。${r[8]}。`,
    cityStores:{tokyo:r[11], fukuoka:r[12], osaka:r[13], kyoto:r[14], sapporo:r[15], nagoya:r[16]},
    cut:r[17], price:Number(r[18]), itemMen:r[19]||r[20], itemWomen:r[20]||r[19], typeMen:r[21]||r[22], typeWomen:r[22]||r[21], domain:r[23], url:'https://'+r[23]
  };
});

// 若設有 RAKUTEN_APP_ID 或 RAKUTEN_APPLICATION_ID，建置時自動呼叫樂天市場 API 更新最新商品數
const rakutenKey = process.env.RAKUTEN_APP_ID || process.env.RAKUTEN_APPLICATION_ID || "";
if (rakutenKey) {
  for (const b of brands) {
    try {
      const u = "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&applicationId=" + rakutenKey + "&keyword=" + encodeURIComponent(b.name.split(" / ")[0].split(" (")[0]) + "&hits=1";
      const res = await fetch(u);
      if (res.ok) {
        const d = await res.json();
        if (typeof d.count === "number" && d.count > 0) {
          b.heat.rakuten = d.count;
          const rScore = Math.min(100, Math.round(Math.log10(Math.max(100, d.count)) * 20));
          b.heat.score = Math.round(b.heat.fti * 0.65 + rScore * 0.35);
        }
      }
    } catch {}
  }
}

// 品牌名稱純文字排版卡（不畫假 LOGO，乾淨呈現品牌英文、日文、分類與男女裝定位）
function brandHeaderCard(b) {
  const audText = b.aud==='men'?'👔 男裝主打':b.aud==='women'?'👗 女裝專屬':'👫 男女皆有';
  return `<div class="brand-type-header" style="border-top:5px solid ${b.color}">
    <div class="brand-type-top">
      <span class="brand-origin-tag">${e(b.origin)} · ${e(b.type)}</span>
      <span class="brand-aud-tag ${b.aud}">${audText}</span>
    </div>
    <a class="brand-title-link" href="/brands/${b.id}">
      <span class="brand-en-name">${e(b.name)}</span>
      <span class="brand-jp-name">${e(b.jp)}</span>
    </a>
  </div>`;
}

function styleCardHtml(s) {
  return `<article class="style-card" data-style-gender="${e(s.gender)}">
    <div class="style-photo-wrap">
      ${styleLookbookSvg(s)}
      <span class="style-gender-tag">${s.gender==='men'?'👔 男生專屬風格':s.gender==='women'?'👗 女生專屬風格':'👫 男女共穿風格'}</span>
    </div>
    <div class="style-card-body">
      <h3>${e(s.name)} <span>${e(s.zh)}</span></h3>
      <div class="style-formula-pills">${s.items.map((it,idx)=>`<span class="formula-pill"><strong>${idx+1}</strong>${e(it)}</span>`).join('')}</div>
      <p>${e(s.note)}</p>
      <div class="style-card-foot"><span>代表：<strong>${e(s.brands)}</strong></span><button type="button" class="text-btn" data-pick-style="${s.id}">篩選此風格品牌 ↓</button></div>
    </div>
  </article>`;
}

const renderHeat = b => `<div class="heat-meter-wrap"><div class="heat-meter-top"><span class="heat-badge ${b.heat.level}">${e(b.heat.badge)}</span><span class="heat-score-text">Trends <strong>${b.heat.fti}</strong> · 樂天 <strong>${b.heat.rakuten.toLocaleString()}</strong>件</span></div><div class="heat-bar-track"><div class="heat-bar-fill ${b.heat.level}" style="width:${b.heat.score}%"></div></div><p class="heat-verdict">${e(b.heat.verdict)}</p></div>`;

const card = (b, i=0) => {
  const svgMen = itemThumbSvg(b.typeMen, b.color, '#ffffff');
  const svgWomen = itemThumbSvg(b.typeWomen, b.color, '#ffffff');
  return `<article class="brand-card ${b.accent}" data-id="${e(b.id)}" data-name="${e(b.name)}" data-price="${b.price}" data-heat="${b.heat.score}" data-aud="${e(b.aud)}" data-style="${e(b.styles.join(','))}" data-tier="${e(b.tier)}" data-item-men="${e(b.itemMen)}" data-item-women="${e(b.itemWomen)}" data-stores='${e(JSON.stringify(b.cityStores))}' data-hay="${e((b.name+' '+b.jp+' '+b.bestFor+' '+b.heat.verdict+' '+b.itemMen+' '+b.itemWomen+' '+Object.values(b.cityStores).join(' ')).toLowerCase())}">
  ${brandHeaderCard(b)}
  <div class="brand-copy">
    ${renderHeat(b)}
    <p class="best-for-box"><strong>💡 誰該買：</strong>${e(b.bestFor)}</p>
    <div class="item-showcase-box">
      <div class="item-svg-slot" data-svg-men>${svgMen}</div>
      <div class="item-svg-slot" data-svg-women hidden>${svgWomen}</div>
      <div class="item-showcase-info">
        <span class="item-showcase-label" data-item-label>${b.aud==='women'?'👗 女裝必買代表單品：':'👔 主力必買代表單品：'}</span>
        <strong class="item-showcase-name" data-item-name>${e(b.aud==='women'?b.itemWomen:b.itemMen)}</strong>
        <span class="item-showcase-price">${yen(b.price)}~ <em>(${twd(b.price)})</em></span>
      </div>
    </div>
    <div class="city-store-callout"><span class="city-store-label">📍 <strong data-city-name>東京 Tokyo</strong> 哪裡買：</span><p class="city-store-text" data-city-store>${e(b.cityStores.tokyo)}</p><a class="city-map-link" data-city-map href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name.split(' (')[0]+' 東京')}" target="_blank" rel="noopener">在 Google Maps 開啟東京店鋪位置 ↗</a></div>
    <div class="card-foot"><div class="tags">${b.styles.map(s=>`<span class="tag">${e(styles.find(x=>x.id===s)?.name.split(' ')[0]||s)}</span>`).join('')}</div><span class="cut-note">📏 ${e(b.cut)}</span></div>
  </div>
</article>`;
};

// 固定於畫面頂端的全局控制列（無 STEP 字樣，下滑隨時可切換男女裝與城市）
const stickyControlBar = () => {
  const menCnt = brands.filter(b=>b.aud!=='women').length;
  const womenCnt = brands.filter(b=>b.aud!=='men').length;
  return `<div class="sticky-control-bar"><div class="wrap sticky-bar-inner">
    <div class="sticky-group">
      <span class="sticky-label">穿搭對象：</span>
      <div class="gender-pills">
        <button type="button" class="gender-pill active" data-global-gender="all">✨ 全部 (${brands.length}組/逾120品牌)</button>
        <button type="button" class="gender-pill" data-global-gender="men">👔 男生穿搭 Men (${menCnt}組 · 排除純女裝)</button>
        <button type="button" class="gender-pill" data-global-gender="women">👗 女生穿搭 Women (${womenCnt}組 · 排除純男裝)</button>
      </div>
    </div>
    <div class="sticky-group">
      <span class="sticky-label">日本城市：</span>
      <div class="city-quick-pills">
        ${cities.map((c,i)=>`<button type="button" class="city-pill ${i===0?'active':''}" data-select-city="${c.id}" data-label="${e(c.name)}">📍 ${e(c.name.split(' ')[0])}</button>`).join('')}
      </div>
    </div>
  </div>
  <div id="gender-status-banner" class="gender-status-banner" hidden><div class="wrap" id="gender-status-text"></div></div>
</div>`;
};

const cityExplorer = () => `<section class="wrap city-explorer-section" id="city-guide"><p class="eyebrow">JAPAN 6-CITY SHOPPING GUIDE (預設：東京 TOKYO)</p><h2>你這趟去日本哪個城市？直接看當地能買什麼牌子、在哪裡買。</h2><p class="muted">預設顯示<strong>東京 Tokyo</strong>；點擊切換福岡、大阪、京都（含山と道/Goldwin町家店）、札幌或名古屋，全站品牌卡會同步切換為該城市的百貨或路面店地址！</p>
  <div class="city-tabs">${cities.map((c,i)=>`<button type="button" class="city-tab ${i===0?'active':''}" data-select-city="${c.id}" data-label="${e(c.name)}"><strong>📍 ${e(c.name)}</strong><span>${e(c.tag)}</span></button>`).join('')}</div>
  <div class="city-panels">${cities.map((c,i)=>`<div class="city-panel" data-city-panel="${c.id}" ${i===0?'':'hidden'}><div class="city-panel-head"><div><span class="eyebrow">CITY ROUTE · ${c.id.toUpperCase()}</span><h3>🗾 去「${e(c.name)}」逛街：商圈動線與品牌位置一覽</h3><p>${e(c.summary)}</p></div><a class="button dark" href="#directory">往下看 ${e(c.name.split(' ')[0])} 品牌卡 ↓</a></div><div class="city-zones-grid">${c.zones.map(z=>`<div class="city-zone-card"><h4>${e(z[0])}</h4><p>${e(z[1])}</p></div>`).join('')}</div><div class="city-brand-chips">${brands.map(b=>`<a href="/brands/${b.id}" class="city-brand-item" data-aud="${e(b.aud)}"><div class="city-brand-top"><strong>${e(b.name)}</strong><span class="heat-mini ${b.heat.level}">${b.heat.score}°</span></div><span class="city-brand-loc">📍 ${e(b.cityStores[c.id])}</span></a>`).join('')}</div></div>`).join('')}</div></section>`;

const heatMethodBox = () => `<div class="heat-method-banner">
  <div><strong>📊 熱度指數 (54°–99°) 真實數據來源說明（FTI Google Trends JP ＋ 日本樂天市場 Rakuten Ichiba API）</strong><p>採兩項可驗證指標加權計算：<strong>① FTI 保存之 Google Trends 日本搜尋指數 (65%)</strong> ＋ <strong>② 日本樂天市場 (Rakuten Ichiba API) 品牌商品流通件數對數指數 (35%)</strong>（每張卡片右上角皆標註 Trends 分數與樂天商品件數；可隨時用下方排序切換「🔥 大眾熱門優先」或「💎 小眾不撞衫優先」）：</p></div>
  <div class="heat-legend-grid">
    <span class="heat-legend-item"><i class="dot s-fire"></i><strong>🔥 S級 現象級熱門 (88°–99°)：</strong>搜尋量與流通量雙高（UNIQLO、mont-bell、Ralph Lauren、DESCENTE 水沢羽絨、鬼塚虎）</span>
    <span class="heat-legend-item"><i class="dot a-hot"></i><strong>📈 A級 主流高人氣 (75°–87°)：</strong>日本山系與百貨主力（山と道、Goldwin、NANGA、Needles、Tommy、COS、PLST）</span>
    <span class="heat-legend-item"><i class="dot b-steady"></i><strong>🌿 B級 質感常青款 (62°–74°)：</strong>內行人穩定指名（AURALEE、COMOLI、A.PRESSE、SHINYAKOZUKA、1LDK、BIOTOP）</span>
    <span class="heat-legend-item"><i class="dot c-niche"></i><strong>💎 C級 小眾行家牌 (54°–61°)：</strong>極少撞衫的東京買手店寶藏（TEATORA、Graphpaper、stein / YOKE、MARKAWARE、CULLNI）</span>
  </div>
</div>`;

const directorySection = () => `<section class="wrap section" id="directory"><div class="section-title"><div><p class="eyebrow">COMPLETE JAPAN BRAND ENCYCLOPEDIA</p><h2>全站收錄 ${brands.length} 大代表組（逾 120 個日本與國際品牌）：從大眾平價、頂級山系（山と道/Goldwin/DESCENTE）到小眾神牌（SHINYAKOZUKA/A.PRESSE）。</h2></div><span id="results-count" class="count-pill">顯示 ${brands.length} / ${brands.length} 組品牌</span></div>
  ${heatMethodBox()}
  <div class="filter-panel"><div class="preset-bar">${[
    ['all',`✨ 全部品牌 (${brands.length}組/120+牌)`],
    ['outdoor','⛰️ 日本頂級山系與機能 (山と道/Goldwin/DESCENTE水沢羽絨/mont-bell/TEATORA/NANGA)'],
    ['niche','🎨 日本小眾與前衛設計 (SHINYAKOZUKA/AURALEE/COMOLI/A.PRESSE/Needles/sacai/三宅/山本耀司)'],
    ['global','🌍 歐美經典與國際名牌日本買 (Ralph Lauren/Tommy/COS/A.P.C./Margiela/始祖鳥/L.L.Bean JP)'],
    ['select','🧭 日本必逛選貨店 (BEAMS/UA/TOMORROWLAND/1LDK/BIOTOP/FREAK’S)'],
    ['street','🛹 裏原宿・丹寧・鞋包 (HUMAN MADE/WTAPS/#FR2/KAPITAL/桃太郎/鬼塚虎/ASICS)'],
    ['mass','💰 國民平價與迅銷 (UNIQLO/GU/PLST/Workman/GLOBAL WORK/niko and...)'],
    ['women','👗 日本人氣女裝專區 (SNIDEL/Mila Owen/CLANE/Ameri/Deuxième Classe/MOUSSY)']
  ].map((p,i)=>`<button type="button" class="preset-chip ${i===0?'active':''}" data-tier="${p[0]}">${p[1]}</button>`).join('')}</div>
  <div class="filter-controls"><input id="q-input" type="search" placeholder="搜尋 SHINYAKOZUKA、山と道、Goldwin、DESCENTE、Ralph Lauren、Tommy、COS、PLST…"><select id="style-sel"><option value="all">所有 8 大穿搭風格</option>${styles.map(s=>`<option value="${s.id}">${e(s.name)} ·${e(s.zh)}</option>`).join('')}</select><select id="city-sel">${cities.map(c=>`<option value="${c.id}">📍 顯示「${e(c.name)}」店鋪</option>`).join('')}</select><select id="sort-sel"><option value="heat-desc">🔥 熱度：從大眾熱門 ➔ 小眾私房</option><option value="heat-asc">💎 小眾度：從小眾行家牌 (SHINYAKOZUKA/TEATORA) ➔ 大眾</option><option value="price-asc">💰 價格：從平價好入手 ➔ 頂級單品</option></select></div></div>
  <div id="brand-grid" class="brand-grid">${brands.map((b,i)=>card(b,i)).join('')}</div></section>`;

const shell = (t, d, b) => `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(t)} | TOKI 日本品牌選物誌</title><meta name="description" content="${e(d)}"><link rel="stylesheet" href="/styles.css"><script type="module" src="/app.mjs"></script></head><body><header class="site-header"><div class="wrap nav-inner"><a class="wordmark" href="/">TOKI<span>日本品牌與城市逛街百科 V6</span></a><nav id="main-nav"><a href="/#city-guide">📍 6 大城市逛街地圖 (預設東京)</a><a href="/#styles">👕 8 大穿搭風格圖鑑</a><a href="/#directory">🔥 120+ 品牌與代表單品</a><a href="/trends">📊 FTI × 樂天熱度榜</a></nav></div></header>${stickyControlBar()}<main id="main">${b}</main><footer class="site-footer"><div class="wrap"><p><strong>TOKI 日本品牌選物誌 V6</strong> · 預設東京，涵蓋東京、福岡、大阪、京都、札幌、名古屋 6 大城市與逾 120 個日本必買大眾、小眾、山系與國際品牌指南。</p></div></footer></body></html>`;

const pages = new Map(), add = (u, t, d, b) => pages.set(u, shell(t, d, b));
add('/', '日本買衣服最直覺的品牌與城市攻略', '預設東京，收錄逾 120 個日本與國際品牌（含 SHINYAKOZUKA、DESCENTE 水沢羽絨、山と道、Goldwin、Ralph Lauren、Tommy Hilfiger、COS、PLST）。', `<section class="wrap hero"><div><p class="eyebrow">TOKYO & JAPAN 6-CITY SHOPPING ENCYCLOPEDIA</p><h1>去日本買衣服，<br><span>大眾、山系、小眾設計師與國際名牌全收錄。</span></h1><p>預設顯示<strong>東京 Tokyo</strong>（頂部固定列下滑也能隨時切換<strong>男生／女生穿搭</strong>與<strong>福岡、大阪、京都、札幌、名古屋</strong>）。現已完整收錄<strong>逾 120 個品牌</strong>：包含日本小眾神牌（<strong>SHINYAKOZUKA、A.PRESSE、stein/YOKE、TEATORA、Needles、visvim</strong>）、頂級山系機能（<strong>山と道 Yamatomichi、Goldwin、DESCENTE 水沢羽絨、NANGA</strong>）以及在日本買最划算的國際品牌（<strong>Polo Ralph Lauren、Tommy Hilfiger、COS、PLST、Theory、Margiela、始祖鳥、L.L.Bean JP</strong>）。</p><div class="hero-actions"><a class="button dark" href="#directory">🔥 直接看 120+ 品牌與小眾神牌 ↓</a><a class="button light" href="#styles">👕 看 8 大穿搭風格圖鑑 ↓</a></div></div><div id="hero-showcase"><div data-hero-card="all">${styleCardHtml(styles[0])}</div><div data-hero-card="men" hidden>${styleCardHtml(styles[2])}</div><div data-hero-card="women" hidden>${styleCardHtml(styles[6])}</div></div></section>${cityExplorer()}<section class="wrap section" id="styles"><div class="section-title"><div><p class="eyebrow">8 ICONIC JAPANESE STYLE FORMULAS</p><h2>八大日本穿搭風格公式（內建高解析三件組穿搭圖鑑）</h2><p class="muted">點擊頂部固定列「男生穿搭」或「女生穿搭」可自動篩選適合你的風格；點擊卡片下方按鈕可直接篩出該風格的品牌。</p></div></div><div class="style-grid" id="style-grid">${styles.map(s=>styleCardHtml(s)).join('')}</div></section>${directorySection()}`);
add('/brands', '日本必買品牌百科資料庫', '完整品牌收錄。', cityExplorer() + directorySection());
add('/styles', '八大日本穿搭風格公式與範例圖', '8 大日本主流與小眾穿搭風格範例。', `<section class="wrap section"><h1>八大日本穿搭風格公式（附三件組穿搭圖鑑）</h1><div class="style-grid">${styles.map(s=>styleCardHtml(s)).join('')}</div></section>`);
add('/trends', '日本品牌熱度排行榜與 FTI × 樂天 API 計算方法', '熱度分級總覽。', `<section class="wrap section"><h1>📊 日本必買品牌熱度分級榜 (FTI × 樂天市場 API)</h1>${heatMethodBox()}<div class="brand-grid">${[...brands].sort((a,b)=>b.heat.score-a.heat.score).map((b,i)=>card(b,i)).join('')}</div></section>`);
add('/releases', '發售筆記', '最新發售資訊。', directorySection());
add('/journal', '日本各城市逛街攻略', '東京、福岡、大阪逛街指南。', cityExplorer());
add('/methods', '熱度指數與 Rakuten API 串接說明', '熱度指數計算公式說明。', `<section class="wrap section"><h1>資料與熱度指數計算方法（FTI ＋ 樂天市場 API）</h1>${heatMethodBox()}</section>`);
add('/privacy', '隱私說明', '無追蹤器。', `<section class="wrap section"><h1>隱私說明</h1><p>純靜態日本服飾選物指南。</p></section>`);
add('/404', '找不到頁面', '404', `<section class="wrap section"><h1>404 找不到頁面</h1><a class="button dark" href="/">返回首頁</a></section>`);

for (const b of brands) {
  add('/brands/' + b.id, `${b.name} 日本購買與各城市店鋪指南`, b.bestFor, `<section class="wrap brand-hero"><div><p class="eyebrow">${e(b.origin)} · ${e(b.type)}</p><h1>${e(b.name)} <span>${e(b.jp)}</span></h1>${renderHeat(b)}<p class="best-for-box"><strong>💡 誰該買：</strong>${e(b.bestFor)}</p><p>${e(b.intro)}</p>
  <div class="detail-items-grid">
    <div class="item-showcase-box">${itemThumbSvg(b.typeMen, b.color, '#fff')}<div class="item-showcase-info"><span class="item-showcase-label">👔 男裝／主力必買單品：</span><strong>${e(b.itemMen)}</strong><span class="item-showcase-price">${yen(b.price)}~ (${twd(b.price)})</span></div></div>
    <div class="item-showcase-box">${itemThumbSvg(b.typeWomen, b.color, '#fff')}<div class="item-showcase-info"><span class="item-showcase-label">👗 女裝／人氣必買單品：</span><strong>${e(b.itemWomen)}</strong><span class="item-showcase-price">${yen(b.price)}~ (${twd(b.price)})</span></div></div>
  </div>
  <div class="hero-actions"><a class="button dark" href="${e(b.url)}" target="_blank" rel="noopener">前往 ${e(b.name)} 官網 ↗</a><a class="button light" href="/#directory">← 返回全部品牌列表</a></div></div><div>${brandHeaderCard(b)}</div></section><section class="wrap section"><h2>📍 ${e(b.name)} 在日本 6 大城市哪裡買？（預設首選：東京）</h2><div class="city-zones-grid">${cities.map(c=>`<div class="city-zone-card"><h4>📍 ${e(c.name)}</h4><p>${e(b.cityStores[c.id])}</p><a class="city-map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name.split(' (')[0]+' '+c.name)}" target="_blank" rel="noopener">開啟 Google Maps 導航 ↗</a></div>`).join('')}</div></section>`);
}

const CSS = `:root{--paper:#f6f3ed;--ink:#282b24;--olive:#536348;--muted:#686b60;--line:#d6d2c7;--hot-s:#c92a2a;--hot-a:#d9531e;--hot-b:#2f6f4e;--hot-c:#2b4c7e}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:"DM Sans","Noto Sans TC",sans-serif;line-height:1.68}a{color:inherit;text-decoration:none}[hidden]{display:none!important}.wrap{width:min(1280px,calc(100% - 36px));margin-inline:auto}.site-header{background:var(--paper);border-bottom:1px solid var(--line)}.nav-inner{display:flex;justify-content:space-between;align-items:center;min-height:56px;gap:14px;flex-wrap:wrap}.wordmark{font-weight:800;font-size:23px}.wordmark span{font-size:12px;font-weight:500;margin-left:8px;color:var(--muted)}#main-nav{display:flex;gap:18px;font-size:13.5px;font-weight:600;flex-wrap:wrap}.sticky-control-bar{position:sticky;top:0;z-index:100;background:rgba(34,37,31,.97);color:#f6f3ed;padding:10px 0;box-shadow:0 4px 16px rgba(0,0,0,.18);backdrop-filter:blur(8px)}.sticky-bar-inner{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.sticky-group{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.sticky-label{font-size:12.5px;font-weight:700;color:#d6d2c7}.gender-pills,.city-quick-pills{display:flex;gap:6px;flex-wrap:wrap}.gender-pill,.city-pill{background:rgba(255,255,255,.1);color:#f6f3ed;border:1px solid rgba(255,255,255,.22);padding:6px 13px;border-radius:99px;font-size:12.5px;font-weight:700;cursor:pointer;transition:.15s}.gender-pill.active{background:#ffdf00;color:#111;border-color:#ffdf00}.city-pill.active{background:#f6f3ed;color:#111;border-color:#f6f3ed}.gender-status-banner{background:#fff8db;border-top:1px solid #e6c84f;padding:7px 0;margin-top:8px;font-size:13px;font-weight:700;color:#222}.hero,.brand-hero{display:grid;grid-template-columns:1.05fr .95fr;gap:28px;padding:28px 0;align-items:center}h1{font-size:clamp(26px,3.6vw,42px);line-height:1.2;margin:8px 0 12px}h1 span{color:var(--olive)}h2{font-size:clamp(20px,2.4vw,29px);margin:6px 0 10px}.eyebrow{font-size:11px;font-weight:800;letter-spacing:.12em;color:var(--muted);margin:0}.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.button{display:inline-flex;align-items:center;padding:10px 18px;border-radius:6px;font-weight:700;font-size:14px}.button.dark{background:var(--ink);color:var(--paper)}.button.light{border:1px solid var(--ink)}.section,.city-explorer-section{padding:28px 0;border-top:1px solid var(--line)}.city-tabs{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:14px 0}.city-tab{background:#fff;border:1.5px solid var(--line);border-radius:8px;padding:10px;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:4px}.city-tab.active{background:var(--ink);color:#fff;border-color:var(--ink)}.city-tab span{font-size:11px;opacity:.8}.city-panel{background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px}.city-panel-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:14px}.city-zones-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}.city-zone-card{background:#f9f7f2;border:1px solid var(--line);border-radius:8px;padding:14px}.city-zone-card h4{margin:0 0 6px}.city-brand-chips{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.city-brand-item{background:#f6f3ed;border:1px solid var(--line);border-radius:8px;padding:9px;display:flex;flex-direction:column;gap:4px}.city-brand-top{display:flex;justify-content:space-between;font-size:13px}.city-brand-loc{font-size:11px;color:var(--muted)}.style-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.style-card{background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden;display:flex;flex-direction:column}.style-photo-wrap{position:relative;background:#ebe4d6;border-bottom:1px solid var(--line)}.style-lookbook-svg{width:100%;height:auto;display:block}.style-gender-tag{position:absolute;top:10px;right:10px;background:rgba(20,22,18,.84);color:#fff;font-size:11px;font-weight:700;padding:3px 9px;border-radius:99px}.style-card-body{padding:14px;display:flex;flex-direction:column;gap:8px;flex:1}.style-card-body h3{font-size:17px;margin:0}.style-card-body h3 span{font-size:12.5px;color:var(--muted);font-weight:500;margin-left:6px}.style-formula-pills{display:flex;flex-wrap:wrap;gap:5px}.formula-pill{background:#f3f0e8;border:1px solid #dcd6c8;font-size:11.5px;padding:2px 8px;border-radius:4px;font-weight:600}.style-card-body p{font-size:13px;color:#444;margin:0;flex:1}.style-card-foot{border-top:1px solid var(--line);padding-top:8px;font-size:12px;display:flex;justify-content:space-between;align-items:center;gap:6px}.text-btn{background:var(--ink);color:#fff;border:0;padding:5px 10px;border-radius:4px;font-size:11.5px;font-weight:700;cursor:pointer}.brand-type-header{background:#fcfbf8;padding:14px 15px 12px;border-bottom:1px solid var(--line)}.brand-type-top{display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;font-size:11px;font-weight:700}.brand-origin-tag{color:var(--muted)}.brand-aud-tag{padding:2px 8px;border-radius:4px;font-size:11px}.brand-aud-tag.men{background:#e3ecf5;color:#1d3b58}.brand-aud-tag.women{background:#f7e4e8;color:#6e2b3b}.brand-aud-tag.both{background:#e8ede4;color:#2f4f38}.brand-title-link{display:block}.brand-en-name{display:block;font-size:20px;font-weight:900;letter-spacing:-.02em;line-height:1.25;color:#111}.brand-jp-name{display:block;font-size:12px;color:var(--muted);margin-top:2px;font-weight:500}.heat-method-banner{background:#fff;border:1.5px solid #d5cfc2;border-radius:10px;padding:14px 16px;margin:12px 0}.heat-method-banner p{margin:4px 0 10px;font-size:13px;color:#444}.heat-legend-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:12px}.heat-legend-item{display:flex;align-items:center;gap:6px}.dot{width:10px;height:10px;border-radius:50%;display:inline-block;flex-shrink:0}.filter-panel{background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px;margin:14px 0}.preset-bar{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}.preset-chip{background:#f6f3ed;border:1px solid var(--line);padding:6px 12px;border-radius:99px;font-size:12.5px;font-weight:700;cursor:pointer}.preset-chip.active{background:var(--ink);color:#fff}.filter-controls{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:8px}.filter-controls input,.filter-controls select{padding:9px;border:1px solid var(--line);border-radius:6px;font-size:13.5px}.brand-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.brand-card{background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden;display:flex;flex-direction:column;position:relative}.brand-copy{padding:14px;display:flex;flex-direction:column;gap:9px;flex:1}.heat-meter-wrap{background:#fbf9f5;border:1px solid #e6e0d4;border-radius:8px;padding:8px 10px}.heat-meter-top{display:flex;justify-content:space-between;align-items:center;font-size:11.5px;margin-bottom:5px}.heat-badge,.heat-mini{font-weight:800;font-size:11px;padding:2px 8px;border-radius:99px;color:#fff}.s-fire{background:var(--hot-s)}.a-hot{background:var(--hot-a)}.b-steady{background:var(--hot-b)}.c-niche{background:var(--hot-c)}.heat-bar-track{height:7px;background:#e5e0d5;border-radius:99px;overflow:hidden}.heat-bar-fill{height:100%;border-radius:99px}.heat-verdict{font-size:12px;color:#444;margin:5px 0 0}.best-for-box{background:#f3f5f0;border-left:3px solid var(--olive);padding:6px 9px;font-size:12.5px;margin:0}.item-showcase-box{display:flex;align-items:center;gap:10px;background:#f8f6f0;border:1px solid #e2ddd2;border-radius:8px;padding:8px}.item-photo-thumb{width:58px;height:58px;border-radius:6px;flex-shrink:0;border:1px solid #d5cfc2;background:#f4f1ea;display:block}.item-showcase-info{display:flex;flex-direction:column;font-size:12px;line-height:1.4}.item-showcase-label{font-size:11px;color:var(--muted);font-weight:700}.item-showcase-name{color:#111;font-size:13px}.item-showcase-price{font-weight:800;color:var(--hot-a)}.item-showcase-price em{font-style:normal;color:var(--muted);font-weight:500}.detail-items-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0}.city-store-callout{background:#fff8eb;border:1px solid #edd8b4;border-radius:8px;padding:9px;font-size:12px}.city-store-text{margin:3px 0;font-weight:600}.city-map-link{color:#b34700;font-weight:700}.card-foot{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:8px;border-top:1px solid var(--line);font-size:11.5px}.tag{font-size:11px;background:#f0ede6;padding:2px 7px;border-radius:4px;margin-right:4px}.cut-note{color:var(--muted)}.site-footer{background:#eae6dc;padding:28px 0;margin-top:40px;border-top:1px solid var(--line)}@media(max-width:1024px){.brand-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:720px){.hero,.brand-hero,.style-grid,.city-zones-grid,.brand-grid,.filter-controls,.heat-legend-grid,.detail-items-grid{grid-template-columns:1fr}.city-tabs,.city-brand-chips{grid-template-columns:repeat(2,1fr)}}`;

const APP_JS = `const st={gender:'all',tier:'all',style:'all',city:'tokyo',q:'',sort:'heat-desc'};
function apply(){
  document.querySelectorAll('[data-global-gender]').forEach(b=>b.classList.toggle('active',b.dataset.globalGender===st.gender));
  document.querySelectorAll('[data-tier]').forEach(b=>b.classList.toggle('active',b.dataset.tier===st.tier));
  document.querySelectorAll('[data-select-city]').forEach(b=>b.classList.toggle('active',b.dataset.selectCity===st.city));
  document.querySelectorAll('[data-city-panel]').forEach(p=>p.hidden=p.dataset.cityPanel!==st.city);
  document.querySelectorAll('[data-hero-card]').forEach(h=>h.hidden=h.dataset.heroCard!==st.gender);
  const banner=document.getElementById('gender-status-banner'), bTxt=document.getElementById('gender-status-text');
  if(banner&&bTxt){
    if(st.gender==='all'){banner.hidden=true;}
    else{
      banner.hidden=false;
      bTxt.textContent=st.gender==='men'?'👔 已切換「男生穿搭 Men」：已排除 Workman Colors、SNIDEL、CLANE 等純女裝，並優先顯示 SHINYAKOZUKA、A.PRESSE、COMOLI、WTAPS、WORKMAN Plus 等男裝與男裝單品！':'👗 已切換「女生穿搭 Women」：已排除 WTAPS、COMOLI、SHINYAKOZUKA 等純男裝，並優先顯示 SNIDEL、Mila Owen、CLANE、Ameri VINTAGE、CFCL、Workman Colors 等女裝與女裝單品！';
    }
  }
  document.querySelectorAll('.style-card[data-style-gender]').forEach(sc=>{
    if(sc.closest('#hero-showcase')) return;
    sc.hidden=st.gender!=='all'&&!sc.dataset.styleGender.split(',').includes(st.gender);
  });
  document.querySelectorAll('.city-brand-item').forEach(el=>{
    const aud=el.dataset.aud;
    el.hidden=st.gender==='men'?aud==='women':st.gender==='women'?aud==='men':false;
  });
  const cSel=document.getElementById('city-sel'); if(cSel&&cSel.value!==st.city)cSel.value=st.city;
  const sSel=document.getElementById('style-sel'); if(sSel&&sSel.value!==st.style)sSel.value=st.style;
  const cBtn=document.querySelector('.city-tab[data-select-city="'+st.city+'"]'), cLabel=cBtn?cBtn.dataset.label:'東京 Tokyo';
  const grid=document.getElementById('brand-grid'); if(!grid)return;
  const cards=[...grid.querySelectorAll('.brand-card')]; let shown=0;
  cards.forEach(c=>{
    const stores=JSON.parse(c.dataset.stores||'{}'), addr=stores[st.city]||stores.tokyo||'日本主要百貨';
    const nEl=c.querySelector('[data-city-name]'), sEl=c.querySelector('[data-city-store]'), mEl=c.querySelector('[data-city-map]');
    if(nEl)nEl.textContent=cLabel; if(sEl)sEl.textContent=addr;
    if(mEl){mEl.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(c.dataset.name.split(' (')[0]+' '+cLabel.split(' ')[0]);mEl.textContent='在 Google Maps 開啟'+cLabel.split(' ')[0]+'店鋪位置 ↗';}
    const iLbl=c.querySelector('[data-item-label]'), iName=c.querySelector('[data-item-name]');
    const svgM=c.querySelector('[data-svg-men]'), svgW=c.querySelector('[data-svg-women]');
    const showWomen = st.gender==='women' || (st.gender==='all' && c.dataset.aud==='women');
    if(svgM&&svgW){svgM.hidden=showWomen; svgW.hidden=!showWomen;}
    if(iLbl&&iName){
      iLbl.textContent=showWomen?'👗 女裝必買代表單品：':'👔 男裝／主力代表單品：';
      iName.textContent=showWomen?c.dataset.itemWomen:c.dataset.itemMen;
    }
    const aud=c.dataset.aud;
    const okG=st.gender==='all'||(st.gender==='men'&&aud!=='women')||(st.gender==='women'&&aud!=='men');
    const okT=st.tier==='all'||c.dataset.tier===st.tier;
    const okS=st.style==='all'||c.dataset.style.split(',').includes(st.style);
    const okQ=!st.q||c.dataset.hay.includes(st.q.toLowerCase());
    const vis=okG&&okT&&okS&&okQ;
    c.hidden=!vis; if(vis)shown++;
  });
  cards.sort((a,b)=>{
    if(st.gender==='women'&&(a.dataset.aud==='women')!==(b.dataset.aud==='women')) return a.dataset.aud==='women'?-1:1;
    if(st.gender==='men'&&(a.dataset.aud==='men')!==(b.dataset.aud==='men')) return a.dataset.aud==='men'?-1:1;
    if(st.sort==='price-asc') return Number(a.dataset.price)-Number(b.dataset.price);
    if(st.sort==='heat-asc') return Number(a.dataset.heat)-Number(b.dataset.heat);
    return Number(b.dataset.heat)-Number(a.dataset.heat);
  });
  cards.forEach(c=>grid.appendChild(c));
  const cnt=document.getElementById('results-count'); if(cnt)cnt.textContent='顯示 '+shown+' / '+cards.length+' 組品牌';
}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-global-gender]'); if(g){st.gender=g.dataset.globalGender;apply();}
  const t=e.target.closest('[data-tier]'); if(t){st.tier=t.dataset.tier;apply();}
  const c=e.target.closest('[data-select-city]'); if(c){st.city=c.dataset.selectCity;apply();}
  const ps=e.target.closest('[data-pick-style]'); if(ps){st.style=ps.dataset.pickStyle;apply();document.getElementById('directory')?.scrollIntoView({behavior:'smooth'});}
});
document.addEventListener('input',e=>{
  if(e.target.id==='q-input'){st.q=e.target.value.trim();apply();}
  if(e.target.id==='style-sel'){st.style=e.target.value;apply();}
  if(e.target.id==='city-sel'){st.city=e.target.value;apply();}
  if(e.target.id==='sort-sel'){st.sort=e.target.value;apply();}
});
apply();`;

fs.mkdirSync(out, {recursive:true});
for (const [u, h] of pages) {
  const f = path.join(out, u === '/' ? 'index.html' : u.slice(1) + '.html');
  fs.mkdirSync(path.dirname(f), {recursive:true});
  fs.writeFileSync(f, h);
}
if (fs.existsSync(path.join(root, 'public'))) fs.cpSync(path.join(root, 'public'), out, {recursive:true});
fs.writeFileSync(path.join(out, 'styles.css'), CSS);
fs.writeFileSync(path.join(out, 'app.mjs'), APP_JS);
console.log('Built ' + pages.size + ' V6 pages for ' + brands.length + ' brand groups (90+ brands).');
