import {travelBudgets,shoppingWays} from './travel-budget-options.mjs';
import {categoryMatches} from './domain.mjs';
import {applyOutfitContext} from './outfit-context.mjs';
const root=document.querySelector('#travel-budget');
if(root){
 const form=root.querySelector('#budget-entry-form'),steps=[...root.querySelectorAll('[data-budget-step]')],results=root.querySelector('#budget-results');
 const cards=[...root.querySelectorAll('[data-budget-brand]')],category=root.querySelector('#budget-result-category');
 // Read selected values even while the other step is disabled for validation.
 const values=()=>Object.fromEntries(['total','way','gender','amount'].map(k=>[k,form.elements.namedItem(k).value]));
 const money=n=>'¥'+n.toLocaleString('en-US');
 const records=new Map(cards.map(el=>[el,JSON.parse(el.dataset.budgetBrand)]));
 let step=0,limit=9;
 function syncAmount(){const high=values().total==='60000-plus',input=form.elements.namedItem('amount');input.closest('label').hidden=!high;input.disabled=!high||step!==0;input.required=high;}
 function focusOn(el){el.focus({preventScroll:true});el.scrollIntoView({block:'start',behavior:'instant'});}
 function showStep(n,focus=true){
  step=n;form.hidden=false;results.hidden=true;root.classList.remove('budget-show-results');
  steps.forEach((el,i)=>{el.hidden=i!==n;el.querySelector('fieldset').disabled=i!==n;});
  root.querySelectorAll('[data-budget-progress]').forEach((el,i)=>{if(i===n)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  syncAmount();if(focus)focusOn(steps[n].querySelector('h2'));
 }
 function save(done,nextStep=step){const v=values(),p=new URLSearchParams();for(const key of ['total','way','gender'])if(v[key])p.set(key,v[key]);if(v.total==='60000-plus'&&v.amount)p.set('amount',v.amount);if(done){p.set('results','1');if(category.value!=='all')p.set('category',category.value);}else p.set('step',String(nextStep));const next=location.pathname+'?'+p+(done?'#budget-results':'');if(next!==location.pathname+location.search+location.hash)history.pushState({},'',next);}
 function render(focus=true,write=true){
  const v=values(),band=travelBudgets.find(x=>x.id===v.total),way=shoppingWays.find(x=>x.id===v.way);
  if(!band||!way)return showStep(0,focus);
  const total=band.id==='60000-plus'?Number(v.amount):band.ceiling;
  if(band.id==='60000-plus'&&(!Number.isInteger(total)||total<60001||total>10000000))return showStep(0,focus);
  const allowance=total?Math.floor(total/way.count):null;
  const genderName={all:'男裝、女裝都看',men:'男裝',women:'女裝'}[v.gender];
  form.hidden=true;results.hidden=false;root.classList.add('budget-show-results');
  root.querySelectorAll('[data-budget-progress]').forEach(el=>el.removeAttribute('aria-current'));
  root.querySelector('#budget-plan-summary').textContent=(total?('整趟購衣 '+(band.id==='60000-plus'?money(total):band.name)):'總預算還沒決定')+' / '+way.name+' / '+genderName;
  root.querySelector('#budget-allocation').textContent=allowance?'以 '+money(total)+' 規劃 '+way.count+' 件，每件先抓 '+money(allowance)+' 以內。':'先看品牌方向，暫不按價格排除。';
  root.querySelector('#budget-plan-advice').textContent=way.advice+(way.id==='special'?' 可從下方穿搭與品牌介紹，找平常較少接觸的方向。':'');
  root.querySelector('#budget-plan-note').textContent=total?(band.id==='60000-plus'?'依你填寫的總額分配。':'先用區間上限分配；實際想花更少，可改選較低區間。')+' 件數是規劃示例，可跨品牌挑選；價格依原單品查核日。':'不用一次決定買什麼；喜歡的品牌先留下，單品價格再到品牌頁比較。';
  for(const o of category.options){const hide=v.gender==='men'&&['dress','skirt'].includes(o.value);o.hidden=hide;o.disabled=hide;}
  if(category.selectedOptions[0]?.disabled)category.value='all';
  const matches=[];
  for(const el of cards){
   const b=records.get(el);
   const pieces=b.pieces.filter(p=>['tops','knitwear','outerwear','bottoms'].includes(p.category)||['dress','skirt'].includes(p.kind)).filter(p=>(v.gender==='all'||p.audience.includes(v.gender))&&categoryMatches(p,category.value));
   const eligible=pieces.filter(p=>Number.isFinite(p.price)&&p.price>0&&!/歷史|202[0-5]|舊型|套組/.test(p.role+' '+p.priceNote)&&(!allowance||p.price<=allowance));
   eligible.sort((a,b)=>b.price-a.price);
   const p=eligible[0];
   const match=(v.gender==='all'||b.audience.includes(v.gender))&&(allowance?!!p:category.value==='all'||pieces.length>0);
   el.hidden=true;if(!match)continue;
   const score=allowance?(p.price/allowance)+(way.id==='special'&&b.styles.includes('mode')?.2:0):way.id==='special'&&b.styles.includes('mode')?1:0;
   matches.push({el,score,p});
   el.querySelector('[data-budget-reason]').textContent=p?'這件可先看：'+p.originalName+' · '+money(p.price)+'；'+(allowance?'落在這個單件分配內。':'日本價格參考。'):'先看風格與品牌差別；這個分類的日本價格請見官方。';
   el.querySelector('[data-budget-price-note]').textContent=p?p.role+' · '+p.priceNote+' · 查核 '+p.checkedAt:'';
   const source=el.querySelector('[data-budget-product]');source.hidden=!p;if(p)source.href=p.source;
   el.querySelector('.sample-price').textContent=p?'參考單品：'+p.originalName+' '+money(p.price):'日本價格請見官方';
   for(const a of el.querySelectorAll('.brand-city-links a')){const u=new URL(a.href);if(v.gender==='all')u.searchParams.delete('gender');else u.searchParams.set('gender',v.gender);a.href=u.pathname+u.search+u.hash;}
  }
  matches.sort((a,b)=>b.score-a.score);
  matches.forEach(({el,p},i)=>{root.querySelector('.budget-brand-grid').append(el);el.hidden=i>=limit;if(!el.hidden){applyOutfitContext(el,v.gender);el.querySelector('.travel-card-start span').textContent=p?'先認識：'+p.name:'先從品牌介紹與穿搭，看喜歡的方向。';}});
  root.querySelector('#budget-result-count').textContent='找到 '+matches.length+' 個'+(allowance?'有符合分配的服飾樣本':'可探索')+'品牌 · 顯示 '+Math.min(limit,matches.length)+' 個';
  root.querySelector('#budget-empty').hidden=matches.length!==0;
  const more=root.querySelector('#budget-more');more.hidden=limit>=matches.length;more.textContent='再看 '+Math.min(9,Math.max(0,matches.length-limit))+' 個品牌 →';
  root.querySelector('#budget-directory').href=v.gender==='all'?'/brands':'/'+v.gender;
  root.querySelector('#budget-areas').href='/areas'+(v.gender==='all'?'':'?gender='+v.gender);
  if(write)save(true);if(focus)focusOn(root.querySelector('#budget-result-title'));
 }
 form.addEventListener('change',event=>{if(event.target.name==='total')syncAmount();});
 form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;if(step===0){save(false,1);showStep(1);}else{limit=9;category.value='all';render();}});
 root.querySelector('#budget-back').addEventListener('click',()=>{save(false,0);showStep(0);});
 root.querySelector('#budget-edit').addEventListener('click',()=>{save(false,0);showStep(0);});
 category.addEventListener('change',()=>{limit=9;render();});
 root.querySelector('#budget-clear-category').addEventListener('click',()=>{category.value='all';limit=9;render();});
 root.querySelector('#budget-more').addEventListener('click',()=>{const shown=cards.filter(el=>!el.hidden).length;limit+=9;render(false,false);[...root.querySelectorAll('.budget-brand:not([hidden])')][shown]?.querySelector('a')?.focus();});
 function restore(){
  form.reset();steps.forEach(el=>el.querySelector('fieldset').disabled=false);const p=new URLSearchParams(location.search);
  for(const [key,items] of [['total',travelBudgets],['way',shoppingWays]]){const value=p.get(key);if(items.some(x=>x.id===value))form.elements.namedItem(key).value=value;}
  form.elements.namedItem('gender').value=['men','women'].includes(p.get('gender'))?p.get('gender'):'all';
  form.elements.namedItem('amount').value=/^\d{1,8}$/.test(p.get('amount')||'')?p.get('amount'):'';
  category.value=[...category.options].some(o=>o.value===p.get('category'))?p.get('category'):'all';
  limit=9;syncAmount();const invalidAmount=values().total==='60000-plus'&&(!Number.isInteger(Number(values().amount))||Number(values().amount)<60001||Number(values().amount)>10000000);
  if(p.get('results')==='1'&&values().total&&values().way&&!invalidAmount)render(false,false);else showStep(values().total&&!invalidAmount&&p.get('step')!=='0'?1:0,false);
 }
 root.querySelector('#budget-interactive').hidden=false;
 window.addEventListener('popstate',restore);restore();
 const restoreResultFocus=()=>{if(location.hash==='#budget-results'&&!results.hidden)requestAnimationFrame(()=>focusOn(root.querySelector('#budget-result-title')));};
 window.addEventListener('pageshow',restoreResultFocus);
 document.fonts.ready.then(restoreResultFocus);
}
