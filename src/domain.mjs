export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

export function budgetMatch(price, budget='all') {
  if (budget === 'all' || !budget) return true;
  if (!Number.isFinite(price)) return false;
  const ranges = {'under-5000':[0,5000],'5000-10000':[5000,10000],'10000-30000':[10000,30000],'30000-plus':[30000,Infinity]};
  const r = ranges[budget];
  return r ? price >= r[0] && price < r[1] : true;
}

export function matchBrand(brand, filters={}) {
  const q=(filters.q || '').normalize('NFKC').trim().toLocaleLowerCase();
  const styleWords={city:'City Boy 城市日常 城市休閒',minimal:'Clean Minimal 簡約 質感',outdoor:'Outdoor 山系 機能 戶外',feminine:'City Girl 柔美 女性 甜美'};
  const hay=[brand.name,brand.jp,brand.tagline,...brand.aliases,...brand.styles.map(s=>styleWords[s] || s)].join(' ').normalize('NFKC').toLocaleLowerCase();
  if (q && !hay.includes(q)) return false;
  if (filters.style && filters.style!=='all' && !brand.styles.includes(filters.style)) return false;
  if (filters.gender && filters.gender!=='all' && !brand.audience.includes(filters.gender)) return false;
  if (filters.budget && filters.budget!=='all') {
    return brand.samples.some(p => sampleMatches(p,filters));
  }
  if (filters.category && filters.category!=='all') {
    return [...(brand.pieces || []),...brand.samples].some(p=>p.category===filters.category && (!filters.gender || filters.gender==='all' || p.audience?.includes(filters.gender)));
  }
  return true;
}

export function sampleMatches(sample,filters={}) {
 if(!Number.isFinite(sample.price))return false;
 if(filters.category && filters.category!=='all' && sample.category!==filters.category)return false;
 if(filters.gender && filters.gender!=='all' && !sample.audience?.includes(filters.gender))return false;
 return budgetMatch(sample.price,filters.budget);
}

export function summarize(s, now=new Date()) {
  const empty = {state:'missing',points:[],change:null,newActivity:false};
  if (!s) return empty;
  const provenance = s.sourceType ? s.sourceType==='live_provider' :
    s.provider==='google-trends' && s.providerMode==='explore_internal' && s.signalStatus==='REAL';
  const at=Date.parse(s.observedAt);
  if (!provenance || s.market!=='JP' || s.provider!=='google-trends' || s.scalingMode!=='query_relative_0_100' || !Number.isFinite(at) || at>now.getTime()+60000) return {...empty,state:'unavailable'};
  const points=(s.timeline || []).map(p=>({date:p.date,value:p.hasData!==false && !p.isPartial && Number.isFinite(p.value) && p.value>=0 && p.value<=100 ? p.value : null}));
  const valid=points.filter(p=>p.value!==null);
  const stale=now.getTime()-at>14*86400000;
  const usable=s.sourceStatus==='ok' && s.signalStatus==='REAL' && valid.length>=8;
  const result={...empty,state:usable ? (stale?'stale':'current'):'collecting',points,query:s.query,observedAt:s.observedAt,latest:valid.at(-1)?.value};
  if (!usable || stale) return result;
  const end=points.findLastIndex(p=>p.value!==null);
  const current=points.slice(Math.max(0,end-6),end+1).filter(p=>p.value!==null);
  const previous=points.slice(Math.max(0,end-13),Math.max(0,end-6)).filter(p=>p.value!==null);
  if(current.length<4 || previous.length<4) return result;
  const avg=a=>a.reduce((t,p)=>t+p.value,0)/a.length;
  const prev=avg(previous), cur=avg(current);
  if(prev===0) return {...result,newActivity:cur>0};
  return {...result,change:Math.round((cur-prev)/prev*1000)/10};
}
