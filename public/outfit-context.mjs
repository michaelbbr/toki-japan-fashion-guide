export function applyOutfitContext(root,gender){
 const g=['men','women'].includes(gender)?gender:'all';
 for(const figure of root.querySelectorAll('[data-outfit-choices]')){
  const look=JSON.parse(figure.dataset.outfitChoices)[g],image=figure.querySelector('img'),caption=figure.querySelector('figcaption'),missing=figure.querySelector('.photo-unavailable');
  image.hidden=!look;missing.hidden=!!look;
  if(look){if(image.getAttribute('src')!==look.image)image.src=look.image;image.style.objectPosition=look.position||'center';image.alt=figure.dataset.outfitBrand+' · '+look.credit;caption.textContent=image.alt;}
  else{image.removeAttribute('src');caption.textContent=figure.dataset.outfitBrand+' · '+(g==='men'?'男裝':g==='women'?'女裝':'品牌')+'穿搭照整理中';missing.textContent='穿搭照片整理中；可先閱讀品牌與真實單品。';}
  const container=figure.closest('.brand-card')||root,source=container.querySelector('[data-outfit-source]');
  if(source){source.hidden=!look;let a=source.querySelector('a');if(look){if(!a){a=document.createElement('a');a.target='_blank';a.rel='noopener noreferrer';a.className='text-link';a.textContent='穿搭照片來源 ↗';source.append(a);}a.href=look.source;}}
 }
 for(const a of root.querySelectorAll('[data-brand-guide]')){const u=new URL(a.href);if(g==='all')u.searchParams.delete('gender');else u.searchParams.set('gender',g);a.href=u.pathname+u.search+u.hash;}
 for(const a of root.querySelectorAll('.tags a')){const u=new URL(a.href);if(u.searchParams.has('style')){u.pathname=g==='all'?'/brands':'/'+g;a.href=u.pathname+u.search+u.hash;}}
 for(const text of root.querySelectorAll('[data-look-choices]'))text.textContent=JSON.parse(text.dataset.lookChoices)[g];
 const pieces=[...root.querySelectorAll('.brand-piece-list [data-piece-audience]')];
 for(const p of pieces)p.hidden=g!=='all'&&!p.dataset.pieceAudience.split(' ').includes(g);
 for(const price of root.querySelectorAll('[data-price-audience]'))price.hidden=g!=='all'&&!price.dataset.priceAudience.split(' ').includes(g);
 const note=root.querySelector('[data-piece-context-note]');
 if(note)note.hidden=g==='all'||pieces.some(p=>!p.hidden);
}
