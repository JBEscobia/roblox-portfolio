const section=document.querySelector<HTMLElement>('.descent');
const host=document.querySelector<HTMLElement>('[data-workshop]');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const mobile=matchMedia('(max-width:760px)');
const connection=(navigator as Navigator & {connection?:{saveData?:boolean}}).connection;
if(section&&host){
 type Phase='idle'|'playing'|'complete';
 let frame=0,visible=true,phase:Phase='idle',elapsed=0,lastTime=0,touchY=0,inputBound=false;
 let gateOpen=false,gateStart=0,gateMin=0,gateCap=0,filmReady=false,stillReady=false,fontsReady=false,pageReady=false;
 const GATE_MIN=1200,GATE_MAX=4000;
 const copy=section.querySelector<HTMLElement>('.hero-copy')!;
 const film=host.querySelector<HTMLVideoElement>('.intro-film');
 const still=host.querySelector<HTMLImageElement>('.intro-film-finished');
 const loading=section.querySelector<HTMLElement>('.intro-load-status');
 const ground=section.querySelector<SVGElement>('.ground-horizon');
 const cue=section.querySelector<HTMLElement>('.descent-cue');
 const clouds=Array.from(section.querySelectorAll<SVGElement>('.cloud'));
 const download=new AbortController();
 let filmUrl='',startTimer=0,lastMediaTime=-1,lastMediaAdvance=0,playPending=false;
 // A decoder hiccup mid-film is not a failure: give it time to recover before falling back.
 const startWait=1500,stallWait=1200;
 let useFilm=!!film&&!motion.matches&&!mobile.matches&&!connection?.saveData&&!!film.canPlayType('video/webm; codecs="vp9"');
 const clamp=(x:number)=>Math.min(1,Math.max(0,x));
 function unlock(){document.documentElement.classList.remove('intro-playing');}
 function complete(){phase='complete';elapsed=2400;clearTimeout(startTimer);download.abort();film?.pause();unlock();closeGate();releaseInput();schedule();}
 function eligible(){if(phase!=='idle'||gateOpen||motion.matches)return false;const bounds=section!.getBoundingClientRect();return bounds.top<innerHeight*.4&&bounds.bottom>innerHeight*.65;}
 function playFilm(){
  if(!useFilm||!film||!filmUrl||phase!=='playing'||film.readyState<2||playPending)return;
  playPending=true;
  film.play().then(()=>{playPending=false;clearTimeout(startTimer);lastMediaAdvance=performance.now();}).catch(()=>{playPending=false;filmFailure();});
 }
 function filmFailure(){
  if(!useFilm)return;
  useFilm=false;clearTimeout(startTimer);download.abort();film?.pause();
  // Keep the exact film artwork on failure, never switch to the older angled
  // SVG wall. Its existing final-frame image is the static fallback, faded in
  // over the stalled frame rather than cut to.
  if(still&&phase==='playing'&&!motion.matches){still.style.display='block';still.style.zIndex='1';still.animate([{opacity:0},{opacity:1}],{duration:550,easing:'ease-out'}).finished.then(()=>{still.style.display='';still.style.zIndex='';host!.removeAttribute('data-render-mode');},()=>host!.removeAttribute('data-render-mode'));}
  else host!.removeAttribute('data-render-mode');
  complete();
 }
 function begin(){
  if(phase!=='idle')return;
  phase='playing';elapsed=0;lastTime=0;lastMediaAdvance=performance.now();
  copy.classList.add('copy-animates');
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
  // The headline is up from the first paint; the film assembles behind it.
  const revealed=true;
  if(copy.classList.contains('is-revealed')!==revealed)copy.classList.toggle('is-revealed',revealed);
  if(ground)ground.style.transform=`translateY(${(1-clamp((p-.3)/.4))*180}px)`;
  if(cue)cue.style.opacity=gateOpen||phase!=='idle'?'0':'1';
  clouds.forEach((cloud,i)=>cloud.style.transform=i===2?`translateY(${-80*p}px)`:`translateX(${[-60,80,0,-40][i]*p}px)`);
  const inert=!reduced&&!revealed;if(copy.inert!==inert)copy.inert=inert;
  host!.dispatchEvent(new CustomEvent('descentprogress',{detail:p}));
  if(!reduced&&phase==='playing')frame=requestAnimationFrame(update);
 }
 function schedule(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(update);}
 // The intro plays by itself and the page stays put until it ends. Escape and the
 // "Skip introduction" link still end it early.
 function holding(){return phase==='playing'||gateOpen;}
 function wheel(event:WheelEvent){if(event.ctrlKey||motion.matches)return;if(holding())event.preventDefault();}
 function touchStart(event:TouchEvent){touchY=event.touches[0]?.clientY||0;}
 function touchMove(event:TouchEvent){if(motion.matches||event.touches.length!==1)return;if(holding())event.preventDefault();}
 function key(event:KeyboardEvent){if(event.key==='Escape'){if(gateOpen){closeGate();complete();return;}if(phase==='playing'){complete();return;}}if((event.target as HTMLElement).closest('input,textarea,select,button,a'))return;const down=['ArrowDown','PageDown',' ','End'].includes(event.key);const navigation=['ArrowUp','PageUp','Home',...['ArrowDown','PageDown',' ','End']].includes(event.key);if((navigation||down)&&holding())event.preventDefault();}
 function navigation(event:MouseEvent){if((event.target as HTMLElement).closest('a[href]'))complete();}
 function resize(){section!.style.setProperty('--header-height',`${document.querySelector('.site-header')?.getBoundingClientRect().height||98}px`);schedule();}
 function visibility(){lastTime=0;lastMediaAdvance=performance.now();if(document.hidden){clearTimeout(startTimer);film?.pause();}else if(useFilm&&phase==='playing'){startTimer=window.setTimeout(filmFailure,startWait);playFilm();}schedule();}
 function preference(){section!.classList.toggle('motion-enabled',!motion.matches);if(motion.matches){complete();copy.inert=false;}schedule();}
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;lastTime=0;if(visible)schedule();else if(phase==='playing')complete();});observer.observe(section);
 // The entrance waits for the film, its final still and the fonts before it can
 // be started at all, so the assembly never begins against a cold cache. A
 // minimum keeps it from flashing; a cap keeps a slow connection from stranding
 // anyone. The film then plays by itself behind the already-visible headline.
 function openGate(){gateOpen=true;gateStart=performance.now();document.documentElement.classList.add('intro-gating');gateCap=window.setTimeout(closeGate,GATE_MAX);}
 function closeGate(){if(!gateOpen)return;gateOpen=false;clearTimeout(gateCap);clearTimeout(gateMin);document.documentElement.classList.remove('intro-gating');if(phase==='idle'){if(eligible())begin();else complete();}else schedule();}
 function checkGate(){if(!gateOpen||!filmReady||!stillReady||!fontsReady||!pageReady)return;clearTimeout(gateMin);gateMin=window.setTimeout(closeGate,Math.max(0,GATE_MIN-(performance.now()-gateStart)));}
 function markFilm(){if(filmReady)return;filmReady=true;checkGate();}
 function markStill(){if(stillReady)return;stillReady=true;checkGate();}
 function markFonts(){if(fontsReady)return;fontsReady=true;checkGate();}
 // Wait for the rest of the page too, so the film is not decoding while images and posters still load.
 function markPage(){if(pageReady)return;pageReady=true;checkGate();}
 // The gesture listeners are non-passive so they can hold the page during the intro.
 // Once it is over they are released rather than left on every wheel tick.
 function releaseInput(){if(!inputBound)return;inputBound=false;window.removeEventListener('wheel',wheel);window.removeEventListener('touchstart',touchStart);window.removeEventListener('touchmove',touchMove);window.removeEventListener('keydown',key);document.removeEventListener('click',navigation);}
 window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('touchstart',touchStart,{passive:true});window.addEventListener('touchmove',touchMove,{passive:false});window.addEventListener('keydown',key);document.addEventListener('click',navigation);inputBound=true;
 window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',preference);host.addEventListener('wallfallback',schedule);
 if(useFilm&&film){
  host.dataset.renderMode='film';film.muted=true;
  film.addEventListener('loadeddata',playFilm);film.addEventListener('canplay',playFilm);
  film.addEventListener('canplay',markFilm);film.addEventListener('canplaythrough',markFilm);film.addEventListener('loadeddata',markFilm);film.addEventListener('error',filmFailure);film.addEventListener('ended',complete);
  // canplaythrough is a bandwidth estimate, not a promise of uninterrupted
  // playback. A complete local blob removes network buffering from playback.
  fetch(film.dataset.src!,{signal:download.signal}).then(response=>{if(!response.ok)throw new Error('Intro download failed');return response.blob();}).then(blob=>{
   if(!useFilm||phase==='complete')return;
   filmUrl=URL.createObjectURL(blob);film.src=filmUrl;film.load();
  }).catch(error=>{if(error.name!=='AbortError')filmFailure();});
 }
 section.classList.toggle('motion-enabled',!motion.matches);if(!useFilm||motion.matches||scrollY>innerHeight*.6){phase='complete';releaseInput();}else{openGate();
 // Decoding the final still up front removes the hitch that used to land
 // exactly on the handover, when a display:none 2700x900 image was shown.
 if(still)still.decode().then(markStill,markStill);else markStill();
 if(document.fonts)document.fonts.ready.then(markFonts);else markFonts();
 if(document.readyState==='complete')markPage();else window.addEventListener('load',markPage,{once:true});
 }resize();update();document.documentElement.classList.remove('intro-boot');
 const earlyWindow=window as Window & {__introEarly?:{requested:boolean;cancelled?:boolean;release:()=>void}};
 const early=earlyWindow.__introEarly;if(early){early.release();delete earlyWindow.__introEarly;if(early.cancelled){closeGate();complete();}}
 function dispose(){cancelAnimationFrame(frame);clearTimeout(startTimer);clearTimeout(gateCap);clearTimeout(gateMin);document.documentElement.classList.remove('intro-gating');download.abort();if(filmUrl)URL.revokeObjectURL(filmUrl);film?.pause();film?.removeEventListener('loadeddata',playFilm);film?.removeEventListener('canplay',playFilm);film?.removeEventListener('error',filmFailure);film?.removeEventListener('ended',complete);unlock();observer.disconnect();releaseInput();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',preference);host!.removeEventListener('wallfallback',schedule);}
 if(import.meta.hot)import.meta.hot.dispose(dispose);
 window.addEventListener('pagehide',()=>{unlock();},{once:true});
}
