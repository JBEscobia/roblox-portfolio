import {readdir,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const dir='src/content/projects';const files=(await readdir(dir)).filter(f=>f.endsWith('.json'));
const projects=await Promise.all(files.map(async file=>({slug:file.slice(0,-5),...JSON.parse(await readFile(`${dir}/${file}`,'utf8'))})));
const banned=[/unhackable/i,/exploit-proof/i,/zero data loss/i,/infinitely scalable/i,/millions of players/i,/industry-leading/i,/crash-proof/i,/\d+\s*(fps|milliseconds|ms\b)/i,/scales to\s+\d/i];
for(const p of projects){
 const affirmative=[p.headline,p.premise,p.proof,...p.capabilities,p.play.title,p.play.description,p.explode.title,p.explode.description,...p.features.flatMap(f=>[f.title,f.description]),...p.cases.map(c=>c.technical)].join('\n');
 for(const pattern of banned)assert(!pattern.test(affirmative),`${p.slug}: unsupported public claim ${pattern}`);
 assert(projects.some(next=>next.slug===p.next),`${p.slug}: missing next route`);
 for(const f of p.features)assert(f.sources?.length,`${p.slug}/${f.title}: missing feature source references`);
 for(const c of p.cases){assert(c.claims.length,`${p.slug}/${c.id}: missing claim references`);assert(c.evidence==='verified-source',`${p.slug}/${c.id}: technical case must be source-verified before publication`);}
 if(p.slug==='gravity-dash')assert(p.attribution?.includes('EmilyBendsSpace'),'Gravity sampling requires explicit attribution');
 if(p.slug==='ants')assert(p.status.evidence!=='status-confirmation-required'||p.status.label==='Status to confirm','Unconfirmed ANTS! release status cannot be promoted');
 if(p.slug==='time-tag')assert(!/fully server-authoritative|rollback netcode/i.test(p.premise+p.cases.map(c=>c.technical).join(' ')),'Time Tag is endpoint reconciliation');
 if(p.slug==='anipal-archipelago'){assert(p.notes.some(n=>n.includes('PosterHandler')),'Retain the leave-checkpoint limitation');assert(!/cross-server (profile|session) (lock|lease)/i.test(p.cases.map(c=>c.technical).join(' ')),'Do not borrow Time Tag profile leasing for AniPal');}
}
console.log(`Claims: ${projects.length} project records checked; attribution, status, and known persistence boundaries retained.`);
