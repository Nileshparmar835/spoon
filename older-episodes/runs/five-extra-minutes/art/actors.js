// Volumetric characters: soft gradients, rim light, and features that wrap around a turning head.
const PEOPLE={
 nora:{skin:'#e8a57f',hair:'#4a2338',top:'#1f8a8c',bottom:'#2c3566',iris:'#5a3420',R:34,body:1},
 theo:{skin:'#efb08a',hair:'#8a4a22',top:'#f2b52c',bottom:'#3d6bb0',iris:'#2f5f8f',R:33,body:.62},
 orrin:{skin:'#dc9c7e',hair:'#e9e4ee',top:'#6b3f72',bottom:'#3a2c40',iris:'#3f6a57',R:35,body:.96},
};
function limb(x0,y0,cx,cy,x1,y1,w,col){const d='M'+x0+' '+y0+' Q'+cx+' '+cy+' '+x1+' '+y1;
 stroke(d,shade(col,-.45),w);g.save();g.translate(-w*.08,-w*.1);stroke(d,col,w*.74);g.translate(-w*.1,-w*.1);g.globalAlpha*=.5;stroke(d,shade(col,.25),w*.24);g.restore()}
function hand(x,y,r,skin){ell(x,y,r,r*1.08,rad(x-r*.35,y-r*.4,0,x,y,r*1.4,[shade(skin,.25),skin,shade(skin,-.3)]))}
// o: look(-1..1 head turn), tilt, mood, mouth(0..1), armL/armR [x,y] hand targets, walk, lookY, blink, rim
function actor(who,t,o={}){
 const P=PEOPLE[who],R=P.R,k=P.body;
 const {look=0,lookY=0,tilt=0,mood='calm',mouth=0,walk=0,rim='255,190,120',legs=true}=o;
 const breathe=sin(t*2.1+R)*1.2,step=sin(t*11)*walk,hop=-abs(cos(t*11))*walk*5;
 const hipY=-72*k,shY=hipY-62*k+breathe,headY=shY-R*.93;
 g.save();g.translate(0,hop);
 if(legs)for(const s of [-1,1]){const fx=s*13*k+step*s*20*k;limb(s*10*k,hipY,s*13*k+step*s*8,hipY*.5,fx,-7-max(0,s*step)*10,17*k,P.bottom);
  ell(fx+look*5,-5-max(0,s*step)*10,13*k,7*k,lin(0,-12,0,2,[shade('#4a2f3c',.2),'#24151f']))}
 // back hair
 g.save();g.translate(look*-4,headY);g.rotate(tilt);
 if(who==='nora'){g.beginPath();g.ellipse(0,5,R*1.17,R*1.16,0,0,TAU);fill(rad(-R*.5,-R*.6,2,0,0,R*1.4,[shade(P.hair,.2),P.hair,shade(P.hair,-.5)]))}
 g.restore();
 // torso
 const w=27*k;
 g.beginPath();g.moveTo(-w*.8,shY);g.bezierCurveTo(-w*1.15,shY+10,-w*1.2,hipY-6,-w*1.05,hipY+9*k);g.quadraticCurveTo(0,hipY+17*k,w*1.05,hipY+9*k);
 g.bezierCurveTo(w*1.2,hipY-6,w*1.15,shY+10,w*.8,shY);g.quadraticCurveTo(0,shY-11,-w*.8,shY);g.closePath();
 fill(lin(-w*1.2,0,w*1.2,0,[shade(P.top,.28),P.top,shade(P.top,-.18),shade(P.top,-.55)]));
 g.save();g.clip();ell(0,shY-4,w*1.2,17*k,'rgba(20,8,38,.30)');stroke('M'+(w*1.02)+' '+shY+' Q'+(w*1.18)+' '+(hipY-20)+' '+(w*1.02)+' '+(hipY+10),'rgba('+rim+',.75)',4);g.restore();
 if(who==='nora'){poly([[-9,shY-5],[9,shY-5],[look*4,shY+20]],'#f3e3d3');stroke('M-11 '+(shY-5)+' L'+(look*4-1)+' '+(shY+24)+' L11 '+(shY-5),shade(P.top,-.35),3);for(let i=0;i<3;i++)ell(look*5,shY+33+i*10,2.2,2.2,'#e9c46a')}
 if(who==='orrin'){poly([[-12,shY-6],[12,shY-6],[look*4,shY+30]],'#f1e7da');poly([[-9,shY-1],[0,shY+4],[-9,shY+9]],'#b4344a');poly([[9,shY-1],[0,shY+4],[9,shY+9]],'#8f2339');ell(0,shY+4,3,3,'#d9556b');
  stroke('M-6 '+(shY+33)+' q12 19 25 3','#e8bd5c',1.8);ell(20,shY+36,5,5,rad(18,shY+34,0,20,shY+36,6,['#fff0b0','#b9832e']));for(let i=0;i<3;i++)ell(look*5-2,shY+36+i*9,2,2,'#e8bd5c')}
 if(who==='theo'){stroke('M-17 '+(shY+17)+' Q0 '+(shY+23)+' 17 '+(shY+17),'#fff0c8',4.5)}
 // neck
 rr(-7*k,shY-14,14*k,16,6,shade(P.skin,-.28));
 // head
 g.save();g.translate(look*3,headY+lookY*3);g.rotate(tilt);
 for(const s of [-1,1]){const ex=s*R*.93-look*R*.22;if(who!=='nora'){ell(ex,5,7.5,10,rad(ex-2,3,0,ex,5,11,[P.skin,shade(P.skin,-.3)]));ell(ex,5,3,5,shade(P.skin,-.22))}}
 const headPath=()=>{g.beginPath();g.moveTo(-R,-2);g.bezierCurveTo(-R,-R*1.33,R,-R*1.33,R,-2);g.bezierCurveTo(R*.98,R*.62,R*.5+look*5,R*1.02,look*7,R*1.02);g.bezierCurveTo(-R*.5+look*5,R*1.02,-R*.98,R*.62,-R,-2);g.closePath()};
 headPath();fill(rad(-R*.38+look*R*.3,-R*.42,R*.08,0,0,R*1.45,[shade(P.skin,.34),P.skin,shade(P.skin,-.17),shade(P.skin,-.48)]));
 g.save();headPath();g.clip();
 stroke('M'+(R*.62)+' '+(-R*.86)+' C'+(R*1.04)+' '+(-R*.5)+' '+(R*1.1)+' '+(R*.45)+' '+(R*.45+look*5)+' '+(R*.95),'rgba('+rim+',.38)',3);
 // feature positions wrap around a sphere
 const wrap=a=>{const th=a+look*.62;return [sin(th)*R*.95,max(.2,cos(th))]};
 const blink=o.blink??(((t+R*.13)%3.4)<.12?1:0);
 const wide=mood==='shock'?1.18:mood==='happy'?.96:1;
 for(const s of [-1,1]){const [ex,sq]=wrap(s*.43);const ew=R*.215*sq*wide,eh=R*.255*wide,ey=lookY*4+1;
  ell(ex,ey,ew*1.3,eh*1.2,'rgba(120,50,50,.13)');
  if(blink>.5||mood==='joy'){stroke('M'+(ex-ew)+' '+ey+' Q'+ex+' '+(ey+(mood==='joy'?-eh*.9:eh*.5))+' '+(ex+ew)+' '+ey,'#3a1d26',2.7)}
  else{g.save();g.beginPath();g.ellipse(ex,ey,ew,eh,0,0,TAU);fill(lin(0,ey-eh,0,ey+eh,['#cfc4d6','#fffaf2','#fff6ee']));g.clip();
   const ix=ex+look*ew*.34+(o.gaze||0)*ew*.4,iy=ey+lookY*eh*.4+1,ir=eh*(mood==='shock'?.5:.7);
   ell(ix,iy,ir*max(.7,sq),ir,rad(ix,iy+ir*.5,0,ix,iy,ir,[shade(P.iris,.35),P.iris,shade(P.iris,-.55)]));
   ell(ix,iy,ir*.46*sq,ir*.5,'#170a12');ell(ix-ir*.36,iy-ir*.38,ir*.28,ir*.28,'#ffffff');ell(ix+ir*.36,iy+ir*.36,ir*.13,ir*.13,'rgba(255,255,255,.85)');
   const lid=mood==='sad'?.28:mood==='sly'?.42:mood==='soft'?.3:mood==='tired'?.5:0;
   if(lid){rr(ex-ew-1,ey-eh-1,ew*2+2,eh*2*lid,0,shade(P.skin,-.06));seg(ex-ew,ey-eh+eh*2*lid-1,ex+ew,ey-eh+eh*2*lid-1,'#6b3a38',1.8)}
   g.restore();stroke('M'+(ex-ew*1.08)+' '+(ey-eh*.3)+' Q'+ex+' '+(ey-eh*1.38)+' '+(ex+ew*1.08)+' '+(ey-eh*.3),'#3a1d26',who==='nora'?2:1.6)}
  // brows carry most of the emotion
  const B={calm:[0,0],happy:[-3,-3],joy:[-4,-4],sad:[-6,2],worry:[-7,1],shock:[-8,-7],sly:[1,-4],soft:[-3,0],tired:[-2,2],busy:[4,-1]}[mood]||[0,0];
  const by=ey-eh-6;const bi=[ex-s*ew*1.05,by+B[0]],bo=[ex+s*ew*1.15,by+B[1]];
  stroke('M'+bi[0]+' '+bi[1]+' Q'+ex+' '+((bi[1]+bo[1])/2-3.5)+' '+bo[0]+' '+bo[1],who==='orrin'?'#f4f0f7':shade(P.hair,-.1),who==='orrin'?5.5:3.4);
  const [cx2]=wrap(s*.72);ell(cx2,R*.34,R*.2,R*.13,rad(cx2,R*.34,0,cx2,R*.34,R*.2,['rgba(235,80,90,'+(mood==='joy'||who==='theo'?.5:.3)+')','rgba(235,80,90,0)']))}
 const [nx]=wrap(0);
 if(who!=='orrin'){ell(nx+2.5,R*.31,4.6,3,'rgba(140,60,55,.35)');ell(nx,R*.26,4.4,3.6,rad(nx-1.5,R*.23,0,nx,R*.26,5,[shade(P.skin,.35),P.skin]))}
 // mouth, driven by the audio envelope
 const my=R*.61,mx=nx*.96,open=clamp(mouth*1.25),mw=R*(mood==='shock'?.19:.26)*(1-open*.12);
 const curve={happy:6,joy:8,calm:2.6,soft:3.6,sly:4,sad:-4,worry:-3,shock:0,tired:-1,busy:0}[mood]??2;
 if(open>.1||mood==='shock'||mood==='joy'){const h=max(mood==='shock'?9:mood==='joy'?7:2,open*R*.31);
  g.beginPath();g.moveTo(mx-mw,my-curve*.4);g.quadraticCurveTo(mx,my+curve*.3-h*.18,mx+mw,my-curve*.4);g.bezierCurveTo(mx+mw*.75,my+h,mx-mw*.75,my+h,mx-mw,my-curve*.4);fill('#4d1428');
  g.save();g.clip();rr(mx-mw,my-5,mw*2,5.6+curve*.12,2,'#fff4ea');ell(mx,my+h*.82,mw*.7,h*.38,'#d8586a');g.restore()}
 else stroke('M'+(mx-mw)+' '+(my-curve*.4)+' Q'+mx+' '+(my+curve)+' '+(mx+mw)+' '+(my-curve*.4),'#7c2b3a',2.5);
 g.restore();
 if(who==='orrin'){const mo=open*3;
  for(const s of [-1,1]){g.beginPath();g.moveTo(nx,R*.38);g.bezierCurveTo(nx+s*13,R*.27,nx+s*22,R*.62+mo,nx+s*33,R*.43+mo);g.bezierCurveTo(nx+s*26,R*.78+mo,nx+s*6,R*.69,nx,R*.5);fill(lin(0,R*.3,0,R*.75,['#fffdf8','#bdb4cc']))}
  ell(nx,R*.28,8,7,rad(nx-3,R*.22,0,nx,R*.28,9,['#f6c4a6','#c97c66']));
  for(const s of [-1,1]){const [ex]=wrap(s*.43);g.beginPath();g.ellipse(ex,3,R*.31,R*.31,0,0,TAU);g.strokeStyle='#d9a441';g.lineWidth=2.2;g.stroke();stroke('M'+(ex-7)+' -3 l5 -4','rgba(255,255,255,.75)',2)}
  stroke('M'+(wrap(-.43)[0]+R*.3)+' 1 Q'+nx+' -5 '+(wrap(.43)[0]-R*.3)+' 1','#d9a441',2);
  for(const s of [-1,1])for(let i=0;i<4;i++){const px=s*(R*.91+(i%2)*5)-look*7,py=-14+i*8;ell(px,py,9-i,8-i*.6,rad(px-3,py-3,0,px,py,10,['#ffffff','#b9afc8']))}
  stroke('M'+(-14+look*9)+' '+(-R*.62)+' q15 -5 29 0',shade(P.skin,-.2),1.4);ell(-R*.3+look*8,-R*.78,10,5,'rgba(255,248,230,.45)',-.25)}
 // front hair
 const hf=rad(-R*.45+look*10,-R*.95,3,0,-R*.2,R*1.5,[shade(P.hair,.32),P.hair,shade(P.hair,-.45)]);
 if(who==='nora'){g.beginPath();g.moveTo(-R*1.12,12);g.bezierCurveTo(-R*1.3,-R*1.55,R*1.3,-R*1.55,R*1.12,12);g.quadraticCurveTo(R*1.04,R*.72,R*.78,R*.82);g.quadraticCurveTo(R*.96,-R*.05,R*.66,-R*.42);g.bezierCurveTo(R*.3+look*9,-R*.86,-R*.1+look*9,-R*.72,-R*.55+look*8,-R*.5);g.quadraticCurveTo(-R*.42,-R*.74,-R*.7,-R*.52);g.quadraticCurveTo(-R*.98,-R*.05,-R*.78,R*.82);g.quadraticCurveTo(-R*1.05,R*.7,-R*1.12,12);fill(hf);
  stroke('M'+(-R*.65)+' '+(-R*.82)+' Q'+(-R*.1)+' '+(-R*1.2)+' '+(R*.55)+' '+(-R*.9),'rgba(255,170,200,.38)',4)}
 if(who==='theo'){g.beginPath();g.moveTo(-R*1.05,3);g.bezierCurveTo(-R*1.3,-R*1.45,R*1.2,-R*1.55,R*1.07,0);g.quadraticCurveTo(R*.86,-R*.5,R*.62,-R*.42);g.quadraticCurveTo(R*.5,-R*.22,R*.28+look*8,-R*.5);g.quadraticCurveTo(R*.06,-R*.2,-R*.18+look*8,-R*.52);g.quadraticCurveTo(-R*.44,-R*.2,-R*.6,-R*.47);g.quadraticCurveTo(-R*.92,-R*.4,-R*1.05,3);fill(hf);
  svg('M-6 '+(-R*1.1)+' Q2 '+(-R*1.42)+' 17 '+(-R*1.3)+' Q7 '+(-R*1.25)+' 9 '+(-R*1.08)+'Z',P.hair);stroke('M'+(-R*.6)+' '+(-R*.85)+' Q'+(-R*.1)+' '+(-R*1.17)+' '+(R*.5)+' '+(-R*.93),'rgba(255,210,140,.45)',3.5)}
 g.restore();
 // arms in front of the torso
 const rest=s=>[s*w*1.45+(walk?-s*step*17:0),hipY+4+breathe];
 const hands={};
 for(const s of [-1,1]){const target=(s<0?o.armL:o.armR)||rest(s);const sx=s*w*.84,sy=shY+9;
  const ex=(sx+target[0])/2+s*17*k,ey=(sy+target[1])/2+9;limb(sx,sy,ex,ey,target[0],target[1],14.5*k,P.top);hand(target[0],target[1],7.6*k,P.skin);hands[s<0?'L':'R']=target;
  if(o.hold&&o.hold[0]===(s<0?'L':'R'))at(target[0],target[1],1,o.hold[1])}
 g.restore();return {shY,headY,hands};
}
