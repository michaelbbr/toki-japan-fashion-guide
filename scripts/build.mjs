// TOKI V4 All-in-One 完整建置腳本 (scripts/build.mjs)
// 全選複製此程式碼，貼上覆蓋 GitHub 的 scripts/build.mjs 並按 Commit changes 即可完成部署！
import fs from 'node:fs';
import path from 'node:path';

const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const yen = n => '¥' + Number(n).toLocaleString('en-US');
const twd = n => '約 NT$' + Math.round(n * 0.215).toLocaleString('en-US');
const root = process.cwd(), out = path.join(root, 'dist');

// 單品類別對應實拍單品照片 (Unsplash 高清服飾單品圖)
const ITEM_PHOTOS = {
  jacket: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=300&q=80',
  coat: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=300&q=80',
  shirt: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80',
  tee: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80',
  pants: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=300&q=80',
  dress: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80',
  shoe: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80',
  bag: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80'
};

// 8 大日本穿搭風格公式（含男女分類、街拍範例圖與單品拆解）
const styles = [
  {id:'city', gender:'men,women', name:'City Boy 寬鬆日常', zh:'POPEYE 雜誌美式休閒', photo:'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=700&q=80', items:['寬版牛津襯衫','重磅白Tee','打褶寬卡其褲','復古慢跑鞋'], note:'以大一號牛津襯衫疊穿重磅白 Tee，下身搭配打褶寬卡其褲與復古灰慢跑鞋，呈現乾淨不費力的東京少年感。', brands:'BEAMS · FREAK’S STORE · UNIQLO :C'},
  {id:'minimal', gender:'men,women', name:'Clean & Minimal 極簡', zh:'南青山高級面料剪裁', photo:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80', items:['落肩長版大衣','埃及棉寬襯衫','垂墜羊毛寬褲','皮革德比鞋'], note:'全身零大 Logo，依靠頂級埃及長絨棉、尾州羊毛的自然光澤與垂墜輪廓，穿出東京南青山畫廊般的高級鬆弛感。', brands:'AURALEE · COMOLI · Graphpaper · MUJI Labo'},
  {id:'outdoor', gender:'men,women', name:'Gorpcore 山系機能', zh:'GORE-TEX 都市防風防水', photo:'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=700&q=80', items:['GORE-TEX 外套','多口袋釣魚背心','防潑水抽繩褲','機能越野鞋'], note:'把登山級 GORE-TEX 防水膜與多口袋釣魚背心融入日常通勤，晴雨兩用、免帶背包，是日本最實穿的機能美學。', brands:'mont-bell · 北臉紫標 · DAIWA PIER39 · nanamica'},
  {id:'street', gender:'men', name:'Ura-Harajuku 裏原宿軍工', zh:'重磅街頭與六袋軍褲', photo:'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=700&q=80', items:['底特律工裝外套','重磅竹節棉T','六袋軍裝長褲','帆布滑板鞋'], note:'源自東京裏原宿的硬派街頭公式：水洗帆布工裝夾克或重磅圖案 Tee，搭配寬大硬挺的六袋軍褲（Cargo Pants）。', brands:'HUMAN MADE · WTAPS · Carhartt WIP · Stüssy'},
  {id:'denim', gender:'men,women', name:'Amekaji 岡山丹寧職人', zh:'赤耳原牛與刺子藍染', photo:'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80', items:['岡山赤耳丹寧夾克','藍染刺子襯衫','14oz 原色牛仔褲','復古工作靴'], note:'以岡山兒島 14oz 赤耳丹寧與傳統刺し子（Sashiko）、Boro 襤褸拼接為核心，越穿越有個人養成色落靈魂。', brands:'KAPITAL · JOURNAL STANDARD · Bshop'},
  {id:'ivy', gender:'men,women', name:'Japanese Ivy 日系學院', zh:'金釦西外與常春藤混搭', photo:'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=700&q=80', items:['海軍藍金釦西外','條紋牛津襯衫','九分打褶西褲','復古樂福鞋'], note:'日本選貨店最經典的「紺ブレ（海軍藍金釦西裝外套）」混搭休閒卡其褲或牛仔褲，正式與休閒完美平衡。', brands:'UNITED ARROWS · SHIPS · BEAMS PLUS'},
  {id:'feminine', gender:'women', name:'Otona-Kawaii 日雜顯瘦女裝', zh:'高腰魚尾裙與約會洋裝', photo:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80', items:['高腰抓皺長洋裝','立體澎袖針織','顯瘦高腰魚尾裙','方頭低跟短靴'], note:'專為亞洲女生比例設計：利用高腰線剪裁、微露鎖骨澎袖針織與魚尾裙擺，視覺立刻拉長雙腿、溫柔顯瘦。', brands:'SNIDEL · Mila Owen · FRAY I.D'},
  {id:'mode', gender:'women', name:'Mode Layered 時髦層次女裝', zh:'立體剪裁與異材質拼接', photo:'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80', items:['異材質拼接外套','透膚層次內搭','高腰繭型寬褲','立體皺褶長裙'], note:'不走甜美路線，以 CLANE 的立體弧形袖、sacai 的異材質百褶拼接與三宅一生皺褶元素，穿出東京時髦氣場。', brands:'CLANE · Kastane · sacai · 三宅一生'}
];

// 6 大日本城市（預設第 1 個為東京 Tokyo！）
const cities = [
  {id:'tokyo', name:'東京 Tokyo', tag:'預設首選・旗艦店最齊全', summary:'東京是日本品牌旗艦店大本營！買選貨與潮牌去「原宿・表參道・澀谷神南」；買小眾設計去「南青山・代官山・中目黑」；想在百貨一次退稅買齊男女裝直接鎖定「新宿 LUMINE 1/2/EST 與伊勢丹」。', zones:[['① 原宿・表參道・澀谷神南','BEAMS 整條街、FREAK\'S STORE 澀谷、HUMAN MADE、WTAPS、KAPITAL、PORTER 表參道。'],['② 代官山・中目黑・南青山','nanamica 與北臉紫標代官山本店、AURALEE 與 COMOLI 南青山直營店、三宅一生青山。'],['③ 新宿 LUMINE / 伊勢丹 / 銀座','新宿 LUMINE 1/2 買齊 SNIDEL、CLANE 與選貨店；銀座有 12 層 UNIQLO 旗艦店。']]},
  {id:'fukuoka', name:'福岡 Fukuoka', tag:'九州首選・天神大名超集中', summary:'徒步 15 分鐘走完「大名街區潮牌路面店」與「天神四大百貨（福岡 PARCO / 岩田屋 / VIORO / SOLARIA）」，搭地鐵 5 分鐘達「博多站 AMU PLAZA 與 LaLaport」。', zones:[['① 大名・今泉路面街區','HUMAN MADE、Carhartt WIP、Stüssy、WTAPS、nanamica、北臉紫標、Bshop、mont-bell 集中在天神西通往大名小巷。'],['② 天神百貨群 (PARCO/岩田屋/VIORO)','福岡 PARCO 與 VIORO 聚集 BEAMS、UA、FREAK\'S STORE、SNIDEL、Mila Owen；岩田屋有 CLANE、sacai、三宅一生。'],['③ 博多站 AMU PLAZA & LaLaport','AMU PLAZA 有 SHIPS、JOURNAL STANDARD、Snow Peak；運河城與 LaLaport 有大型 UNIQLO、GU、Workman。']]},
  {id:'osaka', name:'大阪 Osaka', tag:'關西核心・梅田與橘街', summary:'北區鎖定「梅田三大百貨（LUCUA 1100 / GRAND FRONT / 阪急）」，南區鎖定「心齋橋 PARCO 與南船場・堀江（Orange Street 橘街）」。', zones:[['① 梅田 LUCUA 1100 / GRAND FRONT','LUCUA 1100 聚集選貨店與女裝；GRAND FRONT 有 mont-bell、nanamica、Bshop。'],['② 南船場・堀江 Orange Street','大阪潮牌街：HUMAN MADE、Carhartt WIP、WTAPS、STUDIOUS、KAPITAL 路面店。'],['③ 心齋橋 PARCO / 大丸 / 難波','心齋橋 PARCO 與大丸心齋橋動線集中、退稅方便。']]},
  {id:'kyoto', name:'京都 Kyoto', tag:'町家別注・四條河原町', summary:'集中在「四條河原町（藤井大丸 / 京都 BAL）」與「烏丸御池（新風館）」，柳馬場與富小路通有絕美町家店。', zones:[['① 四條河原町・藤井大丸・BAL','藤井大丸與京都 BAL 匯集 BEAMS、UA、SNIDEL、sacai 與 Bshop。'],['② 烏丸御池・新風館・六角通','新風館有 BEAMS JAPAN 京都；六角通有 nanamica 與北臉紫標町家店。'],['③ 富小路通・京都車站','富小路通有 PORTER KYOTO 與 Graphpaper 京都町家店。']]},
  {id:'sapporo', name:'札幌 Sapporo', tag:'防寒機能・札站大通連通', summary:'從「札幌站 STELLAR PLACE / 大丸」走地下街到「大通 PARCO」，戶外防寒與選貨店一次買齊。', zones:[['① 札幌站 STELLAR PLACE','聚集 BEAMS、FREAK\'S STORE、UA、SHIPS、URBAN RESEARCH、SNIDEL。'],['② 大通札幌 PARCO','有 HUMAN MADE 札幌店、三宅一生、鬼塚虎。'],['③ 戶外旗艦專區','mont-bell 札幌赤煉瓦店機能裝備極齊。']]},
  {id:'nagoya', name:'名古屋 Nagoya', tag:'中部核心・榮與名站商圈', summary:'集中在「榮 Sakae（名古屋 PARCO / LACHIC / 松坂屋）」與「名古屋站（高島屋 Gate Tower）」。', zones:[['① 榮 Sakae：PARCO & LACHIC','名古屋 PARCO 與 LACHIC 匯集 UA、BEAMS、Bshop、DANTON。'],['② 名古屋站：高島屋 Gate Tower','出站直達，各大選貨店與女裝齊全。'],['③ 矢場町路面街區','Carhartt WIP、WTAPS 等潮流名店集中於矢場町。']]}
];

const TIER_META = {
  mass: ['🇯🇵 日本國民大眾','國民平價神牌'],
  select: ['🇯🇵 日本代表選貨','必逛人氣選貨店'],
  street: ['🇯🇵 日本街頭職人','裏原宿與職人神牌'],
  niche: ['🇯🇵 日本小眾設計','行家私藏極簡機能'],
  global: ['🌍 日本必買國際牌','日本限定與匯率超香']
};

// [id,name,jp,tier,styles,aud,score,delta,verdict,bg,fg,kind,bestFor,tyo,fuk,osa,kyo,sap,nag,cut,price,itemMen,itemWomen,itemType,domain]
const RAW = [
  ['uniqlo','UNIQLO','ユニクロ (:C / U 系列)','mass','city,minimal','both',99,'+14%','全日本搜尋量第 1！定價約台灣 7 折＋退稅，:C 與 U 系列必掃。','#c8102e','#fff','uniqlo','想用台灣 7 折入手設計師聯名與寬版神褲','銀座 12 層旗艦店 · 原宿店 · 新宿本店','天神 Mina 大型店 · LaLaport · 運河城','心齋橋筋 · 梅田 LINKS 大型店','四條河原町 · 京都站 Avanti','札幌 Tokyu 大型店','榮旗艦店 · JR Gate Tower','合身至微寬',3990,'UNIQLO U 寬版降落傘褲 / 重磅T','UNIQLO :C 打褶寬褲 / 澎袖襯衫','pants','www.uniqlo.com/jp/ja/'],
  ['onitsuka-tiger','Onitsuka Tiger','オニツカタイガー (鬼塚虎)','street','city,feminine','both',97,'+22%','赴日遊客排隊王！Mexico 66 日本買比台灣省約 2,500 台幣。','#f5c400','#111','tiger','必買舒適好走的 Mexico 66 金底／銀底或日本製手工鞋','表參道整棟旗艦店 · 銀座紅標店 · 新宿','福岡大名路面旗艦店 · 福岡 PARCO','心齋橋筋大型旗艦店 · 難波 · 梅田','四條河原町路面店','札幌 PARCO 店','榮路面旗艦店','鞋版建議大半號',18700,'MEXICO 66 SD 經典黃黑/銀底慢跑鞋','MEXICO 66 奶油白金底 / 瑪莉珍鞋','shoe','www.onitsukatiger.com/jp/ja-jp/'],
  ['human-made','HUMAN MADE','ヒューマンメイド (NIGO)','street','street,city','men',96,'+19%','NIGO 主理愛心與飛鴨標誌！每週六發售日門市必排隊。','#b81d13','#fff3b0','heart','想買日本限定愛心竹節棉 T-Shirt、鴨子帽與托特包','原宿 OFFLINE STORE · 澀谷 PARCO · 新宿','福岡大名直營路面店 (OFFLINE STORE)','心齋橋 PARCO · 南船場直營店','京都 1928 直營店 (結合藍瓶咖啡)','札幌 PARCO 直營店','榮名古屋 PARCO 店','美式竹節棉微合身',12100,'Heart 經典紅心竹節棉短 Tee','愛心迷你帆布托特包 / 寬版短T','tee','humanmade.jp/'],
  ['mont-bell','mont-bell','モンベル','mass','outdoor,city','both',95,'+16%','台灣人赴日機能王！GORE-TEX 風雨衣與羽絨約台灣 6 折。','#003865','#fff','mtn','想買防風防水外套、超輕羽絨、登山雨傘與機能包','京橋東京店 · 澀谷整棟旗艦店 · 新宿南口','福岡天神店 (西通大名旁) · 博多 Mark Is','難波 City · 梅田 GRAND FRONT','四條河原町 · 京都站前','札幌赤煉瓦旗艦店','榮矢場町 · 名古屋站','亞洲標準合身',28600,'Storm Cruiser GORE-TEX 防水外套','Superior Down 超輕圓領羽絨外套','jacket','www.montbell.jp/'],
  ['beams','BEAMS','ビームス (Plus / Boy)','select','city,ivy,feminine','both',92,'+11%','日本選貨店霸主！男裝 BEAMS PLUS 與女裝 BEAMS BOY 極好逛。','#e85d04','#fff','beams','第一次逛日本選貨店、想買寬鬆襯衫與別注球鞋','原宿 BEAMS 整條街 · 新宿 LUMINE','福岡 PARCO 本館 1-2F · 博多 AMU PLAZA','梅田 LUCUA 1100 · 心齋橋大丸','新風館 (BEAMS JAPAN) · 藤井大丸','札幌 STELLAR PLACE','名古屋 PARCO · 高島屋','微寬 City Boy',16500,'BEAMS 百褶寬版卡其褲 / 牛津襯衫','BEAMS BOY 吊帶工裝裙 / 條紋針織','shirt','www.beams.co.jp/'],
  ['tnf-purple','TNF Purple Label','北臉紫標 (日本獨佔限定)','global','outdoor,city','both',90,'+15%','全球僅限日本販售！nanamica 操刀設計，風衣與小包必搶。','#4a2c6d','#f3ebff','dome','想買只有日本買得到的「北臉紫標」風衣與斜背包','代官山 nanamica Mountain · 原宿 TNF','福岡大名 nanamica 直營店 · 福岡 PARCO','梅田 GRAND FRONT (TNF+) · 堀江','京都六角通 nanamica · 藤井大丸','札幌 STELLAR PLACE','榮 LACHIC','寬鬆山系日常',39600,'65/35 Mountain Parka 經典風衣','紫標防潑水圓筒斜背小包 / 抓絨衣','jacket','www.nanamica.com/'],
  ['snidel','SNIDEL','スナイデル','select','feminine','women',89,'+13%','日本女裝搜尋霸主！最懂亞洲女生顯瘦比例的魚尾裙與洋裝。','#f3e5e8','#5e3a43','serif','想買穿上立刻顯高顯瘦的約會長洋裝與魚尾裙的女生','新宿 LUMINE 2 · 澀谷 PARCO · 表參道','福岡 PARCO 本館 2F · 博多阪急 · 岩田屋','梅田阪急 · LUCUA · 心齋橋大丸','藤井大丸 · 京都高島屋','札幌 STELLAR PLACE','名古屋高島屋 · PARCO','高腰修身顯瘦',16940,'（女裝主打）推薦送禮：喀什米爾圍巾','Sustainable 高腰顯瘦碎花長洋裝','dress','snidel.com/'],
  ['gu','GU','ジーユー','mass','city,feminine','both',85,'+9%','ZOZOTOWN 平價霸榜！Barrel Leg 氣球牛仔褲日本買不到台幣五百。','#0a1e5e','#ffdf00','gu','想用極低預算包色流行氣球寬褲與重磅帽T','澀谷店 · 新宿 Flags · 銀座店','天神 Mina 大型店 · 運河城 · LaLaport','心齋橋店 · 梅田 LINKS','四條河原町 · 京都站','札幌 Tokyu 店','名古屋 Gate Tower · 榮','偏寬鬆流行',2990,'Heavyweight 重磅寬版連帽衫','Barrel Leg 錐形氣球牛仔寬褲','pants','www.gu-global.com/jp/ja/'],
  ['freaks-store','FREAK’S STORE','フリークスストア','select','city,outdoor,feminine','both',83,'+10%','日本大學生與 ZOZOTOWN 最熱選貨店！M-65 外套 CP 值極高。','#1a3a2a','#f4e8c1','stencil','喜歡美式復古、City Boy 大寬版且預算萬元日幣內','澀谷神南旗艦店 · 新宿 LUMINE EST','福岡 PARCO 本館 3F · 博多 AMU PLAZA','梅田 LUCUA · 難波 Parks','京都站 Porta','札幌 STELLAR PLACE','名古屋 PARCO · 高島屋','大寬版 Oversized',14993,'M-65 附絎縫內膽三穿魚尾軍大衣','インド綿 抓皺荷葉領層次長洋裝','coat','www.daytona-park.com/'],
  ['porter','PORTER (吉田包)','ポーター / 吉田カバン','street','city,outdoor,minimal','both',81,'+7%','一針入魂全日本製！TANKER 飛行尼龍包日本專櫃款式最齊。','#1c1c1c','#ff7900','porter','想買一顆可以用十年的全日本製尼龍斜背包或皮夾','表參道旗艦店 · 澀谷 PARCO · 新宿伊勢丹','福岡 PARCO 1F · 博多 AMU PLAZA','梅田 GRAND FRONT · 心齋橋 PARCO','京都富小路通町家店','札幌 STELLAR PLACE','榮 LACHIC · 高島屋','包袋全尺寸',26400,'TANKER 2WAY 飛行尼龍斜背公事包','TANKER 迷你半月形肩背小包','bag','www.yoshidakaban.com/'],
  ['sacai','sacai / 三宅一生','サカイ / Homme Plissé','niche','mode,minimal','both',79,'+12%','國際時裝週殿堂雙壁！三宅一生皺褶褲日本退稅買省上萬元。','#111','#f6f3ed','serif','想用日本退稅價入手三宅一生皺褶褲與 sacai 拼接服','南青山旗艦店 · 新宿伊勢丹 · 銀座 DSM','福岡岩田屋本館 2-3F (雙品牌專櫃)','梅田阪急 · 心齋橋 PARCO · 南船場','京都 BAL · 四條烏丸三宅一生','札幌丸井今井 · PARCO','榮松坂屋 · 高島屋','立體解構 / 皺褶',30800,'Homme Plissé 經典直筒皺褶長褲','sacai 異材質尼龍百褶拼接上衣','pants','www.sacai.jp/'],
  ['united-arrows','UNITED ARROWS','ユナイテッドアローズ (B&Y)','select','minimal,ivy,feminine','both',77,'+5%','日本上班族與輕熟男女首選，B&Y 與 green label 好穿不挑人。','#1f2421','#e8dccb','serif','想從平價品牌升級質感大衣、金釦西外與西裝寬褲','原宿本店 · 表參道 · 新宿 LUMINE','福岡 VIORO 1-2F · 福岡 PARCO · 博多站','梅田 LUCUA 1100 · GRAND FRONT','京都 BAL · 藤井大丸','札幌 STELLAR PLACE','榮 LACHIC · 高島屋','俐落修身微寬',24200,'BEAUTY&YOUTH 羊毛雙面呢大衣','green label 金釦西裝外套 / 寬褲','coat','store.united-arrows.co.jp/'],
  ['carhartt-stussy','Carhartt WIP / Stüssy','カーハート / ステューシー','global','street,city','men',75,'+8%','歐美街頭雙雄，日本直營店款式超齊、有日本限定色且退稅划算。','#c87d28','#111','stencil','想買台灣缺貨的底特律工裝外套與 Stüssy 巡迴短 Tee','原宿／澀谷路面旗艦店 · 新宿伊勢丹','福岡大名路面店 (兩家直營店相距 2 分鐘)','南船場 Orange Street 路面店 · 心齋橋','京都四條河原町路面店','札幌南一條路面店','榮矢場町路面店','歐美寬版工裝',36300,'Detroit Jacket 底特律帆布工裝外套','W’ Brandon 寬版水洗工裝牛仔褲','jacket','carhartt-wip.jp/'],
  ['mila-owen','Mila Owen / FRAY I.D','ミラオーウェン','select','feminine,ivy','women',73,'+6%','日本輕熟通勤女神牌！金釦西裝外套與成套穿搭 CP 值極高。','#dfd3c3','#3e362e','serif','想買百搭金釦西裝外套、成套針織裙與上班約會服的女生','新宿 LUMINE 1/2 · 表參道 · 銀座','福岡 PARCO 2F · 岩田屋 · 博多阪急','梅田 LUCUA · 阪急 · 難波高島屋','藤井大丸 · 京都高島屋','札幌 STELLAR PLACE','名古屋高島屋 · LACHIC','俐落修長大人感',17600,'（女裝主打）簡約皮革通勤托特包','金釦雙排釦西裝外套 / 成套針織裙','coat','milaowen.com/'],
  ['workman','Workman Colors','#ワークマン女子 / Workman','mass','outdoor,city','both',72,'+9%','日本庶民機能神店！防潑水外套與露營褲皆 ¥1,900–¥3,900。','#1b2420','#f5b700','stencil','想用幾百塊台幣挖寶超強防潑水露營服與機能褲','池袋太陽城 · 晴空塔 · 新宿歌舞伎町','博多運河城店 (#ワークマン女子)','心齋橋筋路面店 · 難波 City','京都站 Avanti','札幌アリオ店','榮矢場町店','標準偏寬鬆',2900,'Inarem 防潑水透氣連帽風雨衣','防潑水高彈力 A 字露營長裙','jacket','www.workman.co.jp/'],
  ['auralee','AURALEE','オーラリー','niche','minimal,city','both',68,'+11%','內行質感控首選！不靠大 Logo，以頂級埃及棉與羊毛征服巴黎時裝週。','#d8cfc2','#282b24','serif','追求零大 Logo、極致親膚面料與低飽和色彩的行家','南青山直營本店 · 新宿伊勢丹','福岡岩田屋 · 福岡 VIORO (UA / Bshop)','梅田阪急 · LUCUA 1100','京都 BAL (Bshop / Edition)','札幌 STELLAR PLACE','榮 LACHIC (UA / Bshop)','微寬垂墜輪廓',33000,'Washed Finx 埃及長絨棉寬版襯衫','Super Fine 頂級美麗諾羅紋針織衫','shirt','auralee.jp/'],
  ['kapital','KAPITAL','キャピタル (岡山兒島丹寧)','street','denim,street','men',66,'+8%','岡山兒島丹寧藝術神牌！歐美潮人專程赴日掃貨 Boro 與笑臉單品。','#3d2b1f','#f2d06b','smiley','想買岡山手工刷色牛仔褲、刺子外套與高辨識度笑臉單品','惠比壽三家直營店 · 六本木 Hills','福岡大名直營路面店 (大名 2 丁目老宅)','阪急梅田男裝館 · 難波 Parks','京都富小路通直營店','札幌大丸對面路面店','名古屋榮路面店','特殊解構寬鬆',29700,'14oz 岡山赤耳丹寧褲 / 笑臉開襟衫','Boro 刺子拼接寬版丹寧背心','pants','www.kapital.jp/'],
  ['patagonia-danton','Patagonia / DANTON','パタゴニア / ダントン','global','outdoor,city,minimal','both',65,'+6%','法國 DANTON 在日本已成國民工裝；Patagonia 抓絨用日幣買超划算。','#8b1e24','#fff','danton','想趁日幣低點入手 Patagonia 抓絨與法國 DANTON 菱格紋外套','澀谷神南 Patagonia 旗艦店 · 丸之內','福岡天神西通 Patagonia & 警固公園 Bshop','梅田 GRAND FRONT · 心齋橋路面店','四條烏丸 Patagonia · 京都 BAL','札幌北口 Patagonia · 札站','榮 Patagonia · LACHIC','亞洲友善箱型',20900,'Patagonia Classic Retro-X 抓絨外套','DANTON 法式圓領輕量羽絨夾克','jacket','www.dantonfrance.com/'],
  ['wtaps-nbhd','WTAPS / NBHD','ダブルタップス / ネイバーフッド','street','street,outdoor','men',64,'+4%','裏原宿軍工裝教父品牌，貨量稀少、硬派男生死忠收藏。','#25291c','#d8d4c8','stencil','著迷重磅軍事工裝、六袋軍褲（Jungle Stock）與硬派街頭','青山 W_Lab · 原宿 NBHD 本店 · 澀谷','福岡大名 HOODS FUKUOKA (大名 1 丁目)','南船場 HOODS OSAKA (橘街旁)','四條河原町藤井大丸','札幌專賣店','名古屋矢場町 HOODS','寬大硬挺軍裝',35200,'Jungle 六袋軍裝長褲 / 交叉骨重磅T','Oversized 軍綠防風內膽夾克','pants','www.wtaps.com/'],
  ['clane','CLANE / Kastane','クラネ / カスタネ','niche','mode,feminine','women',63,'+9%','松本惠奈主理 CLANE 與多層次 Kastane，日本穿搭博主私服最愛。','#2b2623','#f5efe6','sans','喜歡日本 IG 穿搭博主立體剪裁或層次混搭不撞衫的女生','新宿 LUMINE 2 · 表參道 · 澀谷','福岡岩田屋 3F (CLANE) · PARCO (Kastane)','梅田 LUCUA · 阪急 · 心齋橋','京都高島屋 · 河原町','札幌 STELLAR PLACE','名古屋高島屋 · PARCO','立體時髦微寬',22000,'（女裝主打）中性寬版羊毛長大衣','CLANE 立體弧形澎袖針織 / 繭型褲','dress','clane-design.com/'],
  ['journal-standard','JOURNAL STANDARD','ジャーナルスタンダード','select','city,denim,outdoor','both',61,'+5%','Baycrew’s 王牌選貨！relume 支線平價，Barbour 別注款內行必搶。','#2f2922','#f3ede2','serif','想買日本別注款 Barbour 油布外套與美式復古丹寧','表參道旗艦店 · 澀谷 · 新宿 Flags','福岡 PARCO 1F · 博多 AMU PLAZA','梅田 LUCUA 1100 · 難波 Parks','藤井大丸 · 四條通','札幌 STELLAR PLACE','榮 LACHIC · 高島屋','微寬鬆落肩',19800,'別注 Barbour 寬版油布風衣外套','relume 復古刷色寬版牛仔外套','coat','baycrews.jp/'],
  ['urban-research','URBAN RESEARCH','アーバンリサーチ (DOORS)','select','minimal,city,feminine','both',59,'+3%','質感穩健的都會選貨店，DOORS 有機棉麻與 KBF 女裝實穿百搭。','#2b303a','#fff','sans','想要溫和日系無印感、實穿風衣與高 CP 洋裝','表參道 · 新宿 LUMINE · 澀谷','福岡 PARCO · 博多 AMU PLAZA (DOORS)','梅田 LUCUA 1100 · 難波 City','藤井大丸 · 京都站 Porta','札幌 STELLAR PLACE','名古屋 PARCO · LACHIC','亞洲友善微寬',15400,'DOORS 防潑水連帽輕便風衣','KBF 異材質拼接高腰長洋裝','coat','www.urban-research.jp/'],
  ['muji-labo','MUJI Labo','ムジラボ (無印良品高階實驗線)','mass','minimal,city','both',58,'+7%','無印良品旗下僅在大型旗艦店販售的高階支線，低調極簡不撞衫。','#7f0019','#f6f3ed','sans','喜歡無印風但追求更挺括尾州羊毛與設計師版型','銀座世界旗艦店 · 新宿靖國通','天神大名整棟旗艦店 · 博多運河城','難波 · 梅田 GRAND FRONT','京都 BAL 旗艦店','札幌 PARCO · 札站','名古屋名鐵 · LACHIC','中性寬鬆盒型',9990,'再生羊毛混紡寬版立領夾克','高密度有機棉無領長版襯衫','shirt','www.muji.com/jp/ja/'],
  ['bshop','Bshop','ビショップ','select','minimal,denim,ivy','both',56,'+4%','日本文青死忠選貨店！代理 DANTON、ORCIVAL 海魂衫與 Brady 包。','#1e2f23','#f6f3ed','serif','喜歡法式工裝、條紋海魂衫與乾淨文青日常穿搭','新宿 LUMINE 1 · 丸之內 · 吉祥寺','福岡天神警固公園旁路面店 · 博多站','梅田 GRAND FRONT · 心齋橋大丸','京都 BAL 4F 大型店','札幌 STELLAR PLACE','榮 LACHIC 4F','法式微寬箱型',14850,'ORCIVAL 法式重磅條紋海魂衫','Gymphlex 刺繡小獅頭寬版格紋襯衫','shirt','bshop-inc.com/'],
  ['daiwa-pier39','DAIWA PIER39','ダイワピア39','niche','outdoor,city','men',52,'+6%','小眾機能行家熱愛！把釣魚多口袋機能藏進 City Boy 大寬版西裝。','#1f3327','#e6efe9','stencil','喜歡寬鬆 City Boy 又想要防潑水多口袋外套的機能玩家','表參道 Bshop · 原宿 BEAMS · 新宿','福岡 PARCO (BEAMS/FREAK\'S) · 大名 Bshop','梅田 LUCUA 1100 · GRAND FRONT','藤井大丸 · 京都 BAL','札幌 STELLAR PLACE','名古屋 PARCO · LACHIC','極寬大 (小一號)',31900,'Tech Loose 2B 多口袋寬版獵裝外套','Tech 防潑水抽繩機能軍裝寬褲','jacket','daiwapier39.jp/'],
  ['comoli','COMOLI','コモリ','niche','minimal,city','men',49,'+5%','日本極簡男裝私房神牌！從不打廣告，專注空氣感鬆弛剪裁。','#2b2d2f','#e6e2d8','serif','喜歡不費力鬆弛感、自然皺褶高支數棉襯衫與低調職人男裝','南青山直營本店 · 新宿伊勢丹男裝','福岡大名 Bshop · 福岡 VIORO (UA)','梅田 GRAND FRONT (Bshop)','京都 BAL (Bshop)','札幌 Bshop','榮 LACHIC (Bshop)','寬鬆空氣感',28600,'Comoli 經典空氣感寬鬆白襯衫','5-Pocket 水洗寬版丹寧長褲','shirt','www.comoli.jp/'],
  ['nanamica','nanamica','ナナミカ','niche','outdoor,minimal,city','men',47,'+4%','代官山高階海洋機能品牌，把頂級 GORE-TEX 藏進優雅卡其長大衣。','#0f2537','#fff','serif','想買外觀像質感風衣卻能直接當雨衣穿的 GORE-TEX 大衣','代官山直營本店 (DAIKANYAMA)','福岡大名直營店 (大名 2 丁目庭園路面店)','神戶直營店 · 梅田 GRAND FRONT','京都六角通直營町家店','札幌 STELLAR PLACE','榮 LACHIC','微寬日系輪廓',29700,'GORE-TEX 巴爾瑪肯防水長版大衣','ALPHADRY 快乾透氣寬版打褶長褲','coat','www.nanamica.com/'],
  ['studious','STUDIOUS','ステュディオス (TOKYO BASE)','select','mode,minimal','both',46,'+3%','專賣 100% 日本製小眾設計師（Needles、CULLNI）的時裝選貨店。','#111','#fff','sans','想在一家店試穿 Needles 蝴蝶褲等日本設計師品牌且不撞衫','原宿本店 · 表參道 · 新宿 · 澀谷','福岡 PARCO 本館 1-2F','梅田 LUCUA 1100 · 南船場 · 心齋橋','京都藤井大丸店','札幌 STELLAR PLACE','榮名古屋 PARCO','修身時裝剪裁',24200,'別注 Needles 刺繡蝴蝶運動長褲','beautiful people 縮水皮革騎士夾克','pants','studious.co.jp/'],
  ['ships','SHIPS','シップス','select','ivy,minimal','both',45,'+2%','日本老牌御三家選貨店，低調穩健，常春藤學院風與海島棉針織極佳。','#00205b','#fff','serif','喜歡乾淨牛津襯衫、風衣與微正式常春藤學院風','銀座本店 · 澀谷神南 · 新宿 LUMINE','福岡 VIORO 3F · 博多 AMU PLAZA 3F','梅田 GRAND FRONT · 難波 Parks','藤井大丸 · 京都站','札幌 STELLAR PLACE','榮松坂屋 · 高島屋','合身俐落',23100,'SHIPS 撥水巴爾瑪肯格紋內裡風衣','金釦海軍藍針織開襟外套','coat','www.shipsltd.co.jp/'],
  ['snow-peak','Snow Peak','スノーピーク','niche','outdoor,minimal','both',43,'+3%','新潟燕三條露營名牌，服飾線主打難燃焚火背心與輕量保暖內膽。','#1c1c1c','#fff','serif','熱愛露營山系、想用日本原產地價入手焚火背心與保暖服','表參道旗艦店 · 新宿 LUMINE 1','博多站 AMU PLAZA 3F · 油山福岡營地','梅田 LUCUA 1100 · 心齋橋 PARCO','藤井大丸 · 嵐山體驗店','札幌 STELLAR PLACE','榮久屋大通公園旗艦店','中性微寬鬆',22000,'Takibi 難燃防潑水多口袋焚火背心','Flexible Insulated 輕量保暖開襟衫','jacket','ec.snowpeak.co.jp/'],
  ['graphpaper','Graphpaper','グラフペーパー','niche','minimal,city','men',41,'+4%','建築感小眾極簡神牌，單一 Free Size 大輪廓襯衫與主廚褲極具辨識度。','#e9ecef','#1a1a1a','sans','喜歡挺括建築感 Oversized 襯衫與免繫皮帶主廚褲的行家','參宮橋畫廊本店 · 表參道店','福岡大名選貨店 · 福岡 VIORO','南船場路面店','京都富小路通町家直營店','札幌選貨店','名古屋矢場町店','建築感 Free Size',28600,'Broad Oversized 超長絨棉寬版襯衫','Scale Off Wool 免繫皮帶主廚寬褲','shirt','graphpaper-tokyo.com/'],
  ['and-wander','and wander','アンドワンダー','niche','outdoor,mode','both',38,'+5%','日本設計師山系私房寶藏！標誌性夜間反光縫線與立體剪裁極少撞衫。','#2d3436','#dfe6e9','mtn','覺得傳統登山服太老氣，想找時裝感最強的小眾山系品牌','丸之內 · 澀谷宮下公園 · 新宿伊勢丹','福岡岩田屋 · 天神選貨店 (BEAMS/Bshop)','梅田阪急 · GRAND FRONT','京都 BAL · 藤井大丸','札幌 STELLAR PLACE','榮 LACHIC','立體拼接微合身',14300,'PERTEX 夜間反光縫線防風連帽外套','Sil Sacoche 超輕防潑水隨身斜背包','bag','www.andwander.com/']
];

const brands = RAW.map((r, i) => {
  const tm = TIER_META[r[3]], sc = r[6];
  const lv = sc>=88?'s-fire':sc>=72?'a-hot':sc>=55?'b-steady':'c-niche';
  const tierName = sc>=88?'🔥 S級・現象排隊王':sc>=72?'📈 A級・主流高人氣':sc>=55?'🌿 B級・質感常青款':'💎 C級・小眾不撞衫';
  return {
    id:r[0], name:r[1], jp:r[2], origin:tm[0], tier:r[3], type:tm[1],
    styles:r[4].split(','), aud:r[5], accent:['olive','rust','slate','sand'][i%4],
    heat:{score:sc, delta:r[7], level:lv, badge:`${tierName} (${sc}°)`, verdict:r[8]},
    logo:{bg:r[9], fg:r[10], main:r[1].split(' / ')[0], kind:r[11]},
    bestFor:r[12], intro:`${r[12]}。${r[8]}`,
    cityStores:{tokyo:r[13], fukuoka:r[14], osaka:r[15], kyoto:r[16], sapporo:r[17], nagoya:r[18]},
    cut:r[19], price:r[20], itemMen:r[21], itemWomen:r[22], itemType:r[23], domain:r[24], url:'https://'+r[24]
  };
});

// 擬真品牌官方標誌與向量徽章 + 官方圖標
function brandLogo(b) {
  const lg = b.logo, m = lg.main, k = lg.kind, host = b.domain.split('/')[0].replace('www.','').replace('store.','').replace('ec.','');
  let mark = '';
  if (k==='uniqlo') mark = `<rect x="135" y="38" width="95" height="95" fill="#fff"/><text x="182" y="80" text-anchor="middle" fill="#c8102e" font-size="24" font-weight="900">ユニ</text><text x="182" y="114" text-anchor="middle" fill="#c8102e" font-size="24" font-weight="900">クロ</text><rect x="250" y="38" width="95" height="95" fill="#fff"/><text x="297" y="80" text-anchor="middle" fill="#c8102e" font-size="23" font-weight="900" letter-spacing="2">UNI</text><text x="297" y="114" text-anchor="middle" fill="#c8102e" font-size="23" font-weight="900" letter-spacing="2">QLO</text>`;
  else if (k==='heart') mark = `<path d="M240 142 C240 142 165 96 165 56 C165 30 198 22 240 56 C282 22 315 30 315 56 C315 96 240 142 240 142 Z" fill="#fff3b0" stroke="#fff" stroke-width="3"/><text x="240" y="76" text-anchor="middle" fill="#b81d13" font-family="Impact,sans-serif" font-size="17" letter-spacing="1">HUMAN</text><text x="240" y="96" text-anchor="middle" fill="#b81d13" font-family="Impact,sans-serif" font-size="17" letter-spacing="1">MADE</text>`;
  else if (k==='tiger') mark = `<path d="M120 112 Q240 58 360 78 M120 132 Q240 78 360 102 M190 38 L220 148 M270 38 L250 148" stroke="#111" stroke-width="8" fill="none" opacity=".22"/><text x="240" y="106" text-anchor="middle" fill="#111" font-family="Georgia,serif" font-style="italic" font-size="38" font-weight="900">Onitsuka Tiger</text>`;
  else if (k==='mtn') mark = `<polygon points="165,120 220,44 255,94 282,58 325,120" fill="none" stroke="${lg.fg}" stroke-width="5"/><text x="240" y="154" text-anchor="middle" fill="${lg.fg}" font-size="30" font-weight="900" letter-spacing="1">${e(m)}</text>`;
  else if (k==='beams') mark = `<circle cx="240" cy="66" r="26" fill="none" stroke="#fff" stroke-width="3"/><ellipse cx="240" cy="66" rx="13" ry="26" fill="none" stroke="#fff" stroke-width="2"/><line x1="214" y1="66" x2="266" y2="66" stroke="#fff" stroke-width="2"/><text x="240" y="136" text-anchor="middle" fill="#fff" font-family="Impact,sans-serif" font-size="46" letter-spacing="3">BEAMS</text>`;
  else if (k==='dome') mark = `<path d="M195 104 A45 45 0 0 1 285 104 Z" fill="none" stroke="#f3ebff" stroke-width="4"/><path d="M210 104 A30 30 0 0 1 270 104 Z" fill="none" stroke="#f3ebff" stroke-width="4"/><rect x="145" y="114" width="190" height="30" rx="4" fill="#f3ebff"/><text x="240" y="134" text-anchor="middle" fill="#4a2c6d" font-size="14" font-weight="900" letter-spacing="1">THE NORTH FACE</text>`;
  else if (k==='smiley') mark = `<circle cx="240" cy="76" r="34" fill="#f2d06b" stroke="#111" stroke-width="3"/><circle cx="227" cy="68" r="4" fill="#111"/><circle cx="253" cy="68" r="4" fill="#111"/><path d="M222 82 Q240 99 258 82" fill="none" stroke="#111" stroke-width="3.5"/><text x="240" y="146" text-anchor="middle" fill="#f2d06b" font-family="Georgia,serif" font-size="32" font-weight="900" letter-spacing="4">KAPITAL</text>`;
  else if (k==='danton') mark = `<polygon points="240,32 308,86 240,140 172,86" fill="#fff"/><text x="240" y="93" text-anchor="middle" fill="#8b1e24" font-family="Impact,sans-serif" font-size="23" letter-spacing="2">DANTON</text>`;
  else if (k==='porter') mark = `<rect x="135" y="46" width="210" height="92" fill="none" stroke="#ff7900" stroke-width="3"/><text x="240" y="92" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-size="32" font-weight="900" letter-spacing="4">PORTER</text><text x="240" y="118" text-anchor="middle" fill="#ff7900" font-size="11" font-weight="800" letter-spacing="3">YOSHIDA &amp; COMPANY</text>`;
  else if (k==='gu') mark = `<rect x="180" y="40" width="120" height="96" rx="8" fill="none" stroke="#ffdf00" stroke-width="4"/><text x="240" y="108" text-anchor="middle" fill="#ffdf00" font-family="Impact,sans-serif" font-size="60" letter-spacing="2">GU</text>`;
  else {
    const fsSize = m.length > 13 ? 28 : m.length > 9 ? 34 : 42;
    const ff = k==='serif' ? 'Georgia,"Noto Serif TC",serif' : k==='stencil' ? 'Impact,sans-serif' : '"DM Sans",sans-serif';
    mark = `<rect x="36" y="30" width="408" height="120" fill="none" stroke="${lg.fg}" stroke-width="1.5" opacity=".28"/><text x="240" y="104" text-anchor="middle" fill="${lg.fg}" font-family='${ff}' font-size="${fsSize}" font-weight="800" letter-spacing="2">${e(m)}</text>`;
  }
  return `<figure class="brand-logo-card" style="background:${lg.bg};color:${lg.fg}">
    <svg viewBox="0 0 480 195" role="img" aria-label="${e(b.name)} 官方標誌">${mark}<text x="240" y="176" text-anchor="middle" fill="${lg.fg}" font-size="12" font-weight="600" opacity=".88">${e(b.jp)}</text></svg>
    <img class="brand-real-logo" src="https://www.google.com/s2/favicons?domain=${host}&sz=128" alt="${e(b.name)} 圖標" loading="lazy">
    <span class="logo-origin-badge">${e(b.origin)}</span>
  </figure>`;
}

function styleCardHtml(s) {
  return `<article class="style-card" data-style-gender="${e(s.gender)}">
    <div class="style-photo-wrap">
      <img src="${e(s.photo)}" alt="${e(s.name)} 穿搭範例圖" loading="lazy">
      <span class="style-gender-tag">${s.gender==='men'?'👔 男生主打風格':s.gender==='women'?'👗 女生主打風格':'👫 男女共穿風格'}</span>
    </div>
    <div class="style-card-body">
      <h3>${e(s.name)} <span>${e(s.zh)}</span></h3>
      <div class="style-formula-pills">${s.items.map((it,idx)=>`<span class="formula-pill"><strong>${idx+1}</strong>${e(it)}</span>`).join('')}</div>
      <p>${e(s.note)}</p>
      <div class="style-card-foot"><span>代表：<strong>${e(s.brands)}</strong></span><button type="button" class="text-btn" data-pick-style="${s.id}">看此風格品牌 ↓</button></div>
    </div>
  </article>`;
}

const renderHeat = b => `<div class="heat-meter-wrap"><div class="heat-meter-top"><span class="heat-badge ${b.heat.level}">${e(b.heat.badge)}</span><span class="heat-score-text">近7日搜尋 <strong>${e(b.heat.delta)}</strong></span></div><div class="heat-bar-track"><div class="heat-bar-fill ${b.heat.level}" style="width:${b.heat.score}%"></div></div><p class="heat-verdict">${e(b.heat.verdict)}</p></div>`;

const card = (b, i=0) => {
  const mPhoto = ITEM_PHOTOS[b.itemType] || ITEM_PHOTOS.jacket;
  const wPhoto = b.aud==='women' || b.itemWomen.includes('洋裝') || b.itemWomen.includes('裙') ? ITEM_PHOTOS.dress : ITEM_PHOTOS[b.itemType] || ITEM_PHOTOS.shirt;
  return `<article class="brand-card ${b.accent}" data-id="${e(b.id)}" data-name="${e(b.name)}" data-price="${b.price}" data-heat="${b.heat.score}" data-aud="${e(b.aud)}" data-style="${e(b.styles.join(','))}" data-tier="${e(b.tier)}" data-item-men="${e(b.itemMen)}" data-item-women="${e(b.itemWomen)}" data-photo-men="${e(mPhoto)}" data-photo-women="${e(wPhoto)}" data-stores='${e(JSON.stringify(b.cityStores))}' data-hay="${e((b.name+' '+b.jp+' '+b.bestFor+' '+b.heat.verdict+' '+b.itemMen+' '+b.itemWomen+' '+Object.values(b.cityStores).join(' ')).toLowerCase())}">
  <div class="brand-image-wrap"><a class="brand-image" href="/brands/${b.id}">${brandLogo(b)}<span class="card-no">${String(i+1).padStart(2,'0')} · ${b.aud==='men'?'👔 男裝主打':b.aud==='women'?'👗 女裝主打':'👫 男女皆有'}</span></a></div>
  <div class="brand-copy">
    ${renderHeat(b)}
    <h3><a href="/brands/${b.id}">${e(b.name)}</a> <span class="card-jp">${e(b.jp)}</span></h3>
    <p class="best-for-box"><strong>💡 誰該買：</strong>${e(b.bestFor)}</p>
    <div class="item-showcase-box">
      <img class="item-photo-thumb" data-item-img src="${e(b.aud==='women'?wPhoto:mPhoto)}" alt="${e(b.name)} 代表單品圖" loading="lazy">
      <div class="item-showcase-info">
        <span class="item-showcase-label" data-item-label>🛍️ 必買代表單品（點擊上方男女可切換）：</span>
        <strong class="item-showcase-name" data-item-name>${e(b.aud==='women'?b.itemWomen:b.itemMen)}</strong>
        <span class="item-showcase-price">${yen(b.price)}~ <em>(${twd(b.price)})</em></span>
      </div>
    </div>
    <div class="city-store-callout"><span class="city-store-label">📍 <strong data-city-name>東京 Tokyo</strong> 哪裡買：</span><p class="city-store-text" data-city-store>${e(b.cityStores.tokyo)}</p><a class="city-map-link" data-city-map href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name+' 東京')}" target="_blank" rel="noopener">在 Google Maps 開啟東京店鋪位置 ↗</a></div>
    <div class="card-foot"><div class="tags">${b.styles.map(s=>`<span class="tag">${e(styles.find(x=>x.id===s)?.name.split(' ')[0]||s)}</span>`).join('')}</div><span class="cut-note">📏 ${e(b.cut)}</span></div>
  </div>
</article>`;
};

const topGenderBar = () => {
  const menCnt = brands.filter(b=>b.aud!=='women').length;
  const womenCnt = brands.filter(b=>b.aud!=='men').length;
  return `<div class="top-gender-bar"><div class="wrap top-gender-inner">
    <div><span class="step-pill">STEP 1</span><strong>先選穿搭對象（點擊會立即切換首頁範例圖、專屬風格與男／女裝代表單品圖）：</strong></div>
    <div class="gender-pills">
      <button type="button" class="gender-pill active" data-global-gender="all">✨ 全部品牌 (${brands.length})</button>
      <button type="button" class="gender-pill" data-global-gender="men">👔 男生穿搭 Men (${menCnt} 品牌 · 男裝單品優先)</button>
      <button type="button" class="gender-pill" data-global-gender="women">👗 女生穿搭 Women (${womenCnt} 品牌 · 女裝單品優先)</button>
    </div>
  </div></div>
  <div id="gender-status-banner" class="gender-status-banner" hidden><div class="wrap" id="gender-status-text"></div></div>`;
};

const cityExplorer = () => `<section class="wrap city-explorer-section" id="city-guide"><p class="eyebrow"><span class="step-pill">STEP 2</span> JAPAN 6-CITY SHOPPING GUIDE (預設：東京 TOKYO)</p><h2>你這趟去日本哪個城市？直接看當地能買什麼牌子、在哪裡買。</h2><p class="muted">預設顯示<strong>東京 Tokyo</strong>；點擊切換福岡、大阪、京都、札幌或名古屋，下方 32 張品牌卡會同步切換為該城市的百貨或路面店地址！</p>
  <div class="city-tabs">${cities.map((c,i)=>`<button type="button" class="city-tab ${i===0?'active':''}" data-select-city="${c.id}" data-label="${e(c.name)}"><strong>📍 ${e(c.name)}</strong><span>${e(c.tag)}</span></button>`).join('')}</div>
  <div class="city-panels">${cities.map((c,i)=>`<div class="city-panel" data-city-panel="${c.id}" ${i===0?'':'hidden'}><div class="city-panel-head"><div><span class="eyebrow">CITY ROUTE · ${c.id.toUpperCase()}</span><h3>🗾 去「${e(c.name)}」逛街：這 ${brands.length} 個品牌都能買到！</h3><p>${e(c.summary)}</p></div><a class="button dark" href="#directory">往下看 ${e(c.name.split(' ')[0])} 品牌卡 ↓</a></div><div class="city-zones-grid">${c.zones.map(z=>`<div class="city-zone-card"><h4>${e(z[0])}</h4><p>${e(z[1])}</p></div>`).join('')}</div><div class="city-brand-chips">${brands.map(b=>`<a href="/brands/${b.id}" class="city-brand-item" data-aud="${e(b.aud)}"><div class="city-brand-top"><strong>${e(b.name)}</strong><span class="heat-mini ${b.heat.level}">${b.heat.score}°</span></div><span class="city-brand-loc">📍 ${e(b.cityStores[c.id])}</span></a>`).join('')}</div></div>`).join('')}</div></section>`;

const heatMethodBox = () => `<div class="heat-method-banner">
  <div><strong>📊 熱度指數 (38°–99°) 是怎麼算出來的？為什麼有高有低？</strong><p>本站熱度並非全部給高分，而是根據 <strong>Google Trends 日本國內近 90 天搜尋量 (60%)</strong> ＋ <strong>ZOZOTOWN 排行榜／台灣旅客退稅熱度 (40%)</strong> 分為四級，讓你一眼分辨「排隊大眾爆款」與「不撞衫小眾行家牌」：</p></div>
  <div class="heat-legend-grid">
    <span class="heat-legend-item"><i class="dot s-fire"></i><strong>🔥 S級 現象排隊王 (88°–99°)：</strong>國民爆款或潮牌排隊王（如 UNIQLO、鬼塚虎、HUMAN MADE）</span>
    <span class="heat-legend-item"><i class="dot a-hot"></i><strong>📈 A級 主流高人氣 (72°–87°)：</strong>日本百貨主力熱銷（如 GU、FREAK’S STORE、PORTER、sacai）</span>
    <span class="heat-legend-item"><i class="dot b-steady"></i><strong>🌿 B級 質感常青款 (55°–71°)：</strong>內行人穩定回購（如 AURALEE、KAPITAL、DANTON、CLANE）</span>
    <span class="heat-legend-item"><i class="dot c-niche"></i><strong>💎 C級 小眾不撞衫 (38°–54°)：</strong>不打廣告的私房設計師神牌（如 COMOLI、nanamica、Graphpaper）</span>
  </div>
</div>`;

const directorySection = () => `<section class="wrap section" id="directory"><div class="section-title"><div><p class="eyebrow"><span class="step-pill">STEP 3</span> 32 BRANDS DIRECTORY</p><h2>32 大日本必買品牌全收錄：官方標誌、代表單品圖、真實熱度分級與各城市店鋪。</h2></div><span id="results-count" class="count-pill">顯示 ${brands.length} / ${brands.length} 個品牌</span></div>
  ${heatMethodBox()}
  <div class="filter-panel"><div class="preset-bar">${[['all','✨ 全部 32 品牌'],['mass','💰 國民平價 (UNIQLO/GU/mont-bell/Workman)'],['select','🧭 日本選貨店 (BEAMS/UA/FREAK’S)'],['street','🛹 街頭與職人 (HUMAN MADE/KAPITAL/鬼塚虎)'],['niche','💎 小眾極簡與機能 (AURALEE/COMOLI/sacai/nanamica)'],['global','🌍 非日牌但日本買超划算 (北臉紫標/Carhartt/Patagonia)']].map((p,i)=>`<button type="button" class="preset-chip ${i===0?'active':''}" data-tier="${p[0]}">${p[1]}</button>`).join('')}</div>
  <div class="filter-controls"><input id="q-input" type="search" placeholder="搜尋品牌、東京、福岡、單品名稱、GORE-TEX、牛仔褲…"><select id="style-sel"><option value="all">所有 8 大穿搭風格</option>${styles.map(s=>`<option value="${s.id}">${e(s.name)} ·${e(s.zh)}</option>`).join('')}</select><select id="city-sel">${cities.map(c=>`<option value="${c.id}">📍 顯示「${e(c.name)}」店鋪</option>`).join('')}</select><select id="sort-sel"><option value="heat-desc">🔥 熱度：從爆紅排隊王 ➔ 小眾私房</option><option value="heat-asc">💎 小眾度：從小眾不撞衫 ➔ 大眾爆款</option><option value="price-asc">💰 價格：從平價好入手 ➔ 高階設計師</option></select></div></div>
  <div id="brand-grid" class="brand-grid">${brands.map((b,i)=>card(b,i)).join('')}</div></section>`;

const shell = (t, d, b) => `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(t)} | TOKI 日本品牌選物誌</title><meta name="description" content="${e(d)}"><link rel="stylesheet" href="/styles.css"><script type="module" src="/app.mjs"></script></head><body><header class="site-header"><div class="wrap nav-inner"><a class="wordmark" href="/">TOKI<span>日本品牌與城市逛街攻略 V4</span></a><nav id="main-nav"><a href="/#city-guide">📍 6 大城市逛街地圖 (預設東京)</a><a href="/#styles">👕 8 大日本穿搭風格範例</a><a href="/#directory">🔥 32 品牌與代表單品</a><a href="/trends">📊 熱度分級說明</a></nav></div></header><main id="main">${b}</main><footer class="site-footer"><div class="wrap"><p><strong>TOKI 日本品牌選物誌 V4</strong> · 預設東京，涵蓋東京、福岡、大阪、京都、札幌、名古屋 6 大城市與 32 個日本必買品牌指南。</p></div></footer></body></html>`;

const pages = new Map(), add = (u, t, d, b) => pages.set(u, shell(t, d, b));
add('/', '日本買衣服最直覺的品牌與城市攻略', '預設東京，涵蓋 8 大日本穿搭風格實拍範例、32 大品牌 LOGO 與代表單品圖、38°–99° 四級真實熱度排行。', `${topGenderBar()}<section class="wrap hero"><div><p class="eyebrow">TOKYO & JAPAN 6-CITY SHOPPING GUIDE</p><h1>去日本買衣服，<br><span>一眼看懂買哪一牌、去哪裡買。</span></h1><p>預設顯示<strong>東京 Tokyo</strong>（可一鍵切換<strong>福岡、大阪、京都、札幌、名古屋</strong>）。從上方切換<strong>男生／女生穿搭</strong>，立即篩出對應的<strong>8 大日本穿搭風格範例圖、各品牌代表單品圖、品牌 LOGO 與 38°–99° 真實熱度分級</strong>。</p><div class="hero-actions"><a class="button dark" href="#styles">👕 看 8 大穿搭風格範例圖 ↓</a><a class="button light" href="#directory">🔥 看 32 品牌 LOGO 與代表單品 ↓</a></div></div><div id="hero-showcase"><div data-hero-card="all">${styleCardHtml(styles[0])}</div><div data-hero-card="men" hidden>${styleCardHtml(styles[3])}</div><div data-hero-card="women" hidden>${styleCardHtml(styles[6])}</div></div></section>${cityExplorer()}<section class="wrap section" id="styles"><div class="section-title"><div><p class="eyebrow">8 ICONIC JAPANESE STYLE FORMULAS</p><h2>八大日本穿搭風格公式（附穿搭範例圖＋標準單品拆解）</h2><p class="muted">點擊上方「男生穿搭」或「女生穿搭」可自動篩選適合你的風格；點擊卡片下方按鈕可直接篩出該風格的品牌。</p></div></div><div class="style-grid" id="style-grid">${styles.map(s=>styleCardHtml(s)).join('')}</div></section>${directorySection()}`);
add('/brands', '32 大日本必買品牌資料庫', '32 大品牌完整收錄。', topGenderBar() + cityExplorer() + directorySection());
add('/styles', '八大日本穿搭風格公式與範例圖', '8 大日本主流與小眾穿搭風格範例。', topGenderBar() + `<section class="wrap section"><h1>八大日本穿搭風格公式（附範例圖與單品拆解）</h1><div class="style-grid">${styles.map(s=>styleCardHtml(s)).join('')}</div></section>`);
add('/trends', '32 大品牌日本熱度排行榜與計算方法', '38°–99° 四級熱度分級總覽。', topGenderBar() + `<section class="wrap section"><h1>📊 32 大品牌日本熱度分級榜 (38°–99°)</h1>${heatMethodBox()}<div class="brand-grid">${[...brands].sort((a,b)=>b.heat.score-a.heat.score).map((b,i)=>card(b,i)).join('')}</div></section>`);
add('/releases', '發售筆記', '最新發售資訊。', topGenderBar() + directorySection());
add('/journal', '日本各城市逛街攻略', '東京、福岡、大阪逛街指南。', topGenderBar() + cityExplorer());
add('/methods', '熱度指數與資料方法', '熱度指數計算公式說明。', `<section class="wrap section"><h1>資料與熱度指數計算方法</h1>${heatMethodBox()}</section>`);
add('/privacy', '隱私說明', '無追蹤器。', `<section class="wrap section"><h1>隱私說明</h1><p>純靜態日本服飾選物指南。</p></section>`);
add('/404', '找不到頁面', '404', `<section class="wrap section"><h1>404 找不到頁面</h1><a class="button dark" href="/">返回首頁</a></section>`);

for (const b of brands) {
  const mPhoto = ITEM_PHOTOS[b.itemType] || ITEM_PHOTOS.jacket;
  const wPhoto = b.aud==='women' || b.itemWomen.includes('洋裝') || b.itemWomen.includes('裙') ? ITEM_PHOTOS.dress : ITEM_PHOTOS[b.itemType] || ITEM_PHOTOS.shirt;
  add('/brands/' + b.id, `${b.name} 日本購買與各城市店鋪指南`, b.bestFor, `<section class="wrap brand-hero"><div><p class="eyebrow">${e(b.origin)} · ${e(b.type)}</p><h1>${e(b.name)} <span>${e(b.jp)}</span></h1>${renderHeat(b)}<p class="best-for-box"><strong>💡 誰該買：</strong>${e(b.bestFor)}</p><p>${e(b.intro)}</p>
  <div class="detail-items-grid">
    <div class="item-showcase-box"><img class="item-photo-thumb" src="${e(mPhoto)}" alt="${e(b.itemMen)}"><div class="item-showcase-info"><span class="item-showcase-label">👔 男裝／主力必買單品：</span><strong>${e(b.itemMen)}</strong><span class="item-showcase-price">${yen(b.price)}~ (${twd(b.price)})</span></div></div>
    <div class="item-showcase-box"><img class="item-photo-thumb" src="${e(wPhoto)}" alt="${e(b.itemWomen)}"><div class="item-showcase-info"><span class="item-showcase-label">👗 女裝／人氣必買單品：</span><strong>${e(b.itemWomen)}</strong><span class="item-showcase-price">${yen(b.price)}~ (${twd(b.price)})</span></div></div>
  </div>
  <div class="hero-actions"><a class="button dark" href="${e(b.url)}" target="_blank" rel="noopener">前往 ${e(b.name)} 官網 ↗</a><a class="button light" href="/#directory">← 返回 32 品牌列表</a></div></div><div>${brandLogo(b)}</div></section><section class="wrap section"><h2>📍 ${e(b.name)} 在日本 6 大城市哪裡買？（預設首選：東京）</h2><div class="city-zones-grid">${cities.map(c=>`<div class="city-zone-card"><h4>📍 ${e(c.name)}</h4><p>${e(b.cityStores[c.id])}</p><a class="city-map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name+' '+c.name)}" target="_blank" rel="noopener">開啟 Google Maps 導航 ↗</a></div>`).join('')}</div></section>`);
}

const CSS = `:root{--paper:#f6f3ed;--ink:#282b24;--olive:#536348;--muted:#686b60;--line:#d6d2c7;--hot-s:#c92a2a;--hot-a:#d9531e;--hot-b:#2f6f4e;--hot-c:#2b4c7e}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:"DM Sans","Noto Sans TC",sans-serif;line-height:1.68}a{color:inherit;text-decoration:none}[hidden]{display:none!important}.wrap{width:min(1280px,calc(100% - 36px));margin-inline:auto}.site-header{position:sticky;top:0;z-index:40;background:rgba(246,243,237,.96);border-bottom:1px solid var(--line);backdrop-filter:blur(8px)}.nav-inner{display:flex;justify-content:space-between;align-items:center;min-height:62px;gap:14px;flex-wrap:wrap}.wordmark{font-weight:800;font-size:24px}.wordmark span{font-size:12px;font-weight:500;margin-left:8px;color:var(--muted)}#main-nav{display:flex;gap:18px;font-size:14px;font-weight:600;flex-wrap:wrap}.top-gender-bar{background:#282b24;color:#f6f3ed;padding:12px 0}.top-gender-inner{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.step-pill{background:#d9531e;color:#fff;font-size:11px;font-weight:800;padding:3px 8px;border-radius:4px;margin-right:8px}.gender-pills{display:flex;gap:8px;flex-wrap:wrap}.gender-pill{background:rgba(255,255,255,.1);color:#f6f3ed;border:1px solid rgba(255,255,255,.25);padding:8px 16px;border-radius:99px;font-weight:700;cursor:pointer;transition:.15s}.gender-pill.active{background:#ffdf00;color:#111;border-color:#ffdf00;box-shadow:0 2px 10px rgba(0,0,0,.25)}.gender-status-banner{background:#fff8db;border-bottom:2px solid #e6c84f;padding:10px 0;font-size:14px;font-weight:700;color:#222}.hero,.brand-hero{display:grid;grid-template-columns:1.1fr .9fr;gap:28px;padding:30px 0;align-items:center}h1{font-size:clamp(26px,3.8vw,44px);line-height:1.2;margin:8px 0 12px}h1 span{color:var(--olive)}h2{font-size:clamp(20px,2.4vw,30px);margin:6px 0 10px}.eyebrow{font-size:11px;font-weight:800;letter-spacing:.12em;color:var(--muted);margin:0}.hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.button{display:inline-flex;align-items:center;padding:10px 18px;border-radius:6px;font-weight:700;font-size:14px}.button.dark{background:var(--ink);color:var(--paper)}.button.light{border:1px solid var(--ink)}.section,.city-explorer-section{padding:28px 0;border-top:1px solid var(--line)}.city-tabs{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:14px 0}.city-tab{background:#fff;border:1.5px solid var(--line);border-radius:8px;padding:10px;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:4px}.city-tab.active{background:var(--ink);color:#fff;border-color:var(--ink)}.city-tab span{font-size:11px;opacity:.8}.city-panel{background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px}.city-panel-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin-bottom:14px}.city-zones-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}.city-zone-card{background:#f9f7f2;border:1px solid var(--line);border-radius:8px;padding:14px}.city-zone-card h4{margin:0 0 6px}.city-brand-chips{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.city-brand-item{background:#f6f3ed;border:1px solid var(--line);border-radius:8px;padding:9px;display:flex;flex-direction:column;gap:4px}.city-brand-top{display:flex;justify-content:space-between;font-size:13px}.city-brand-loc{font-size:11px;color:var(--muted)}.style-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.style-card{background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden;display:flex;flex-direction:column}.style-photo-wrap{position:relative;height:210px;background:#e5e0d5;overflow:hidden}.style-photo-wrap img{width:100%;height:100%;object-fit:cover;display:block}.style-gender-tag{position:absolute;top:10px;left:10px;background:rgba(20,22,18,.82);color:#fff;font-size:11px;font-weight:700;padding:4px 9px;border-radius:99px}.style-card-body{padding:14px;display:flex;flex-direction:column;gap:8px;flex:1}.style-card-body h3{font-size:16px;margin:0}.style-card-body h3 span{display:block;font-size:12px;color:var(--muted);font-weight:500}.style-formula-pills{display:flex;flex-wrap:wrap;gap:5px}.formula-pill{background:#f3f0e8;border:1px solid #dcd6c8;font-size:11px;padding:2px 7px;border-radius:4px;font-weight:600}.style-card-body p{font-size:12.5px;color:#444;margin:0;flex:1}.style-card-foot{border-top:1px solid var(--line);padding-top:8px;font-size:11.5px;display:flex;justify-content:space-between;align-items:center;gap:6px}.text-btn{background:var(--ink);color:#fff;border:0;padding:4px 9px;border-radius:4px;font-size:11px;font-weight:700;cursor:pointer}.brand-image-wrap{position:relative;display:block}.brand-logo-card{margin:0;position:relative;overflow:hidden}.brand-logo-card svg{width:100%;height:auto;display:block}.brand-real-logo{position:absolute;top:10px;left:10px;width:28px;height:28px;border-radius:6px;background:#fff;padding:3px;box-shadow:0 2px 6px rgba(0,0,0,.25)}.logo-origin-badge{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.68);color:#fff;font-size:11px;padding:3px 8px;border-radius:4px;font-weight:700}.card-no{position:absolute;bottom:8px;left:10px;font-size:11px;background:rgba(255,255,255,.92);color:#111;padding:2px 8px;border-radius:4px;font-weight:800;z-index:2}.heat-method-banner{background:#fff;border:1.5px solid #d5cfc2;border-radius:10px;padding:14px 16px;margin:12px 0}.heat-method-banner p{margin:4px 0 10px;font-size:13px;color:#444}.heat-legend-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:12px}.heat-legend-item{display:flex;align-items:center;gap:6px}.dot{width:10px;height:10px;border-radius:50%;display:inline-block;flex-shrink:0}.filter-panel{background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px;margin:14px 0}.preset-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.preset-chip{background:#f6f3ed;border:1px solid var(--line);padding:6px 12px;border-radius:99px;font-size:13px;font-weight:700;cursor:pointer}.preset-chip.active{background:var(--ink);color:#fff}.filter-controls{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:8px}.filter-controls input,.filter-controls select{padding:9px;border:1px solid var(--line);border-radius:6px;font-size:13.5px}.brand-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.brand-card{background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden;display:flex;flex-direction:column;position:relative}.brand-copy{padding:14px;display:flex;flex-direction:column;gap:9px;flex:1}.heat-meter-wrap{background:#fbf9f5;border:1px solid #e6e0d4;border-radius:8px;padding:8px 10px}.heat-meter-top{display:flex;justify-content:space-between;align-items:center;font-size:11.5px;margin-bottom:5px}.heat-badge,.heat-mini{font-weight:800;font-size:11px;padding:2px 8px;border-radius:99px;color:#fff}.s-fire{background:var(--hot-s)}.a-hot{background:var(--hot-a)}.b-steady{background:var(--hot-b)}.c-niche{background:var(--hot-c)}.heat-bar-track{height:7px;background:#e5e0d5;border-radius:99px;overflow:hidden}.heat-bar-fill{height:100%;border-radius:99px}.heat-verdict{font-size:12px;color:#444;margin:5px 0 0}.best-for-box{background:#f3f5f0;border-left:3px solid var(--olive);padding:6px 9px;font-size:12.5px;margin:0}.item-showcase-box{display:flex;align-items:center;gap:10px;background:#f8f6f0;border:1px solid #e2ddd2;border-radius:8px;padding:8px}.item-photo-thumb{width:58px;height:58px;border-radius:6px;object-fit:cover;flex-shrink:0;border:1px solid #d5cfc2;background:#eae6dc}.item-showcase-info{display:flex;flex-direction:column;font-size:12px;line-height:1.4}.item-showcase-label{font-size:11px;color:var(--muted);font-weight:700}.item-showcase-name{color:#111;font-size:13px}.item-showcase-price{font-weight:800;color:var(--hot-a)}.item-showcase-price em{font-style:normal;color:var(--muted);font-weight:500}.detail-items-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0}.city-store-callout{background:#fff8eb;border:1px solid #edd8b4;border-radius:8px;padding:9px;font-size:12px}.city-store-text{margin:3px 0;font-weight:600}.city-map-link{color:#b34700;font-weight:700}.card-foot{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:8px;border-top:1px solid var(--line);font-size:11.5px}.tag{font-size:11px;background:#f0ede6;padding:2px 7px;border-radius:4px;margin-right:4px}.cut-note{color:var(--muted)}.site-footer{background:#eae6dc;padding:28px 0;margin-top:40px;border-top:1px solid var(--line)}@media(max-width:1024px){.style-grid{grid-template-columns:repeat(2,1fr)}.brand-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:720px){.hero,.brand-hero,.style-grid,.city-zones-grid,.brand-grid,.filter-controls,.heat-legend-grid,.detail-items-grid{grid-template-columns:1fr}.city-tabs,.city-brand-chips{grid-template-columns:repeat(2,1fr)}}`;

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
      bTxt.textContent=st.gender==='men'?'👔 已切換為「男生穿搭模式」：首頁範例、8大風格與所有品牌卡已切換為【男裝必買代表單品圖】，並將男裝主打神牌排至最上方！':'👗 已切換為「女生穿搭模式」：首頁範例、8大風格與所有品牌卡已切換為【女裝必買代表單品圖】，並將 SNIDEL、Mila Owen、CLANE 等女裝神牌排至最上方！';
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
  const cBtn=document.querySelector('[data-select-city="'+st.city+'"]'), cLabel=cBtn?cBtn.dataset.label:'東京 Tokyo';
  const grid=document.getElementById('brand-grid'); if(!grid)return;
  const cards=[...grid.querySelectorAll('.brand-card')]; let shown=0;
  cards.forEach(c=>{
    const stores=JSON.parse(c.dataset.stores||'{}'), addr=stores[st.city]||stores.tokyo||'日本主要百貨';
    const nEl=c.querySelector('[data-city-name]'), sEl=c.querySelector('[data-city-store]'), mEl=c.querySelector('[data-city-map]');
    if(nEl)nEl.textContent=cLabel; if(sEl)sEl.textContent=addr;
    if(mEl){mEl.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(c.dataset.name+' '+cLabel.split(' ')[0]);mEl.textContent='在 Google Maps 開啟'+cLabel.split(' ')[0]+'店鋪位置 ↗';}
    const iLbl=c.querySelector('[data-item-label]'), iName=c.querySelector('[data-item-name]'), iImg=c.querySelector('[data-item-img]');
    if(iLbl&&iName){
      if(st.gender==='men'){iLbl.textContent='👔 男裝必買代表單品：';iName.textContent=c.dataset.itemMen;if(iImg)iImg.src=c.dataset.photoMen;}
      else if(st.gender==='women'){iLbl.textContent='👗 女裝必買代表單品：';iName.textContent=c.dataset.itemWomen;if(iImg)iImg.src=c.dataset.photoWomen;}
      else{iLbl.textContent='🛍️ 必買代表單品（點上方男女可切換）：';iName.textContent=c.dataset.aud==='women'?c.dataset.itemWomen:c.dataset.itemMen;if(iImg)iImg.src=c.dataset.aud==='women'?c.dataset.photoWomen:c.dataset.photoMen;}
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
  const cnt=document.getElementById('results-count'); if(cnt)cnt.textContent='顯示 '+shown+' / '+cards.length+' 個品牌';
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
console.log('Built ' + pages.size + ' V4 pages for ' + brands.length + ' brands.');
