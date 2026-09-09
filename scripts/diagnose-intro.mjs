import {chromium} from '@playwright/test';
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.addInitScript(()=>{
 window.introDiagnostics={scrolls:[],frames:[],longTasks:[]};
 addEventListener('scroll',()=>window.introDiagnostics.scrolls.push({t:performance.now(),y:scrollY}));
 document.addEventListener('descentprogress',e=>window.introDiagnostics.frames.push({t:performance.now(),p:e.detail,webgl:!!document.querySelector('.workshop.is-rendered')}),true);
 new PerformanceObserver(list=>{for(const e of list.getEntries())window.introDiagnostics.longTasks.push({t:e.startTime,duration:e.duration});}).observe({type:'longtask',buffered:true});
});
await page.goto('http://127.0.0.1:4321/',{waitUntil:'domcontentloaded'});await page.mouse.wheel(0,260);await page.waitForTimeout(4500);
console.log('EARLY INPUT',await page.evaluate(()=>({scroll:scrollY,phase:document.querySelector('.descent').dataset.animationState,longTasks:window.introDiagnostics.longTasks.filter(t=>t.duration>100),gaps:window.introDiagnostics.frames.flatMap((f,i,arr)=>i&&f.t-arr[i-1].t>150?[{gap:f.t-arr[i-1].t,p:f.p,previousP:arr[i-1].p,webgl:f.webgl}]:[])})));
await page.evaluate(()=>window.scrollTo({top:2000,behavior:'instant'}));await page.reload({waitUntil:'networkidle'});console.log('RELOAD',await page.evaluate(()=>({y:scrollY,restoration:history.scrollRestoration,scrolls:window.introDiagnostics.scrolls})));
await browser.close();
