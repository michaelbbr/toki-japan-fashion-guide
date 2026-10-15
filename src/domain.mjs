export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

export function budgetMatch(price, budget='all') {
  if (budget === 'all' || !budget) return true;
  if (!Number.isFinite(price)) return false;
  const under=/^under-(\d+)$/.exec(budget), range=/^(\d+)-(\d+)$/.exec(budget), plus=/^(\d+)-plus$/.exec(budget);
  const r=under?[0,+under[1]]:range?[+range[1],+range[2]]:plus?[+plus[1],Infinity]:null;
  return r ? price >= r[0] && price < r[1] : false;
}

export function pieceKind(p){
 if(p.kind)return p.kind;
 const name=(p.originalName||p.name||'').toLowerCase();
 if(p.category==='outerwear')return 'outerwear';
 if(/skirt|スカート|裙子|長裙|短裙/.test(name))return 'skirt';
 if(/one.?piece|\bdress\b|ワンピース|洋裝|連身裙/.test(name)&&!/shirt|シャツ/.test(name))return 'dress';
 if(p.category==='bottoms')return 'bottoms';
 if(/sweat|\bt[\s-]?shirts?\b|\btee\b|ロンt|tシャツ|スウェット|衛衣|棉t/.test(name))return 'tshirt';
 if(/knit|cardigan|ニット|カーディガン|針織|毛衣/.test(name)||p.category==='knitwear')return 'knitwear';
 if(/shirt|blouse|シャツ|ブラウス|襯衫|罩衫/.test(name))return 'shirt';
 return p.category;
}
export function categoryMatches(p,category='all'){
 return category==='all'||!category||pieceKind(p)===category||(category==='tops'&&['tshirt','shirt'].includes(pieceKind(p)));
}

export function matchBrand(brand, filters={}) {
  const q=(filters.q || '').normalize('NFKC').trim().toLocaleLowerCase();
  const styleWords={city:'City Boy 城市日常 城市休閒',minimal:'Clean Minimal 簡約 質感',outdoor:'Outdoor 山系 機能 戶外',feminine:'City Girl 柔美 女性',street:'街頭 運動',workwear:'工裝 軍裝',americana:'美式 休閒',vintage:'復古 混搭',mode:'設計感 黑色系',natural:'自然 舒適',smart:'俐落 通勤',girly:'甜美 浪漫'};
  const hay=[brand.name,brand.jp,brand.tagline,...brand.aliases,...brand.styles.map(s=>styleWords[s] || s)].join(' ').normalize('NFKC').toLocaleLowerCase();
  if (q && !hay.includes(q)) return false;
  if (filters.shelf && filters.shelf!=='all' && brand.shelf!==filters.shelf) return false;
  if (filters.style && filters.style!=='all' && !brand.styles.includes(filters.style)) return false;
  if (filters.gender && filters.gender!=='all' && !brand.audience.includes(filters.gender)) return false;
  if (filters.budget && filters.budget!=='all') {
    return brand.samples.some(p => sampleMatches(p,filters));
  }
  if (filters.category && filters.category!=='all') {
    return [...(brand.pieces || []),...brand.samples].some(p=>categoryMatches(p,filters.category) && (!filters.gender || filters.gender==='all' || p.audience?.includes(filters.gender)));
  }
  return true;
}

export function sampleMatches(sample,filters={}) {
 if(!Number.isFinite(sample.price))return false;
 if(!categoryMatches(sample,filters.category))return false;
 if(filters.gender && filters.gender!=='all' && !sample.audience?.includes(filters.gender))return false;
 if(filters.budget&&filters.budget!=='all'&&/歷史|202[0-5]|舊型|套組/.test((sample.role||'')+' '+(sample.note||'')+' '+(sample.priceNote||'')))return false;
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
