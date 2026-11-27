// Sets and shots for "The Five Extra Minutes".
function clockFace(r,t,o={}){const hour=o.hour??t*.08+r,minute=o.minute??t*.9+r*3;
 ell(r*.12,r*.16,r*1.17,r*1.17,'rgba(8,3,18,.35)');
 ell(0,0,r*1.16,r*1.16,lin(-r,-r,r,r,['#ffe3a0','#c58a3c','#6b3c24']));ell(0,0,r*1.01,r*1.01,lin(-r,-r,r,r,['#6e4023','#e9b964']));
 ell(0,0,r*.9,r*.9,rad(-r*.3,-r*.35,0,0,0,r,['#fffdf2','#f1e0bd','#c9ad8c']));
 for(let i=0;i<12;i++){const a=i*TAU/12;seg(sin(a)*r*.71,-cos(a)*r*.71,sin(a)*r*.8,-cos(a)*r*.8,'#58384a',r*(i%3?.03:.065))}
 seg(0,0,sin(hour)*r*.43,-cos(hour)*r*.43,'#33192d',r*.085);seg(0,0,sin(minute)*r*.67,-cos(minute)*r*.67,'#33192d',r*.05);ell(0,0,r*.08,r*.08,'#a33d4c');
 g.beginPath();g.arc(0,0,r*.77,3.6,4.75);g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=r*.07;g.stroke()}
function floorBoards(col,z0,z1){quad([[-900,FLOOR,z0],[900,FLOOR,z0],[900,FLOOR,z1],[-900,FLOOR,z1]],lin(0,pr(0,FLOOR,z1)[1],0,660,[shade(col,-.55),col,shade(col,.1)]));
 const near=max(z0,cam.z+90);for(let x=-880;x<=880;x+=55){const a=pr(x,FLOOR,near),b=pr(x,FLOOR,z1);seg(a[0],a[1],b[0],b[1],'rgba(25,8,22,.42)',1.4);
  for(let i=0;i<3;i++){const z=near+60+rand(x*.1+i)*(z1-near-70),p=pr(x,FLOOR,z),q=pr(x+55,FLOOR,z);seg(p[0],p[1],q[0],q[1],'rgba(25,8,22,.35)',1.2)}}}
function windowPane(x,y,z,w,h,sky){board(x,y,z,()=>{rr(-w/2-9,-h/2-9,w+18,h+18,w*.5,lin(-w,0,w,0,['#c28a58','#5d3329']));g.save();g.beginPath();g.roundRect(-w/2,-h/2,w,h,w*.45);g.clip();
 rr(-w/2,-h/2,w,h,0,lin(0,-h/2,0,h/2,sky));for(let i=0;i<7;i++){const bw=w/6,bh=h*(.16+rand(i+4)*.3);rr(-w/2+i*bw-3,h/2-bh,bw+2,bh,1,'#352450');for(let j=0;j<4;j++)if(rand(i*9+j)>.4)rr(-w/2+i*bw+2,h/2-bh+6+j*11,4,5,1,'#ffd98a')}
 g.restore();seg(0,-h/2,0,h/2,'#7a4a34',6);seg(-w/2,0,w/2,0,'#7a4a34',6);seg(-w/2,-h/2+8,-w/2,h/2,'rgba(255,220,160,.7)',2)})}
function shopBack(t,dusk=1){
 quad([[-900,-600,880],[900,-600,880],[900,FLOOR,880],[-900,FLOOR,880]],lin(0,-60,0,500,['#1c1030','#4a2748','#7d4650']));
 for(let x=-600;x<600;x+=64){const a=pr(x,-500,880),b=pr(x,FLOOR,880);seg(a[0],a[1],b[0],b[1],'rgba(20,8,30,.28)',11*a[2])}
 floorBoards('#8c5040',250,880);
 windowPane(112,-72,876,135,175,dusk?['#5a4a9c','#e07a78','#ffc27a']:['#10173c','#2b3568','#6c5a8c']);
 for(const [y,n] of [[-190,0],[-78,1],[36,2]]){box(-330,-40,y,y+13,815,875,'#8a5136');
  for(let i=0;i<4;i++){const r=[27,19,33,22][(i+n)%4];board(-282+i*68,y-r*1.17,840,()=>clockFace(r,t+i*2+n))}}
 for(const y of [-170,-20])box(205,340,y,y+13,805,875,'#8a5136');
 [[240,-201,26],[298,-195,20],[262,-52,28]].forEach((c,i)=>board(c[0],c[1],835,()=>clockFace(c[2],t+i*4)));
 board(-45,-258,860,()=>clockFace(44,t));
 // grandfather clock
 box(190,262,15,FLOOR,730,790,'#6e342f');box(184,268,-62,15,722,790,'#7d3d33');board(226,-24,718,()=>clockFace(29,t));
 board(226,90,726,()=>{rr(-19,-55,38,115,17,'#241127');const a=sin(t*3.14)*.22;g.rotate(a);seg(0,-52,0,30,'#c99848',3);ell(0,38,12,12,rad(-4,33,0,0,38,13,['#fff0ae','#b37a2c']))});
}
function pendant(x,y,z,t){board(x,y,z,()=>{seg(0,-420,0,0,'#150a1c',2.5);glow(0,22,150,'255,176,86',.55);g.beginPath();g.moveTo(-36,22);g.bezierCurveTo(-30,-14,30,-14,36,22);g.closePath();fill(lin(-36,0,36,0,['#3d6a73','#7fb3ac','#1f3445']));ell(0,22,36,7,'#fff0bd');glow(0,24,38,'255,236,170')})}
function counter(x0=-165,x1=95,z=425){shadow((x0+x1)/2,z+20,175,.55);box(x0,x1,98,FLOOR,z,z+62,'#8c4a38');box(x0-10,x1+10,85,99,z-9,z+68,'#c27c4a',{top:.28});
 for(let x=x0+14;x<x1-50;x+=82)box(x,x+62,115,174,z-3,z,'#763a31')}
function foreground(t){soft(.16,()=>{board(-205,215,260,()=>clockFace(58,t*2));board(222,-255,285,()=>clockFace(44,t*3))})}
function shop(t,o={}){soft(.55,()=>shopBack(t,o.dusk??1));shaft([[70,-150,870],[160,-150,870],[40,FLOOR,430],[-190,FLOOR,430]],'255,196,130',.2);pendant(o.lx??-95,-170,560,t)}
function person(who,x,z,t,o={},s=1.12){shadow(x,z,52*PEOPLE[who].body*s,.5);board(x,FLOOR,z,()=>actor(who,t,o),s)}
function coin(x,y,r,a){const sx=max(.1,abs(cos(a))),th=r*.2*sin(a);for(let i=4;i>=0;i--)ell(x+th*i/4,y,r*sx,r,i?'#8f5a1c':lin(x-r,y-r,x+r,y+r,['#fff6bd','#f1bd45','#a96c1e']));
 ell(x,y,r*.73*sx,r*.73,lin(x+r,y+r,x-r,y-r,['#ffe58a','#c9902f']));at(x,y,1,()=>{g.scale(sx,1);text('5',0,1,r*1.05,'#8a5518')})}
function sparkle(x,y,r,a=1){g.save();g.globalAlpha*=clamp(a);glow(x,y,r*2.2,'255,220,130');svg('M'+x+' '+(y-r)+'Q'+x+' '+y+' '+(x+r)+' '+y+'Q'+x+' '+y+' '+x+' '+(y+r)+'Q'+x+' '+y+' '+(x-r)+' '+y+'Q'+x+' '+y+' '+x+' '+(y-r),'#fff8da');g.restore()}
function token(t,s=1){glow(0,0,48*s,'255,200,100',.8);at(0,0,s,()=>{rr(-4,-33,8,8,3,'#e8b755');clockFace(23,0,{hour:.2,minute:.52+0})})}

function office(t,night){
 soft(.5,()=>{quad([[-900,-600,860],[900,-600,860],[900,FLOOR,860],[-900,FLOOR,860]],lin(0,-20,0,500,night?['#11122f','#252752','#454074']:['#2b2450','#54406e','#8a5c78']));
  floorBoards('#5d4468',250,860);windowPane(55,-105,852,255,215,night?['#080d2c','#1c2a64','#4a4686']:['#3d4a8e','#c06c88','#ffab7a']);
  box(-310,-195,-120,FLOOR,780,850,'#5b3d62');for(let j=0;j<4;j++){box(-310,-195,-96+j*68,-88+j*68,770,780,'#8a5d78');for(let i=0;i<6;i++)box(-302+i*17,-289+i*17,-140+j*68+rand(i+j)*12,-96+j*68,775,782,['#d36a62','#5aa5a0','#e2b55c','#7c6bb4'][(i+j)%4])}});
}
function sitter(t,o){board(0,FLOOR-48,520,()=>actor('nora',t,{...o,legs:false}),1.12)}
function desk(t){box(-190,190,100,118,380,500,'#a96b4c',{top:.2});box(-172,-150,118,FLOOR,390,415,'#6e4135');box(150,172,118,FLOOR,390,415,'#6e4135')}
function laptop(t,x,msgs){box(x-42,x+42,95,101,400,440,'#9a98b4');board(x,95,438,()=>{g.scale(.68,.68);rr(-66,-84,132,84,7,lin(-66,-84,66,0,['#585778','#242338']));rr(-59,-78,118,71,3,lin(0,-78,0,-7,['#dff7ff','#8cc6e8']));
 if(msgs===undefined){for(let i=0;i<6;i++){const w=clamp(t*1.3-i,0,1)*(94-(i%3)*18);rr(-49,-69+i*10,w,4,2,'#38557c')}}
 glow(0,-42,90,'130,200,255',.3)})}
function mug(x,z,t){board(x,100,z,()=>{ell(0,0,18,4,'rgba(20,5,20,.35)');rr(-13,-29,26,29,6,lin(-13,0,13,0,['#f59a86','#d6536a','#782a50']));g.beginPath();g.arc(15,-16,8,-1.4,1.4);g.strokeStyle='#bb455f';g.lineWidth=4;g.stroke();ell(0,-29,13,3.5,'#4a2330');
 for(let i=0;i<2;i++)stroke('M'+(-4+i*8)+' -34 q'+(sin(t*2+i)*9)+' -11 0 -21 t0 -19','rgba(255,240,240,.28)',2.5)})}
function papers(x,z,n){for(let i=0;i<n;i++){const o=(rand(i+x)-.5)*12;box(x-32+o,x+32+o,97-i*5,100-i*5,z,z+45,'#e9e2ee',{top:.4,side:-.2})}}

function tree(x,z,s,t,c){board(x,FLOOR,z,()=>{seg(0,0,0,-95,'#4a2a38',15);[[-34,-112,40],[32,-118,42],[0,-155,50],[0,-112,44]].forEach((b,i)=>{const sw=sin(t*.9+i+x)*2.5;ell(b[0]+sw,b[1],b[2],b[2]*.92,rad(b[0]-b[2]*.4,b[1]-b[2]*.5,3,b[0],b[1],b[2]*1.25,[shade(c,.3),c,shade(c,-.5)]))})},s)}
// Riverside at golden hour. dim: 0 bright .. 1 nearly dusk.
function riverside(t,dim=0){
 soft(.5,()=>{const H=pr(0,FLOOR,6000)[1];rr(-80,-80,520,H+90,0,lin(0,0,0,H,dim>.5?['#161a4a','#5c3f82','#e57b6c']:['#4859a8','#dd7f8d','#ffd27d']));
  const sy=H-105+dim*68;glow(250,sy,150,'255,190,110',.65);ell(250,sy,31,31,rad(242,sy-8,2,250,sy,33,['#fffbe0','#ffd069']));
  for(let i=0;i<7;i++){const x=((i*111+t*5)%560)-100,y=45+rand(i)*160;for(let j=0;j<3;j++)ell(x+j*22-22,y-(j==1?7:0),31,10,'rgba(255,190,188,.24)')}
  for(const [z,c,amp,off] of [[3600,'#8a5c8e',420,3],[2300,'#5c4578',250,11]]){const pts=[pr(-3200,FLOOR,z)];for(let i=0;i<=30;i++){const x=-3200+i*213;pts.push(pr(x,FLOOR-70-rand(i+off)*amp,z))}pts.push(pr(3200,FLOOR,z));poly(pts,c)}
  for(let i=0;i<12;i++){const x=-760+i*140,hh=65+rand(i+40)*95;box(x,x+90,FLOOR-hh,FLOOR,1750,1840,['#a75f70','#7c5c8c','#b87a62'][i%3]);board(x+45,FLOOR-hh,1750,()=>{poly([[-52,0],[0,-42],[52,0]],'#573056');for(let j=0;j<2;j++)rr(-24+j*32,16,14,19,3,'#ffdc8c')})}
  quad([[-2600,FLOOR,610],[2600,FLOOR,610],[2600,FLOOR,1750],[-2600,FLOOR,1750]],lin(0,H,0,pr(0,FLOOR,610)[1],['#ed9a86','#7b6ca0','#2f5384']));
  for(let i=0;i<150;i++){const z=625+rand(i)*1050,x=rand(i+55)*1800-900+sin(t*1.2+i)*9,a=pr(x,FLOOR,z),b=pr(x+18+rand(i+7)*55,FLOOR,z),gold=abs(a[0]-250)<55;seg(a[0],a[1],b[0],b[1],gold?'rgba(255,224,140,'+(.5+.35*sin(t*3+i))+')':'rgba(210,225,255,.25)',gold?2.3:1.3)}
  tree(-330,900,1.25,t,'#c2615c');tree(355,1000,1.35,t,'#8f4f7c');tree(-560,1400,1.4,t,'#6e5584')});
 const edge=pr(0,FLOOR,610)[1];quad([[-1200,FLOOR,610],[1200,FLOOR,610],[1200,FLOOR,230],[-1200,FLOOR,230]],lin(0,edge,0,660,['#6f8a5a','#46664c','#1f3036']));
 box(-900,900,FLOOR-3,FLOOR+9,598,614,'#a48287');
 for(let i=0;i<130;i++){const x=rand(i+3)*900-450,z=300+rand(i+77)*290;if(z-cam.z<110)continue;board(x,FLOOR,z,()=>{const s=sin(t*1.5+i)*2;seg(0,0,-4+s,-9,'#83a267',1.6);seg(0,0,3+s,-12,'#a2b86f',1.6);if(i%9==0)ell(3+s,-13,3.2,3.2,i%2?'#ffd0dc':'#ffe28a')})}
}
// Folded paper boat built from separately lit faces.
function boat(s=1){at(0,0,s,()=>{poly([[-42,0],[-24,19],[0,5]],'#d8cfe6');poly([[-24,19],[25,19],[0,5]],'#fffaf0');poly([[25,19],[43,0],[0,5]],'#b3a6cc');poly([[-42,0],[0,5],[43,0],[0,-3]],'#8d7fae');poly([[-17,0],[0,-34],[0,3]],'#fff6e4');poly([[0,-34],[19,0],[0,3]],'#c4b6da');seg(-24,19,25,19,'#fff',1)})}
function floating(t,x,z){const bob=sin(t*2.3)*3;const [X,Y,d]=pr(x,FLOOR+bob,z);for(let i=1;i<5;i++){g.beginPath();g.ellipse(X,Y+3*d,(30+i*15+((t*9)%15))*d,(3+i*2)*d,0,0,TAU);g.strokeStyle='rgba(255,232,200,'+(.4-i*.07)+')';g.lineWidth=1.3;g.stroke()}
 g.save();g.globalAlpha=.25;at(X,Y+17*d,d,()=>{g.scale(1,-.6);boat()});g.restore();at(X,Y-17*d,d,()=>boat(),sin(t*1.6)*.07)}

function street(t,run){
 soft(.6,()=>{rr(-80,-80,520,700,0,lin(0,0,0,420,['#0e1238','#403472','#d36f78']));for(let i=0;i<60;i++)ell(rand(i)*360,rand(i+80)*210,.9,.9,'rgba(255,240,215,'+(.4+.4*sin(t+i))+')');glow(180,265,130,'255,170,110',.5)});
 floorBoards('#4c4268',200,2600);for(let z=2400;z>230;z-=70){if(z-cam.z<90)continue;const a=pr(-175,FLOOR,z),b=pr(175,FLOOR,z);seg(a[0],a[1],b[0],b[1],'rgba(170,150,205,.22)',1.6*a[2])}
 for(let i=6;i>=0;i--){const z=330+i*270+(i?0:0);for(const s of [-1,1]){const hh=300+rand(i*3+s)*170,x0=s<0?-430:185,x1=s<0?-185:430,col=['#6a4272','#84505f','#4c5584','#8a604f'][(i+(s>0?2:0))%4];
   if(z+240-cam.z<100)continue;const zn=max(z,cam.z+90);box(x0,x1,FLOOR-hh,FLOOR,zn,z+240,col,{side:-.12});
   const face=s<0?x1:x0;for(let r=0;r<4;r++)for(let c=0;c<3;c++){const a=z+25+c*72,y=FLOOR-hh+30+r*68;if(a-cam.z<100)continue;quad([[face,y,a],[face,y,a+38],[face,y+39,a+38],[face,y+39,a]],rand(i*20+r*5+c+s)>.38?'#ffcf7d':'#26203f')}}}
 for(let i=5;i>=0;i--){const z=420+i*300,x=i%2?150:-150;if(z-cam.z<110)continue;board(x,FLOOR,z,()=>{seg(0,0,0,-185,'#17102a',6);ell(0,-194,11,14,'#ffe5a0');glow(0,-192,70,'255,188,95',.8)})}
}
const loud=(c,who)=>c.speaker===who?c.mouth:0;
const scenes={
 shop(t,c){cam={x:lerp(-45,10,smooth(c.p)),y:lerp(-8,12,c.p),z:lerp(-30,175,smooth(c.p))};shop(t);
  person('orrin',5,520,t,{look:sin(t*.7)*.35,mood:'sly',armR:c.p>.4?[58,-170]:undefined,hold:c.p>.4?['R',()=>token(t,.9)]:null});counter();
  const coinT=c.on('coin!');if(coinT>=0){const k=back(coinT*2.4);board(-80,-40,410,()=>{coin(0,0,27*k,coinT*5);sparkle(30,-28,12*k,1-coinT*.5)})}foreground(t)},
 arrive(t,c){const u=smooth(c.p*1.5);cam={x:lerp(30,-25,smooth(c.p)),y:5,z:lerp(40,150,u)};office(t,false);
  person('nora',lerp(-150,-5,u),470,t,{walk:1-smooth((c.p*1.5-.55)*2.2),look:lerp(.7,-.15,u),mood:'worry',armR:[48,-122],hold:['R',()=>{rr(-9,-24,19,34,4,'#232038');rr(-7,-21,15,27,2,'#9fdcff')}]});
  for(let i=0;i<4;i++){const a=t*2.2+i*TAU/4;board(lerp(-150,-5,u)+cos(a)*95,-95+sin(t*3+i)*15,470+sin(a)*95,()=>clockFace(15,t*8+i,{hour:t*3,minute:t*14}))}},
 buy(t,c){const buyer=c.part===0;if(buyer){cam={x:-50,y:25,z:225+c.age*8};shop(t,{lx:-180});person('nora',-65,500,t,{look:.5,mood:'worry',mouth:loud(c,'nora'),armR:[66,-111],tilt:-.05,hold:['R',()=>coin(3,-12,13,t*4)]});counter(-60,230,430)}
  else{cam={x:55,y:20,z:205+c.age*9};shop(t,{lx:190});person('orrin',65,515,t,{look:-.45,mood:'sly',mouth:loud(c,'orrin'),armL:[-62,-125],tilt:.08,hold:['L',()=>token(t,1)]});counter(-190,200,425);sparkle(110,300,9,.5+.5*sin(t*4))}},
 report(t,c){cam={x:lerp(45,-20,c.p),y:-5,z:lerp(100,185,c.p)};office(t,false);sitter(t,{mood:'busy',look:sin(t*1.4)*.12,lookY:.8,tilt:.05,armL:[-30,-62+sin(t*23)*4],armR:[30,-62+cos(t*21)*4]});desk(t);papers(-128,415,7);laptop(c.age,0);mug(115,420,t);
  board(105,-130,540,()=>clockFace(35,0,{hour:t*.9,minute:t*9}))},
 pings(t,c){cam={x:sin(t*.6)*30,y:0,z:130+c.p*50};office(t,true);const q=c.part===1;sitter(t,{mood:q?'shock':'busy',look:q?sin(t*9)*.5:0,lookY:.5,armL:[-31,-62+sin(t*27)*4],armR:[31,-62+cos(t*29)*4]});desk(t);laptop(t,0);mug(118,420,t);papers(-125,420,5);
  const pop=(x,y,z,k,i)=>{if(k<0)return;board(x,y+sin(t*3+i)*5,z,()=>{const s=back(k*4);g.scale(s,s);rr(-30,-19,64,40,12,'rgba(15,5,35,.35)');rr(-34,-23,64,40,12,lin(0,-23,0,17,['#ffffff','#d7e6ff']));poly([[-14,16],[-3,16],[-17,28]],'#d7e6ff');for(let j=0;j<2;j++)rr(-23,-12+j*13,38-j*13,5,2,'#8b9ac4');ell(30,-22,11,11,'#ee4d62');text(String(i+1),30,-21,12,'#fff','Label')})};
  [[-105,-90,430],[112,-60,450],[-88,0,390]].forEach((p,i)=>pop(...p,c.age-.3-i*.5,i));
  if(q)[[75,-135,380],[-110,-155,470],[118,25,370]].forEach((p,i)=>pop(...p,c.t-c.partStart-i*.36,i+3))},
 habit(t,c){cam={x:lerp(-30,30,c.p),y:lerp(-25,10,c.p),z:lerp(190,20,smooth(c.p))};office(t,true);sitter(t,{mood:'tired',lookY:.8,tilt:.1*smooth(c.p*2),armL:[-31,-62+sin(t*18)*3],armR:[31,-62+cos(t*17)*3]});desk(t);laptop(t,0);
  const n=Math.floor(smooth(c.p*1.1)*13);papers(-130,420,3+n);papers(128,430,2+Math.floor(n*.8));
  for(let i=0;i<14;i++){const u=c.p*14-i;if(u<0)continue;let x=-190+(i*83)%390;if(abs(x)<100)x+=x<0?-100:100;const z=390+(i*61)%230,y=lerp(-310,-130+(i*47)%130,back(min(1,u*.7)));board(x,y+sin(t*2+i)*7,z,()=>token(t,.65))}},
 boat(t,c){cam={x:lerp(-85,20,smooth(c.p)),y:lerp(-55,10,smooth(c.p)),z:lerp(-70,130,smooth(c.p))};riverside(t,.1);const u=smooth(c.on('held')*2);
  person('theo',-15,480,t,{look:.1,mood:'happy',armR:[lerp(24,34,u),lerp(-45,-112,u)],armL:[lerp(-24,-6,u),lerp(-45,-92,u)],hold:['R',()=>at(-9,-12,.9,()=>boat())]},1.18);motes(t,26,'255,214,130')},
 ask(t,c){cam={x:-8+sin(t*.5)*8,y:55,z:245+c.age*14};riverside(t,.15);person('theo',-5,500,t,{look:-.12,lookY:-.4,tilt:-.07,mood:c.age>.9?'happy':'joy',blink:0,mouth:loud(c,'theo'),armR:[44,-52],armL:[-2,-42],hold:['R',()=>at(-16,-6,.7,()=>boat())]},1.18);motes(t,24,'255,214,130');if(c.age>1)sparkle(246,243,8,.6+.4*sin(t*5))},
 minute(t,c){cam={x:18,y:20,z:250-c.age*10};riverside(t,.3);person('nora',10,505,t,{look:.5,lookY:.9,mood:'busy',mouth:loud(c,'nora'),armL:[6,-100],armR:[32,-104],hold:['R',()=>{rr(-23,-23,25,38,5,'#211d36');rr(-20,-20,19,31,2,'#a9e4ff');glow(-10,-6,46,'130,205,255',.7)}]})},
 empty(t,c){if(c.part===0){cam={x:0,y:10,z:190+c.age*20};riverside(t,.35);person('nora',0,500,t,{look:-.2,lookY:.9,mood:'busy',armL:[-14,-92],armR:[25+sin(t*8)*5,-96],hold:['L',()=>{rr(-14,-5,48,34,10,lin(0,-5,0,29,['#d96a74','#76284a']));ell(10,3,4,4,'#f5cf6a')}]})}
  else{const k=c.t-c.partStart;cam={x:0,y:0,z:0};soft(.2,()=>riverside(t,.55));rr(-20,-20,400,680,0,'rgba(15,8,40,.35)');
   at(180,325,lerp(1,1.14,smooth(k/3)),()=>{ell(0,90,140,27,'rgba(5,2,20,.4)');g.beginPath();g.moveTo(-132,-38);g.bezierCurveTo(-150,128,150,128,132,-38);g.quadraticCurveTo(0,-5,-132,-38);fill(lin(-130,-40,130,100,['#ef8a8c','#a83b5a','#4e1737']));
    ell(0,-42,132,45,'#7a2748');ell(0,-39,118,35,rad(0,-27,5,0,-39,115,['#12030f','#2b0c22','#541a34']));g.setLineDash([7,6]);stroke('M-112 0 Q0 100 112 0','rgba(255,205,180,.7)',2.3);g.setLineDash([]);
    stroke('M-127 -43 Q-104 -90 0 -88 Q104 -90 127 -43','#e9b557',7);for(const s of [-1,1]){ell(s*10,-91,11,11,rad(s*10-4,-95,0,s*10,-91,12,['#fff3b0','#ad742a']))}
    for(let i=0;i<9;i++){const u=(k*.22+i*.11)%1;ell(sin(i*5+k)*40*u,-42-u*150,2,2,'rgba(220,205,235,'+(1-u)*.5+')')}},sin(k*1.2)*.025)}},
 run(t,c){const z=smooth(c.p)*330;cam={x:sin(t*5.5)*5,y:-5+abs(sin(t*11))*5,z};street(t,true);person('nora',sin(t*2)*16,z+430-c.p*40,t,{walk:1,look:.1,mood:'shock',tilt:.07,armL:[-52,-110+sin(t*11)*25],armR:[52,-110-sin(t*11)*25]});motes(t,22,'255,205,150',z+200,z+900,2)},
 plead(t,c){cam={x:-30,y:22,z:220+smooth(c.p)*60};shop(t,{dusk:0,lx:-190});person('nora',-35,500,t,{look:.35,lookY:-.2,mood:'worry',mouth:loud(c,'nora'),armL:[-8,-96],armR:[14,-98+sin(t*15)*2]});counter(-70,230,430)},
 truth(t,c){const q=c.part;cam=q<2?{x:25,y:18,z:190+c.age*11}:{x:35,y:12,z:285+(c.t-c.partStart)*17};shop(t,{dusk:0,lx:-180});person('orrin',30,515,t,{look:q==2?-.05:-.3,lookY:q==0?.3:0,tilt:q==2?-.07:.06,mood:q==2?'sad':'soft',mouth:loud(c,'orrin'),armL:q==2?[-47,-108]:undefined});counter(-190,200,425);
  rr(-20,-20,400,680,0,'rgba(18,12,65,'+smooth(c.p*1.4)*.3+')');motes(t,20,'190,175,255')},
 when(t,c){if(c.part===0){cam={x:-35,y:22,z:260+c.age*12};shop(t,{dusk:0,lx:-190});person('nora',-35,500,t,{look:.4,mood:'shock',mouth:loud(c,'nora')});counter(-70,230,430);rr(-20,-20,400,680,0,'rgba(18,12,65,.3)')}
  else{const k=c.t-c.partStart;cam={x:lerp(-20,20,k/3.5),y:0,z:k*22};
   // a vision of later: a grown son walks past the little boat
   riverside(t,1);const bx=-35;board(bx,FLOOR-14,500,()=>boat(1.2));shadow(bx,500,52);const wx=lerp(35,125,smooth(k/4));shadow(wx,590,34);board(wx,FLOOR,590,()=>{g.save();g.globalAlpha*=.9;
     seg(-8,-100,-26+sin(t*5)*13,-4,'#1b1438',17);seg(8,-100,24-sin(t*5)*13,-4,'#1b1438',17);rr(-29,-184,58,96,25,lin(-29,0,29,0,['#51407c','#1b1438']));ell(3,-210,25,27,'#1b1438');rr(17,-157,29,43,9,'#2b2152');seg(27,-190,25,-212,'rgba(255,175,130,.85)',3);g.restore()},1.12);
   rr(-20,-20,400,680,0,rad(180,320,90,180,320,400,['rgba(90,60,170,0)','rgba(35,15,85,.6)']));motes(t,30,'200,180,255')}},
 choose(t,c){const q=c.part;if(q===0){cam={x:0,y:0,z:0};soft(.18,()=>shopBack(t,0));const k=c.age;at(180,315,lerp(1.02,1.2,smooth(k/1.8)),()=>{glow(0,0,190,'255,190,115',.45);clockFace(108,t,{hour:Math.PI,minute:Math.floor(k*1.4)*.1})})}
  else{cam={x:0,y:30,z:265+(c.t-c.partStart)*14};riverside(t,.62);const off=q===2?smooth((c.t-c.partStart-.65)*3):0;person('nora',0,505,t,{look:q===1?.15:0,lookY:q===1?.9:.7*(1-off),mood:off>.7?'soft':'sad',armL:[-3,-101],armR:[27,-105],hold:['R',()=>{rr(-27,-25,28,43,5,'#211d36');rr(-24,-22,22,35,2,off>.4?'#0b0a16':'#a9e4ff');if(off<.4)glow(-13,-5,52,'130,205,255',.7)}]});
   if(off>.4)sparkle(pr(22,70,500)[0],pr(22,70,500)[1],13,1-(off-.4)*1.5)}},
 show(t,c){const u=smooth(c.p*1.3);cam={x:lerp(-25,5,u),y:34,z:lerp(150,235,u)};riverside(t,.4);
  person('nora',-52,505,t,{look:.62,lookY:.25,tilt:.12*u,mood:'soft',mouth:loud(c,'nora'),armR:[58,-79]},1.08);person('theo',56,490,t,{look:-.62,lookY:-.55,tilt:-.08,mood:c.p>.6?'joy':'happy',armL:[-48,-76],hold:['L',()=>at(5,-13,.68,()=>boat())]},1.1);motes(t,25,'255,214,140')},
 float(t,c){const u=smooth(c.p);cam={x:lerp(-45,-10,u),y:lerp(-15,35,u),z:lerp(70,170,u)};riverside(t,.35);floating(t,lerp(-30,70,u),lerp(670,735,u));
  person('nora',-125,545,t,{look:.8,lookY:.5,mood:'happy',legs:true},.82);person('theo',-62,540,t,{look:.8,lookY:.5,mood:'joy',armR:[55,-125+sin(t*6)*6]},.86);motes(t,26,'255,220,150',300,1100)},
 end(t,c){const u=smooth(c.p);cam={x:lerp(30,0,u),y:lerp(25,-80,u),z:lerp(190,-90,u)};riverside(t,lerp(.45,.8,u));floating(t,55,760);
  for(const [who,x,s] of [['nora',-62,1],['theo',2,1.05]]){shadow(x,545,46);board(x,FLOOR,545,()=>seated(who,t),s)}motes(t,36,'255,215,140',250,1200,9)},
};
// Back view of the two sitting together at the water's edge.
function seated(who,t){const P=PEOPLE[who],k=P.body,sh=-72*k,hy=sh-P.R*.82,lean=who==='theo'?-.13:.07;
 g.save();g.rotate(lean);ell(0,-8,40*k,14*k,P.bottom);
 g.beginPath();g.moveTo(-31*k,-8);g.bezierCurveTo(-36*k,sh,-18*k,sh-9,0,sh-9);g.bezierCurveTo(18*k,sh-9,36*k,sh,31*k,-8);g.closePath();fill(lin(-34*k,0,34*k,0,[shade(P.top,-.5),shade(P.top,-.18),shade(P.top,.2)]));
 stroke('M'+(24*k)+' '+(sh+3)+' Q'+(34*k)+' '+(sh*.55)+' '+(29*k)+' -13','rgba(255,196,130,.9)',3.4);
 at(0,hy+sin(t*1.4+k)*1.3,1,()=>{const R=P.R*(who==='nora'?1.1:1);ell(0,0,R,R*(who==='nora'?1.08:1),rad(R*.45,-R*.5,3,0,0,R*1.35,[shade(P.hair,.3),P.hair,shade(P.hair,-.5)]));g.beginPath();g.arc(0,0,R-2,-1.55,.55);g.strokeStyle='rgba(255,196,135,.9)';g.lineWidth=3.4;g.stroke()},-lean*.4);g.restore()}
