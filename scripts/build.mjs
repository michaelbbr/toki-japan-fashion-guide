import fs from 'node:fs';
import path from 'node:path';
import {brands,styles,articles,releases,checkedAt} from '../data/catalog.mjs';
import {escapeHtml as e,summarize} from '../src/domain.mjs';

const root=process.cwd(), out=path.join(root,'dist');
const site=process.env.SITE_URL || 'https://toki-japan-fashion-guide.vercel.app';
const snapshots=JSON.parse(fs.readFileSync(path.join(root,'data/fti-snapshots.json'),'utf8'));
const yen=n=>'¥'+n.toLocaleString('en-US');
const date=s=>s ? s.slice(0,10).replaceAll('-','.') : '—';
const link=(url,text,css='text-link')=>`<a class="${css}" href="${e(url)}" target="_blank" rel="noopener noreferrer">${text}<span aria-hidden="true"> ↗</span><span class="sr-only">（另開視窗）</span></a>`;
const arrow='<span aria-hidden="true">↗</span>';
function art(cell, css='') {
  const x=[0,209,418,627,836,1045,1254], y=[0,235,444,650,823,1016,1254];
  const c=cell%6,r=Math.floor(cell/6);
  return `<figure class="concept ${css}"><svg viewBox="${x[c]+2} ${y[r]+2} ${x[c+1]-x[c]-4} ${y[r+1]-y[r]-4}" role="img" aria-label="AI 製作的泛用服飾風格示意，並非品牌商品"><image href="/media/fashion-references-v1.webp" width="1254" height="1254"/></svg><figcaption>風格示意 · AI</figcaption></figure>`;
}
function shell(title,description,url,body,active='') {
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}｜TOKI 日本品牌選物誌</title><meta name="description" content="${e(description)}"><meta name="theme-color" content="#f6f3ed"><link rel="canonical" href="${site}${url}"><meta property="og:title" content="${e(title)}｜TOKI"><meta property="og:description" content="${e(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${site}${url}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;600;700&family=Noto+Serif+TC:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/styles.css"><script type="module" src="/app.mjs"></script></head><body><a class="skip" href="#main">跳至主要內容</a>
  <header class="site-header"><div class="wrap nav-inner"><a class="wordmark" href="/" aria-label="TOKI 首頁">TOKI<span>日本品牌選物誌</span></a><button class="menu-toggle" aria-label="開啟導覽選單" aria-expanded="false" aria-controls="main-nav">選單 <span aria-hidden="true">☰</span></button><nav id="main-nav" aria-label="主導覽">
  ${[['/brands','找品牌','brands'],['/styles','風格索引','styles'],['/trends','趨勢觀測','trends'],['/releases','新品筆記','releases'],['/journal','選物日誌','journal']].map(([href,text,key])=>`<a href="${href}" ${active===key?'aria-current="page"':''}>${text}</a>`).join('')}<a class="nav-search" href="/brands#search" aria-label="搜尋品牌"><svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m15 15 6 6" stroke="currentColor" stroke-width="1.5"/></svg></a></nav></div></header>
  <main id="main">${body}</main><footer class="site-footer"><div class="wrap footer-main"><div><a href="/" class="footer-logo">TOKI<span>時々、好きな服を。</span></a><p>從風格開始，找到下一個喜歡的日本品牌。<br>給台灣、香港讀者的個人選物筆記。</p></div><div class="footer-links"><a href="/brands">品牌資料庫</a><a href="/journal/japan-shopping-checklist">日本購物指南</a><a href="/methods">資料與編輯方法</a><a href="/privacy">隱私說明</a>${link('https://fashion-trend-index.vercel.app/zh-tw','FTI 趨勢觀測')}</div></div><div class="wrap footer-bottom"><span>© 2026 TOKI · PERSONAL EDITORIAL PROJECT</span><span>繁體中文 · Taiwan / Hong Kong</span></div></footer></body></html>`;
}
function tags(b) {return b.styles.map(id=>`<a class="tag" href="/brands?style=${id}">${styles.find(s=>s.id===id).name}</a>`).join('');}
function card(b,i=0) {
  const min=Math.min(...b.samples.map(p=>p.price));
  return `<article class="brand-card ${b.accent}" data-brand="${e(JSON.stringify(b))}" data-name="${e(b.name)}" data-price="${min}" data-order="${i}"><a class="brand-image" href="/brands/${b.id}" aria-label="認識 ${e(b.name)}">${art(b.cell)}<span class="card-no">0${i+1} / BRAND GUIDE</span><span class="round-arrow" aria-hidden="true">↗</span></a><div class="brand-copy"><p class="eyebrow">${b.type}</p><h3><a href="/brands/${b.id}">${e(b.name)}</a></h3><p>${b.tagline}</p><div class="card-foot"><div class="tags">${tags(b)}</div><span class="sample-price">單品樣本 ${yen(min)}</span></div></div></article>`;
}
function filters() {
 return `<form id="filter-form" class="filter-panel" role="search" aria-label="找品牌"><div class="search-box"><svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m15 15 6 6" stroke="currentColor" stroke-width="1.5"/></svg><label class="sr-only" for="search">搜尋品牌</label><input type="search" id="search" name="q" maxlength="160" placeholder="品牌名、日文名、你喜歡的風格…" autocomplete="off"></div><div class="filter-selects"><label>風格<select name="style"><option value="all">所有風格</option>${styles.map(s=>`<option value="${s.id}">${s.name} · ${s.zh}</option>`).join('')}</select></label><label>單品預算<select name="budget"><option value="all">不限預算</option><option value="under-5000">低於 ¥5,000</option><option value="5000-10000">¥5,000–未滿 10,000</option><option value="10000-30000">¥10,000–未滿 30,000</option><option value="30000-plus">¥30,000 以上</option></select></label><label>服裝類型<select name="gender"><option value="all">不限</option><option value="men">男裝</option><option value="women">女裝</option></select></label><button type="reset" class="reset">清除條件 ↺</button></div><p class="filter-note">預算依已查核的上衣樣本篩選，含兩件套組；不代表品牌全部商品價格。<a href="/methods#prices">了解價格資料 ↗</a></p></form>`;
}
function directory(title='从日常，找到你的品牌。') {
 return `<section class="wrap section" id="directory"><div class="section-title"><div><p class="eyebrow">THE BRAND INDEX</p><h2>${title.replace('从','從')}</h2></div><span class="tiny">FIRST EDITION · 05 BRANDS</span></div>${filters()}<div class="result-bar"><p id="result-count" role="status" aria-live="polite">找到 5 個品牌</p><label>排序<select id="sort" name="sort"><option value="editorial">編輯順序</option><option value="price">樣本價格由低至高</option><option value="name">品牌名稱</option></select></label></div><div class="brand-grid">${brands.map(card).join('')}</div><div id="empty-results" class="empty" hidden><span>NO MATCH, YET.</span><h3>這組條件還沒有符合的品牌。</h3><p>目前首輯收錄五個品牌。試試其他風格，或清除條件繼續探索。</p><button type="button" class="button dark" id="empty-reset">清除所有條件 →</button></div><noscript><p class="notice">所有品牌已列出。啟用 JavaScript 可使用搜尋與篩選。</p></noscript></section>`;
}
function styleCards() {
 return `<div class="style-grid">${styles.map((s,i)=>`<a class="style-card" href="/brands?style=${s.id}">${art(s.cell)}<div><span class="tiny">0${i+1} / STYLE</span><h3>${s.name}</h3><p>${s.zh} · ${s.note}</p><span class="style-count">${brands.filter(b=>b.styles.includes(s.id)).length} 個品牌 ${arrow}</span></div></a>`).join('')}</div>`;
}
function journalCards() {
 return `<div class="journal-grid">${articles.map(a=>`<a class="journal-card" href="/journal/${a.slug}">${art(a.cell)}<div><p class="eyebrow">${a.eyebrow} · ${a.readTime}</p><h3>${a.title}</h3><p>${a.intro}</p><span class="text-link">閱讀筆記 →</span></div></a>`).join('')}</div>`;
}
function svgChart(obs) {
 if(!obs.points.length) return '';
 const paths=[]; let current=[];
 obs.points.forEach((p,i)=>{
  if(p.value===null) {if(current.length)paths.push(current.join(' '));current=[];return;}
  const x=38+i/Math.max(1,obs.points.length-1)*652,y=180-p.value*1.5;
  current.push((current.length?'L':'M')+x.toFixed(1)+','+y.toFixed(1));
 });
 if(current.length)paths.push(current.join(' '));
 return `<svg class="trend-chart" viewBox="0 0 720 220" role="img" aria-label="歷史搜尋相對指數圖，各搜尋詞獨立正規化">${[0,50,100].map(v=>`<line x1="38" x2="690" y1="${180-v*1.5}" y2="${180-v*1.5}" stroke="#dedbd3"/><text x="5" y="${185-v*1.5}">${v}</text>`).join('')}${paths.map(d=>`<path d="${d}" stroke="#536348" stroke-width="2.8" fill="none" stroke-linejoin="round"/>`).join('')}<text x="38" y="211">${e(obs.points[0].date)}</text><text x="690" y="211" text-anchor="end">${e(obs.points.at(-1).date)}</text></svg>`;
}
function observation(b,compact=false) {
 const obs=summarize(snapshots.snapshots[b.fti]);
 const title=obs.state==='stale'?'歷史觀測 · 待更新':obs.state==='current'?'已保存日本觀測':obs.state==='missing'?'尚無日本搜尋觀測':'資料不足';
 const change=obs.change===null?'':`<span class="momentum">${obs.change>0?'+':''}${obs.change}% · 同詞週變化</span>`;
 return `<section class="observation ${compact?'compact':''}" ${compact?' ':'id="trend"'}><div class="observation-head"><div><p class="eyebrow">FTI / JAPAN SEARCH</p><h3>${compact?e(b.name):'日本搜尋關注'}</h3></div><span class="status ${obs.state}">${title}</span></div>${obs.points.length ? `<p class="muted">取得於 ${date(obs.observedAt)} · 查詢：${e(obs.query)}</p>${change}${svgChart(obs)}<p class="notice">${obs.state==='stale'?'這份快照已超過 14 天，只供查看當時走勢。':''} 0–100 是該搜尋詞自己的相對指數，不能與其他品牌比較絕對人氣，也不代表銷售。缺值與未完成資料保留斷線。</p>`:`<p class="no-signal">品牌資料已收錄；日本搜尋資料尚未收錄，暫不顯示熱度或升降。</p>`}
 ${b.scope?`<p class="scope-note">${b.scope}</p>`:''}<details><summary>資料來源與說明</summary><p>FTI 保存的 Google Trends 日本搜尋觀測。取得日和原始查詢保留。不同品牌名稱可能涵蓋不同商品範圍。</p>${link('https://fashion-trend-index.vercel.app/zh-tw'+(b.fti?'/asset/'+b.fti+'?market=JP':''),'查看 FTI')} · <a href="/methods">本站資料方法 →</a></details></section>`;
}
function pageIntro(en,title,description) {return `<section class="wrap page-intro"><p class="eyebrow">${en}</p><h1>${title}</h1><p>${description}</p></section>`;}
const pages=new Map();
function add(url,title,description,body,active) {pages.set(url,shell(title,description,url,body,active));}
add('/','找到你喜歡的日本風格','給台灣、香港讀者的日本服飾品牌探索。從風格與預算出發，認識品牌、查價格、規劃購物。',`
 <section class="wrap hero"><div class="hero-copy"><p class="eyebrow"><span class="edition-dot"></span> JAPANESE STYLE, YOUR WAY.</p><h1>找到你喜歡的，<br><span>日本風格。</span></h1><p class="hero-english">Your next favourite.</p><p class="hero-desc">從城市日常到山系穿搭。<br>認識品牌、找到風格，為下一趟日本旅行多一點靈感。</p><div class="hero-actions"><a class="button dark" href="/styles">從風格開始 <span aria-hidden="true">↗</span></a><a class="text-link" href="/brands">瀏覽品牌資料庫 →</a></div><div class="hero-bottom"><span>TAIWAN / HONG KONG</span><span>VOL. 01 — OCT. 2026</span></div></div><div class="hero-art"><div class="art-backdrop"></div><div class="hero-flatlay art-one">${art(1)}<span>TEXTURE / 質感</span></div><div class="hero-flatlay art-two">${art(2)}<span>EVERYDAY / 日常</span></div><div class="hero-flatlay art-three">${art(3)}<span>DETAIL / 細節</span></div><span class="hero-stamp">THE<br>STYLE<br>FIELD GUIDE.</span></div></section>
 <div class="editorial-strip"><div class="wrap"><span>A LITTLE JAPAN IN YOUR EVERYDAY.</span><p>喜歡的衣服，從認識開始。</p><span>EXPLORE, THEN MAKE IT YOURS. ↗</span></div></div>
 <section class="wrap section" id="styles"><div class="section-title"><div><p class="eyebrow">FIND YOUR MOOD</p><h2>你喜歡哪一種日常？</h2></div><a class="text-link" href="/styles">所有風格 →</a></div>${styleCards()}</section>
 ${directory()}
 <section class="wrap feature-note"><div><p class="eyebrow">A NOTE ON TRENDS</p><h2>多看一點數據，<br>慢慢找到自己的選擇。</h2><p>用 FTI 的日本搜尋觀測，多認識一個品牌。每份資料都有日期，讓選物也有跡可循。</p><a class="button light" href="/trends">查看品牌觀測 ↗</a></div><div class="feature-lines"><span>01 / 日本市場</span><span>02 / 原始搜尋詞</span><span>03 / 真實取得日期</span><p>目前相關快照為歷史資料，<br>已標示日期與待更新狀態。</p></div></section>
 <section class="wrap section"><div class="section-title"><div><p class="eyebrow">THE JOURNAL</p><h2>選物，也是一種日常練習。</h2></div><a class="text-link" href="/journal">全部筆記 →</a></div>${journalCards()}</section>
 <section class="wrap release-teaser"><p class="eyebrow">NEW & NOTED</p><h2>新品筆記，保留每個確認過的日期。</h2><a class="text-link" href="/releases">查看官方發售與新品入口 →</a></section>`);
add('/brands','品牌資料庫','用風格、上衣價格樣本和服裝類型，探索首輯五個日本品牌。',pageIntro('BRAND GUIDE / FIRST EDITION','認識下一個，<em>喜歡的品牌。</em>','從你平常怎麼穿開始。五個品牌，五種值得慢慢認識的方向。')+directory('從喜歡的風格，縮小選擇。'),'brands');
add('/styles','風格索引','City Boy、簡約、戶外與柔美城市風格，日本服飾品牌探索入口。',pageIntro('THE STYLE INDEX','讓風格，<em>有自己的名字。</em>','這些分類是編輯給你的探索入口。一個品牌可以跨越幾種風格，穿搭也可以。')+`<section class="wrap section">${styleCards()}<p class="notice">風格分類與相似品牌是編輯建議；服飾示意圖為 AI 泛用插畫，並非品牌商品照片。</p></section>`,'styles');
for(const b of brands) {
 add('/brands/'+b.id,b.name+' 品牌指南',b.tagline+ ' 了解風格、價格樣本、日本購物入口與搜尋觀測。',`<div class="wrap breadcrumb"><a href="/brands">品牌資料庫</a><span>/</span><span>${e(b.name)}</span></div><section class="wrap brand-hero"><div><p class="eyebrow">${b.type} · JAPAN BRAND GUIDE</p><h1>${e(b.name)}</h1><p class="brand-jp">${b.jp}</p><h2>${b.tagline}</h2><div class="tags">${tags(b)}</div><div class="hero-actions">${link(b.official,'前往官方網站','button dark')}<a class="text-link" href="#buying">在日本哪裡買 →</a></div><p class="tiny">內容與價格查核：${checkedAt} · 風格分類為編輯建議</p></div>${art(b.cell,'brand-hero-art')}</section>
 <div class="wrap detail-layout"><aside class="detail-nav" aria-label="品牌頁內導覽"><span class="eyebrow">IN THIS GUIDE</span><a href="#about">認識品牌</a><a href="#prices">價格樣本</a><a href="#buying">日本購物</a><a href="#trend">搜尋觀測</a><a href="#similar">延伸探索</a></aside><div class="detail-body"><section id="about"><p class="eyebrow">GET TO KNOW</p><h2>先認識，再決定。</h2><p>${b.intro}</p><h3>誰可以從這裡開始？</h3><p>${b.why}</p><div class="focus-list">${b.look.map((t,i)=>`<div><span>0${i+1}</span><p>${t}</p></div>`).join('')}</div></section>
 <section id="prices"><p class="eyebrow">THE PRICE NOTES</p><h2>把預算放進單品裡。</h2><p class="muted">查核日 ${checkedAt} · 日圓價格樣本；不代表品牌所有商品的最低／最高價。</p><div class="price-list">${b.samples.map(s=>`<div><div><h3>${e(s.name)}</h3><p>${s.note}</p>${link(s.url,'查核來源')}</div><strong>${yen(s.price)}</strong></div>`).join('')}</div><p class="notice">實際售價、庫存與配送以通路當下顯示為準。不同商品與套組請分開比較。</p></section>
 <section id="buying"><p class="eyebrow">SHOP IN JAPAN</p><h2>把它放進購物清單。</h2><p>${b.shopping}</p>${link(b.shop,b.id==='snidel'?'查看日本購物專區':'查看官方日本店舖','button light')}<p class="muted">出發前再次確認店舖營業資訊和販售品項。<a href="/journal/japan-shopping-checklist">閱讀購物清單指南 →</a></p></section>
 ${observation(b)}
 <section id="similar"><p class="eyebrow">KEEP EXPLORING</p><h2>沿著喜歡的地方，繼續看。</h2><div class="related-list">${b.similar.map(s=>`<a href="/brands/${s.id}"><div><h3>${brands.find(x=>x.id===s.id).name}</h3><p>${s.reason}</p></div>${arrow}</a>`).join('')}</div><p class="tiny">延伸品牌由編輯依探索方向選擇，非銷售或使用者偏好排名。</p></section>
 <section class="source-list"><details><summary>本頁來源與編輯說明</summary><ul>${b.sources.map(s=>`<li>${link(s.url,s.label)}</li>`).join('')}${b.samples.map(s=>`<li>${link(s.url,e(s.name)+' 價格來源')}</li>`).join('')}</ul><p>品牌介紹為本站原創整理；風格與延伸品牌是編輯判斷。圖像為 AI 泛用風格示意，並非該品牌實際商品。</p></details></section></div></div>`,'brands');
}
add('/trends','品牌搜尋觀測','保留日期與原始查詢的日本 Google Trends 觀測。歷史資料不作今日熱門排名。',pageIntro('FTI × TOKI / SEARCH OBSERVATIONS','看見關注，<em>也看見時間。</em>','Google Trends 日本搜尋歷史，由 FTI 保存。這裡呈現每個詞自己的變化；缺少或過期資料如實標示。')+`<div class="wrap trend-grid">${brands.map(b=>`<div>${observation(b,true)}<a class="text-link" href="/brands/${b.id}">認識 ${e(b.name)} →</a></div>`).join('')}</div><div class="wrap section"><a class="text-link" href="/methods">閱讀完整資料方法 →</a></div>`,'trends');
add('/releases','新品筆記','查核官方消息的日本服飾新品與發售日期筆記。',pageIntro('NEW & NOTED','新品筆記，<em>有跡可循。</em>','只記錄確認到的官方消息。發售時間以日本時間 JST 表示；日期已過，不代表目前仍有庫存。')+`<section class="wrap section release-list">${releases.map(r=>`<article><div class="release-date"><span class="tiny">${r.date?new Date(r.date).getTime()<Date.now()?'已到公布日期':'預定發售':'日期未公布'}</span><strong>${r.date?r.date.slice(5,10).replace('-',' / '):'TBA'}</strong><span>${r.dateLabel}</span></div><div><p class="eyebrow">${brands.find(b=>b.id===r.brand).name} · ${r.type}</p><h2>${r.name}</h2><p>${r.note}</p>${r.price?`<p>官方價格樣本 ${yen(r.price)}（含稅）</p>`:''}${link(r.url,'查看官方消息')}<p class="tiny">消息查核：${checkedAt}</p></div></article>`).join('')}</section>`,'releases');
add('/journal','選物日誌','日本服飾品牌入門與日本購物指南，給台灣香港讀者的繁體中文原創內容。',pageIntro('THE JOURNAL','穿搭之外，<em>多認識一點。</em>','把品牌放回日常情境，也把購物清單放進下一趟旅程。')+`<section class="wrap section">${journalCards()}</section>`,'journal');
for(const a of articles) add('/journal/'+a.slug,a.title,a.intro,`<article class="wrap story"><a href="/journal" class="text-link">← 選物日誌</a><p class="eyebrow">${a.eyebrow} · ${checkedAt} · ${a.readTime}</p><h1>${a.title}</h1><p class="story-lead">${a.intro}</p>${art(a.cell,'story-art')}<div class="story-text">${a.sections.map(([h,p])=>`<section><h2>${h}</h2><p>${p}</p></section>`).join('')}<h2>從這些品牌繼續看</h2><div class="story-brands">${a.brands.map(id=>`<a class="tag" href="/brands/${id}">${brands.find(b=>b.id===id).name} ↗</a>`).join('')}</div><details><summary>來源與編輯說明</summary><p>本文是編輯探索建議，沒有宣稱作者實穿或實訪。品牌事實與購物入口參考以下官方頁；各品牌頁另附單品價格來源。</p><ul>${a.brands.map(id=>{const b=brands.find(b=>b.id===id);return `<li>${link(b.shop,b.name+' 購物／店舖來源')}</li>`;}).join('')}</ul></details></div></article>`,'journal');
add('/methods','資料與編輯方法','TOKI 的價格、搜尋觀測、風格分類、來源與資料更新方法。',pageIntro('OUR EDITORIAL METHOD','每一份資料，<em>保留來處。</em>','讓你知道哪些是官方資料，哪些是編輯建議，哪些仍在等待更新。')+`<div class="wrap prose"><section id="prices"><h2>價格是單品樣本</h2><p>依 ${checkedAt} 查核到的日本官網或品牌販售頁列價顯示。特定商品、套組和舊專題價格不代表整個品牌，也不保證目前有貨。預算區间為低於 ¥5,000、¥5,000 至未滿 ¥10,000、¥10,000 至未滿 ¥30,000、¥30,000 以上；各區間不重疊。</p></section><section><h2>搜尋是關注，不是銷售</h2><p>FTI 保存的 Google Trends 日本資料只讀取可核驗的來源。0–100 是搜尋詞在該次查詢期間的相對值，不能拿不同詞的 80 和 60 判定哪個品牌更紅。跨詞排行、預測與未驗證綜合分數不在這個版本提供。</p><p>原始取得時間保留；超過 14 天標示歷史資料並隱藏當前升降。未完成日資料與缺值不接線、不填零。目前三個相關日本快照取得於 2026-09-11；AURALEE、SNIDEL 尚無觀測。</p><p>Snow Peak 原始查詢涵蓋露營裝備等整個品牌；品牌頁特別說明服飾線與搜尋範圍的差異。</p>${link('https://fashion-trend-index.vercel.app/zh-tw','閱讀 FTI')}</section><section><h2>風格與相似品牌是編輯建議</h2><p>分類依探索情境安排，可跨多個標籤；相似品牌附上選擇原因，沒有假設所有喜歡 A 的人都喜歡 B。</p></section><section><h2>發售日以官方消息為準</h2><p>顯示日本時間 JST，保留消息查核日。未公布具體日期就標示未公布；過了發售日也不推定庫存。官方調整可能晚於本站查核，購買前開啟原消息確認。</p></section><section><h2>圖像是泛用示意</h2><p>使用 FTI 已有的 AI 服飾風格圖集，所有圖像均標示 AI，非品牌實際商品照片，也不參與熱度判斷。</p></section><section><h2>個人選物原型</h2><p>本站為個人非商業資訊原型，目前收錄五個品牌。不販售商品；外部連結未附聯盟行銷代碼。</p></section></div>`);
add('/privacy','隱私說明','TOKI 個人資訊網站的資料使用說明。',pageIntro('PRIVACY','輕鬆探索，<em>留在當下。</em>','本站不要求帳號、不收集付款或個人資料。')+`<div class="wrap prose"><h2>搜尋與篩選</h2><p>搜尋及篩選在你的瀏覽器處理，網址會保留選擇以便分享。請不要在搜尋框輸入個資；分享網址時會帶上搜尋內容。</p><h2>第三方服務</h2><p>網站由 Vercel 提供靜態託管，平台可能依其政策處理基本存取日誌。字型由 Google Fonts 提供。點擊品牌官網、商店或 FTI 後，適用該網站的政策。</p><h2>本站功能</h2><p>沒有帳號、付款、廣告追蹤、聯盟行銷代碼或第三方分析程式。</p></div>`);
add('/404','找不到頁面','這個頁面不存在，回到 TOKI 探索日本品牌。',pageIntro('404 / A DIFFERENT TURN','這一頁，<em>還沒在這裡。</em>','回到品牌探索，換一條路繼續看看。')+`<section class="wrap section"><a class="button dark" href="/brands">回到品牌資料庫 →</a></section>`);

fs.mkdirSync(out,{recursive:true});
for(const [url,html] of pages) {
 const file=path.join(out,url==='/'?'index.html':url.slice(1)+'.html');
 fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html);
}
fs.cpSync(path.join(root,'public'),out,{recursive:true});
fs.copyFileSync(path.join(root,'src/domain.mjs'),path.join(out,'domain.mjs'));
fs.mkdirSync(path.join(out,'data'),{recursive:true});
fs.writeFileSync(path.join(out,'data/catalog.json'),JSON.stringify({brands,styles,checkedAt}));
fs.writeFileSync(path.join(out,'data/fti-snapshots.json'),JSON.stringify(snapshots));
fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...pages.keys()].filter(u=>u!=='/404').map(u=>`<url><loc>${site}${u}</loc></url>`).join('')}</urlset>`);
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+site+'/sitemap.xml\n');
fs.writeFileSync(path.join(out,'build-manifest.json'),JSON.stringify({routes:[...pages.keys()],builtAt:new Date().toISOString(),runtimeFunctions:0},null,2));
console.log('Built '+pages.size+' HTML routes. 0 dependencies, 0 runtime functions.');
