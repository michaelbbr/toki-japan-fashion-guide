import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {extractPublicSnapshots} from '../scripts/import-fti.mjs';
import {brands} from '../data/catalog.mjs';
test('import only copies audited public fields; incomplete input throws',()=>{
 const fixture={market:'JP',query:'x',provider:'google-trends',providerMode:'explore_internal',scalingMode:'query_relative_0_100',signalStatus:'REAL',sourceStatus:'ok',observedAt:'2026-09-11T00:00:00Z',timeline:[],privateToken:'FAKE-TEST-ONLY'};
 const raw=Object.fromEntries(['beams','united-arrows','snow-peak'].map(id=>[id+':JP',fixture]));
 assert.ok(!JSON.stringify(extractPublicSnapshots(raw)).includes('FAKE-TEST-ONLY'));
 assert.throws(()=>extractPublicSnapshots({}),/Untrusted/);
 assert.throws(()=>extractPublicSnapshots({...raw,'beams:JP':{...fixture,sourceType:'seed_fixture'}}),/Untrusted/);
});
test('all 5 profiles have checked samples, sources and valid related destinations',()=>{
 assert.equal(brands.length,5);
 for(const b of brands) {
  assert.ok(b.intro.length>60);assert.ok(b.samples.length);
  for(const s of b.samples){assert.ok(s.price>0);assert.ok(s.url.startsWith('https://'));}
  for(const r of b.similar)assert.ok(brands.find(x=>x.id===r.id));
 }
});
test('static build internal links resolve and never provides runtime functions',()=>{
 execFileSync(process.execPath,['scripts/build.mjs'],{stdio:'pipe'});
 const m=JSON.parse(fs.readFileSync('dist/build-manifest.json','utf8'));
 assert.equal(m.runtimeFunctions,0);assert.equal(m.routes.length,16);
 for(const route of m.routes) {
  const html=fs.readFileSync('dist/'+(route==='/'?'index':route.slice(1))+'.html','utf8');
  assert.ok(html.includes('lang="zh-Hant"'));
  for(const match of html.matchAll(/href="(\/[^"]*)"/g)) {
   const p=match[1].split(/[?#]/)[0];
   const file='dist/'+(p==='/'?'index.html':p.slice(1)+(p.includes('.')?'':'.html'));
   assert.ok(fs.existsSync(file),'Missing internal link '+p+' in '+route);
  }
  assert.ok(!html.includes('undefined'));
  assert.ok(!html.includes('NaN'));
 }
 assert.ok(fs.readFileSync('dist/brands/auralee.html','utf8').includes('尚無日本搜尋觀測'));
 assert.ok(fs.readFileSync('dist/brands/beams.html','utf8').includes('歷史觀測 · 待更新'));
 const v=JSON.parse(fs.readFileSync('vercel.json','utf8'));
 assert.equal(v.framework,null);assert.ok(!v.crons);assert.ok(!v.functions);
});
