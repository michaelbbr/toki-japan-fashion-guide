import fs from 'node:fs';
const edition=JSON.parse(fs.readFileSync(new URL('./expanded-catalog.json',import.meta.url),'utf8'));
export const expandedProfiles=Object.fromEntries(edition.brands.map(b=>[b.id,b.profile]));
export const expandedPieces=Object.fromEntries(edition.brands.map(b=>[b.id,[b.piece]]));
export const expandedRelationships=Object.fromEntries(edition.brands.filter(b=>b.profile.companySource).map(b=>[b.id,edition.brands.filter(other=>other.id!==b.id&&other.profile.companySource===b.profile.companySource).map(other=>({name:other.profile.name,id:other.id,kind:'同集團品牌',note:'集團官方索引分別列出；商品、圖片與價格按完整品牌分開。',url:b.profile.companySource}))]));
