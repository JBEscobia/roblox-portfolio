document.querySelectorAll<HTMLElement>('[data-assembly]').forEach(root=>{
 const controls=root.querySelector<HTMLElement>('.mode-controls');
 const buttons=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-mode-button]'));
 const play=root.querySelector<HTMLElement>('.play-copy');
 const explode=root.querySelector<HTMLElement>('.explode-copy');
 const mechanic=root.querySelector<HTMLButtonElement>('[data-mechanic]');
 if(!controls||!play||!explode)return;
 controls.hidden=false; explode.hidden=true;
 function select(mode:string){root.dataset.mode=mode;root.dataset.demo='false';mechanic?.setAttribute('aria-pressed','false');buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.modeButton===mode)));play!.hidden=mode!=='play';explode!.hidden=mode!=='explode';}
 buttons.forEach(b=>b.addEventListener('click',()=>select(b.dataset.modeButton!)));
 if(mechanic){mechanic.hidden=false;mechanic.setAttribute('aria-pressed','false');mechanic.addEventListener('click',()=>{
   const active=root.dataset.demo!=='true';root.dataset.demo=String(active);mechanic.setAttribute('aria-pressed',String(active));
   const status=root.querySelector('[data-model-status]');
   const messages:Record<string,string>={gravity:'Model gravity direction changed; editorial text remains upright.',time:'Illustrative model moved into historical positions.',ants:'Illustrative additional claimant changes the haul. Multi-ant item ownership returns to automatic selection.',anipal:'Island layers separated to reveal the underlying system.'};
   if(status)status.textContent=active?messages[root.dataset.kind!]:'Illustrative model reset.';
 });}
});

// Only advance the decorative time trails while their section is visible and scrolling.
const timeSection=document.querySelector<HTMLElement>('.project-section.time');
if(timeSection){let active=false,frame=0;const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const update=()=>{frame=0;if(active&&!motion.matches){timeSection.style.setProperty('--trail-offset',`${-timeSection.getBoundingClientRect().top*.4}px`);}};
 const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;update();});observer.observe(timeSection);
 window.addEventListener('scroll',()=>{if(active&&!frame&&!motion.matches)frame=requestAnimationFrame(update);},{passive:true});
}
