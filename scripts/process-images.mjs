import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const [id,input]=process.argv.slice(2);
if(!id||!input)throw new Error('Usage: npm run media:images -- GD-03 path/to/approved-capture.png');
const records=JSON.parse(await readFile('src/data/media.json','utf8'));const m=records.find(m=>m.id===id);
if(!m||m.kind!=='image')throw new Error('Select a configured image capture ID.');
const original=await sharp(resolve(input)).rotate().toBuffer();const meta=await sharp(original).metadata();
const dir=`public/projects/${m.project}`;await mkdir(dir,{recursive:true});
const widths=[640,960,1280,1600].filter(w=>w<=meta.width);if(!widths.length)widths.push(meta.width);
m.variants=[];
for(const width of widths)for(const format of ['avif','webp','jpg']){const path=`${dir}/${id.toLowerCase()}-${width}.${format}`;let image=sharp(original).resize({width,withoutEnlargement:true});if(format==='jpg')image=image.jpeg({quality:85});else image=image.toFormat(format,{quality:format==='avif'?55:82});await image.toFile(path);m.variants.push({src:path.replace(/^public/,''),width,format});}
m.src=m.variants.filter(v=>v.format==='jpg').at(-1).src;m.width=widths.at(-1);m.height=Math.round(meta.height*m.width/meta.width);m.status='verified-capture';
await writeFile('src/data/media.json',JSON.stringify(records,null,2)+'\n');
console.log(`Processed ${id}. This command assumes the input is an approved, real capture. Review its description and run npm run build.`);
