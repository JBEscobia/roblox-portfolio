import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

/** The original wall geometry, materials, lighting, camera, and assembly path. */
export async function createWallScene(canvas:OffscreenCanvas,width:number,height:number,dpr:number,capture=false){
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:capture});
 renderer.setPixelRatio(Math.min(dpr,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 const scene=new THREE.Scene();const camera=new THREE.OrthographicCamera(-12,12,6.7,-6.7,.1,100);
 camera.position.set(1,4,24);camera.lookAt(0,0,0);
 scene.add(new THREE.HemisphereLight('#effaff','#71634d',2.7));
 const sun=new THREE.DirectionalLight('#fff0d2',3.1);sun.position.set(-6,10,8);scene.add(sun);
 const fill=new THREE.DirectionalLight('#adcbf5',.8);fill.position.set(10,3,-5);scene.add(fill);
 const colors=['#3d70d0','#e4b638','#bf7550','#6c9956','#d98154','#89afb2','#9d83bc','#c6b593'];
 const material=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.38});
 const parts:THREE.BufferGeometry[]=[];const body=new RoundedBoxGeometry(1.95,.52,.9,2,.06);
 parts.push(body.index?body.toNonIndexed():body.clone());body.dispose();
 for(let x=-.73;x<1;x+=.49)for(let z=-.23;z<.4;z+=.46){const stud=new THREE.CylinderGeometry(.15,.16,.12,14).toNonIndexed();stud.translate(x,.3,z);parts.push(stud);}
 const geometry=mergeGeometries(parts);parts.forEach(p=>p.dispose());
 const instances=new THREE.InstancedMesh(geometry,material,96);instances.frustumCulled=false;instances.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(instances);
 const transform=new THREE.Object3D();
 const bricks:{index:number;start:THREE.Vector3;end:THREE.Vector3;rotation:THREE.Vector3;delay:number}[]=[];
 for(let row=0;row<6;row++)for(let col=0;col<16;col++){
  const n=row*16+col,end=new THREE.Vector3(col*1.96-14.8+(row%2)*-.98,-5.7+row*.57,0);
  const start=new THREE.Vector3(end.x+Math.sin(n*2.7)*3,end.y+7.5+(n*7%9)*.72,(n%4)*.7);
  instances.setColorAt(n,new THREE.Color(colors[(n*3+row)%colors.length]));
  bricks.push({index:n,start,end,rotation:new THREE.Vector3(Math.sin(n)*.7,Math.cos(n*1.7)*.7,Math.sin(n*2.1)*.9),delay:row*.047+(col%5)*.012});
 }
 function resize(w:number,h:number,pixelRatio?:number){if(pixelRatio!==undefined)renderer.setPixelRatio(pixelRatio);camera.left=-6.7*w/h;camera.right=6.7*w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
 function render(progress:number){
  bricks.forEach(({index,start,end,rotation,delay})=>{const t=Math.max(0,Math.min(1,(progress-delay)/(.74-delay)));const fall=t*t,align=t*t*(3-2*t);transform.position.set(start.x+(end.x-start.x)*align,start.y+(end.y-start.y)*fall,start.z+(end.z-start.z)*align);transform.rotation.set(rotation.x*(1-align),rotation.y*(1-align),rotation.z*(1-align));transform.updateMatrix();instances.setMatrixAt(index,transform.matrix);});
  instances.instanceMatrix.needsUpdate=true;
  renderer.render(scene,camera);return {calls:renderer.info.render.calls,triangles:renderer.info.render.triangles};
 }
 function dispose(){instances.dispose();geometry.dispose();material.dispose();renderer.dispose();}
 resize(width,height);await renderer.compileAsync(scene,camera);
 return {resize,render,dispose};
}
