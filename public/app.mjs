import {matchBrand,summarize,budgetMatch} from './domain.mjs';
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
  const names=['q','style','budget','gender'];
  function fromUrl() {
    const params=new URLSearchParams(location.search);
    for(const name of names) {
      const control=form.elements.namedItem(name);
      const val=params.get(name) || (name==='q'?'':'all');
      if(control instanceof HTMLSelectElement) control.value=Array.from(control.options).some(o=>o.value===val)?val:'all';
      else control.value=val.slice(0,160);
    }
    sort.value=['editorial','name','price'].includes(params.get('sort'))?params.get('sort'):'editorial';
  }
  function apply(updateUrl=false) {
    const filters=Object.fromEntries(new FormData(form));
    filters.q=String(filters.q || '').slice(0,160);
    form.elements.namedItem('q').value=filters.q;
    const selected=sort.value;
    let total=0;
    for(const c of cards) {
      const brand=JSON.parse(c.dataset.brand);
      const visible=matchBrand(brand,filters);
      c.hidden=!visible;if(visible)total++;
      const selectedSamples=brand.samples.filter(s=>budgetMatch(s.price,filters.budget));
      if(selectedSamples.length) {
        const price=Math.min(...selectedSamples.map(s=>s.price));
        c.dataset.price=String(price);
        c.querySelector('.sample-price').textContent='單品樣本 ¥'+price.toLocaleString('en-US');
      }
    }
    cards.sort((a,b)=>selected==='price'?Number(a.dataset.price)-Number(b.dataset.price):selected==='name'?a.dataset.name.localeCompare(b.dataset.name):Number(a.dataset.order)-Number(b.dataset.order)).forEach(c=>grid.append(c));
    count.textContent='找到 '+total+' 個品牌';empty.hidden=total!==0;
    if(updateUrl) {
      const params=new URLSearchParams();
      for(const [k,v] of Object.entries(filters)) if(v && v!=='all') params.set(k,v);
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
    for(const name of names) form.elements.namedItem(name).value=name==='q'?'':'all';
    sort.value='editorial';
    apply(true);
  }
  form.addEventListener('reset',event=>{event.preventDefault();resetFilters();});
  document.querySelector('#empty-reset').addEventListener('click',()=>{resetFilters();form.elements.namedItem('q').focus();});
  sort.addEventListener('change',()=>apply(true));
  window.addEventListener('popstate',()=>{fromUrl();apply();});
  fromUrl();apply();
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
