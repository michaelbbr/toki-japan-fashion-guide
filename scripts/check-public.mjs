import fs from 'node:fs';
const base=process.argv[2] || 'http://127.0.0.1:3057';
const allowed=new Set(['127.0.0.1','localhost','toki-japan-fashion-guide.vercel.app']);
const host=new URL(base);
if(!allowed.has(host.hostname))throw new Error('Pass an explicitly approved deployment origin.');
const manifest=JSON.parse(fs.readFileSync('dist/build-manifest.json','utf8'));
const report={base,checkedAt:new Date().toISOString(),routes:[],assets:[],runtimeFunctions:manifest.runtimeFunctions};
for(const route of manifest.routes.filter(r=>r!=='/404')) {
 const res=await fetch(base+route,{signal:AbortSignal.timeout(10000)});
 const text=await res.text();
 const pass=res.status===200 && text.includes('TOKI') && text.includes('lang="zh-Hant"');
 report.routes.push({route,status:res.status,pass,title:text.match(/<title>(.*?)<\/title>/)?.[1]});
}
for(const asset of ['/styles.css','/app.mjs','/domain.mjs','/media/fashion-references-v1.webp','/data/fti-snapshots.json','/sitemap.xml']) {
 const r=await fetch(base+asset,{signal:AbortSignal.timeout(10000)});
 const b=await r.arrayBuffer();
 report.assets.push({asset,status:r.status,bytes:b.byteLength,pass:r.status===200 && b.byteLength>0});
}
const missing=await fetch(base+'/not-a-page-toki-check',{signal:AbortSignal.timeout(10000)});
const missingText=await missing.text();
report.missing={status:missing.status,custom404:missingText.includes('這一頁')};
const pass=report.routes.every(r=>r.pass) && report.assets.every(a=>a.pass) && report.missing.status===404 && report.missing.custom404;
fs.mkdirSync('evidence',{recursive:true});
fs.writeFileSync('evidence/'+(host.hostname==='127.0.0.1'?'local':'production')+'-http-smoke.json',JSON.stringify({...report,pass},null,2));
console.log(JSON.stringify({origin:base,routes:report.routes.length,assets:report.assets.length,custom404:report.missing,pass}));
if(!pass)process.exitCode=1;
