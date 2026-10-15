import {budgetMatch} from './domain.mjs';
const root=document.querySelector('#trip-finder');
if(root){
 const form=root.querySelector('#trip-form'), steps=[...root.querySelectorAll('[data-step]')], results=root.querySelector('#trip-results');
 const entries=[...root.querySelectorAll('[data-trip-brand]')];
 const keys=['gender','budget','city','style'];
 const allowed={gender:['all','men','women'],budget:['all','under-5000','5000-10000','10000-30000','30000-plus'],city:['all','tokyo','osaka','kyoto','other'],style:['all','city','minimal','outdoor','feminine']};
 const labels={gender:{all:'男裝＋女裝',men:'男裝',women:'女裝'},budget:{all:'不限預算','under-5000':'單件低於 ¥5,000','5000-10000':'單件 ¥5,000–未滿 10,000','10000-30000':'單件 ¥10,000–未滿 30,000','30000-plus':'單件 ¥30,000 以上'},city:{all:'地區不限',tokyo:'東京',osaka:'大阪',kyoto:'京都',other:'其他地區'},style:{all:'不限風格',city:'寬鬆休閒',minimal:'簡單素色',outdoor:'戶外機能感',feminine:'柔和細節'}};
 let step=0,limit=6;
 const values=()=>Object.fromEntries(new FormData(form));
 function adjustStyles(){
  const g=values().gender;root.dataset.gender=g;
  for(const el of root.querySelectorAll('[data-example-gender]'))el.hidden=el.dataset.exampleGender!==g;
  const feminine=root.querySelector('[data-style-id="feminine"]');
  feminine.hidden=g==='men';
  feminine.querySelector('input').disabled=g==='men';
  if(g==='men'&&!allowed.style.filter(s=>s!=='feminine').includes(values().style))form.elements.namedItem('style').value='all';
 }
 function showStep(n,focus=true){
  step=n;results.hidden=true;form.hidden=false;
  steps.forEach((s,i)=>s.hidden=i!==n);
  root.querySelectorAll('[data-trip-progress]').forEach((el,i)=>{el.toggleAttribute('aria-current',i===n);el.classList.toggle('done',i<n);});
  root.querySelector('#trip-back').hidden=n===0;
  root.querySelector('#trip-next').textContent=['下一步：選預算 →','下一步：選地區 →','下一步：選穿衣喜好 →','看看適合逛的品牌 →'][n];
  root.querySelector('#trip-skip').textContent=n===3?'不限制風格，看結果 →':'這步先不限 →';
  adjustStyles();
  if(focus){steps[n].querySelector('h3').focus({preventScroll:true});root.scrollIntoView({block:'start',behavior:'instant'});}
 }
 function save(result){
  const url=new URL(location.href);
  for(const key of keys){url.searchParams.delete('trip-'+key);if(values()[key]!=='all')url.searchParams.set('trip-'+key,values()[key]);}
  if(result)url.searchParams.set('trip-results','1');else url.searchParams.delete('trip-results');
  url.hash='trip-finder';
  if(url.href!==location.href)history.pushState({},'',url.pathname+url.search+url.hash);
 }
 function render(focus=true,write=true){
  adjustStyles();const v=values();let total=0,shown=0;
  form.hidden=true;results.hidden=false;
  root.querySelectorAll('[data-trip-progress]').forEach(el=>{el.removeAttribute('aria-current');el.classList.add('done');});
  const ordered=[...entries].sort((a,b)=>Number(JSON.parse(b.dataset.tripBrand).cities.includes(v.city))-Number(JSON.parse(a.dataset.tripBrand).cities.includes(v.city)));
  for(const el of ordered){
   root.querySelector('.trip-results-grid').append(el);
   const b=JSON.parse(el.dataset.tripBrand);
   const gender=el.dataset.tripGender===v.gender;
   const style=v.style==='all'||b.styles.includes(v.style);
   const samples=b.pieces.filter(p=>Number.isFinite(p.price)&&(v.gender==='all'||p.audience.includes(v.gender))&&!/歷史|202[0-5]|舊型|套組/.test(p.role+' '+p.priceNote));
   const budget=v.budget==='all'||samples.some(p=>budgetMatch(p.price,v.budget));
   const match=gender&&style&&budget;
   if(match)total++;
   el.hidden=!match||shown>=limit;
   if(!el.hidden){shown++;el.querySelector('[data-trip-reason]').textContent='符合：'+labels.gender[v.gender]+' · '+labels.style[v.style]+(v.budget!=='all'?' · 有符合預算的具名單品':'');}
   const shop=el.querySelector('[data-trip-store]');
   if(shop){shop.href='/areas?brand='+encodeURIComponent(b.id)+(b.cities.includes(v.city)?'&city='+v.city:'');shop.textContent=b.cities.includes(v.city)?labels.city[v.city]+'有本站已核對據點 →':'看本站已收錄據點 →';}
  }
  root.querySelector('#trip-summary').textContent=keys.map(k=>labels[k][v[k]]).join(' / ')+'。找到 '+total+' 個品牌，目前顯示 '+shown+' 個。'+(v.city!=='all'?' 目的地只用於找店參考，不作門市完整性判斷。':'');
  root.querySelector('#trip-empty').hidden=total!==0;
  root.querySelector('#trip-more').hidden=shown>=total;
  const params=new URLSearchParams();if(v.style!=='all')params.set('style',v.style);
  root.querySelector('#trip-all').href=(v.gender==='all'?'/brands':'/'+v.gender)+(params.size?'?'+params:'');
  root.querySelector('#trip-area').href='/areas'+(allowed.city.includes(v.city)&&!['all','other'].includes(v.city)?'?city='+v.city:'');
  if(write)save(true);
  if(focus){root.querySelector('#trip-result-title').focus({preventScroll:true});root.scrollIntoView({block:'start',behavior:'instant'});}
 }
 form.addEventListener('submit',event=>{event.preventDefault();if(step<3)showStep(step+1);else{limit=6;render();}});
 root.querySelector('#trip-back').addEventListener('click',()=>showStep(step-1));
 root.querySelector('#trip-skip').addEventListener('click',()=>{form.elements.namedItem(keys[step]).value='all';if(step<3)showStep(step+1);else{limit=6;render();}});
 root.querySelector('#trip-edit').addEventListener('click',()=>{save(false);showStep(0);});
 root.querySelector('#trip-restart').addEventListener('click',()=>{form.reset();limit=6;save(false);showStep(0);});
 root.querySelector('#trip-more').addEventListener('click',()=>{const shown=entries.filter(el=>!el.hidden).length;limit+=6;render(false,false);[...root.querySelectorAll('.trip-result:not([hidden])')][shown]?.querySelector('a')?.focus();});
 root.querySelector('#trip-relax').addEventListener('click',()=>{form.elements.namedItem('budget').value='all';form.elements.namedItem('style').value='all';limit=6;render();});
 root.querySelectorAll('[data-style-mode]').forEach(button=>button.addEventListener('click',()=>{
  const questions=button.dataset.styleMode==='questions';root.classList.toggle('trip-questions',questions);
  root.querySelectorAll('[data-style-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  root.querySelectorAll('.trip-question').forEach(el=>el.hidden=!questions);
 }));
 function restore(){
  const params=new URLSearchParams(location.search);form.reset();
  for(const k of keys){const v=params.get('trip-'+k);if(allowed[k].includes(v))form.elements.namedItem(k).value=v;}
  limit=6;if(params.get('trip-results')==='1')render(false,false);else showStep(0,false);
 }
 root.querySelector('.trip-interactive').hidden=false;
 window.addEventListener('popstate',restore);restore();
}
