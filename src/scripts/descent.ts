const section=document.querySelector<HTMLElement>('.descent');
const host=document.querySelector<HTMLElement>('[data-workshop]');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const mobile=matchMedia('(max-width:760px)');
const connection=(navigator as Navigator & {connection?:{saveData?:boolean}}).connection;
if(section&&host){
 type Phase='idle'|'playing'|'complete';
 let frame=0,visible=true,phase:Phase='idle',elapsed=0,lastTime=0,touchY=0;
 const copy=section.querySelector<HTMLElement>('.hero-copy')!;
 const film=host.querySelector<HTMLVideoElement>('.intro-film');
 const loading=section.querySelector<HTMLElement>('.intro-load-status');
 const ground=section.querySelector<SVGElement>('.ground-horizon');
 const cue=section.querySelector<HTMLElement>('.descent-cue');
 const clouds=Array.from(section.querySelectorAll<SVGElement>('.cloud'));
 const download=new AbortController();
 let filmUrl='',startTimer=0,lastMediaTime=-1,lastMediaAdvance=0,playPending=false;
 const startWait=400,stallWait=400;
 let useFilm=!!film&&!motion.matches&&!mobile.matches&&!connection?.saveData&&!!film.canPlayType('video/webm; codecs="vp9"');
 const clamp=(x:number)=>Math.min(1,Math.max(0,x));
 function unlock(){document.documentElement.classList.remove('intro-playing');}
 function complete(){phase='complete';elapsed=2400;clearTimeout(startTimer);download.abort();film?.pause();unlock();schedule();}
 function eligible(){const bounds=section!.getBoundingClientRect();return phase==='idle'&&!motion.matches&&bounds.top<innerHeight*.4&&bounds.bottom>innerHeight*.65;}
 function playFilm(){
  if(!useFilm||!film||!filmUrl||phase!=='playing'||film.readyState<2||playPending)return;
  playPending=true;
  film.play().then(()=>{playPending=false;clearTimeout(startTimer);lastMediaAdvance=performance.now();}).catch(()=>{playPending=false;filmFailure();});
 }
 function filmFailure(){
  if(!useFilm)return;
  useFilm=false;clearTimeout(startTimer);download.abort();film?.pause();
  // Keep the exact film artwork on failure, never switch to the older angled
  // SVG wall. Its existing final-frame image is the static fallback.
  host!.removeAttribute('data-render-mode');complete();
 }
 function begin(){
  if(phase!=='idle')return;
  phase='playing';elapsed=0;lastTime=0;lastMediaAdvance=performance.now();
  document.documentElement.classList.add('intro-playing');
  if(useFilm){startTimer=window.setTimeout(filmFailure,startWait);playFilm();}
  schedule();
 }
 function update(now=performance.now()){frame=0;if(!visible||document.hidden){lastTime=0;return;}
  const reduced=motion.matches;
  if(phase==='playing'){
   if(useFilm&&film){
    elapsed=film.duration>0?film.currentTime/film.duration*2400:0;
    if(film.currentTime>lastMediaTime){lastMediaTime=film.currentTime;lastMediaAdvance=now;}
    else if(now-lastMediaAdvance>stallWait)filmFailure();
    if(film.ended)elapsed=2400;
   }else if(lastTime)elapsed+=now-lastTime;
   lastTime=now;if(elapsed>=2400)complete();
  }
  const p=reduced||phase==='complete'?1:clamp(elapsed/2400);
  if(section!.dataset.animationState!==phase)section!.dataset.animationState=phase;
  if(loading)loading.hidden=!(phase==='playing'&&useFilm&&film&&film.currentTime===0);
  host!.classList.toggle('film-complete',phase==='complete');
  // Inherited custom properties invalidated the intro SVG subtree every frame.
  // Only touch the individual elements that consume the animation progress.
  const reveal=clamp((p-.62)/.16);
  copy.style.opacity=String(reveal);copy.style.transform=`translate(-50%,${(1-reveal)*65}px)`;
  if(ground)ground.style.transform=`translateY(${(1-clamp((p-.3)/.4))*180}px)`;
  if(cue)cue.style.opacity=String(clamp(1-p*2));
  clouds.forEach((cloud,i)=>cloud.style.transform=i===2?`translateY(${-80*p}px)`:`translateX(${[-60,80,0,-40][i]*p}px)`);
  const inert=!reduced&&p<.64;if(copy.inert!==inert)copy.inert=inert;
  host!.dispatchEvent(new CustomEvent('descentprogress',{detail:p}));
  if(!reduced&&phase==='playing')frame=requestAnimationFrame(update);
 }
 function schedule(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(update);}
 function wheel(event:WheelEvent){if(event.ctrlKey||motion.matches)return;if(phase==='playing'){event.preventDefault();return;}if(event.deltaY>0&&eligible()){event.preventDefault();begin();}}
 function touchStart(event:TouchEvent){touchY=event.touches[0]?.clientY||0;}
 function touchMove(event:TouchEvent){if(motion.matches||event.touches.length!==1)return;if(phase==='playing'){event.preventDefault();return;}if(touchY-(event.touches[0]?.clientY||0)>3&&eligible()){event.preventDefault();begin();}}
 function key(event:KeyboardEvent){if(event.key==='Escape'&&phase==='playing'){complete();return;}if((event.target as HTMLElement).closest('input,textarea,select,button,a'))return;const down=['ArrowDown','PageDown',' ','End'].includes(event.key);const navigation=['ArrowUp','PageUp','Home',...['ArrowDown','PageDown',' ','End']].includes(event.key);if(phase==='playing'&&navigation){event.preventDefault();return;}if(down&&eligible()){event.preventDefault();begin();}}
 function navigation(event:MouseEvent){if((event.target as HTMLElement).closest('a[href]'))complete();}
 function resize(){section!.style.setProperty('--header-height',`${document.querySelector('.site-header')?.getBoundingClientRect().height||98}px`);schedule();}
 function visibility(){lastTime=0;lastMediaAdvance=performance.now();if(document.hidden){clearTimeout(startTimer);film?.pause();}else if(useFilm&&phase==='playing'){startTimer=window.setTimeout(filmFailure,startWait);playFilm();}schedule();}
 function preference(){section!.classList.toggle('motion-enabled',!motion.matches);if(motion.matches){complete();copy.inert=false;}schedule();}
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;lastTime=0;if(visible)schedule();else if(phase==='playing')complete();});observer.observe(section);
 window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('touchstart',touchStart,{passive:true});window.addEventListener('touchmove',touchMove,{passive:false});window.addEventListener('keydown',key);document.addEventListener('click',navigation);
 window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',preference);host.addEventListener('wallfallback',schedule);
 if(useFilm&&film){
  host.dataset.renderMode='film';film.muted=true;
  film.addEventListener('loadeddata',playFilm);film.addEventListener('canplay',playFilm);film.addEventListener('error',filmFailure);film.addEventListener('ended',complete);
  // canplaythrough is a bandwidth estimate, not a promise of uninterrupted
  // playback. A complete local blob removes network buffering from playback.
  fetch(film.dataset.src!,{signal:download.signal}).then(response=>{if(!response.ok)throw new Error('Intro download failed');return response.blob();}).then(blob=>{
   if(!useFilm||phase==='complete')return;
   filmUrl=URL.createObjectURL(blob);film.src=filmUrl;film.load();
  }).catch(error=>{if(error.name!=='AbortError')filmFailure();});
 }
 section.classList.toggle('motion-enabled',!motion.matches);if(!useFilm||motion.matches||scrollY>innerHeight*.6)phase='complete';resize();update();document.documentElement.classList.remove('intro-boot');
 const earlyWindow=window as Window & {__introEarly?:{requested:boolean;cancelled?:boolean;release:()=>void}};
 const early=earlyWindow.__introEarly;if(early){early.release();delete earlyWindow.__introEarly;if(early.cancelled)complete();else if(early.requested)begin();}
 function dispose(){cancelAnimationFrame(frame);clearTimeout(startTimer);download.abort();if(filmUrl)URL.revokeObjectURL(filmUrl);film?.pause();film?.removeEventListener('loadeddata',playFilm);film?.removeEventListener('canplay',playFilm);film?.removeEventListener('error',filmFailure);film?.removeEventListener('ended',complete);unlock();observer.disconnect();window.removeEventListener('wheel',wheel);window.removeEventListener('touchstart',touchStart);window.removeEventListener('touchmove',touchMove);window.removeEventListener('keydown',key);document.removeEventListener('click',navigation);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',preference);host!.removeEventListener('wallfallback',schedule);}
 if(import.meta.hot)import.meta.hot.dispose(dispose);
 window.addEventListener('pagehide',()=>{unlock();},{once:true});
}
