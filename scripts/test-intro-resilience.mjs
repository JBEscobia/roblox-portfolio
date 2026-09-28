import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';

const base=process.env.TEST_URL||'http://127.0.0.1:4322';
const browser=await chromium.launch();
try {
 for(const mode of ['film','delayed-download','decoder-stall','held','mobile','reduced-motion']){
  const context=await browser.newContext({viewport:{width:mode==='mobile'?390:1440,height:900},reducedMotion:mode==='reduced-motion'?'reduce':'no-preference'});
  const page=await context.newPage();
  if(mode==='delayed-download')await page.route('**/decorative/intro-wall.webm',async route=>{await new Promise(resolve=>setTimeout(resolve,1500));await route.abort().catch(()=>{});});
  await page.goto(base+'/',{waitUntil:'domcontentloaded'});
  if(!['mobile','reduced-motion','delayed-download'].includes(mode))await page.waitForFunction(()=>document.querySelector('.intro-film').readyState>=2);
  // The headline is visible before any gesture; the film plays by itself behind it.
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity','1');
  if(mode==='held'){
   // Scrolling while the intro plays leaves the page where it is.
   await expect(page.locator('.descent')).toHaveAttribute('data-animation-state','playing',{timeout:5000});
   await page.mouse.wheel(0,400);await page.waitForTimeout(300);
   assert.equal(await page.evaluate(()=>scrollY),0,'Scrolling during the intro must be held');
  }
  if(!['mobile','reduced-motion','held'].includes(mode)){
   if(mode==='decoder-stall'){
    await page.waitForFunction(()=>document.querySelector('.intro-film').currentTime>.6);
    await page.locator('.intro-film').evaluate(film=>film.pause());
   }
  }
  await expect(page.locator('.descent')).toHaveAttribute('data-animation-state','complete',{timeout:5000});
  assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('intro-playing')),false);
  await expect(page.locator('.intro-film-finished')).toBeVisible();
  await expect(page.locator('.intro-film-finished')).toHaveAttribute('src','/decorative/intro-last.webp');
  await expect(page.locator('.workshop-fallback,.sky-brick')).toHaveCount(0);
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity','1');
  if(mode==='film')assert(await page.locator('.intro-film').evaluate(film=>film.currentTime>=2.3),'Real film must play to its ending, not silently fall back');
  if(mode==='delayed-download')await page.screenshot({path:'artifacts/intro-front-facing-fallback.png'});
  if(mode==='film')await page.screenshot({path:'artifacts/intro-front-facing-film.png'});
  await page.mouse.wheel(0,400);await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0);
  console.log(`PASS ${mode}: original front-facing artwork, visible text, scrolling released.`);
  await context.close();
 }
} finally {await browser.close();}
