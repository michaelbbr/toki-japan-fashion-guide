import fs from 'node:fs';
import path from 'node:path';
import {brands,styles,articles,releases,checkedAt} from '../data/catalog.mjs';
import {escapeHtml as e} from '../src/domain.mjs';
import {shell,photo,outfitPhoto,lookFor,firstLook,brandCard,pieceCard,directory,styleCards,relationshipRows,lead,sectionHead,routeLink,sourceLink,yen,tags} from '../src/view.mjs';
import {startHero,familyHub,familyPage,areasPage} from '../src/discovery.mjs';
import {cityGuide,brandCityLinks} from '../src/city-guide.mjs';
import {shoppingCities,shoppingStores,citySlug} from '../data/shopping-guides.mjs';
import {travelFinder} from '../src/journey.mjs';
import {budgetPage} from '../src/landing.mjs';
import {outfits} from '../data/outfits.mjs';
import {familyGuides} from '../data/label-guide.mjs';
const site=process.env.SITE_URL || 'https://toki-japan-fashion-guide.vercel.app';
const out=path.resolve('dist');
const byId=new Map(brands.map(b=>[b.id,b]));
if(byId.size!==brands.length)throw new Error('Brand IDs must be unique');
const retention=JSON.parse(fs.readFileSync('data/brand-retention.json','utf8'));
for(const id of [...retention.requiredUnion,...retention.explicitRequests])if(!byId.has(id))throw new Error('Previously requested brand missing: '+id);
if(brands.length<150)throw new Error('The current catalog requires at least 150 brand/label guides');
for(const b of brands){
 for(const field of ['name','jp','type','tagline','intro','why','shopping','official','shop'])if(!b[field])throw new Error('Missing '+b.id+'.'+field);
 if(!b.styles.length || !b.audience.length || !b.pieces.length)throw new Error('Incomplete brand: '+b.id);
 for(const p of b.pieces)if(!p.sku || !p.source.startsWith('https://') || !p.image.startsWith('https://'))throw new Error('Missing product/photo provenance: '+b.id);
}
for(const s of shoppingStores){if(!s.audience?.length||!s.difference||!s.buy||!s.source.startsWith('https://')||!s.address)throw new Error('Incomplete shopping store: '+s.id);for(const id of s.brands)if(!byId.has(id))throw new Error('Unknown store brand: '+id);}
for(const c of shoppingCities)for(const id of c.start)if(!shoppingStores.some(s=>s.id===id&&s.city===c.id))throw new Error('Unknown city starter: '+id);
const pages=new Map();
const add=(url,title,description,body,active)=>pages.set(url,shell(title,description,url,body,active));
function journals(){return `<div class="journal-grid">${articles.map(a=>`<a class="journal-card" href="/journal/${a.slug}"><p class="eyebrow">${e(a.eyebrow)} · ${e(a.readTime)}</p><h3>${e(a.title)}</h3><p>${e(a.intro)}</p><span class="text-link">閱讀筆記 →</span></a>`).join('')}</div>`;}

add('/','去日本，找到值得逛的服飾品牌','按地區逛店、按整趟購衣預算與買法找品牌、逐步問題引導，或直接認識150個品牌與標籤。',startHero());
add('/budget','按整趟購衣預算找品牌','先選整趟購衣日圓預算，再選多買幾件、少買買好一點或一件特別單品，找到品牌、參考單品與逛店方向。',budgetPage());
add('/start','五步找到想逛的日本品牌','依服裝類型、想買品類、單件日圓預算、旅遊地區與穿衣喜好挑選品牌。',travelFinder(true),'start');
add('/brands','日本可買品牌索引','認識在日本可買到的品牌、先看什麼單品，以及官方購物入口。',lead('BEFORE YOUR JAPAN TRIP','去日本，<em>有哪些品牌可以逛？</em>',`收錄 ${brands.length} 個品牌與標籤。包含日本品牌、國際品牌與小眾設計師。從常穿的衣服、單件預算開始看。` )+`<div class="wrap audience-links">${routeLink('/brands','全部品牌')}${routeLink('/men','男裝')}${routeLink('/women','女裝')}</div>`+directory(),'brands');
for(const g of ['men','women']){
 const title=g==='men'?'男裝':'女裝';
 add('/'+g,title+'品牌探索','給第一次去日本買衣服的旅客：認識'+title+'品牌、單品與官方購物入口。',lead('SHOP FOR YOUR JAPAN TRIP',title+'，<em>這趟想逛哪幾家？</em>','先看品牌在賣什麼、適合從哪件開始。不熟風格也沒關係，可以用五步引導幫你挑。')+`<div class="wrap audience-links">${routeLink('/men','男裝')}${routeLink('/women','女裝')}${routeLink('/brands','全部品牌')}</div>`+directory(g),g);
}
add('/guide','購衣指南','品牌支線、代表單品、品牌比較與日本購物筆記。',lead('BEFORE YOU GO','出發前，<em>多了解一點。</em>','依你現在的問題，選一個主題繼續看。')+`<section class="wrap section guide-tool-grid">${[['/pieces','不知道先看什麼單品？','品牌代表單品'],['/relationships','同一家有很多支線？','品牌支線怎麼選'],['/compare','想比較不同牌子？','品牌比較'],['/shopping','準備安排購物行程？','日本購物指南'],['/journal','想慢慢認識穿搭？','選物日誌'],['/releases','想知道發售資訊？','新品筆記']].map(([url,q,title])=>`<a href="${url}"><span>${q}</span><h2>${title} →</h2></a>`).join('')}</section>`,'guide');
add('/styles','風格索引','城市日常、簡約、山系與柔美城市風格。',lead('THE STYLE INDEX','找到喜歡的，<em>穿衣方向。</em>','看官方穿搭示例選感覺；風格分類是本站的編輯探索方向。')+`<section class="wrap section">${styleCards()}</section>`);
add('/pieces','品牌代表單品','用真實商品圖認識官方定番、系列與編輯選品。',lead('THE PIECE INDEX','先認識一件，<em>再認識品牌。</em>','有官方依據才標定番；編輯選品與歷史版本各自標示。每張照片對應具體商品與來源。')+`<section class="wrap section"><div class="piece-grid">${brands.flatMap(b=>b.pieces.map(p=>pieceCard(b,p))).join('')}</div></section>`,'pieces');
for(const b of brands){
 const related=b.similar.filter(r=>byId.has(r.id));
 add('/brands/'+b.id,b.name+' 品牌指南',b.tagline+' 代表單品、價格樣本與官方關係。',`<div class="wrap breadcrumb"><a href="/brands">品牌索引</a><span>/</span><span>${e(b.name)}</span></div><section class="wrap brand-hero"><div><p class="eyebrow">${e(b.type)}</p><h1>${e(b.name)}</h1><p class="brand-jp">${e(b.jp)}</p><h2>${e(b.tagline)}</h2><div class="tags">${tags(b)}</div><div class="hero-actions">${b.id==='beams'?routeLink('/relationships/beams','先選 BEAMS 標籤','button dark'):routeLink('#pieces','先看代表單品','button dark')}${sourceLink(b.official,'官方入口')}</div>${b.audienceBasis==='editorial'?'<p class="scope-note">本頁男女入口為編輯探索建議，並不推定每款皆為 UNISEX。</p>':''}<p class="tiny">品牌內容查核 ${checkedAt}</p></div>${outfitPhoto(b,'brand-hero-art',true)}</section><div class="wrap detail-layout"><aside class="detail-nav" aria-label="品牌頁內導覽"><span class="eyebrow">IN THIS GUIDE</span><a href="#pieces">代表單品</a><a href="#about">認識品牌</a><a href="#prices">價格參考</a>${b.relationships.length?'<a href="#relationships">品牌關係</a>':''}<a href="#buying">日本購物</a><a href="#fit">尺寸怎麼看</a></aside><div class="detail-body">
<p class="outfit-source-note" data-outfit-source>${sourceLink(lookFor(b)?.source||b.official,(lookFor(b)?.credit||'品牌')+'來源')} · 造型可能搭配其他品牌，單品歸屬請看下方商品資料。</p><section class="travel-quick"><div><strong>第一次先看什麼？</strong><p data-look-choices="${e(JSON.stringify(Object.fromEntries(['all','men','women'].map(g=>[g,firstLook(b,g)]))))}">${e(b.look[0])}</p></div><div><strong>準備去哪裡買？</strong><p>先看官方購物／店舖資訊，確認服裝類型與庫存。</p>${sourceLink(b.shop,'官方購物／查店入口')}</div></section><section id="pieces"><p class="eyebrow">START WITH THESE PIECES</p><h2>先看這幾件。</h2><div class="brand-piece-list">${b.pieces.map(p=>pieceCard(b,p)).join('')}</div><p class="notice" data-piece-context-note hidden>這個服裝方向的具名單品仍在整理，可先從官方入口查看完整系列。</p></section>
<section id="about"><p class="eyebrow">GET TO KNOW</p><h2>把品牌放回日常。</h2><p>${e(b.intro)}</p><h3>誰可以從這裡開始？</h3><p>${e(b.why)}</p><ul class="focus-list">${b.look.map((t,i)=>`<li ${i===0?'data-look-choices="'+e(JSON.stringify(Object.fromEntries(['all','men','women'].map(g=>[g,firstLook(b,g)]))))+'"':''}>${e(t)}</li>`).join('')}</ul></section>
<section id="prices"><p class="eyebrow">PRICE NOTES</p><h2>價格，跟著單品看。</h2><p class="notice">具名樣本不代表全品牌價格；是否與上方照片同款，請看商品名稱。</p><div class="price-list">${b.samples.length?b.samples.map(s=>`<div data-price-audience="${e((s.audience||[]).join(' '))}"><div><h3>${e(s.name)}</h3><p>${e(s.note)} · 查核 ${e(s.checkedAt||'2026-10-14')}</p>${sourceLink(s.url,'價格來源')}</div><strong>${yen(s.price)}</strong></div>`).join(''):'<p>日本價格尚未核實，請開啟官方商品頁確認。</p>'}</div></section>
${b.relationships.length?`<section id="relationships"><p class="eyebrow">BRAND, LABEL OR COLLABORATION?</p><h2>支線與名稱，怎麼分？</h2>${relationshipRows(b)}</section>`:''}
<section id="buying"><p class="eyebrow">SHOP IN JAPAN</p><h2>想試穿，再安排逛店。</h2>${brandCityLinks(b)}<p>${e(b.shopping)}</p>${sourceLink(b.shop,'官方購物／店舖入口','button light')}<p class="notice">門市、商品範圍、售價與庫存，出發前請再確認。${routeLink('/shopping','日本逛店指南')}</p></section>
<section id="fit"><p class="eyebrow">FIT NOTES</p><h2>尺寸從實寸開始。</h2><p>${e(b.fitAdvice)}</p></section>
${related.length?`<section><p class="eyebrow">KEEP EXPLORING</p><h2>沿著喜歡的方向，繼續看。</h2><div class="related-list">${related.map(r=>routeLink('/brands/'+r.id,`<strong>${e(byId.get(r.id).name)}</strong><span>${e(r.reason)}</span>`)).join('')}</div><p class="notice">編輯探索建議，非隸屬或人氣排名。</p></section>`:''}
<section class="source-list"><details><summary>本頁來源與圖片說明</summary><ul>${b.sources.map(s=>`<li>${sourceLink(s.url,s.label)}</li>`).join('')}${b.pieces.map(p=>`<li>${sourceLink(p.source,p.originalName+' · 商品與圖片')}</li>`).join('')}</ul><p>原創整理與編輯選品；照片由具名官方／品牌銷售來源載入，權利屬原權利人。圖片不保證現貨，也不等同作者實穿。</p></details></section></div></div>`,'brands');
}
add('/relationships','品牌支線怎麼選','從穿著需求理解 BEAMS 等品牌的標籤差別。',familyHub(),'relationships');
for(const [id,g] of Object.entries(familyGuides))add('/relationships/'+id,g.title,g.summary,familyPage(id),'relationships');
add('/brands/beams/labels','BEAMS 完整標籤指南','14 個入門選擇與 35 項官方名稱索引。',familyPage('beams'),'relationships');
add('/areas','按城市安排日本服飾逛店','主要城市的品牌差別、值得看的衣服、已核對店址，另有宇都宮 ARKnets 和鎌倉山と道。',areasPage(),'areas');
for(const c of shoppingCities)add('/areas/'+citySlug(c),'去'+c.name+'，可以逛哪些服飾品牌？',c.intro,cityGuide(c),'areas');
add('/compare','品牌探索比較','依用途與完整標籤比較品牌，品類與價格樣本分開看。',lead('READ THE DIFFERENCE','看起來都喜歡，<em>怎麼選？</em>','先比較探索方式，再挑同類單品；以下是編輯建議，沒有品牌總分。')+`<section class="wrap section"><div class="comparison"><div class="compare-head"><span>第一次逛選貨店</span><a href="/brands/beams">BEAMS</a><a href="/brands/united-arrows">UNITED ARROWS</a></div>${[['品牌類型','選貨店／自有品牌','選貨店／自有品牌'],['編輯探索方向','休閒、層次與多種標籤','簡潔日常與通勤用途'],['先看什麼','完整標籤與常穿的上衣','主品牌與同用途的服裝'],['價格怎麼比','同品類、同購買單位','同品類、同購買單位']].map(row=>`<div class="compare-row">${row.map(t=>`<span>${t}</span>`).join('')}</div>`).join('')}</div><p class="notice">T-shirt、針織、外套與套組不混作品牌高低排名。</p></section>`);
add('/shopping','日本逛店指南','從想看的單品與官方店型，整理日本旅行購物清單。',lead('TAKE YOUR STYLE TO JAPAN','把喜歡的品牌，<em>放進下一趟旅行。</em>','先記下想試的單品，再核對店舖、完整標籤與服裝範圍。')+`<section class="wrap section shopping-grid"><article><p class="eyebrow">01 / BEFORE YOU GO</p><h2>挑三個想看的品牌。</h2><p>品牌、日文品名、貨號與預算，讓清單更具體。</p>${routeLink('/pieces','認識代表單品')}</article><article><p class="eyebrow">02 / CHECK THE STORE</p><h2>先確認店型。</h2><p>男裝／女裝、服裝／裝備與販售標籤分開核對。</p>${routeLink('/relationships','看懂品牌與標籤')}</article><article><p class="eyebrow">03 / YOUR OWN ROUTE</p><h2>按城市與街區找門市。</h2><p>核對官方位置、交通方式與營業時間，安排符合旅程的動線。</p>${routeLink('/areas','按地區找門市')}</article></section><section class="wrap section">${sectionHead('OFFICIAL ENTRY POINTS','從官方入口核對店舖。')}<div class="store-links">${brands.map(b=>`<div><a href="/brands/${b.id}">${e(b.name)}</a>${sourceLink(b.shop,'購物／店舖入口')}</div>`).join('')}</div></section>`,'shopping');
add('/releases','新品筆記','官方新品日期與消息，保留查核日。',lead('NEW & NOTED','新品消息，<em>保留確認的日期。</em>','以日本時間 JST 表示；日期已過不代表目前有貨。')+`<section class="wrap section release-list">${releases.map(r=>`<article><div class="release-date"><span>${r.date?'官方公布日期':'日期未公布'}</span><strong>${r.date?r.date.slice(5,10).replace('-',' / '):'TBA'}</strong><small>${e(r.dateLabel)}</small></div><div><p class="eyebrow">${e(byId.get(r.brand).name)}</p><h2>${e(r.name)}</h2><p>${e(r.note)}</p>${sourceLink(r.url,'官方消息')}<p class="tiny">消息查核 ${r.checkedAt||'2026-10-14'}</p></div></article>`).join('')}</section>`);
add('/journal','選物日誌','原創繁體中文日本服飾品牌入門與購物指南。',lead('THE JOURNAL','穿搭之外，<em>多認識一點。</em>','把品牌放回日常，把清單放進旅程。')+`<section class="wrap section">${journals()}</section>`);
for(const a of articles)add('/journal/'+a.slug,a.title,a.intro,`<article class="wrap story">${routeLink('/journal','選物日誌')}<p class="eyebrow">${e(a.eyebrow)} · ${checkedAt}</p><h1>${e(a.title)}</h1><p class="story-lead">${e(a.intro)}</p><div class="story-text">${a.sections.map(([h,p])=>`<section><h2>${e(h)}</h2><p>${e(p)}</p></section>`).join('')}<section><h2>沿著這些品牌繼續看。</h2><div class="story-brands">${a.brands.map(id=>routeLink('/brands/'+id,e(byId.get(id).name),'tag')).join('')}</div></section><details><summary>來源與編輯說明</summary><p>本文是編輯建議，沒有宣稱實穿或實訪。</p><ul>${a.brands.map(id=>`<li>${sourceLink(byId.get(id).shop,byId.get(id).name+' 官方入口')}</li>`).join('')}</ul></details></div></article>`);
add('/methods','資料、圖片與編輯方法','價格樣本、實物照片、品牌關係與歷史資料說明。',lead('OUR EDITORIAL METHOD','每份資料，<em>保留來處。</em>','官方事實、編輯建議與尚未確認的欄位各自標示。')+`<div class="wrap prose"><section id="prices"><h2>價格屬於具名單品。</h2><p>價格保留每件商品的查核日期、款名、年份與來源。舊專題、促銷、套組與不同品類分開看，不代表品牌全部價格或現貨。未核實日本地區的售價就提供官方入口，不換算國際站價格；沒有價格的品牌仍可在不限預算時找到。</p></section><section><h2>照片對應真實商品。</h2><p>品牌探索、風格與引導頁使用具名官方／品牌通路穿搭照片，歷史影像標示年份；整套造型可能搭配其他品牌。代表單品另用該款官方／品牌通路的實物照片，附品名、貨號與來源。標籤指南另用具名官方標籤形象，可能包含店內他牌選品，不將整套造型視為同品牌商品。圖片由原來源載入，權利屬原權利人，可能因來源調整而失效。不用 AI 圖或其他品牌商品替代；穿搭示例不代表整套同品牌、商品現貨或整套價格。</p></section><section><h2>代表單品有不同角色。</h2><p>官方定番須有官方文字支持；編輯入門選品是本站探索建議。季節與歷史款保留年份，不宣稱每款都是官方代表作、銷量最好或現在有貨。</p></section><section><h2>公司、標籤與合作分開看。</h2><p>同公司品牌、子標籤、合作線、面料與商品系列附官方依據；店內販售某品牌不直接證明隸屬。</p>${routeLink('/relationships','品牌關係索引')}</section><section><h2>風格與搭配是編輯建議。</h2><p>不保證全品牌適合某種身形，也不提供全品牌固定縮碼建議；請對照每款官方實寸。</p></section><section><h2>個人資訊原型。</h2><p>不銷售商品、不加聯盟行銷代碼；維持既有免費靜態託管。</p></section></div>`);
add('/privacy','隱私說明','搜尋、外部圖片與靜態託管的資料使用說明。',lead('PRIVACY','輕鬆探索，<em>留在當下。</em>','不要求帳號、不收集付款資訊。')+`<div class="wrap prose"><section><h2>搜尋與分享網址。</h2><p>篩選在瀏覽器處理，網址會帶上搜尋內容。請不要輸入個資，分享前可清除條件。</p></section><section><h2>外部圖片與字型。</h2><p>商品照片從列明的品牌／通路來源載入，對方會收到基本連線資訊。Google Fonts 提供字型，外部來源適用該站政策。</p></section><section><h2>網站服務。</h2><p>Vercel 提供靜態託管並可能處理存取日誌。本站沒有帳號、付款、廣告追蹤、第三方分析或聯盟代碼。</p></section></div>`);
add('/404','找不到頁面','回到 TOKI 探索日本品牌。',lead('404 / A DIFFERENT TURN','這一頁，<em>還沒在這裡。</em>','換一條路，繼續看喜歡的品牌。')+`<section class="wrap section">${routeLink('/brands','回到品牌索引','button dark')}</section>`);
fs.mkdirSync(out,{recursive:true});
for(const file of ['trends.html','data/fti-snapshots.json','editorial-theme.mjs'])fs.rmSync(path.join(out,file),{force:true});
for(const [url,html] of pages){const file=path.join(out,url==='/'?'index.html':url.slice(1)+'.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html);}
fs.cpSync('public',out,{recursive:true});fs.writeFileSync(path.join(out,'domain.mjs'),fs.readFileSync('src/domain.mjs','utf8').split('export function summarize(')[0]);
fs.mkdirSync(path.join(out,'data'),{recursive:true});fs.writeFileSync(path.join(out,'data/catalog.json'),JSON.stringify({brands:brands.map(({fti,scope,...b})=>b),styles,checkedAt}));fs.copyFileSync('data/discovery-options.mjs',path.join(out,'discovery-options.mjs'));
fs.writeFileSync(path.join(out,'data/brand-search.json'),JSON.stringify(brands.map(({id,name,jp,aliases})=>({id,name,jp,aliases}))));
fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...pages.keys()].filter(u=>u!=='/404').map(u=>`<url><loc>${site}${u}</loc></url>`).join('')}</urlset>`);
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+site+'/sitemap.xml\n');
fs.writeFileSync(path.join(out,'build-manifest.json'),JSON.stringify({routes:[...pages.keys()],builtAt:new Date().toISOString(),runtimeFunctions:0,brands:brands.length},null,2));
console.log('Built '+pages.size+' routes for '+brands.length+' brands. 0 runtime functions.');
