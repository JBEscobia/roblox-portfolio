import {chromium} from '@playwright/test';
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});
for(const slug of ['gravity-dash','time-tag','ants','anipal-archipelago']){await page.goto(`http://127.0.0.1:4322/projects/${slug}/`,{waitUntil:'networkidle'});await page.screenshot({path:`artifacts/case-${slug}.png`});}
await page.goto('http://127.0.0.1:4322/',{waitUntil:'networkidle'});await page.locator('.world-transition').first().screenshot({path:'artifacts/wallpaper-transition.png'});
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4322/projects/anipal-archipelago/',{waitUntil:'networkidle'});await page.screenshot({path:'artifacts/case-mobile.png'});
await browser.close();
