import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const media=JSON.parse(await readFile('src/data/media.json','utf8'));const ids=new Set();let pending=0;
const publicRoot=resolve('public');
async function asset(path){assert(path.startsWith('/')&&!path.includes('..'),`Unsafe asset path: ${path}`);const local=resolve(publicRoot,`.${path}`);assert(local.startsWith(publicRoot+sep));const s=await stat(local);assert(s.isFile()&&s.size>0,`Empty asset ${path}`);assert(s.size<25*1024*1024,`Asset exceeds 25 MiB: ${path}. Encode a shorter/smaller clip.`);return local;}
for(const m of media){assert(!ids.has(m.id),`Duplicate media ID ${m.id}`);ids.add(m.id);assert(m.description&&m.width>0&&m.height>0,`Missing media metadata: ${m.id}`);
 if(m.status==='placeholder'){assert(!m.src&&!m.poster,`${m.id}: placeholders cannot contain imagery presented as evidence`);pending++;continue;}
 assert(m.status==='verified-capture',`${m.id}: real media needs reviewed verified-capture status`);
 const path=await asset(m.src);
 if(m.kind==='video'){await asset(m.poster);if(m.mobileSrc)await asset(m.mobileSrc);if(m.webm)await asset(m.webm);assert(m.transcript||m.audioRequired!==true,`${m.id}: add a transcript for required audio`);}
 else{const actual=await sharp(path).metadata();assert(actual.width===m.width&&actual.height===m.height,`${m.id}: image dimensions disagree`);for(const variant of m.variants||[])await asset(variant.src);}
}
for(const file of await readdir('src/content/projects')){if(!file.endsWith('.json'))continue;const p=JSON.parse(await readFile(`src/content/projects/${file}`,'utf8'));for(const id of [p.hero,...p.supporting])assert(ids.has(id),`${file}: unknown media ${id}`);}
console.log(`Media: ${media.length} references checked; ${pending} explicitly labeled placeholders, ${media.length-pending} reviewed captures.`);
