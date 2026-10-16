import {applyOutfitContext} from './outfit-context.mjs';
const guide=document.querySelector('[data-city-guide]');
if(guide){
 const form=guide.querySelector('#city-shopping-filter'),cards=[...guide.querySelectorAll('[data-city-shop]')],starter=JSON.parse(guide.dataset.starter);
 const results=guide.querySelector('#city-results'),heading=guide.querySelector('.city-results-heading h2'),count=guide.querySelector('#city-shopping-count');
 const district=form.elements.namedItem('district'),gender=form.elements.namedItem('gender'),routes=[...guide.querySelectorAll('[data-city-route]')];
 let routeIds=null,brand=null;
 function read(){
  const p=new URLSearchParams(location.search);
  gender.value=['men','women'].includes(p.get('gender'))?p.get('gender'):'all';
  brand=p.get('brand');
  const selectedRoute=routes.find(a=>new URL(a.href).searchParams.get('route')===p.get('route'));
  routeIds=selectedRoute?JSON.parse(selectedRoute.dataset.cityRoute):null;
  const d=p.get('district')||'all';
  district.value=[...district.options].some(o=>o.value===d)?d:'all';
 }
 function apply(write=false,focus=false){
  const order=routeIds||(district.value==='starter'?starter:[]);
  if(order.length)cards.sort((a,b)=>{const rank=card=>{const n=order.indexOf(JSON.parse(card.dataset.cityShop).id);return n<0?999:n;};return rank(a)-rank(b);}).forEach(card=>guide.querySelector('.city-shop-list').append(card));
  let total=0;
  for(const card of cards){const s=JSON.parse(card.dataset.cityShop);
   const match=(gender.value==='all'||s.audience.includes(gender.value))&&(!brand||s.brands.includes(brand))&&(routeIds?routeIds.includes(s.id):district.value==='starter'?starter.includes(s.id):district.value==='all'||district.value===s.district);
   card.hidden=!match;
   if(match){total++;applyOutfitContext(card,gender.value);for(const a of card.querySelectorAll('[data-city-brand]'))a.hidden=gender.value!=='all'&&!JSON.parse(a.dataset.cityBrand).includes(gender.value);}
  }
  const selectedRoute=routeIds?routes.find(a=>a.dataset.cityRoute===JSON.stringify(routeIds)):null;
  let routeOption=district.querySelector('[data-active-route]');
  if(selectedRoute){if(!routeOption){routeOption=document.createElement('option');routeOption.value='route';routeOption.dataset.activeRoute='';district.append(routeOption);}routeOption.textContent=selectedRoute.querySelector('strong').textContent.replace(' →','');district.value='route';}
  else if(routeOption){routeOption.remove();if(!district.value)district.value='all';}
  const nextStep=guide.querySelector('.city-more a'),nextUrl=new URL(nextStep.href);if(gender.value==='all')nextUrl.searchParams.delete('trip-gender');else nextUrl.searchParams.set('trip-gender',gender.value);nextStep.href=nextUrl.pathname+nextUrl.search;
  heading.textContent=selectedRoute?selectedRoute.querySelector('strong').textContent.replace(' →','')+'，從這裡逛。':brand?'這個品牌，去哪裡逛？':district.value==='starter'?'第一次，從這裡開始。':district.value==='all'?guide.dataset.cityName+'，可以逛這些店。':district.value+'，可以逛什麼？';
  count.textContent='找到 '+total+' 個已整理逛店起點'+(gender.value==='all'?'':' · '+(gender.value==='men'?'男裝':'女裝'));
  guide.querySelector('.city-shopping-empty').hidden=total!==0;
  guide.querySelector('#city-shopping-all').hidden=!brand&&!routeIds&&district.value==='all';
  if(write){const p=new URLSearchParams();if(gender.value!=='all')p.set('gender',gender.value);if(brand)p.set('brand',brand);if(selectedRoute)p.set('route',new URL(selectedRoute.href).searchParams.get('route'));else if(district.value!=='all')p.set('district',district.value);const next=location.pathname+(p.size?'?'+p:'')+'#city-results';if(next!==location.pathname+location.search+location.hash)history.pushState({},'',next);}
  if(focus){results.focus({preventScroll:true});results.scrollIntoView({block:'start',behavior:'instant'});}
 }
 form.addEventListener('submit',event=>{event.preventDefault();apply(true,true);});
 form.addEventListener('change',event=>{if(event.target===district){routeIds=null;brand=null;}apply(true);});
 routes.forEach(a=>a.addEventListener('click',event=>{event.preventDefault();routeIds=JSON.parse(a.dataset.cityRoute);district.value='all';brand=null;apply(true,true);}));
 const all=()=>{district.value='all';routeIds=null;brand=null;apply(true,true);};
 guide.querySelector('#city-shopping-all').addEventListener('click',all);
 guide.querySelector('#city-shopping-reset').addEventListener('click',all);
 window.addEventListener('popstate',()=>{read();apply();});
 read();apply();
 if(location.hash==='#city-results')requestAnimationFrame(()=>apply(false,true));
}
const index=document.querySelector('.city-index');
if(index){
 const p=new URLSearchParams(location.search),aliases={aichi:'nagoya',hokkaido:'sapporo',tochigi:'utsunomiya'},city=p.get('city');
 const targets=[...index.querySelectorAll('[data-city-destination]')];
 if(['men','women'].includes(p.get('gender')))for(const a of targets){const u=new URL(a.href);u.searchParams.set('gender',p.get('gender'));a.href=u.pathname+u.search;}
 const chosen=targets.find(a=>a.dataset.cityDestination===(aliases[city]||city));
 if(chosen){const u=new URL(chosen.href);if(p.get('brand')){u.searchParams.set('brand',p.get('brand'));u.searchParams.set('district','all');}if(['men','women'].includes(p.get('gender')))u.searchParams.set('gender',p.get('gender'));location.replace(u.pathname+u.search+'#city-results');}
 else if(p.get('brand')){
  const brand=p.get('brand');let matches=0;
  for(const a of targets){a.hidden=!JSON.parse(a.dataset.cityBrands).includes(brand);if(!a.hidden){matches++;const u=new URL(a.href);u.searchParams.set('brand',brand);u.searchParams.set('district','all');u.hash='city-results';a.href=u.pathname+u.search+u.hash;}}
  index.querySelector('h1').textContent=matches?'這個品牌，可以在哪裡逛？':'這個品牌的門市，還在整理中。';
  index.querySelector('h1+p').textContent=matches?'選一個城市，直接看已核對店址。':'目前尚無已核對地址；先選城市看其他逛店起點，或回品牌指南查官方。';
  if(!matches)targets.forEach(a=>a.hidden=false);
 }
}
