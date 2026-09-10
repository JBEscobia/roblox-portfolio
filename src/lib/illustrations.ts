// Original site illustrations. These geometries are explanatory models, never gameplay.
export const palette = { gravity:'#3869ed', time:'#9e8be8', ants:'#f18345', anipal:'#48b391' };
export function brick(x:number,y:number,w:number,d:number,h:number,color:string,studs=true):string {
  const px=(a:number,b:number)=> x+(a-b)*.866, py=(a:number,b:number)=>y+(a+b)*.5;
  const top=`${px(0,0)},${py(0,0)-h} ${px(w,0)},${py(w,0)-h} ${px(w,d)},${py(w,d)-h} ${px(0,d)},${py(0,d)-h}`;
  let s=`<g><polygon points="${px(0,d)},${py(0,d)-h} ${px(w,d)},${py(w,d)-h} ${px(w,d)},${py(w,d)} ${px(0,d)},${py(0,d)}" fill="${color}"/><polygon points="${px(w,0)},${py(w,0)-h} ${px(w,d)},${py(w,d)-h} ${px(w,d)},${py(w,d)} ${px(w,0)},${py(w,0)}" fill="${color}"/><polygon points="${px(w,0)},${py(w,0)-h} ${px(w,d)},${py(w,d)-h} ${px(w,d)},${py(w,d)} ${px(w,0)},${py(w,0)}" fill="#142844" opacity=".22"/><polygon points="${top}" fill="${color}" stroke="#fff" stroke-opacity=".3" stroke-width="1"/><polygon points="${top}" fill="#fff" opacity=".15"/>`;
  if(studs) for(let a=13;a<w;a+=26)for(let b=13;b<d;b+=26){const cx=px(a,b),cy=py(a,b)-h; s+=`<path d="M${cx-8} ${cy-4}v5a8 4 0 0 0 16 0v-5" fill="${color}" stroke="#142844" stroke-opacity=".15"/><ellipse cx="${cx}" cy="${cy-4}" rx="8" ry="4" fill="${color}" stroke="#fff" stroke-opacity=".4"/><ellipse cx="${cx}" cy="${cy-4}" rx="8" ry="4" fill="#fff" opacity=".18"/>`;}
  return s+'</g>';
}
export function motif(kind:string):string {
  let s=''; const c=palette[kind as keyof typeof palette];
  s+=`<ellipse cx="260" cy="291" rx="163" ry="35" fill="#203448" opacity=".09"/>`;
  s+='<g class="model-base">'+brick(247,226,190,160,17,'#d3dfd8')+'</g>';
  if(kind==='gravity') {
    s+='<g class="model-layer layer-bottom">'+brick(230,200,120,78,21,c)+brick(240,144,52,52,70,c)+'</g>';
    s+='<g class="model-layer layer-middle">'+brick(250,139,52,52,66,c)+'</g>';
    s+='<g class="model-layer layer-top">'+brick(250,82,130,52,23,c)+brick(289,82,26,26,28,'#f8c646')+'</g>';
    s+='<path class="model-lines" d="M205 227L249 202L250 128L284 109" fill="none" stroke="#f8c646" stroke-width="4" stroke-dasharray="6 6"/>';
  } else if(kind==='time') {
    for(let i=0;i<4;i++)s+=`<g class="model-layer layer-${i===0?'bottom':i===3?'top':'middle'}">`+brick(146+i*65,204-i*17,52,52,18+i*12,i===3?'#6854be':c)+`<g opacity="${.18+i*.25}">`+brick(150+i*65,181-i*29,26,26,29,'#f8c646')+'</g></g>';
    s+='<path class="model-lines" d="M141 172Q185 87 208 142Q255 58 274 113Q317 40 338 84" fill="none" stroke="#6953be" stroke-width="3" stroke-dasharray="7 6"/>';
  } else if(kind==='ants') {
    s+='<g class="model-layer layer-top">'+brick(250,169,78,52,46,'#f8c646')+'</g>';
    s+='<g class="model-layer layer-middle"><path d="M182 225Q215 220 256 160M330 238Q323 185 283 164" fill="none" stroke="#34404f" stroke-width="3"/>'+brick(181,238,52,26,25,c)+brick(330,242,52,26,25,c)+'</g>';
    s+='<g class="model-layer layer-bottom" fill="none" stroke="#374455" stroke-width="3"><path d="M170 228l-17 4-9 14m32-11-10 15m23-4-1 15m154-25 20 6 5 12m-27-9 12 17m-28-12 3 19"/></g>';
  } else {
    s+='<g class="model-layer layer-bottom">'+brick(245,219,156,130,26,c)+brick(226,229,78,52,7,'#f3d286')+'</g>';
    s+='<g class="model-layer layer-middle">'+brick(255,167,52,52,50,'#f6eee0')+brick(255,117,78,65,19,'#ed7957')+brick(163,170,26,26,38,'#b28357')+brick(163,132,52,52,34,'#35856c')+brick(338,212,26,26,28,'#b28357')+brick(338,184,52,52,31,'#35856c')+'</g>';
    s+='<g class="model-layer layer-top">'+brick(191,223,21,21,27,'#f8c646')+brick(239,249,21,21,27,'#ee805b')+brick(297,214,21,21,27,'#597fe9')+'</g>';
  }
  return s;
}
export function workshop():string {
  let s='<ellipse cx="365" cy="471" rx="248" ry="47" fill="#326878" opacity=".1"/>';
  s+=brick(350,352,285,245,32,'#528eb0')+brick(350,325,285,245,18,'#d2e5db');
  s+=`<g transform="translate(13 120) scale(.7)">${motif('gravity')}</g><g transform="translate(245 92) scale(.63)">${motif('time')}</g><g transform="translate(104 256) scale(.63)">${motif('ants')}</g><g transform="translate(320 222) scale(.73)">${motif('anipal')}</g>`;
  s+='<g class="fall-piece">'+brick(184,119,78,52,30,'#f8c646')+'</g><g class="fall-piece">'+brick(459,80,52,52,32,'#f18369')+'</g><g class="fall-piece">'+brick(580,225,78,26,24,'#4071e8')+'</g>';
  return s;
}
export function skyWall():string {
 const colors=['#4e78d6','#e4ad40','#b06f4a','#779c5c','#cf7854','#93afb1','#b99cca'];
 let s='';
 for(let row=0;row<5;row++)for(let col=0;col<14;col++){
  const n=row*14+col,x=col*112-40+(row%2)*-42,y=655+row*48;
  const startX=((n*257+71)%1700)-130,startY=((n*191+33)%1180)-390;
  s+=`<g class="sky-brick" data-x="${x}" data-y="${y}" data-sx="${startX}" data-sy="${startY}" data-delay="${row*.065+(col%4)*.015}" transform="translate(${x} ${y})">${brick(0,0,124,28,43,colors[(n*3+row)%colors.length])}</g>`;
 }
 return s;
}

/* ---------------------------------------------------------------------------
   Sky geometry.

   The wall, the ground horizon and the contact brick are all rectangles, so
   nothing in the sky is allowed to be a smooth circle either. Sun and clouds
   are mosaics of rectangular plates on a fixed module: a round shape is
   approximated by stepping the rows, the way it would actually be built.

   Studs are one <defs> shape reused through <use>. Drawing all 100 of the
   sun's studs inline costs about three times the nodes, and the homepage node
   count is already the thing that made scrolling stall.
--------------------------------------------------------------------------- */
export type Plate={x:number,y:number,w:number,h:number};

export function studDefs(id:string,cap:string,dark:string,r:number):string{
 const n=(v:number)=>Number(v.toFixed(2));
 return `<defs><g id="${id}">`
  +`<circle cy="${n(r*.34)}" r="${n(r)}" fill="${dark}"/>`
  +`<circle r="${n(r)}" fill="${cap}"/>`
  +`<path d="M${n(-r*.66)} ${n(-r*.3)}A${n(r*.8)} ${n(r*.8)} 0 0 1 ${n(r*.18)} ${n(-r*.72)}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="${n(r*.24)}" stroke-linecap="round"/>`
  +`</g></defs>`;
}

/** Lays plates onto the module grid: one flat dark under-layer whose union
    gives the silhouette its edge and its bottom thickness, then each plate's
    face inset by `gap` so the under-layer reads through as a seam. */
export function plateBuild(plates:Plate[],o:{m:number,body:string,dark:string,studId:string,studR:number,lip?:number,gap?:number}):string{
 const {m,body,dark,studId,studR}=o,lip=o.lip??6,gap=o.gap??1;
 const n=(v:number)=>Number(v.toFixed(2));
 let base='',face='',studs='';
 for(const p of plates){
  base+=`<rect x="${n(p.x*m)}" y="${n(p.y*m)}" width="${n(p.w*m)}" height="${n(p.h*m+lip)}"/>`;
  face+=`<rect x="${n(p.x*m+gap)}" y="${n(p.y*m+gap)}" width="${n(p.w*m-gap*2)}" height="${n(p.h*m-gap*2)}" rx="${n(Math.min(3.2,m*.16))}"/>`;
  for(let c=0;c<p.w;c++)for(let r=0;r<p.h;r++)studs+=`<use href="#${studId}" x="${n((p.x+c+.5)*m)}" y="${n((p.y+r+.5)*m)}"/>`;
 }
 return `<g fill="${dark}">${base}</g><g fill="${body}">${face}</g>${studs}`;
}

/* Sun: a 12x12 stepped disc on a 16x16 module grid, split into 2- and 4-wide
   plates with staggered seams so the pieces stay readable, ringed by eight
   detached rays - four 1x2 plates on the cardinals, four 1x1 sparks on the
   diagonals.

   Two things were learned the hard way here. Stepping the row widths evenly
   (4,6,8,10...) chamfers every corner at 45 degrees and the disc reads as a
   diamond; the widths below are the ones a circle of radius 6 actually covers
   on this grid, so the steps are large at the poles and flat at the equator.
   And rays attached to the disc just extend that diamond into a gem - a ray
   has to sit off the body with a clear module of sky around it to read as
   light rather than as more brick. */
const SUN_ROWS:number[][][]=[
 [[6,4]],
 [[4,4],[8,4]],
 [[3,2],[5,4],[9,4]],
 [[3,4],[7,4],[11,2]],
 [[2,4],[6,4],[10,4]],
 [[2,2],[4,4],[8,4],[12,2]],
 [[2,4],[6,4],[10,4]],
 [[2,4],[6,2],[8,4],[12,2]],
 [[3,4],[7,4],[11,2]],
 [[3,2],[5,4],[9,4]],
 [[4,4],[8,4]],
 [[6,4]],
];
const SUN_RAYS:Plate[]=[
 {x:7,y:0,w:2,h:1},{x:7,y:15,w:2,h:1},{x:0,y:7,w:1,h:2},{x:15,y:7,w:1,h:2},
 {x:2,y:2,w:1,h:1},{x:13,y:2,w:1,h:1},{x:2,y:13,w:1,h:1},{x:13,y:13,w:1,h:1},
];
export function sun():string{
 const plates:Plate[]=[...SUN_RAYS];
 SUN_ROWS.forEach((row,i)=>row.forEach(([x,w])=>plates.push({x,y:i+2,w,h:1})));
 return `<defs><radialGradient id="sun-glow"><stop offset=".38" stop-color="#ffd97a" stop-opacity=".46"/><stop offset="1" stop-color="#ffd97a" stop-opacity="0"/></radialGradient></defs>`
  +studDefs('sun-stud','#f9cb60','#cf9522',6.2)
  +`<circle cx="160" cy="160" r="159" fill="url(#sun-glow)"/>`
  +plateBuild(plates,{m:20,body:'#f2b93c',dark:'#c78a1f',studId:'sun-stud',studR:6.2,lip:6,gap:1});
}

/* Clouds: a wide flat base with bumps of unequal width sitting off-centre.
   Symmetrical bumps on a stepped stack read as a ziggurat, not weather, so
   every variant is deliberately lopsided. All three share a 12x4 grid - the
   flatter ones simply leave the top row empty - so one viewBox fits all. */
const CLOUD_SHAPES:number[][][][]=[
 [[[3,3]],[[2,5],[7,3]],[[1,5],[6,5]],[[0,6],[6,6]]],
 [[],[[2,4],[6,2]],[[1,5],[6,4]],[[0,6],[6,6]]],
 [[],[[4,3]],[[2,4],[6,3]],[[1,5],[6,5]]],
];
export function cloud(variant=0):string{
 const shape=CLOUD_SHAPES[variant%CLOUD_SHAPES.length]!;
 const plates:Plate[]=[];
 shape.forEach((row,i)=>row.forEach(([x,w])=>plates.push({x,y:i,w,h:1})));
 return studDefs(`cloud-stud-${variant}`,'#fff','#bcd8e4',5.4)
  +plateBuild(plates,{m:18,body:'#f4fbfd',dark:'#b3d3e0',studId:`cloud-stud-${variant}`,studR:5.4,lip:6,gap:1});
}
