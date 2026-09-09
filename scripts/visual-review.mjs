import {chromium} from '@playwright/test';
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://127.0.0.1:4322/',{waitUntil:'networkidle'});
for(const id of ['gravity-dash','time-tag','ants','anipal-archipelago']){await page.locator('#'+id).evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY,behavior:'instant'}));await page.waitForTimeout(600);await page.screenshot({path:`artifacts/review-${id}.png`});}
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4322/',{waitUntil:'networkidle'});await page.locator('#ants').evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY,behavior:'instant'}));await page.waitForTimeout(600);await page.screenshot({path:'artifacts/review-mobile.png'});
console.log(await page.locator('#ants .media-placeholder').evaluate(e=>({width:e.clientWidth,scroll:e.scrollWidth,columns:getComputedStyle(e).gridTemplateColumns,child:e.querySelector('div').clientWidth,h3:e.querySelector('h3').clientWidth,text:getComputedStyle(e.querySelector('h3')).whiteSpace})));
console.log(await page.locator('#ants').evaluate(e=>Array.from(e.querySelectorAll('.project-grid,.project-evidence,.media-frame,.media-placeholder,.media-placeholder>div,.project-grid>*')).map(n=>({class:n.className,width:n.clientWidth,cssWidth:getComputedStyle(n).width,min:getComputedStyle(n).minWidth,columns:getComputedStyle(n).gridTemplateColumns,position:getComputedStyle(n).position,overflow:getComputedStyle(n).overflow}))));
await browser.close();
