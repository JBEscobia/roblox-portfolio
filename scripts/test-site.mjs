import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://127.0.0.1:4322';
const routes=['/','/projects/gravity-dash/','/projects/time-tag/','/projects/ants/','/about/','/services/','/contact/','/assets/'];
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();const errors=[],broken=[],a11y=[];let assertions=0;
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).origin===new URL(base).origin)broken.push(`${r.status()} ${r.url()}`);});
try{
 for(const route of routes){
  const response=await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(response.status(),200,route);assertions++;
  assert.equal(await page.locator('h1').count(),1,`${route} needs one H1`);assertions++;
  assert(await page.title(),`${route} needs title`);assertions++;
  assert(await page.locator('meta[name=description]').getAttribute('content'));assertions++;
  for(const tags of await page.locator('.project-evidence>.tags').all()){assert(await tags.evaluate(e=>e.getBoundingClientRect().bottom<e.parentElement.querySelector('.media-frame').getBoundingClientRect().top),'Feature tags must be separated from the footage');assertions++;}
  if(route==='/'){
   // The headline is up from the first paint and the intro plays by itself behind it.
   await expect.poll(()=>page.locator('.hero-copy').evaluate(e=>getComputedStyle(e).opacity)).toBe('1');assertions++;
   await page.mouse.wheel(0,650);
   assert.equal(await page.evaluate(()=>scrollY),0,'Scrolling during the intro must be held');assertions++;
   await expect(page.locator('.descent')).toHaveAttribute('data-animation-state','complete',{timeout:8000});
   assert.equal(await page.evaluate(()=>scrollY),0,'The intro must not advance the page by itself');assertions++;
   await page.screenshot({path:'artifacts/validated-intro.png'});
  }
  for(const root of await page.locator('[data-assembly]').all()){
   const technical=root.locator('[data-mode-button=explode]');await technical.click();await expect(technical).toHaveAttribute('aria-pressed','true');await expect(root.locator('.explode-copy')).toBeVisible();await expect(root.locator('.play-copy')).toBeHidden();
   const mechanic=root.locator('[data-mechanic]');await mechanic.click();await expect(mechanic).toHaveAttribute('aria-pressed','true');
   await root.locator('[data-mode-button=play]').click();await expect(root.locator('.play-copy')).toBeVisible();await expect(mechanic).toHaveAttribute('aria-pressed','false');assertions+=6;
  }
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();if(audit.violations.length)a11y.push({route,violations:audit.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  for(const href of await page.locator('a[href]').evaluateAll(as=>as.map(a=>a.getAttribute('href')).filter(h=>h?.startsWith('/')))){
   const u=new URL(href,base);const r=await context.request.get(u.href);assert.equal(r.status(),200,`${route} link ${href}`);assertions++;
  }
 }
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});
  for(const route of routes){await page.goto(base+route,{waitUntil:'networkidle'});const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));assert(dimensions.scroll<=dimensions.viewport+1,`${route} at ${width}px overflows: ${dimensions.scroll}`);assertions++;
   const controls=page.locator('[data-mode-button=explode]');for(const button of await controls.all()){await button.click();await expect(button).toHaveAttribute('aria-pressed','true');assertions++;}
   const after=await page.evaluate(()=>document.documentElement.scrollWidth);assert(after<=width+1,`${route} technical mode at ${width}px overflows: ${after}`);assertions++;
   for(const box of await page.locator('.media-placeholder').all()){assert(await box.evaluate(e=>e.clientWidth<=e.parentElement.clientWidth+1),`${route}: media contents clipped at ${width}px`);assertions++;}
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/',{waitUntil:'networkidle'});await page.locator('.menu-toggle').click();await expect(page.locator('#site-nav')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('.menu-toggle')).toBeFocused();assertions+=2;
 await page.locator('.project-section').last().scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/validated-mobile.png'});
 await page.reload({waitUntil:'networkidle'});assert.equal(await page.evaluate(()=>scrollY),0,'A normal homepage reload must not restore the old scroll position');assertions++;
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/',{waitUntil:'networkidle'});await expect(page.locator('.hero-copy')).toBeVisible();assert.equal(await page.locator('.descent').evaluate(e=>e.classList.contains('motion-enabled')),false);assert.equal(await page.locator('canvas').count(),0);assertions+=3;
 await page.locator('[data-mode-button=explode]').first().click();const transition=await page.locator('.model-layer').first().evaluate(e=>getComputedStyle(e).transitionDuration);assert(transition.split(',').every(n=>parseFloat(n)<=.01));assertions++;
 await page.screenshot({path:'artifacts/validated-reduced-motion.png',fullPage:true});
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const basic=await nojs.newPage();await basic.goto(base+'/');await expect(basic.locator('.hero-copy')).toBeVisible();await expect(basic.locator('.explode-copy').first()).toBeVisible();await expect(basic.locator('#site-nav')).toBeVisible();assertions+=3;await nojs.close();
 assert.equal(errors.length,0,JSON.stringify(errors));assert.equal(broken.length,0,JSON.stringify(broken));assertions+=2;
 await writeFile('artifacts/validation.json',JSON.stringify({assertions,routes,errors,broken,a11y},null,2));
 assert.equal(a11y.length,0,`Accessibility violations; see artifacts/validation.json (${a11y.length} routes)`);
 console.log(`PASS: ${assertions} checks across ${routes.length} routes, desktop, 390px / 320px mobile, reduced motion, no JavaScript, interactions, links, assets, and axe WCAG A/AA.`);
} finally {await browser.close();}
