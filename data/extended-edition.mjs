import fs from 'node:fs';
const edition=JSON.parse(fs.readFileSync(new URL('./extended-edition.json',import.meta.url),'utf8'));
export const extendedProfiles=Object.fromEntries(edition.brands.map(b=>[b.id,b.profile]));
export const extendedPieces=Object.fromEntries(edition.brands.map(b=>[b.id,b.pieces]));
export const extendedRelationships=Object.fromEntries(edition.brands.map(b=>[b.id,b.relationships]));
