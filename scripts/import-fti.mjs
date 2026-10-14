import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {summarize} from '../src/domain.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export function extractPublicSnapshots(raw) {
  const result={};
  for(const slug of ['beams','united-arrows','snow-peak']) {
    const s=raw[slug+':JP'];
    if(!s || ['missing','unavailable'].includes(summarize(s).state)) throw new Error('Untrusted or missing JP snapshot: '+slug);
    result[slug]={assetId:s.assetId,market:s.market,query:s.query,provider:s.provider,providerMode:s.providerMode,scalingMode:s.scalingMode,sourceType:s.sourceType,signalStatus:s.signalStatus,sourceStatus:s.sourceStatus,observedAt:s.observedAt,timeline:s.timeline.map(p=>({date:p.date,value:p.value,hasData:p.hasData,isPartial:p.isPartial}))};
  }
  return result;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const source=process.argv[2];
  if(!source) throw new Error('Pass explicit source JSON path. This command never contacts a provider.');
  const raw=JSON.parse(fs.readFileSync(source,'utf8'));
  const content=JSON.stringify({sourceRepository:'https://github.com/michaelbbr/fashion-trend-index',snapshots:extractPublicSnapshots(raw)},null,2);
  const destination=path.join(root,'data','fti-snapshots.json');
  fs.mkdirSync(path.dirname(destination),{recursive:true});
  fs.writeFileSync(destination+'.tmp',content+'\n');
  fs.renameSync(destination+'.tmp',destination);
  console.log('Imported 3 public JP histories. Source dates preserved; no provider calls.');
}
