import {budgetMatch,categoryMatches} from './domain.mjs';
import {itemTypes,styleOptions,destinations,budgetOptions} from './discovery-options.mjs';
const root=document.querySelector('#trip-finder');
if(root){
 const form=root.querySelector('#trip-form'), steps=[...root.querySelectorAll('[data-step]')], results=root.querySelector('#trip-results');
 const entries=[...root.querySelectorAll('[data-trip-brand]')];
 const originalCopy=new Map(entries.map(el=>[el,{price:el.querySelector('.sample-price').textContent,start:el.querySelector('.travel-card-start').textContent,first:el.querySelector('.trip-reason >p:nth-child(2)').textContent}]));
 const keys=['gender','category','budget','city','style'];
 const allowed={gender:['all','men','women'],category:['all',...itemTypes.map(x=>x.id)],city:['all',...destinations.map(x=>x.id)],style:['all',...styleOptions.map(x=>x.id)]};
 const labels={gender:{all:'男裝＋女裝',men:'男裝',women:'女裝'},category:{all:'品類不限',...Object.fromEntries(itemTypes.map(x=>[x.id,x.name]))},budget:{all:'不限預算'},city:{all:'地區不限',...Object.fromEntries(destinations.map(x=>[x.id,x.name]))},style:{all:'不限風格',...Object.fromEntries(styleOptions.map(x=>[x.id,x.zh]))}};
 let step=0,limit=6;
 const values=()=>Object.fromEntries(new FormData(form));
 function adjustStyles(){
  const g=values().gender;root.dataset.gender=g;
  steps[4].querySelector('h3 + p').textContent='從 '+styleOptions.filter(s=>g!=='men'||s.examples.men).length+' 種穿衣方向看圖片選感覺，也可以切換白話問題。不確定就先不限。';
  for(const el of root.querySelectorAll('[data-example-gender]'))el.hidden=el.dataset.exampleGender!==g;
  for(const el of root.querySelectorAll('[data-style-id]')){const option=styleOptions.find(s=>s.id===el.dataset.styleId),hidden=g==='men'&&!option.examples.men;el.hidden=hidden;el.querySelector('input').disabled=hidden;if(hidden&&el.querySelector('input').checked)form.elements.namedItem('style').value='all';}
  for(const el of form.querySelectorAll('[name="category"]')){const hidden=g==='men'&&['dress','skirt'].includes(el.value);el.closest('label').hidden=hidden;el.disabled=hidden;if(hidden&&el.checked)form.elements.namedItem('category').value='all';}

 }
 function syncBudget(){
  const v=values(),options=budgetOptions(v.category),box=root.querySelector('#trip-budget-options');
  if(box.dataset.category===v.category){if(!v.budget)box.querySelector('[value="all"]').checked=true;return;}
  box.dataset.category=v.category;box.replaceChildren();const legend=document.createElement('legend');legend.className='sr-only';legend.textContent='單件日圓預算';box.append(legend);
  for(const item of [{id:'all',name:'不限／還不知道'},...options]){const label=document.createElement('label');label.className='trip-choice';const input=document.createElement('input');input.type='radio';input.name='budget';input.value=item.id;input.defaultChecked=item.id==='all';input.checked=item.id===(options.some(x=>x.id===v.budget)?v.budget:'all');const span=document.createElement('span'),strong=document.createElement('strong');strong.textContent=item.name;span.append(strong);label.append(input,span);box.append(label);labels.budget[item.id]=item.id==='all'?'不限預算':item.name;}
  const item=itemTypes.find(x=>x.id===v.category);steps[2].querySelector('h3').textContent=item?item.name+'，單件預算多少？':'先逛不同品類，預算暫時不限。';
  root.querySelector('#trip-budget-note').textContent=item?'以下價格只比較「'+item.name+'」，不與其他品類混算。':'還沒決定品類時，不用一個價格同時篩選 T-shirt、褲子和外套。想設預算可回上一步選品類。';
 }
 function showStep(n,focus=true){syncBudget();
  step=n;results.hidden=true;form.hidden=false;
  steps.forEach((s,i)=>s.hidden=i!==n);
  root.querySelectorAll('[data-trip-progress]').forEach((el,i)=>{el.toggleAttribute('aria-current',i===n);el.classList.toggle('done',i<n);});
  root.querySelector('#trip-back').hidden=n===0;
  root.querySelector('#trip-next').textContent=['下一步：選品類 →','下一步：選預算 →','下一步：選地區 →','下一步：選穿衣喜好 →','看看適合逛的品牌 →'][n];
  root.querySelector('#trip-skip').textContent=n===4?'不限制風格，看結果 →':'這步先不限 →';
  adjustStyles();
  if(focus){steps[n].querySelector('h3').focus({preventScroll:true});steps[n].scrollIntoView({block:'start',behavior:'instant'});}
 }
 function save(result){
  const url=new URL(location.href);
  for(const key of keys){url.searchParams.delete('trip-'+key);if(values()[key]!=='all')url.searchParams.set('trip-'+key,values()[key]);}
  if(result)url.searchParams.set('trip-results','1');else url.searchParams.delete('trip-results');
  url.hash='trip-finder';
  if(url.href!==location.href)history.pushState({},'',url.pathname+url.search+url.hash);
 }
 function render(focus=true,write=true){
  adjustStyles();syncBudget();const v=values();let total=0,shown=0;
  form.hidden=true;results.hidden=false;
  root.querySelectorAll('[data-trip-progress]').forEach(el=>{el.removeAttribute('aria-current');el.classList.add('done');});
  const ordered=[...entries].sort((a,b)=>Number(JSON.parse(b.dataset.tripBrand).cities.includes(v.city))-Number(JSON.parse(a.dataset.tripBrand).cities.includes(v.city)));
  for(const el of ordered){
   root.querySelector('.trip-results-grid').append(el);
   const b=JSON.parse(el.dataset.tripBrand);
   const gender=el.dataset.tripGender===v.gender;
   const style=v.style==='all'||b.styles.includes(v.style);
   const categoryPieces=b.pieces.filter(p=>categoryMatches(p,v.category)&&(v.gender==='all'||p.audience.includes(v.gender)));
   const samples=categoryPieces.filter(p=>Number.isFinite(p.price)&&(v.gender==='all'||p.audience.includes(v.gender))&&!/歷史|202[0-5]|舊型|套組/.test(p.role+' '+p.priceNote));
   const budget=v.budget==='all'||samples.some(p=>budgetMatch(p.price,v.budget));
   const match=gender&&style&&budget&&(v.category==='all'||categoryPieces.length>0);
   const matchedPiece=v.budget==='all'?categoryPieces[0]:samples.find(p=>budgetMatch(p.price,v.budget));
   const copy=originalCopy.get(el);
   el.querySelector('.sample-price').textContent=matchedPiece?(Number.isFinite(matchedPiece.price)?'參考單品價格：'+matchedPiece.name+' ¥'+matchedPiece.price.toLocaleString('en-US'):'這款的日本價格請見官方'):copy.price;
   el.querySelector('.travel-card-start').textContent=matchedPiece?'先看這件：'+matchedPiece.name:copy.start;
   el.querySelector('.trip-reason >p:nth-child(2)').textContent=matchedPiece?'先看這件：'+matchedPiece.name:copy.first;
   if(match)total++;
   el.hidden=!match||shown>=limit;
   if(!el.hidden){shown++;el.querySelector('[data-trip-reason]').textContent='符合：'+labels.gender[v.gender]+' · '+labels.style[v.style]+(v.category!=='all'?' · '+labels.category[v.category]:'')+(v.budget!=='all'?' · '+samples.filter(p=>budgetMatch(p.price,v.budget)).map(p=>p.name+' ¥'+p.price.toLocaleString('en-US')).join('；'):'');}
   const shop=el.querySelector('[data-trip-store]');
   if(shop){shop.href='/areas?brand='+encodeURIComponent(b.id)+(b.cities.includes(v.city)?'&city='+v.city:'');shop.textContent=b.cities.includes(v.city)?labels.city[v.city]+'有本站已核對據點 →':'看本站已收錄據點 →';}
  }
  root.querySelector('#trip-summary').textContent=keys.map(k=>labels[k][v[k]]).join(' / ')+'。找到 '+total+' 個品牌，目前顯示 '+shown+' 個。';
  root.querySelector('#trip-empty').hidden=total!==0;
  root.querySelector('#trip-more').hidden=shown>=total;
  const params=new URLSearchParams();for(const key of ['style','category','budget'])if(v[key]!=='all')params.set(key,v[key]);
  root.querySelector('#trip-all').href=(v.gender==='all'?'/brands':'/'+v.gender)+(params.size?'?'+params:'');
  root.querySelector('#trip-area').href='/areas'+(allowed.city.includes(v.city)&&!['all','other'].includes(v.city)?'?city='+v.city:'');
  if(write)save(true);
  if(focus){root.querySelector('#trip-result-title').focus({preventScroll:true});results.scrollIntoView({block:'start',behavior:'instant'});}
 }
 form.addEventListener('submit',event=>{event.preventDefault();if(step<4)showStep(step+1);else{limit=6;render();}});
 root.querySelector('#trip-back').addEventListener('click',()=>showStep(step-1));
 root.querySelector('#trip-skip').addEventListener('click',()=>{form.elements.namedItem(keys[step]).value='all';if(step<4)showStep(step+1);else{limit=6;render();}});
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
  for(const k of keys){const v=params.get('trip-'+k);if((k==='budget'?['all',...budgetOptions(values().category).map(x=>x.id)]:allowed[k]).includes(v)){if(k==='budget')syncBudget();form.elements.namedItem(k).value=v;}}
  syncBudget();limit=6;if(params.get('trip-results')==='1')render(false,false);else showStep(0,false);
 }
 root.querySelector('.trip-interactive').hidden=false;
 window.addEventListener('popstate',restore);restore();
}
