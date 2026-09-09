import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch();
for(const amount of [80,260,650]){
 const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto('http://127.0.0.1:4321/',{waitUntil:'networkidle'});await page.mouse.wheel(0,amount);
 await page.waitForTimeout(2700);
 console.log(amount,await page.locator('.descent').evaluate(e=>({progress:e.style.getPropertyValue('--descent'),height:e.clientHeight,scroll:scrollY,heroTop:e.querySelector('.hero').getBoundingClientRect().top,opacity:getComputedStyle(e.querySelector('.hero-copy')).opacity,canvas:!!e.querySelector('canvas')})));
 await page.screenshot({path:`artifacts/intro-gesture-${amount}.png`});
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(300);await expect(page.locator('.hero-copy')).toBeVisible();await page.close();
}
await browser.close();
