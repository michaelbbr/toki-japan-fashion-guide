import fs from 'node:fs';
const edition=JSON.parse(fs.readFileSync(new URL('./new-edition.json',import.meta.url),'utf8'));
export const newProfiles=Object.fromEntries(edition.brands.map(b=>[b.id,b.profile]));
export const newPieces=Object.fromEntries(edition.brands.map(b=>[b.id,[b.piece]]));
export const newRelationships=Object.fromEntries(edition.brands.map(b=>[b.id,b.relationships]));
export const newOutfits=Object.fromEntries(edition.brands.map(b=>[b.id,b.outfit]));
