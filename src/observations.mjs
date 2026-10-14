import fs from 'node:fs';
import {escapeHtml as e,summarize} from './domain.mjs';
import {sourceLink as link} from './view.mjs';
const snapshots=JSON.parse(fs.readFileSync('data/fti-snapshots.json','utf8'));
const date=s=>s?s.slice(0,10).replaceAll('-','.'):'—';
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
export function observation(b,compact=false) {
 const obs=summarize(snapshots.snapshots[b.fti]);
 const title=obs.state==='stale'?'歷史觀測 · 待更新':obs.state==='current'?'已保存日本觀測':obs.state==='missing'?'尚無日本搜尋觀測':'資料不足';
 const change=obs.change===null?'':`<span class="momentum">${obs.change>0?'+':''}${obs.change}% · 同詞週變化</span>`;
 return `<section class="observation ${compact?'compact':''}" ${compact?' ':'id="trend"'}><div class="observation-head"><div><p class="eyebrow">FTI / JAPAN SEARCH</p><h3>${compact?e(b.name):'日本搜尋關注'}</h3></div><span class="status ${obs.state}">${title}</span></div>${obs.points.length ? `<p class="muted">取得於 ${date(obs.observedAt)} · 查詢：${e(obs.query)}</p>${change}${svgChart(obs)}<p class="notice">${obs.state==='stale'?'這份快照已超過 14 天，只供查看當時走勢。':''} 0–100 是該搜尋詞自己的相對指數，不能與其他品牌比較絕對人氣，也不代表銷售。缺值與未完成資料保留斷線。</p>`:`<p class="no-signal">品牌資料已收錄；日本搜尋資料尚未收錄，暫不顯示熱度或升降。</p>`}
 ${b.scope?`<p class="scope-note">${b.scope}</p>`:''}<details><summary>資料來源與說明</summary><p>FTI 保存的 Google Trends 日本搜尋觀測。取得日和原始查詢保留。不同品牌名稱可能涵蓋不同商品範圍。</p>${link('https://fashion-trend-index.vercel.app/zh-tw'+(b.fti?'/asset/'+b.fti+'?market=JP':''),'查看 FTI')} · <a href="/methods">本站資料方法 →</a></details></section>`;
}
