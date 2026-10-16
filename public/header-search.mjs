// Progressive enhancement: the GET form works even if the suggestion index is unavailable.
const headerSearch=document.querySelector('#header-brand-search');
if(headerSearch){
 const input=headerSearch.elements.namedItem('q'),panel=headerSearch.querySelector('#header-search-suggestions');
 const list=panel.querySelector('ul'),status=panel.querySelector('[data-search-status]'),all=panel.querySelector('[data-search-all]');
 const normalized=s=>String(s||'').normalize('NFKC').trim().toLocaleLowerCase();
 const resultUrl=q=>'/brands?'+new URLSearchParams({q})+'#brand-results';
 let indexPromise,timer,version=0,suppressFocus=false;
 const close=()=>{panel.hidden=true;};
 function loadIndex(){return indexPromise??=fetch('/data/brand-search.json').then(r=>{if(!r.ok)throw new Error('Search index unavailable');return r.json();}).catch(()=>null);}
 async function suggest(){
  const request=++version,query=input.value.slice(0,160),q=normalized(query);
  if(!q){close();return;}
  const brands=await loadIndex();
  if(request!==version||!brands||!headerSearch.contains(document.activeElement)){close();return;}
  const matches=brands.filter(b=>[b.name,b.jp,...b.aliases].some(s=>normalized(s).includes(q))).sort((a,b)=>{
   const rank=b=>normalized(b.name)===q?0:normalized(b.name).startsWith(q)?1:2;
   return rank(a)-rank(b)||a.name.localeCompare(b.name,'en');
  });
  list.replaceChildren();
  for(const b of matches.slice(0,6)){
   const li=document.createElement('li'),a=document.createElement('a'),name=document.createElement('strong'),jp=document.createElement('span');
   a.href='/brands/'+encodeURIComponent(b.id);name.textContent=b.name;jp.textContent=b.jp;
   a.append(name,jp);li.append(a);list.append(li);
  }
  status.textContent=matches.length?'找到 '+matches.length+' 個名稱相符的品牌':'名稱沒有相符品牌，可再看關鍵字搜尋結果。';
  all.href=resultUrl(query);panel.hidden=false;
 }
 input.addEventListener('input',()=>{clearTimeout(timer);version++;if(!input.value.trim())close();else timer=setTimeout(suggest,120);});
 input.addEventListener('focus',()=>{if(!suppressFocus&&input.value.trim())suggest();});
 input.addEventListener('keydown',event=>{if(event.key==='ArrowDown'&&!panel.hidden){event.preventDefault();panel.querySelector('a')?.focus();}});
 headerSearch.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();version++;clearTimeout(timer);close();suppressFocus=true;input.focus({preventScroll:true});suppressFocus=false;}
  if(event.target.tagName==='A'&&['ArrowDown','ArrowUp'].includes(event.key)){
   event.preventDefault();const links=[...panel.querySelectorAll('a')],i=links.indexOf(event.target),next=i+(event.key==='ArrowDown'?1:-1);
   if(next<0)input.focus({preventScroll:true});else links[Math.min(next,links.length-1)]?.focus();
  }
 });
 headerSearch.addEventListener('submit',()=>{clearTimeout(timer);version++;close();});
 headerSearch.addEventListener('focusout',()=>requestAnimationFrame(()=>{if(!headerSearch.contains(document.activeElement))close();}));
 document.addEventListener('pointerdown',event=>{if(!headerSearch.contains(event.target)){version++;close();}});
}
