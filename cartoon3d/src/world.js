// The campus plaza, the chocolate stall and the two "free offer" sets.
import {T,mesh,toon,Box,Ball,Cyl,Cone,canvasTex,rand,person} from './kit.js';
export function truffle(p,x,y,z,s=1){const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(s);p.add(g);
 mesh(g,Cyl(.2,.14,.13,14),'#f2b92f',0,.065,0,{ink:.018});mesh(g,Ball(.17),'#5a2a1c',0,.2,0,{ink:.022});
 for(let i=0;i<3;i++){const r=mesh(g,new T.TorusGeometry(.14-i*.035,.017,6,20),'#f6dfb4',0,.27+i*.035,0,{ink:0});r.rotation.x=1.57+.18}return g}
export function plain(p,x,y,z,s=1){const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(s);p.add(g);
 mesh(g,Cyl(.15,.17,.1,6),'#8a4b2a',0,.05,0,{ink:.018});mesh(g,Cyl(.09,.12,.05,6),'#a3603a',0,.12,0,{ink:.012});return g}
export function sign(p,x,y,z,w,h){const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*h/w);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;
 const g=new T.Group();g.position.set(x,y,z);p.add(g);mesh(g,Box(w+.1,h+.1,.08),'#8a4d2c',0,0,0);
 const f=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,toneMapped:false}));f.position.z=.046;g.add(f);let last='';
 g.write=(lines,bg='#fff4da')=>{const key=lines.join()+bg;if(key===last)return;last=key;const k=c.getContext('2d');k.fillStyle=bg;k.fillRect(0,0,c.width,c.height);k.textAlign='center';k.textBaseline='middle';
  lines.forEach(([txt,size,col],i)=>{k.fillStyle=col;let s=size;k.font='900 '+s+'px Mont';while(k.measureText(txt).width>480){s-=4;k.font='900 '+s+'px Mont'}k.fillText(txt,256,c.height*(i+.5)/lines.length+4)});tex.needsUpdate=true};return g}
function cobbles(){const t=canvasTex(512,512,g=>{g.fillStyle='#c9ab86';g.fillRect(0,0,512,512);for(let r=0;r<8;r++)for(let i=-1;i<8;i++){const x=i*73+(r%2)*36,y=r*64;g.fillStyle=['#efd9b4','#e6cca6','#f4e2c0','#e0c49e'][(rand(r*9+((i+8)%7))*4)|0];g.beginPath();g.roundRect(x+3,y+3,68,59,13);g.fill()}});t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(22,22);return t}
function facade(color,cols,rows){return canvasTex(512,640,g=>{g.fillStyle=color;g.fillRect(0,0,512,640);g.fillStyle='rgba(60,20,30,.12)';for(let y=0;y<640;y+=22)g.fillRect(0,y,512,3);
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const w=512/cols,h=640/rows,x=c*w+w*.22,y=r*h+h*.2;g.fillStyle='#fff6e2';g.fillRect(x-8,y-8,w*.56+16,h*.6+16);g.fillStyle='#5d93c4';g.fillRect(x,y,w*.56,h*.6);g.fillStyle='#a9d4ee';g.beginPath();g.moveTo(x,y);g.lineTo(x+w*.4,y);g.lineTo(x,y+h*.38);g.fill();g.fillStyle='#fff6e2';g.fillRect(x+w*.28-4,y,8,h*.6);g.fillRect(x,y+h*.3-4,w*.56,8)}})}
export function building(p,x,z,w,h,color,roof,ry=0){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=ry;p.add(g);
 const tex=facade(color,Math.max(2,Math.round(w/1.7)),Math.max(2,Math.round(h/2)));
 mesh(g,Box(w,h,3),color,0,h/2,-.0,{ink:.07,cast:false});const f=new T.Mesh(new T.PlaneGeometry(w-.04,h-.04),toon('#ffffff',tex));f.position.set(0,h/2,1.53);g.add(f);
 const r=mesh(g,Cyl(1,1,w+.3,3),roof,0,h+.55,0,{ink:.06,cast:false});r.rotation.z=Math.PI/2;r.rotation.x=-Math.PI/2;r.scale.set(1.15,1,1.9);
 for(const s of [-.28,.25])mesh(g,Box(.45,1.1,.45),'#b5654c',s*w,h+1.35,-.3,{cast:false})}
export function tree(p,x,z,s=1){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);p.add(g);mesh(g,Cyl(.16,.24,1.8),'#8a5a3a',0,.9,0);
 for(const [a,b,c,r] of [[0,2.7,0,1.05],[-.75,2.25,.2,.72],[.78,2.3,.1,.75],[.15,3.45,-.1,.7]])mesh(g,Ball(r),'#4fbf4a',a,b,c,{ink:.05})}
export function cloud(p,x,y,z,s){const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(s);p.add(g);const m=new T.MeshBasicMaterial({color:'#ffffff',fog:false});
 for(const [a,b,r] of [[0,0,1],[1.1,-.2,.75],[-1.1,-.25,.7],[.4,.45,.75],[2,-.45,.45]]){const o=new T.Mesh(Ball(r),m);o.position.set(a,b,0);o.scale.z=.4;g.add(o)}return g}

export function buildWorld(scene){
 const W={};
 const ground=new T.Mesh(new T.PlaneGeometry(260,260),toon('#ffffff',cobbles()));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
 const plaza=new T.Group();scene.add(plaza);W.plaza=plaza;
 // backdrop on every side, so low, side and high angles all have a world behind them
 const cols=['#e78a63','#f2c46a','#c9786f','#8fb4c9','#e9a57c','#b98bb8'],roofs=['#b8433a','#5b6b8c','#a9503c','#6a4a6e'];
 for(let i=0;i<9;i++)building(plaza,-28+i*7,-17-(i%2)*1.2,6.5,6.5+rand(i)*4,cols[i%6],roofs[i%4]);
 for(const s of [-1,1])for(let i=0;i<6;i++)building(plaza,s*(19+(i%2)),-10+i*7,6.6,6+rand(i*3+s)*3.5,cols[(i+(s>0?3:1))%6],roofs[(i+1)%4],-s*Math.PI/2);
 for(let i=0;i<7;i++)building(plaza,-21+i*7,36,6.5,6+rand(i+20)*3,cols[(i+2)%6],roofs[(i+2)%4],Math.PI);
 for(const [x,z,s] of [[-8,-10,1.25],[8.5,-11,1.1],[-12,-2,1],[12,0,1.2],[-13,9,1.1],[13,11,1],[-3,-12,.8],[4,-12.5,.9],[-11,19,1.2],[11,20,1]])tree(plaza,x,z,s);
 // bunting
 for(const z of [-3.2,13]){const bunt=new T.Group();plaza.add(bunt);if(z<0)W.stallBunting=bunt;const pts=[];for(let i=0;i<=30;i++){const u=i/30;pts.push(new T.Vector3(-9+18*u,6.6-Math.sin(u*Math.PI)*1.2,z))}
  mesh(bunt,new T.TubeGeometry(new T.CatmullRomCurve3(pts),60,.03,5),'#2a1c30',0,0,0,{ink:0});
  for(let i=1;i<30;i+=2){const f=mesh(bunt,Cone(.28,.62,3),['#ef4e45','#ffc93c','#3aa0e0','#6ac24a'][(i>>1)%4],pts[i].x,pts[i].y-.34,z,{ink:.02});f.rotation.x=Math.PI;f.scale.z=.2}
  for(const s of [-1,1])mesh(bunt,Cyl(.09,.12,6.7),'#3b2c46',s*9,3.35,z)}
 // the stall
 const stall=new T.Group();plaza.add(stall);W.stall=stall;
 mesh(stall,Box(6.4,1.35,1.5),'#c9713f',0,.675,0,{recv:true});mesh(stall,Box(6.75,.17,1.78),'#f0b46a',0,1.43,0,{recv:true});
 for(let i=0;i<9;i++)mesh(stall,Box(.06,1.2,.04),'#8f4a2a',-2.8+i*.7,.65,.77,{ink:0});
 for(const s of [-1,1])mesh(stall,Cyl(.08,.08,4.8),'#7a4326',s*3.1,2.4,-.75);
 for(let i=0;i<10;i++){const x=-3.15+i*.7,c=i%2?'#fff4dc':'#e8463f';const a=mesh(stall,Box(.68,.1,1.9),c,x,4.82,-.35,{ink:.025});a.rotation.x=.22;const d=mesh(stall,Cyl(.35,.35,.09,20),c,x,4.55,.6,{ink:.025});d.rotation.x=Math.PI/2}
 W.title=sign(stall,0,5.55,-.5,4.4,.82);W.title.write([['CHOCOLATE',92,'#6b2f1d']]);
 for(const [s,fn] of [[-1,truffle],[1,plain]]){mesh(stall,Box(1.9,.1,1.0),'#fff4dc',s*1.75,1.57,.12);for(let r=0;r<3;r++)for(let i=0;i<5-r;i++)fn(stall,s*1.75-.68+i*.34+r*.17,1.62+r*.24,.3-r*.2,1)}
 W.signL=sign(stall,-1.75,.78,.9,1.75,1.0);W.signR=sign(stall,1.75,.78,.9,1.75,1.0);
 W.clouds=[[-16,15,-34,1.7],[9,19,-38,2.1],[22,13,-30,1.3],[-30,18,-20,1.6]].map(c=>cloud(plaza,...c));
 // set: home delivery (far to the right)
 const D=new T.Group();D.position.set(60,0,0);scene.add(D);W.delivery=D;
 building(D,0,-7,9,8,'#f2c46a','#b8433a');for(const s of [-1,1]){building(D,s*9,-8,7,6.5,s<0?'#8fb4c9':'#c9786f','#5b6b8c');tree(D,s*4.6,-3.5,1)}
 W.door=mesh(D,Box(1.9,3.5,.12),'#7a4326',-1.4,1.75,-5.4);
 W.parcel=new T.Group();D.add(W.parcel);mesh(W.parcel,Box(1.35,1.05,1.1),'#d9a05f',0,.53,0);mesh(W.parcel,Box(.22,1.08,1.13),'#e8463f',0,.53,0,{ink:0});
 W.dsign=sign(D,0,4.55,-3.2,3.9,1.35);
 W.basket=new T.Group();W.basket.position.set(2.05,0,.2);D.add(W.basket);
 mesh(W.basket,Box(1.7,.8,1.15),'#4a8fd0',0,1.05,0);for(const x of [-.65,.65])for(const z of [-.4,.4]){const w=mesh(W.basket,Cyl(.2,.2,.14),'#2a1c30',x,.22,z);w.rotation.x=1.5708;mesh(W.basket,Cyl(.04,.04,.45),'#2a1c30',x,.5,z,{ink:0})}
 W.goods=[];for(let i=0;i<16;i++){const m=mesh(W.basket,i%3?Box(.45,.45,.45):Ball(.27),['#ef4e45','#ffc93c','#6ac24a','#b061c9','#ff8f3c'][i%5],-.55+(i%4)*.37,1.6+(i/4|0)*.4,(rand(i)-.5)*.6);m.rotation.y=rand(i+7);W.goods.push(m)}
 W.shopper=person(D,{shirt:'#2f9e8f',style:1,hair:'#3d1f38',skin:1,seed:2});
 // set: buy two, get a gift
 const G=new T.Group();G.position.set(-60,0,0);scene.add(G);W.gift=G;
 for(let i=0;i<5;i++)building(G,-14+i*7,-9,6.5,7+rand(i+9)*2,['#c9786f','#8fb4c9','#f2c46a','#b98bb8','#e9a57c'][i],'#a9503c');
 mesh(G,Box(6.2,1.3,1.7),'#6f8fd6',0,.65,0,{recv:true});mesh(G,Box(6.5,.16,1.95),'#cfe0ff',0,1.38,0,{recv:true});
 W.boxes=[-1.9,-.35,1.75].map((x,i)=>{const b=new T.Group();b.position.set(x,1.47,0);G.add(b);const c=i<2?'#ffb43c':'#e8467a';mesh(b,Box(1.15,1.0,.9),c,0,.5,0);mesh(b,Box(.18,1.03,.93),'#fff4dc',0,.5,0,{ink:0});mesh(b,Box(1.18,.18,.93),'#fff4dc',0,.62,0,{ink:0});for(const s of [-1,1]){const r=mesh(b,new T.TorusGeometry(.2,.065,10,22),'#fff4dc',s*.2,1.16,0,{ink:.018});r.rotation.z=s*.6}return b});
 W.gsign=sign(G,0,4.5,-.6,4.2,1.35);
 W.buyer=person(G,{shirt:'#e4553f',style:3,hair:'#2c5fb3',skin:2,seed:5});
 // set: the giant zero
 const Z=new T.Group();Z.position.set(0,0,80);scene.add(Z);W.zeroSet=Z;
 W.zero=new T.Group();W.zero.position.set(0,4.5,-1.5);Z.add(W.zero);const ring=mesh(W.zero,new T.TorusGeometry(1.75,.52,24,60),'#ffc52e',0,0,0,{ink:.09});ring.scale.set(.92,1.22,1);
 for(let i=0;i<7;i++)building(Z,-21+i*7,-14,6.5,6+rand(i+33)*3,['#8fb4c9','#f2c46a','#c9786f','#e9a57c'][i%4],'#6a4a6e');
 tree(Z,-6.5,-6,1.2);tree(Z,6.8,-7,1.1);
 W.confetti=[];for(let i=0;i<90;i++){const c=new T.Mesh(new T.PlaneGeometry(.16,.28),new T.MeshBasicMaterial({color:['#ef4e45','#ffc93c','#3aa0e0','#6ac24a','#b061c9'][i%5],side:T.DoubleSide}));Z.add(c);W.confetti.push(c)}
 return W}
