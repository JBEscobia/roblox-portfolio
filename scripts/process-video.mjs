import {spawnSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const [id,input,trimStart='0',length='12']=process.argv.slice(2);
if(!id||!input||!Number.isFinite(Number(trimStart))||!Number.isFinite(Number(length))||Number(length)<=0||Number(length)>30)throw new Error('Usage: npm run media:video -- GD-01 path/to/approved.mp4 start-seconds duration-seconds (maximum 30)');
function run(tool,args){const r=spawnSync(tool,args,{encoding:'utf8',windowsHide:true});if(r.error||r.status!==0)throw new Error(`${tool}: ${r.error?.message||r.stderr}`);return r.stdout;}
run('ffmpeg',['-version']);run('ffprobe',['-version']);
const records=JSON.parse(await readFile('src/data/media.json','utf8'));const m=records.find(m=>m.id===id);
if(!m||m.kind!=='video')throw new Error('Select a configured video capture ID.');
const dir=`public/projects/${m.project}`;await mkdir(dir,{recursive:true});const name=`${dir}/${id.toLowerCase()}`;
for(const [suffix,width] of [['',1920],['-mobile',960]])run('ffmpeg',['-y','-ss',trimStart,'-i',resolve(input),'-t',length,'-an','-vf',`scale=w='min(${width},iw)':h=-2`,'-c:v','libx264','-crf','23','-preset','slow','-pix_fmt','yuv420p','-movflags','+faststart',`${name}${suffix}.mp4`]);
run('ffmpeg',['-y','-ss','0.2','-i',`${name}.mp4`,'-frames:v','1','-q:v','3',`${name}-poster.jpg`]);
const metadata=JSON.parse(run('ffprobe',['-v','quiet','-print_format','json','-show_streams','-show_format',`${name}.mp4`]));const video=metadata.streams.find(s=>s.codec_type==='video');
Object.assign(m,{src:`${name}.mp4`.replace(/^public/,''),mobileSrc:`${name}-mobile.mp4`.replace(/^public/,''),poster:`${name}-poster.jpg`.replace(/^public/,''),width:video.width,height:video.height,duration:`${Number(metadata.format.duration).toFixed(1)} s`,status:'verified-capture'});
await writeFile('src/data/media.json',JSON.stringify(records,null,2)+'\n');
console.log(`Encoded ${id} without audio. Input must be approved real gameplay. Review metadata and run npm run build.`);
