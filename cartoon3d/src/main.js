// Shot list, staging, captions. Every frame is computed from audio time alone.
import {T,clamp,lerp,ease,back,rand,person,mesh,Ball} from './kit.js';
import {buildWorld,truffle,plain} from './world.js';
const OUTW=1080,OUTH=1920;
let renderer,scene,cam,W,sun,out,o,small,sg,E,words,caps,shots,crowd,hero,prof,V;
const SHIRTS=['#3c7fd0','#f2a93b','#8a5cc2','#43a95a','#e86a92','#2f9e9a','#d9603b','#6b7fd8','#c9b13a','#5a9e4a','#b8508a','#3f8fb8','#e0824a','#7a6ad0','#4aab8a'];
const HAIR=['#3b2222','#1f1a2a','#a8572a','#e0b24a','#5a3425','#2a2f55','#772f3f'];

window.init=async function(edit,scale){
 E=edit;words=E.words;
 await document.fonts.load('900 100px Mont');
 const gl=document.createElement('canvas');out=document.querySelector('#out');out.width=OUTW*scale;out.height=OUTH*scale;o=out.getContext('2d');
 renderer=new T.WebGLRenderer({canvas:gl,antialias:true,preserveDrawingBuffer:true});renderer.setSize(out.width,out.height,false);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 small=document.createElement('canvas');small.width=out.width/2;small.height=out.height/2;sg=small.getContext('2d');
 scene=new T.Scene();const sky=document.createElement('canvas');sky.width=4;sky.height=256;const k=sky.getContext('2d'),gr=k.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#2f7fe0');gr.addColorStop(.55,'#7cc0f4');gr.addColorStop(1,'#e8f6ff');k.fillStyle=gr;k.fillRect(0,0,4,256);
 const bg=new T.CanvasTexture(sky);bg.colorSpace=T.SRGBColorSpace;scene.background=bg;scene.fog=new T.Fog('#cfe6f8',45,110);
 cam=new T.PerspectiveCamera(40,9/16,.1,260);
 scene.add(new T.HemisphereLight('#fff6ea','#9a7f9e',1.55));
 sun=new T.DirectionalLight('#fff0d2',1.75);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const c=sun.shadow.camera;c.left=c.bottom=-16;c.right=c.top=16;c.far=70;sun.shadow.bias=-.0006;sun.shadow.normalBias=.03;scene.add(sun,sun.target);
 W=buildWorld(scene);V=new T.Vector3();
 prof=person(W.plaza,{shirt:'#f4f6fb',coat:true,glasses:true,style:2,hair:'#6a5a6e',skin:1,seed:1});
 crowd=[];for(let i=0;i<16;i++)crowd.push(person(W.plaza,i===0?{shirt:'#e4553f',style:3,hair:'#2c5fb3',skin:2,seed:5}:{shirt:SHIRTS[i-1],style:i%5,hair:HAIR[i%7],skin:i%4,seed:i*1.7,scale:.93+rand(i)*.12}));
 // hero double for the other sets
 hero=person(W.zeroSet,{shirt:'#e4553f',style:3,hair:'#2c5fb3',skin:2,seed:5});
 for(const a of [crowd[0],hero,W.buyer,W.shopper]){a.choc=plain(a.arms[1],0,-.95,.05,1.25);a.truf=truffle(a.arms[1],0,-1.0,.05,1.1)}
 for(const a of crowd.slice(1)){a.choc=plain(a.arms[1],0,-.93,.05,1);a.truf=truffle(a.arms[1],0,-.98,.05,.9)}
 buildCaptions();buildShots();
};

// ---------- crowd layouts ----------
const order=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
// first choice: 12 of 16 queue for the truffle; after the price change 11 of 16 take the free one
const first=i=>i<12?[-1,i]:[1,i-12];
const second=i=>i<5?[-1,i]:[1,i-5];
function spot([s,k]){const row=Math.floor(k/3),col=k%3;return [s*2.05+(col-1)*1.15+(rand(k+s*9)-.5)*.2,2.35+row*1.5+(col===1?-.25:.2)]}
function stageCrowd(t,mode,u,extra={}){
 crowd.forEach((a,i)=>{let x,z,ry=Math.PI,walk=0;
  const A=spot(first(i)),B=spot(second(i));
  if(mode==='split'){[x,z]=A}
  else if(mode==='flipped'){[x,z]=B}
  else if(mode==='flip'){const k=ease((u-rand(i)*.25)/.75),moved=first(i)[0]!==second(i)[0];x=lerp(A[0],B[0],k);z=lerp(A[1],B[1],k)+(moved?Math.sin(k*Math.PI)*.9:0);walk=k>0&&k<1?1:0;if(walk)ry=Math.atan2(B[0]-A[0],B[1]-A[1]+Math.cos(k*Math.PI)*2.8)}
  else if(mode==='rush'){const k=ease(u*.8+rand(i)*.2);x=lerp(A[0]*2.4,A[0],k);z=lerp(A[1]+7,A[1],k);walk=k<.98?1:0}
  a.g.position.set(x,0,z);a.g.rotation.y=ry;a.choc.visible=a.truf.visible=false;
  const p={mood:['happy','calm','calm','joy'][i%4],walk,...(extra.all?extra.all(i,a):{})};a.pose(t,p)});
}
function place(a,x,z,ry){a.g.position.set(x,0,z);a.g.rotation.y=ry}
const mouth=(c,who)=>c.speaker===who?Math.min(3,Math.round(c.level*3.4)):0;
// hide everyone, then bring in just the actors a close-up needs
function clearCrowd(t){crowd.forEach(a=>a.pose(t,{show:false}))}
function solo(t,i,x,z,ry,p,item){const a=crowd[i];place(a,x,z,ry);a.choc.visible=item==='choc';a.truf.visible=item==='truf';a.pose(t,p)}
const HOLD=[-1.35,.12],UP=[0,2.5],POINT=[-.2,2.0],OPEN=[-.45,1.15];

function buildShots(){
 const S=(w,cfg)=>({t:w===0?0:words[w].start-.07,...cfg});
 const c=(p0,p1,l0,l1,fov=40,o={})=>({p0,p1,l0,l1:l1||l0,fov,...o});
 shots=[
 S(0,{cam:c([.5,2.3,6.9],[.3,2.4,5.5],[0,2.15,2.6],null,36),set(t,u){clearCrowd(t);solo(t,0,0,2.6,0,{mood:u<.35?'calm':'greedy',armR:[-2.1,-.15],nod:.05},'choc')},dof:1}),
 S(3,{cam:c([7,12,17],[4,10,14],[0,.8,2.5],null,40),set(t,u){stageCrowd(t,'rush',u*1.1,{all:()=>({mood:'joy'})})}}),
 S(4,{hideStall:true,cam:c([-.9,1.7,-3.3],[-1.4,1.8,-2.2],[-1.5,2.15,2.6],null,40),set(t){stageCrowd(t,'split',0,{all:i=>({mood:'greedy',armR:i%2?HOLD:null,armL:i%3?null:HOLD})})},dof:1}),
 S(10,{cam:c([0,13,25],[0,8.5,19],[0,2.6,0],null,38),set(t){clearCrowd(t);for(let i=1;i<7;i++){const a=crowd[i],x=((i*3.7+t*(i%2?1.1:-1.1))%18+18)%18-9;place(a,x,3+i*1.2,i%2?1.57:-1.57);a.choc.visible=a.truf.visible=false;a.pose(t,{walk:1,mood:'happy'})}},card:'mit'}),
 S(15,{cam:c([3.8,3.6,11],[1.2,3.1,8.2],[0,2.5,0],null,40),set(t){clearCrowd(t)},prof:{mood:'happy',armR:[0,2.4]}}),
 S(20,{cam:c([-3.3,3.4,3.9],[-2.3,2.7,2.7],[-1.75,1.85,.1],null,36),set(t){clearCrowd(t)},dof:1}),
 S(24,{cam:c([-1.9,1.1,6.6],[-1.75,1.0,5.7],[-1.75,.38,.8],null,36),set(t){clearCrowd(t)}}),
 S(26,{cam:c([3.3,3.4,3.9],[2.3,2.7,2.7],[1.75,1.85,.1],null,36),set(t){clearCrowd(t)},dof:1}),
 S(30,{cam:c([1.9,1.1,6.6],[1.75,1.0,5.7],[1.75,.38,.8],null,36),set(t){clearCrowd(t)}}),
 S(33,{cam:c([0,10.5,17],[0,9,15.5],[0,.6,3],null,40),set(t){stageCrowd(t,'split',0)}}),
 S(38,{cam:c([-.6,6.6,-8.5],[0,6,-7.5],[0,1,4.5],null,48),set(t){stageCrowd(t,'split',0,{all:()=>({mood:'happy'})})},card:'bars1',hideStall:true}),
 S(40,{cam:c([-3.9,2.5,6.9],[-3.0,2.55,5.6],[-2.1,2.2,2.35],null,34),set(t){stageCrowd(t,'split',0,{all:()=>({show:false})});solo(t,0,-2.1,2.4,-.35,{mood:'smug',armR:[-1.75,.05],nod:-.06},'truf')},dof:1}),
 S(42,{cam:c([.3,2.9,5.8],[.1,2.9,4.6],[0,2.5,-1.1],null,34),set(t){clearCrowd(t)},prof:{mood:'smug',armR:[-.5,2.5]},dof:1}),
 S(50,{cam:c([-2.6,1.3,6.4],[-1.9,1.05,5.6],[-1.75,.38,.8],null,36),set(t){clearCrowd(t)}}),
 S(53,{cam:c([2.5,1.3,6.7],[1.85,1.05,5.8],[1.75,.38,.8],null,36),set(t){clearCrowd(t)}}),
 S(55,{cam:c([1.75,.95,4.3],[1.75,1.0,5.6],[1.75,.4,.8],null,38,{shake:1}),set(t){clearCrowd(t)},flash:true,card:'burst'}),
 S(56,{cam:c([.1,2.8,-5],[.1,2.75,-3.9],[0,2.15,3],null,46,{shake:1}),set(t){stageCrowd(t,'split',0,{all:i=>({mood:'shock',open:2,armL:i%2?UP:null,armR:i%2?UP:null,hop:Math.abs(Math.sin(t*14+i))*.1})})},hideStall:true,dof:1}),
 S(57,{cam:c([0,3.3,8.6],[0,3.2,7.6],[0,2.45,0],null,40),set(t){clearCrowd(t)},prof:{mood:'think',armL:OPEN,armR:OPEN},card:'gap'}),
 S(63,{cam:c([6,12,15],[3,11,14],[0,.4,3.6],null,42),set(t,u){stageCrowd(t,'flip',u*1.15,{all:()=>({mood:'joy'})})}}),
 S(67,{cam:c([.8,6.6,-8.5],[0,6,-7.5],[0,1,4.5],null,48),set(t){stageCrowd(t,'flipped',0,{all:i=>({mood:'joy',armR:i%2?UP:null})})},card:'bars2',hideStall:true}),
 S(73,{zone:80,cam:c([0,.8,10.5],[0,1.5,12],[0,3.4,0],[0,3.5,0],44),set(t,u){this.h(t,{mood:'shock',look:Math.sin(t*3)*.25,nod:-.25},null,0,.4)},card:'effect'}),
 S(80,{zone:80,cam:c([1.5,2.6,7.4],[.7,2.6,6.4],[0,2.5,1.2],null,36),set(t){this.h(t,{mood:'greedy',armR:[-1.9,-.1]},'choc',0,1.2)},dof:1}),
 S(85,{zone:80,cam:c([-2.2,1.6,11],[0,2.2,12.5],[0,3.2,0],null,42),set(t){this.h(t,{mood:'joy',armL:UP,armR:UP,hop:Math.abs(Math.sin(t*7))*.55},null,0,1)},confetti:true}),
 S(91,{zone:'D',cam:c([1.2,3.1,12],[0,2.9,10.8],[-.8,2.35,-1],null,42),set(t,u){this.d(t,u,false)}}),
 S(97,{zone:'D',cam:c([3.6,3.4,12.6],[2.2,3.1,11.4],[.55,2.3,-.6],null,44),set(t,u){this.d(t,u,true)}}),
 S(103,{zone:'G',cam:c([2.2,3.4,12.2],[1.2,3.1,11],[.15,2.45,0],null,42),set(t,u){this.gf(t,u,false)}}),
 S(107,{zone:'G',cam:c([-2.6,3.6,11.8],[-.8,3.3,11],[0,2.4,0],null,44),set(t,u){this.gf(t,u,true)}}),
 S(111,{cam:c([2.6,2.9,12.4],[1.4,2.7,10.4],[0,2.1,4],null,38),set(t){clearCrowd(t);solo(t,0,0,4.2,0,{mood:'happy',armR:HOLD},'choc')},prof:{mood:'calm'},dof:1}),
 S(118,{cam:c([.5,2.55,9.4],[.3,2.55,8.7],[0,2.25,4.2],null,34),set(t){clearCrowd(t);solo(t,0,0,4.2,0,{mood:'think',armR:[-1.9,-.1]},'choc')},prof:{show:false},dof:1}),
 S(120,{cam:c([0,2.5,9.3],[0,2.42,7.2],[0,2.2,4.2],null,32),set(t,u){clearCrowd(t);solo(t,0,0,4.2,0,{mood:u<.45?'think':'worry',armR:[-1.9,-.1],nod:.06},'choc')},prof:{show:false},dof:1}),
 ];
 for(const s of shots){
  s.h=(t,p,item,x,z)=>{place(hero,x,z,0);hero.choc.visible=item==='choc';hero.truf.visible=false;hero.pose(t,p)};
  s.d=(t,u,more)=>{const sh=W.shopper;place(sh,more?-.25:-.35,.9,more?.55:0);sh.choc.visible=sh.truf.visible=false;sh.pose(t,more?{mood:'worry',armR:[-1.35,.4],armL:null}:{mood:'joy',armL:UP,armR:UP,hop:Math.abs(Math.sin(t*8))*.14});
   W.parcel.position.set(-1.65,more?0:Math.max(0,1-back(u*3))*3,.7);W.basket.visible=more;
   W.goods.forEach((m,i)=>{const k=back((u*20-i)*.8);m.visible=more&&u*20>i;m.scale.setScalar(Math.max(.001,k))});
   if(more)W.dsign.write([['FREE DELIVERY',70,'#1f8a4c'],['*if you spend more',46,'#c22f2f']]);else W.dsign.write([['FREE DELIVERY',70,'#1f8a4c']])};
  s.gf=(t,u,two)=>{const b=W.buyer;place(b,two?-.2:-1.15,1.55,two?0:.35);b.choc.visible=b.truf.visible=false;b.pose(t,two?{mood:'worry',armL:OPEN,armR:OPEN}:{mood:'greedy',armR:POINT});
   W.boxes.forEach((m,i)=>{const show=i===2||two;m.visible=show;const k=i===2?back(u*3):back((u*3.2-i*.5));m.scale.setScalar(Math.max(.001,show?k:0))});
   if(two)W.gsign.write([['BUY 2 FIRST',76,'#c22f2f'],['then the gift is "free"',46,'#5a3350']]);else W.gsign.write([['FREE GIFT!',96,'#d12f66']])};
 }
}

// ---------- captions and cards ----------
function buildCaptions(){
 const HOT=new Set(['NOTHING','THINKING','MIT','TRUFFLE','73%','FIFTEEN','ONE','FREE!','FREE?!','SAME','FLIPPED!','69%','ZERO','EFFECT','LOSE','DELIVERY','GIFT','TWO','COSTING']);
 caps=[];for(let i=0;i<words.length;i++){const w=words[i];let txt=w.text,end=w.end,start=w.start;
  if(txt==='M'){txt='MIT';end=words[i+2].end;i+=2}
  else if(txt==='Seventy-three'||txt==='Sixty-nine'){txt=txt[0]==='S'&&txt[1]==='e'?'73%':'69%';end=words[i+1].end;i++}
  txt=txt.toUpperCase().replace(/[.,:]/g,'');caps.push({text:txt,start,end,hot:HOT.has(txt)||HOT.has(txt.replace(/[?!]/g,''))})}
 caps.forEach((c,i)=>c.until=Math.min(caps[i+1]?.start??1e9,c.end+.4));
}
function type(txt,x,y,size,fill,line=size*.17){o.font='900 '+size+'px Mont';o.textAlign='center';o.textBaseline='middle';o.lineJoin='round';o.lineWidth=line;o.strokeStyle='#150b1a';if(line)o.strokeText(txt,x,y);o.fillStyle=fill;o.fillText(txt,x,y)}
function panel(x,y,w,h,k,draw,bg='#fff5df'){if(k<=0)return;o.save();o.translate(x,y);const s=back(k);o.scale(s,s);o.fillStyle='rgba(20,8,30,.28)';o.beginPath();o.roundRect(-w/2+8,-h/2+14,w,h,34);o.fill();o.fillStyle=bg;o.strokeStyle='#1a0f1f';o.lineWidth=9;o.beginPath();o.roundRect(-w/2,-h/2,w,h,34);o.fill();o.stroke();draw();o.restore()}
function bars(age,a,b){[[300,'TRUFFLE',a,'#7a3b24'],[780,'PLAIN',b,'#e0892f']].forEach(([x,name,v,col],i)=>panel(x,430,390,500,(age-i*.12)*4,()=>{
 type(name,0,-198,50,'#2a1630',0);const u=ease((age-.15)*1.8),h=270*v/100*u;o.fillStyle='#eadcc0';o.fillRect(-75,-140,150,270);o.fillStyle=col;o.fillRect(-75,130-h,150,h);o.lineWidth=7;o.strokeRect(-75,-140,150,270);
 type(Math.round(v*u)+'%',0,192,76,'#2a1630',0)}));type('OF THOSE WHO BOUGHT',540,735,40,'#fff')}
function cards(kind,age){
 if(kind==='mit')panel(540,300,760,230,age*3.5,()=>{type('MIT',0,-35,110,'#2a1630',0);type('A REAL EXPERIMENT',0,62,46,'#a0442c',0)});
 if(kind==='bars1')bars(age,73,27);
 if(kind==='bars2')bars(age,31,69);
 if(kind==='gap'){panel(540,265,860,190,age*3.5,()=>{type('BEFORE   15¢ − 1¢ = 14¢',0,0,55,'#2a1630',0)});panel(540,495,860,190,(age-.55)*3.5,()=>{type('AFTER   14¢ − 0¢ = 14¢',0,0,55,'#2a1630',0)},'#ffe07a')}
 if(kind==='effect')panel(540,300,880,250,(age-.3)*3.5,()=>{type('THE ZERO PRICE',0,-47,82,'#2a1630',0);type('EFFECT',0,55,92,'#c8402c',0)});
 if(kind==='burst'){o.save();o.translate(540,520);o.rotate(age*.7);for(let i=0;i<20;i++){o.rotate(6.283/20);o.fillStyle=i%2?'rgba(255,226,70,.5)':'rgba(255,255,255,.35)';o.beginPath();o.moveTo(0,0);o.lineTo(900,-80);o.lineTo(900,80);o.fill()}o.restore();type('FREE!',540,400,230*Math.max(.01,back(age*5)),'#ffe246')}
}

window.frame=function(t){
 let i=0;while(i+1<shots.length&&shots[i+1].t<=t)i++;
 const s=shots[i],end=shots[i+1]?.t??E.duration,age=t-s.t,u=clamp(age/(end-s.t));
 const part=E.beats.flatMap(b=>b.parts).find(p=>t>=p.start&&t<=p.end);
 const n=Math.floor(t*30),level=E.mouth[n]||0,ctx={speaker:part?.who,level};
 // signs follow the story
 W.signL.write(t<words[51].start?[['TRUFFLE',64,'#6b2f1d'],['15¢',190,'#2a1630']]:[['TRUFFLE',64,'#6b2f1d'],['14¢',190,'#2a1630']],'#fff4da');
 if(t<words[55].start-.07)W.signR.write([['PLAIN',64,'#6b2f1d'],['1¢',190,'#2a1630']]);else W.signR.write([['PLAIN',64,'#6b2f1d'],['FREE',170,'#c8202f']],'#ffe246');
 place(prof,0,-1.25,0);prof.pose(t,{mood:'happy',...(s.prof||{})});
 s.set.call(s,t,u,ctx);
 // cameras looking out from behind the counter would be blocked by the stall
 W.stall.visible=!s.hideStall;W.stallBunting.visible=s.cam.p0[2]>-7;
 if(s.hideStall)prof.pose(t,{show:false});
 W.confetti.forEach((c,k)=>{c.visible=!!s.confetti;c.position.set(rand(k)*10-5,8-((age*3.2+rand(k+50)*8)%8),rand(k+90)*6-1);c.rotation.set(age*5+k,age*3+k,k)});
 W.zero.rotation.y=Math.sin(t*1.8)*.35;W.zero.scale.setScalar(s.card==='effect'?back(age*2):1);
 W.clouds.forEach((c,k)=>c.position.x=[-16,9,22,-30][k]+Math.sin(t*.05+k)*2);
 const zx=s.zone==='D'?60:s.zone==='G'?-60:0,zz=s.zone===80?80:0;
 const k=ease(u*.9+.1*u),P=s.cam.p0.map((v,j)=>lerp(v,s.cam.p1[j],k)),L=s.cam.l0.map((v,j)=>lerp(v,s.cam.l1[j],k));
 const sh=(s.cam.shake?Math.exp(-age*6)*.12:0);
 cam.position.set(P[0]+zx+Math.sin(t*47)*sh+Math.sin(t*1.3)*.02,P[1]+Math.cos(t*53)*sh+Math.cos(t*1.7)*.015,P[2]+zz);cam.fov=s.cam.fov*(1-.07*Math.exp(-age*9));cam.updateProjectionMatrix();cam.lookAt(L[0]+zx,L[1],L[2]+zz);
 sun.position.set(zx+9,18,zz+11);sun.target.position.set(zx,0,zz+2);
 renderer.render(scene,cam);
 // finishing: punchy colour, tilt-shift blur, vignette
 const w=out.width,h=out.height,gl=renderer.domElement;
 o.setTransform(1,0,0,1,0,0);o.filter='saturate(1.12) contrast(1.04)';o.drawImage(gl,0,0);o.filter='none';
 sg.globalCompositeOperation='source-over';sg.clearRect(0,0,w/2,h/2);sg.filter='blur('+(w/270)*(s.dof?1.25:.75)+'px) saturate(1.12)';sg.drawImage(gl,0,0,w/2,h/2);sg.filter='none';sg.globalCompositeOperation='destination-in';
 const m=sg.createLinearGradient(0,0,0,h/2);for(const [p,a] of s.dof?[[0,1],[.13,.8],[.27,0],[.78,0],[.93,.9],[1,1]]:[[0,.85],[.14,0],[.84,0],[1,1]])m.addColorStop(p,'rgba(0,0,0,'+a+')');sg.fillStyle=m;sg.fillRect(0,0,w/2,h/2);o.drawImage(small,0,0,w,h);
 o.setTransform(w/OUTW,0,0,h/OUTH,0,0);
 const v=o.createRadialGradient(540,900,600,540,960,1250);v.addColorStop(0,'rgba(20,5,35,0)');v.addColorStop(1,'rgba(20,5,35,.34)');o.fillStyle=v;o.fillRect(0,0,1080,1920);
 if(s.card)cards(s.card,age);
 if(s.flash&&age<.2){o.fillStyle='rgba(255,255,240,'+(1-age/.2)*.85+')';o.fillRect(0,0,1080,1920)}
 const c=caps.find(c=>t>=c.start&&t<c.until);
 if(c){const pop=.8+.2*back((t-c.start)/.13);let size=128;o.font='900 '+size+'px Mont';const tw=o.measureText(c.text).width;if(tw>940)size*=940/tw;type(c.text,540,1235,size*pop,c.hot?'#ffe033':'#ffffff')}
 return out.toDataURL('image/jpeg',.93);
};
