import {brands} from '../data/catalog.mjs';
import {itemTypes} from '../data/discovery-options.mjs';
export function landing(){
 const paths=[
  ['/areas','01 / DESTINATION','按地區逛店','已經決定去哪裡？看這座城市有哪些店、各有什麼不同。'],
  ['/budget','02 / BUDGET','按預算找衣服','先選 T-shirt、褲子或外套，再依單件預算找品牌。'],
  ['/start','03 / STEP BY STEP','不知道怎麼選','回答幾個簡單問題，一步一步找到適合自己的方向。'],
  ['/brands','04 / BRAND GUIDE','認識更多品牌',`瀏覽全部 ${brands.length} 個品牌與標籤，看風格、差別與代表單品。`]
 ];
 return `<section class="wrap purpose-landing"><header><p class="eyebrow">日本旅行・服飾購物指南</p><h1>去日本，<br><em>找到值得逛的服飾品牌。</em></h1><p class="purpose-description">不熟日本服飾也沒關係。看懂品牌差別、價格與代表單品，知道去哪裡買。</p></header><nav class="entry-grid" aria-label="選擇探索方式">${paths.map(([href,en,name,note])=>`<a class="entry-card" href="${href}"><span class="eyebrow">${en}</span><div><h2>${name}</h2><span class="entry-arrow" aria-hidden="true">↗</span></div><p>${note}</p></a>`).join('')}</nav></section>`;
}
export function budgetPage(){
 return `<section class="wrap budget-entry"><a class="text-link" href="/">← 換個方式探索</a><header><p class="eyebrow">SHOP BY BUDGET</p><h1>想買什麼，<em>單件預算多少？</em></h1><p>T-shirt、褲子和外套分開比較。先選品類，再選日圓預算。</p></header><form id="budget-entry-form" action="/brands" method="get"><label>想看哪類衣服<select name="gender"><option value="all">男裝、女裝都看</option><option value="men">男裝</option><option value="women">女裝</option></select></label><label>想買什麼<select name="category" required><option value="" selected disabled>先選單品種類</option>${itemTypes.map(x=>`<option value="${x.id}">${x.name}</option>`).join('')}</select></label><label>單件預算（日圓）<select name="budget" required disabled><option value="">先選單品種類</option></select></label><button type="submit" class="button dark">看符合預算的品牌 →</button></form><p class="budget-context" role="status" aria-live="polite">價格依已收錄、已核對的同品類單品配對；不是全品牌價帶或整趟購物總額。</p><p class="budget-context">不確定想買什麼？ <a href="/start">用問題一步一步挑 →</a></p><noscript><p>請啟用 JavaScript 使用預算引導，或前往 <a href="/brands">品牌大全的品類與預算篩選</a>。</p></noscript></section>`;
}
