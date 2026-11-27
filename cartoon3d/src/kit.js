// Cartoon-3D toolkit: toon shading, ink outlines, flat 2D faces on 3D heads.
import * as T from 'three';
export {T};
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const lerp=(a,b,x)=>a+(b-a)*x;
export const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
export const back=x=>{x=clamp(x);return 1+2.4*(x-1)**3+1.4*(x-1)**2};
export const rand=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
const grad=new T.DataTexture(new Uint8Array([140,140,140,255, 205,205,205,255, 255,255,255,255, 255,255,255,255]),4,1);
grad.minFilter=grad.magFilter=T.NearestFilter;grad.needsUpdate=true;
const mats=new Map();
export function toon(color,map){if(map)return new T.MeshToonMaterial({color,map,gradientMap:grad});if(!mats.has(color))mats.set(color,new T.MeshToonMaterial({color,gradientMap:grad}));return mats.get(color)}
const inks=new Map();
function ink(w){if(!inks.has(w)){const m=new T.MeshBasicMaterial({color:0x1a0f1f,side:T.BackSide});
 m.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n transformed += normalize(normal)*'+w.toFixed(4)+';')};m.customProgramCacheKey=()=>'ink'+w;inks.set(w,m)}return inks.get(w)}
const boxInk=new T.MeshBasicMaterial({color:0x1a0f1f,side:T.BackSide});
export function mesh(parent,geo,color,x=0,y=0,z=0,o={}){
 const m=new T.Mesh(geo,o.mat||toon(color,o.map));m.position.set(x,y,z);m.castShadow=o.cast??true;m.receiveShadow=o.recv??false;parent.add(m);
 const w=o.ink??.035;
 if(w){if(geo.type==='BoxGeometry'){const p=geo.parameters,e=new T.Mesh(geo,boxInk);e.scale.set((p.width+w*2)/p.width,(p.height+w*2)/p.height,(p.depth+w*2)/p.depth);m.add(e)}else m.add(new T.Mesh(geo,ink(w)))}
 return m}
const gc=new Map();const cached=(k,f)=>{if(!gc.has(k))gc.set(k,f());return gc.get(k)};
export const Box=(w,h,d)=>cached('b'+[w,h,d],()=>new T.BoxGeometry(w,h,d));
export const Ball=r=>cached('s'+r,()=>new T.SphereGeometry(r,32,22));
export const Cyl=(a,b,h,s=20)=>cached('c'+[a,b,h,s],()=>new T.CylinderGeometry(a,b,h,s));
export const Cone=(r,h,s=20)=>cached('n'+[r,h,s],()=>new T.ConeGeometry(r,h,s));
export function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t}

// ---- faces ----
const faces=new Map();
function faceTex(mood,open,blink,glasses){const key=[mood,open,blink,glasses].join();if(faces.has(key))return faces.get(key);
 const t=canvasTex(512,512,g=>{const INK='#1a0f1f';g.lineCap='round';g.lineJoin='round';g.strokeStyle=INK;g.fillStyle=INK;
  const line=(pts,w=15)=>{g.lineWidth=w;g.beginPath();g.moveTo(pts[0],pts[1]);if(pts.length===6)g.quadraticCurveTo(pts[2],pts[3],pts[4],pts[5]);else g.lineTo(pts[2],pts[3]);g.stroke()};
  const ell=(x,y,a,b,c)=>{g.fillStyle=c;g.beginPath();g.ellipse(x,y,a,b,0,0,7);g.fill()};
  for(const s of [-1,1]){const x=256+s*78,y=232;
   if(mood==='joy'||(mood==='happy'&&blink))line([x-34,y+10,x,y-34,x+34,y+10],17);
   else if(blink)line([x-32,y,x+32,y],16);
   else if(mood==='shock'){ell(x,y,44,52,INK);ell(x,y,34,42,'#fff');ell(x,y,13,16,INK)}
   else if(mood==='greedy'){ell(x,y,36,45,INK);ell(x-10,y-15,13,15,'#fff');ell(x+12,y+14,7,8,'#fff')}
   else if(mood==='flat'||mood==='smug'){line([x-34,y-4,x+34,y-4],17);ell(x+(mood==='smug'?8:0),y+8,15,17,INK)}
   else{const dx=mood==='think'?15:0,dy=mood==='think'?-12:0;ell(x+dx,y+dy,21,29,INK);ell(x+dx-7,y+dy-9,7,8,'#fff')}
   const B={worry:[-34,-4],shock:[-40,-40],greedy:[-24,-30],flat:[0,0],smug:[10,-14],think:s<0?[6,0]:[-34,-34],sad:[-30,4]}[mood];
   if(B){const base=mood==='shock'?158:166;line([x-s*34,base+B[0]*.7,x+s*36,base+B[1]*.7],15)}
   if(['happy','joy','greedy'].includes(mood))ell(256+s*128,300,30,18,'rgba(240,90,100,.42)')}
  if(glasses){g.lineWidth=11;for(const s of [-1,1]){g.beginPath();g.arc(256+s*78,232,60,0,7);g.stroke()}line([238,222,256,206,274,222],11)}
  const y=345;
  if(open>0||mood==='shock'){const w=mood==='shock'?34:46,h=mood==='shock'?Math.max(46,open*24):14+open*20;
   g.fillStyle='#4a1030';g.strokeStyle=INK;g.lineWidth=12;g.beginPath();
   if(mood==='shock')g.ellipse(256,y+14,w,h*.8,0,0,7);else{g.moveTo(256-w,y-8);g.quadraticCurveTo(256,y-14,256+w,y-8);g.bezierCurveTo(256+w*.8,y+h*1.15,256-w*.8,y+h*1.15,256-w,y-8)}
   g.fill();g.save();g.clip();ell(256,y+h*(mood==='shock'?.85:.78),w*.65,h*.34,'#ef6a7e');g.restore();g.stroke()}
  else if(mood==='happy'||mood==='joy'||mood==='greedy')line([206,y-8,256,y+42,306,y-8]);
  else if(mood==='worry'){g.lineWidth=13;g.beginPath();g.moveTo(206,y+8);for(let i=1;i<=6;i++)g.quadraticCurveTo(206+i*17-8,y+8+(i%2?-17:17),206+i*17,y+8);g.stroke()}
  else if(mood==='sad')line([216,y+22,256,y-12,296,y+22]);
  else if(mood==='smug')line([214,y+8,266,y+24,310,y-14]);
  else if(mood==='think')line([226,y+8,300,y-6]);
  else line([222,y+2,256,y+14,290,y+2])});
 faces.set(key,t);return t}

const faceGeo=new T.SphereGeometry(.585,32,24,Math.PI/2-.95,1.9,Math.PI/2-.95,1.9);
const SKIN=['#f6d3b3','#e9b48c','#c98a5e','#9a6240'];
export function person(parent,o={}){
 const g=new T.Group();parent.add(g);
 const body=new T.Group();g.add(body);
 const shirt=o.shirt||'#e4553f',skin=SKIN[o.skin??0];
 const legs=[-1,1].map(s=>{const p=new T.Group();p.position.set(s*.17,.92,0);g.add(p);mesh(p,Cyl(.048,.048,.9,8),'#241829',0,-.45,0,{ink:.012});mesh(p,Box(.22,.09,.34),'#241829',0,-.88,.07,{ink:.015});return p});
 const torso=mesh(body,Ball(.5),shirt,0,1.38,0);torso.scale.set(.86,1.18,.72);
 mesh(body,Cyl(.17,.2,.14),'#fff6e8',0,1.94,0,{ink:.02});
 if(o.coat){mesh(body,Box(.04,.7,.05),'#9aa6bd',0,1.34,.37,{ink:0});for(let i=0;i<3;i++)mesh(body,Ball(.035),'#344060',.1,1.58-i*.23,.37,{ink:0})}
 else for(let i=0;i<2;i++)mesh(body,Ball(.04),'#fff6e8',0,1.55-i*.24,.37,{ink:.01});
 const arms=[-1,1].map(s=>{const p=new T.Group();p.position.set(s*.37,1.68,0);body.add(p);mesh(p,Cyl(.045,.045,.78,8),'#241829',0,-.39,0,{ink:.012});mesh(p,Ball(.095),skin,0,-.82,0,{ink:.025});return p});
 const head=new T.Group();head.position.set(0,2.47,0);body.add(head);
 mesh(head,Ball(.575),skin,0,0,0,{ink:.04});
 const face=new T.Mesh(faceGeo,new T.MeshBasicMaterial({map:faceTex('calm',0,0,!!o.glasses),transparent:true,toneMapped:false,color:'#ffffff'}));head.add(face);
 const hc=o.hair||'#4a2a22',style=o.style??0;
 const cap=(r,len,y=0,tilt=-.42)=>{const m=mesh(head,new T.SphereGeometry(r,32,16,0,Math.PI*2,0,len),hc,0,y,0,{ink:.03});m.rotation.x=tilt;return m};
 if(style===0)cap(.605,1.15);
 if(style===1){cap(.61,1.28,0,-.55);mesh(head,Ball(.27),hc,0,.52,-.28)}
 if(style===2){cap(.61,1.1,0,-.35);for(const s of [-1,1])mesh(head,Ball(.22),hc,s*.55,-.1,-.1)}
 if(style===3){const m=cap(.62,1.05,.01,-.28);mesh(head,Box(.62,.07,.34),hc,0,.34,.55);mesh(head,Ball(.07),'#fff6e8',0,.62,0)}
 if(style===4){for(let i=0;i<11;i++){const a=i/11*6.283;mesh(head,Ball(.19),hc,Math.cos(a)*.4,.4+Math.sin(i*5)*.04,Math.sin(a)*.4-.12)}mesh(head,Ball(.28),hc,0,.52,-.08)}
 if(o.scale)g.scale.setScalar(o.scale);
 const A={g,body,head,arms,legs,face,glasses:!!o.glasses,seed:o.seed??Math.random()*9};
 // pose: everything is a pure function of the arguments, so any frame can be redrawn.
 A.pose=(t,p={})=>{g.visible=p.show??true;const {mood='calm',open=0,walk=0,armL=null,armR=null,look=0,nod=0,hop=0,lean=0}=p;
  const ph=t*9+A.seed,s=Math.sin(ph)*walk;
  legs[0].rotation.x=s*.55;legs[1].rotation.x=-s*.55;
  body.position.y=Math.abs(Math.cos(ph))*walk*.07+Math.sin(t*2.2+A.seed)*.018+hop;g.position.y=0;legs.forEach(l=>l.position.y=.92+hop);
  body.rotation.x=lean;
  const set=(arm,a,side)=>{if(a){arm.rotation.set(a[0],0,a[1]*side)}else arm.rotation.set(-s*.6*side,0,side*(.2+Math.sin(t*1.7+A.seed)*.025))};
  set(arms[0],armL,-1);set(arms[1],armR,1);
  head.rotation.set(nod,look,Math.sin(t*1.3+A.seed)*.04);
  const blink=((t+A.seed)%3.3)<.12?1:0;face.material.map=faceTex(mood,open,blink,A.glasses)};
 return A}
