import './city-shopping.mjs';
import './budget-entry.mjs';
import './journey.mjs';
import {applyOutfitContext} from './outfit-context.mjs';
import {budgetOptions} from './discovery-options.mjs';
import {matchBrand,sampleMatches} from './domain.mjs';
document.documentElement.classList.add('js');
if(document.querySelector('.brand-hero'))applyOutfitContext(document.querySelector('main'),new URLSearchParams(location.search).get('gender')||'all');
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
  function syncBudget(){const category=form.elements.namedItem('category').value,control=form.elements.namedItem('budget'),old=control.value;control.replaceChildren(...[{id:'all',name:category==='all'?'先選品類／不限預算':'不限預算'},...budgetOptions(category)].map(x=>new Option(x.name,x.id)));control.value=[...control.options].some(o=>o.value===old)?old:'all';}
  const names=['q','style','category','budget','gender'];
  const more=document.querySelector('#show-more-brands');
  let visibleLimit=Infinity;
  const defaults={q:'',style:'all',category:'all',budget:'all',gender:form.dataset.gender || 'all'};
  function fromUrl() {
    const params=new URLSearchParams(location.search);
    for(const name of names) {
      if(name==='budget')syncBudget();
      const control=form.elements.namedItem(name);
      const val=name==='gender' && defaults.gender!=='all' ? defaults.gender : params.get(name) || defaults[name];
      if(control instanceof HTMLSelectElement) control.value=Array.from(control.options).some(o=>o.value===val)?val:'all';
      else control.value=val.slice(0,160);
    }
    sort.value=['editorial','name','price'].includes(params.get('sort'))?params.get('sort'):'editorial';
    // Retired mixed-axis categories and invalid direct links never strand a visitor.
    const normalized=new URLSearchParams();
    for(const [key,value] of new FormData(form))if(value&&value!==defaults[key])normalized.set(key,value);
    if(sort.value!=='editorial')normalized.set('sort',sort.value);
    const next=location.pathname+(normalized.size?'?'+normalized:'')+location.hash;
    if(next!==location.pathname+location.search+location.hash)history.replaceState({},'',next);
  }
  function apply(updateUrl=false) {
    if(updateUrl)visibleLimit=Infinity;
    const gender=form.elements.namedItem('gender').value,styleControl=form.elements.namedItem('style');
    const categoryControl=form.elements.namedItem('category');
    for(const option of categoryControl.options){const hidden=gender==='men'&&['dress','skirt'].includes(option.value);option.disabled=hidden;option.hidden=hidden;}
    if(categoryControl.selectedOptions[0]?.disabled)categoryControl.value='all';
    syncBudget();
    for(const option of styleControl.options){
      const available=option.value==='all'||cards.some(c=>{const b=JSON.parse(c.dataset.brand);return (gender==='all'||b.audience.includes(gender))&&b.styles.includes(option.value);});
      option.disabled=!available;option.hidden=!available;
    }
    if(styleControl.selectedOptions[0]?.disabled)styleControl.value='all';
    const filters=Object.fromEntries(new FormData(form));
    filters.q=String(filters.q || '').slice(0,160);
    form.elements.namedItem('q').value=filters.q;
    const selected=sort.value;
    let total=0;
    for(const c of cards) {
      const brand=JSON.parse(c.dataset.brand);
      const visible=matchBrand(brand,filters);
      if(visible)applyOutfitContext(c,gender);
      c.dataset.matches=String(visible);if(visible)total++;
      const indexLink=document.querySelector('[data-index-brand="'+brand.id+'"]');
      if(indexLink){indexLink.toggleAttribute('hidden',!visible);indexLink.href='/brands/'+brand.id+(gender==='all'?'':'?gender='+gender);}
      const selectedSamples=brand.samples.filter(s=>sampleMatches(s,filters));
      if(selectedSamples.length) {
        const sample=selectedSamples.sort((a,b)=>a.price-b.price)[0];
        const price=sample.price;
        c.dataset.price=String(price);
        c.querySelector('.sample-price').textContent=(brand.photoProductName===null?'參考單品價格：':brand.photoProductName===sample.name?'照片單品價格：':'其他單品價格樣本：')+sample.name+' ¥'+price.toLocaleString('en-US');
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
    {
      const params=new URLSearchParams();
      for(const [k,v] of Object.entries(filters)) if(v && v!==defaults[k]) params.set(k,v);
      if(selected!=='editorial')params.set('sort',selected);
      const next=location.pathname+(params.size?'?'+params:'')+(updateUrl?'':location.hash);
      if(next!==location.pathname+location.search+location.hash) history[updateUrl?'pushState':'replaceState']({},'',next);
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
  window.addEventListener('popstate',()=>{visibleLimit=Infinity;fromUrl();apply();});
  function showBrandResults(){
    const result=document.querySelector('#brand-results');
    result.focus({preventScroll:true});
    result.scrollIntoView({block:'start',behavior:'instant'});
  }
  for(const link of document.querySelectorAll('.shelf-shortcuts a'))link.addEventListener('click',event=>{
    event.preventDefault();
    const target=new URL(link.href);
    form.elements.namedItem('style').value=target.searchParams.get('style')||'all';
    apply(true);
    history.replaceState({},'',location.pathname+location.search+'#brand-results');
    showBrandResults();
  });
  fromUrl();apply();
  if(location.hash==='#brand-results')requestAnimationFrame(()=>requestAnimationFrame(showBrandResults));
}

// An unavailable official photograph never falls back to another brand or an AI image.
for(const img of document.querySelectorAll('.product-photo img,.outfit-photo img')) {
 const failed=()=>{const figure=img.closest('.product-photo,.outfit-photo');figure.classList.add('photo-failed');figure.querySelector('.photo-unavailable').hidden=false;};
 img.addEventListener('error',failed);
 if(img.complete && !img.naturalWidth)failed();
}
