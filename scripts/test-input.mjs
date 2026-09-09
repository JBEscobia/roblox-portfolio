import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
for(const input of ['wheel','keyboard','touch']){
 const context=await browser.newContext({viewport:{width:input==='touch'?390:1440,height:900},hasTouch:input==='touch',isMobile:input==='touch'});
 const page=await context.newPage();await page.goto('http://127.0.0.1:4321/',{waitUntil:'networkidle'});
 if(input==='touch'){await expect(page.locator('.descent')).toHaveAttribute('data-animation-state','complete');await expect(page.locator('.intro-film-finished')).toBeVisible();console.log('PASS touch: original wall still is immediately available without a loading lock.');await context.close();continue;}
 if(input==='wheel'){await page.mouse.wheel(0,650);await page.mouse.wheel(0,900);}
 if(input==='keyboard'){await page.keyboard.press('PageDown');await page.keyboard.press('ArrowDown');}
 if(input==='touch'){const client=await context.newCDPSession(page);await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:500}]});await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y:360}]});await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y:230}]});await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
 await expect(page.locator('.descent')).toHaveAttribute('data-animation-state','playing');assert.equal(await page.evaluate(()=>scrollY),0);
 await expect(page.locator('.descent')).toHaveAttribute('data-animation-state','complete',{timeout:8000});assert.equal(await page.evaluate(()=>scrollY),0);
 await page.mouse.wheel(0,300);await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0);
 console.log(`PASS ${input}: start without movement, hold during playback, no movement on completion, scroll resumes.`);await context.close();
}
await browser.close();
