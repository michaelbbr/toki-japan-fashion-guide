import {matchBrand,summarize,sampleMatches} from './domain.mjs';
document.documentElement.classList.add('js');
const menu=document.querySelector('.menu-toggle'), nav=document.querySelector('#main-nav');
if(menu) {
  menu.addEventListener('click',()=>{
    const open=menu.getAttribute('aria-expanded')!=='true';
    menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape' && menu.getAttribute('aria-expanded')==='true') {
      menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.focus();
    }
  });
}

const form=document.querySelector('#filter-form');
if(form) {
  const cards=Array.from(document.querySelectorAll('.brand-card'));
  const grid=document.querySelector('.brand-grid');
  const sort=document.querySelector('#sort');
  const count=document.querySelector('#result-count'), empty=document.querySelector('#empty-results');
  const names=['q','shelf','style','category','budget','gender'];
  const more=document.querySelector('#show-more-brands');
  let visibleLimit=12;
  const defaults={q:'',shelf:'all',style:'all',category:'all',budget:'all',gender:form.dataset.gender || 'all'};
  function fromUrl() {
    const params=new URLSearchParams(location.search);
    for(const name of names) {
      const control=form.elements.namedItem(name);
      const val=name==='gender' && defaults.gender!=='all' ? defaults.gender : params.get(name) || defaults[name];
      if(control instanceof HTMLSelectElement) control.value=Array.from(control.options).some(o=>o.value===val)?val:'all';
      else control.value=val.slice(0,160);
    }
    sort.value=['editorial','name','price'].includes(params.get('sort'))?params.get('sort'):'editorial';
  }
  function apply(updateUrl=false) {
    if(updateUrl)visibleLimit=12;
    const filters=Object.fromEntries(new FormData(form));
    filters.q=String(filters.q || '').slice(0,160);
    form.elements.namedItem('q').value=filters.q;
    const selected=sort.value;
    let total=0;
    for(const c of cards) {
      const brand=JSON.parse(c.dataset.brand);
      const visible=matchBrand(brand,filters);
      c.dataset.matches=String(visible);if(visible)total++;
      document.querySelector('[data-index-brand="'+brand.id+'"]')?.toggleAttribute('hidden',!visible);
      const selectedSamples=brand.samples.filter(s=>sampleMatches(s,filters));
      if(selectedSamples.length) {
        const sample=selectedSamples.sort((a,b)=>a.price-b.price)[0];
        const price=sample.price;
        c.dataset.price=String(price);
        c.querySelector('.sample-price').textContent=(brand.photoProductName===sample.name?'照片單品價格：':'其他單品價格樣本：')+sample.name+' ¥'+price.toLocaleString('en-US');
      } else {
        c.dataset.price=String(Number.MAX_SAFE_INTEGER);
        c.querySelector('.sample-price').textContent='此分類的日本價格請見官方';
      }
    }
    cards.sort((a,b)=>selected==='price'?Number(a.dataset.price)-Number(b.dataset.price):selected==='name'?a.dataset.name.localeCompare(b.dataset.name):Number(a.dataset.order)-Number(b.dataset.order)).forEach(c=>grid.append(c));
    let displayed=0;
    for(const card of cards){card.hidden=card.dataset.matches!=='true'||displayed>=visibleLimit;if(!card.hidden)displayed++;}
    count.textContent='找到 '+total+' 個品牌 · 目前顯示 '+displayed+' 個';empty.hidden=total!==0;
    document.querySelector('.brand-name-index summary').textContent='我知道名字：品牌名稱索引（目前 '+total+' 個）';
    more.hidden=displayed>=total;more.textContent='再看 '+Math.min(12,total-displayed)+' 個品牌 →';
    if(updateUrl) {
      const params=new URLSearchParams();
      for(const [k,v] of Object.entries(filters)) if(v && v!==defaults[k]) params.set(k,v);
      if(selected!=='editorial')params.set('sort',selected);
      const next=location.pathname+(params.size?'?'+params:'');
      if(next!==location.pathname+location.search) history.pushState({},'',next);
    }
  }
  let timer;
  form.addEventListener('input',event=>{if(event.target.name==='q'){clearTimeout(timer);timer=setTimeout(()=>apply(true),250);}});
  form.addEventListener('change',()=>apply(true));
  form.addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);apply(true);});
  function resetFilters() {
    clearTimeout(timer);
    for(const name of names) form.elements.namedItem(name).value=defaults[name];
    sort.value='editorial';
    apply(true);
  }
  form.addEventListener('reset',event=>{event.preventDefault();resetFilters();});
  document.querySelector('#empty-reset').addEventListener('click',()=>{resetFilters();form.elements.namedItem('q').focus();});
  sort.addEventListener('change',()=>apply(true));
  more.addEventListener('click',()=>{visibleLimit+=12;apply();});
  window.addEventListener('popstate',()=>{fromUrl();apply();});
  fromUrl();apply();
}

const areaForm=document.querySelector('#area-filter');
if(areaForm){
 const storeCards=Array.from(document.querySelectorAll('[data-store]'));
 const controls=['city','district','brand'];
 const areaCount=document.querySelector('.area-count'),areaEmpty=document.querySelector('.area-empty');
 function restoreArea(){
  const params=new URLSearchParams(location.search);
  for(const name of controls){const control=areaForm.elements.namedItem(name),value=params.get(name)||'all';control.value=Array.from(control.options).some(o=>o.value===value)?value:'all';}
 }
 function applyArea(update=false){
  const values=Object.fromEntries(new FormData(areaForm));
  const districts=new Set(storeCards.map(c=>JSON.parse(c.dataset.store)).filter(s=>values.city==='all'||s.city===values.city).map(s=>s.district));
  const districtControl=areaForm.elements.namedItem('district');
  for(const option of districtControl.options)option.disabled=option.value!=='all'&&!districts.has(option.value);
  if(values.district!=='all'&&!districts.has(values.district)){values.district='all';districtControl.value='all';}
  let total=0;
  for(const card of storeCards){const data=JSON.parse(card.dataset.store);card.hidden=!controls.every(k=>values[k]==='all'||values[k]===data[k]);if(!card.hidden)total++;}
  areaCount.textContent='找到 '+total+' 個門市／櫃位';areaEmpty.hidden=total!==0;
  if(update){const params=new URLSearchParams();for(const [k,v] of Object.entries(values))if(v!=='all')params.set(k,v);const next=location.pathname+(params.size?'?'+params:'');if(next!==location.pathname+location.search)history.pushState({},'',next);}
 }
 areaForm.addEventListener('change',()=>applyArea(true));
 areaForm.addEventListener('submit',event=>{event.preventDefault();applyArea(true);});
 areaForm.addEventListener('reset',event=>{event.preventDefault();for(const name of controls)areaForm.elements.namedItem(name).value='all';applyArea(true);});
 window.addEventListener('popstate',()=>{restoreArea();applyArea();});
 restoreArea();applyArea();
}

// An unavailable official photograph never falls back to another brand or an AI image.
for(const img of document.querySelectorAll('.product-photo img')) {
 const failed=()=>{const figure=img.closest('.product-photo');figure.classList.add('photo-failed');figure.querySelector('.photo-unavailable').hidden=false;};
 img.addEventListener('error',failed);
 if(img.complete && !img.naturalWidth)failed();
}

// A static deployment may outlive its snapshot. Re-evaluate freshness in the browser.
if(document.querySelector('.observation')) {
  fetch('/data/fti-snapshots.json').then(r=>{if(!r.ok)throw new Error('data unavailable');return r.json();}).then(data=>{
    const byName=new Map(Object.entries(data.snapshots));
    for(const el of document.querySelectorAll('.observation')) {
      const heading=el.querySelector('h3')?.textContent;
      const query=el.querySelector('.muted')?.textContent;
      let raw;
      for(const [id,s] of byName) if(query?.includes(s.query) || heading?.toLowerCase()===id) raw=s;
      if(!raw)continue;
      if(summarize(raw).state==='stale') {
        const badge=el.querySelector('.status');
        badge.textContent='歷史觀測 · 待更新';badge.className='status stale';
        el.querySelector('.momentum')?.remove();
      }
    }
  }).catch(()=>{document.querySelectorAll('.observation .momentum').forEach(e=>e.remove());});
}
