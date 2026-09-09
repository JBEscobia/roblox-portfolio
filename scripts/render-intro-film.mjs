import {chromium} from '@playwright/test';
import {mkdir,writeFile,readFile,unlink} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
import ffmpegStatic from 'ffmpeg-static';
await mkdir('artifacts/intro-frames',{recursive:true});await mkdir('public/decorative',{recursive:true});
await writeFile('public/_capture.html','<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Local decorative animation capture</title></head><body></body></html>');
const browser=await chromium.launch();const page=await browser.newPage();
try{
await page.goto('http://127.0.0.1:4321/_capture.html');
await page.evaluate(async()=>{const {createWallScene}=await import('/src/scripts/wall-scene.ts');window.captureCanvas=new OffscreenCanvas(2700,900);window.captureEngine=await createWallScene(window.captureCanvas,2700,900,1,true);});
for(let i=0;i<144;i++){
 const base64=await page.evaluate(async p=>{window.captureEngine.render(p);const blob=await window.captureCanvas.convertToBlob({type:'image/png'});const bytes=new Uint8Array(await blob.arrayBuffer());let s='';for(let i=0;i<bytes.length;i+=32768)s+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(s);},i/143);
 await writeFile(`artifacts/intro-frames/${String(i).padStart(4,'0')}.png`,Buffer.from(base64,'base64'));
 if(i%36===0)console.log(`Rendered ${i}/144 decorative frames`);
}
}finally{await browser.close();await unlink('public/_capture.html').catch(()=>{});}
await sharp('artifacts/intro-frames/0000.png').webp({quality:90,alphaQuality:100}).toFile('public/decorative/intro-first.webp');
await sharp('artifacts/intro-frames/0143.png').webp({quality:90,alphaQuality:100}).toFile('public/decorative/intro-last.webp');
const ffmpeg=process.env.FFMPEG_BIN||ffmpegStatic;
const result=spawnSync(ffmpeg,['-y','-framerate','60','-i','artifacts/intro-frames/%04d.png','-vf','scale=1920:640','-c:v','libvpx-vp9','-pix_fmt','yuva420p','-auto-alt-ref','0','-b:v','0','-crf','38','-row-mt','1','-an','artifacts/intro-wall.webm'],{encoding:'utf8',windowsHide:true});
if(result.status!==0)throw new Error(result.stderr);console.log('Rendered and encoded original decorative wall animation.');
await writeFile('public/decorative/intro-wall.webm',await readFile('artifacts/intro-wall.webm'));
