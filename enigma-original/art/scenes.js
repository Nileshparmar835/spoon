// The scene registry is the extension point for every new episode.
// Coordinates are in a 360 x 640 stage. The canvas is drawn at export resolution.
function brassCounter(x,y,s,number,t,angle=0){
 transform(x,y,s,()=>{
 oval(-55,1,12,12,null,'#302a2d',6);oval(-55,1,12,12,null,'#c29861',3);
 round(-52,-30,104,61,12,'#9c703f',ink,2.6);
 round(-49,-28,98,54,10,grad(-30,29,'#f9dd99','#c09758','#9c744c'),'#514135',1.3);
 round(-37,-15,74,27,4,'#342f36','#73583f',2);
 const n=String(Math.floor(number)).padStart(3,'0');
 for(let i=0;i<3;i++){round(-33+i*22,-13,20,22,2,grad(-14,10,'#272c32','#484545','#24292f'),null);
 label(n[i],-23+i*22,-1,17,'#fff1c5');line(-32+i*22,-1,-14+i*22,-1,'rgba(0,0,0,.23)',.8)}
 for(const xx of [-43,43])for(const yy of [-21,20]){oval(xx,yy,1.9,1.9,'#694f3e');line(xx-1,yy+.6,xx+1,yy-.6,'#dabc84',.65)}
 label('F L A M E S',0,19,5,'#3c3430');round(28,-35,13,7,2,brass,ink,1.3);
 },angle);
}
function coin(x,y,s,t){transform(x,y,s,()=>{oval(1,2,17,17,'#ae713c',ink,1.7);oval(0,0,17,17,grad(-17,17,'#ffe9a0','#d9a352','#f8d181'),ink,1.6);
 oval(0,0,13.4,13.4,null,'#9f703c',.9);for(let j=0;j<24;j++){let a=j*TAU/24;line(15*cos(a),15*sin(a),16*cos(a),16*sin(a),'#a27b47',.65)}
 path('M-4 6h8 l-1 -9 h-6Z','#a47843',null);path('M-5 -4l5 -4 5 4Z','#a47843',null);star(-6,-8+sin(t)*.7,2.2,'#ffedb1')})}
function interior(t){
 rect(-30,-30,420,720,grad(-20,530,'#211f32','#554352','#85634f'));
 for(let i=-1;i<13;i++){line(i*34,0,i*34,427,'rgba(38,33,45,.48)',1);line(i*34+2,0,i*34+2,427,'rgba(245,207,171,.07)',1)}
 round(213,225,101,102,2,'#58454a',ink,4);rect(219,231,89,90,grad(231,322,'#30364e','#a77972'),ink);
 for(let i=0;i<9;i++)house(216+i*11,321,10,15+rand(i)*16,i,true,true);
 line(262,230,262,322,'#514051',4);line(219,275,308,275,'#514051',4);round(207,324,114,5,2,'#9e7b63',ink);
 rect(-30,372,422,61,'#53505a','#352f3a');for(let i=0;i<8;i++)round(i*52-8,380,43,43,2,'#5c5861','#48444d');
 stones(434);glow(70,318,122,'rgba(225,168,97,.14)');
}
function desk(x,y,s=1){transform(x,y,s,()=>{
 for(let xx of [-58,56]){path('M'+xx+' 3 l8 0 -2 62 -4 0Z','#7c5848',ink,1.5)}
 round(-68,-2,137,8,2,grad(-2,6,'#b18a69','#775646'),ink);rect(-56,6,112,15,'#77574c',ink);line(-50,12,51,12,'#98735b',1);oval(0,14,2,2,brass);
 });}
function ledger(x,y,s,n,t){transform(x,y,s,()=>{
 path('M-75 -53 Q-41 -61 0 -53 Q38 -62 76 -54 L81 51 Q40 43 0 52 Q-39 43 -81 51Z','#663b3f',ink,3);
 path('M-72 -50 Q-37 -57 0 -48 L0 47 Q-38 39 -76 46Z','#e6ce9c',ink,1.2);
 path('M0 -48 Q38 -57 72 -51 L76 46 Q35 40 0 47Z','#f0dfb4',ink,1.2);
 label('BELL STREET',-36,-36,7,'#6a5545');label('FRIDAY',37,-34,7,'#6a5545');
 for(let i=0;i<7;i++){line(-66,-24+i*9,-7,-24+i*9,'#c3aa86',.7);line(7,-24+i*9,67,-24+i*9,'#c3aa86',.7)}
 for(let i=0;i<5;i++){let yy=-19+i*9;path('M-61 '+yy+'q6 -4 12 0t13 0l6 -1',null,'#967b62',1.2)}
 label(n,36,1,24,'#75463b','Story');path('M12 19 q21 3 48 -1',null,'#af5b4a',1.4);path('M-5 45 l-2 15 5 -3 4 4 1 -17Z','#9d4942',ink,.7);
 },-.045)}
function closeRoom(t,tone='violet'){
 rect(-40,-40,440,720,tone==='rust'?grad(0,640,'#231c30','#5b3841','#332834'):grad(0,640,'#171a2b','#3b354b','#252b3a'));
 glow(180,346,193,'rgba(230,180,123,.21)');
 for(let j=0;j<24;j++){let x=rand(j)*401-17,y=(rand(j+54)*710-t*(1+j%2)+710)%710;oval(x,y,.45+rand(j+85)*.6,.5,'rgba(246,221,173,.32)')}
}
function plate(x,y,txt,w){transform(x,y,1,()=>{round(-w/2,-9,w,18,3,'#373940','#af9068',1);label(txt,0,0,7,'#e9cf9e')})}
function wind(t,x,y,p){if(p<=0)return;layer(p,()=>{for(let i=0;i<3;i++){let xx=x+((t*65+i*23)%100)-55,yy=y+i*8;path('M'+xx+' '+yy+' q16 -8 33 -2 t23 -2',null,'#c1c6c9',1.1)}})}
function map(t,c){closeRoom(t);
 transform(180,350,1,()=>{path('M-149 -74l85 -12 80 9 113 -11 12 134 -90 15 -90 -9 -103 10Z','#d5c39e','#40343a',2);
 for(let i=0;i<42;i++){let x=rand(i)*253-125,y=rand(i+65)*115-63;rect(x,y,6+rand(i+21)*13,4+rand(i+98)*5,'#b5a990')}
 path('M-140 32Q-62 63 0 32T135 8',null,'#799ba1',17);
 path('M-114 -17 Q-75 -43 -35 -20 T23 -6 Q41 -9 59 18 T100 28',null,'#72564e',3);
 for(const [xx,yy,title] of [[-105,-24,'BAKERY'],[21,-7,'BRIDGE'],[98,29,'QUAY']]){oval(xx,yy,4,4,'#ad584c',ink,1);label(title,xx,yy-13,7,'#453e41')}
 const u=smooth(c.p),x=lerp(-106,99,u),y=-18+46*u-14*sin(u*TAU);glow(x,y,16,'rgba(255,219,116,.75)');star(x,y,7,'#fff2bb');
 },-.035);
}
function inbox(t,c,waiting=false){
 closeRoom(t);transform(180,354,1,()=>{
 round(-111,-86,222,157,9,'#353947',ink,2.4);round(-104,-78,208,140,5,'#ddd5c4',ink,1.2);
 rect(-103,-76,206,22,'#485863');label('INBOX',-89,-65,8,'#f5e4ba','Label','left');
 let count=waiting?0:Math.max(0,10-Math.floor(smooth(c.p/.85)*11));
 if(count){round(68,-72,25,14,7,'#ac5149',null);label(String(count),80,-65,8,'#fff1cc')}
 for(let i=0;i<4;i++){let y=-38+i*25;oval(-86,y,6,6,i===3?'#ad7562':'#95a29b');rect(-73,y-3,i===3?91:51+i*9,2.6,'#737879');rect(-73,y+3,i===3?55:38+i*7,2.2,'#b2b3a7');line(-94,y+12,94,y+12,'#b7b6a9',.8);if(!waiting&&i<count%5)oval(83,y,2.5,2.5,'#ad584d')}
 path('M-110 70H110L130 82Q132 87 122 88H-123Q-132 87 -128 82Z','#7a7880',ink,2);line(-44,80,45,80,'#514d58',1.7);
 if(waiting){const q=smooth(c.p*4);transform(0,11+(1-q)*16,.88+.12*q,()=>{round(-92,-36,184,73,4,'#ffebc5','#6d554c',1.6);label('R E :   T H E   B R I D G E',-79,-20,6,'#8b6f59','Label','left');label('Can you help?',-79,-2,17,'#433f47','Story','left');label('AWAITING REPLY',-79,21,6.5,'#a65b4e','Label','left');oval(69,18,6.8,6.8,null,'#a65b4e',1);line(69,18,69,14,'#a65b4e');line(69,18,72,19,'#a65b4e')})}
 });}
const scenes={
 record(t,c){closeRoom(t,'rust');let start=c.on('three');let n=start<0?299:300;transform(180,354,1,()=>{brassCounter(0,0,1.92,n,t,-.10+.023*sin(t));if(start>=0)layer(1-smooth(start/.7),()=>star(76,-27,10+start*8,'#ffe2a3'))});},
 street(t,c){bridge(t);for(let i=0;i<3;i++)lamp(42+i*135,429,1.03-i*.12,0,t);person(146+smooth(c.p)*10,433,.85,t,{walk:.24,emotion:'worry'});plate(182,446,'BELL STREET',71)},
 route(t,c){map(t,c)},
 bread(t,c){let j=c.on('bridge'),k=c.on('last');if(j<0){shop(t);lamp(252,418,.95,1,t);person(115+29*c.p,420,.93,t,{walk:.65,tool:true})}else{bridge(t,true);lamp(286,428,1.05,k>=0?smooth(k*3):.18,t);person(110+94*c.p,429,.96,t,{walk:.76,tool:true,reach:k>=0?.88:0})}},
 child(t,c){quay(t);for(let i=0;i<4;i++)lamp(25+i*100,424,.72,1,t);person(161,429,.97,t,{tool:true,tilt:-.06});},
 clerk(t,c){interior(t);person(203,436,1.21,t,{type:'clerk',facing:-1,reach:.45+.22*sin(t*2)});desk(133,384,.82);ledger(129,379,.31,'12',t);person(62,434,.98,t,{tool:true});},
 counter(t,c){closeRoom(t);transform(175,367,1,()=>{path('M-130 14L126 -3',null,ink,15);path('M-130 14L126 -3',null,'#b48758',10);round(102,-13,25,16,3,brass,ink,2);
 let u=smooth(c.p*3);brassCounter(0,lerp(-43,-15,u),1.39,c.on('click')<0?0:1,t,-.065)});},
 rule(t,c){interior(t);person(108,428,1.35,t,{type:'clerk',reach:.91});person(249,428,1.2,t,{facing:-1});let hit=c.on('gold');if(hit>=0){glow(177,337,48,'rgba(255,211,112,.24)');coin(176,341-3*sin(t*2),.85,t)}},
 wind(t,c){shop(t);const lost=c.on('out'),back=c.on('again');let on=lost<0?1:back<0?0:smooth(back*5);lamp(240,418,.87,on,t);person(201,419,1.13,t,{reach:back>=0?.95:.43,tool:true,emotion:'worry'});wind(t,230,311,lost<0?.8:1-smooth(lost/1.35));},
 click(t,c){if(c.on('Then')<0){closeRoom(t);brassCounter(180,350,2.13,2,t,-.035);return}shop(t);let u=c.on('blew');lamp(225,419,.81,u<0?1:1-smooth(u*6),t);person(192,422,1.32,t,{tool:true,reach:.5,blow:u>=0,tilt:.07});wind(t,219,322,u<0?0:1-smooth(u/.7))},
 again(t,c){shop(t);const on=c.on('On')>=0;lamp(227,419,.85,on?1:0,t);person(185,420,1.23,t,{tool:true,reach:on?.95:.2});brassCounter(82,364,.63,on?4:3,t,-.08);},
 score(t,c){interior(t);desk(180,405,1.8);ledger(176,349,1.33,'300',t);transform(249,346+2*sin(t*4),1,()=>{path('M0 0L28 -49l3 2L3 2Z','#b48c58',ink);path('M25 -43Q19 -66 43 -81Q44 -59 28 -44Z','#ded7c2',ink)},.10*sin(t*2))},
 award(t,c){interior(t);person(99,433,1.35,t,{type:'clerk',reach:.88});person(251,434,1.28,t,{facing:-1,reach:.87});let u=smooth(Math.max(0,c.on('pressed'))*1.1);coin(lerp(145,218,u),364-sin(u*Math.PI)*15,.75,t);},
 bridge(t,c){bridge(t);lamp(291,428,.98,0,t);person(100+smooth(c.p)*48,430,.98,t,{walk:1-smooth(c.p),emotion:'worry',tool:true});person(220,434,.74,t,{type:'boy',sit:.9,facing:-1,emotion:'worry'});},
 boy(t,c){bridge(t);lamp(303,426,.87,0,t);person(135,434,1.21,t,{emotion:'worry',tool:true,tilt:.08});person(212,433,.96,t,{type:'boy',facing:-1,reach:.7*smooth(c.on('Where')*4),emotion:'worry'});},
 wallet(t,c){closeRoom(t);transform(176,367,1,()=>{path('M-97 -81Q-8 -110 92 -74L107 66Q17 94 -103 71Z','#bb824d',ink,2);
 path('M-55 -4Q-1 8 57 -4L53 49Q6 74 -51 51Z','#94643f',ink,2);path('M-49 1Q1 12 50 1',null,'#e3b879',1.1);
 let u=smooth(c.on('pocket')*1.8);g.save();g.beginPath();g.rect(-80,-95,160,97);g.clip();coin(0,-39+62*u,1.25,t);g.restore();line(65,-75,68,56,'#8b593d',1.5)},-.09)},
 inbox(t,c){inbox(t,c,false)},draft(t,c){inbox(t,c,true)},
 home(t,c){bridge(t,true);let u=smooth(c.p*1.5);person(93+u*132,429,1.11,t,{walk:1-u,tool:true,reach:smooth(c.on('lit')*4)});person(67+143*u,431,.64,t,{type:'boy',walk:1-u});lamp(259,427,.86,smooth(c.on('lit')*4),t);},
 end(t,c){sea(t,true);railing(-10,425,10,42);stones(426);lamp(180,426,1.24,1,t);person(119-31*c.p,430,.92,t,{facing:-1,walk:.63,tool:true});person(91-28*c.p,430,.62,t,{type:'boy',facing:-1,walk:.7});glow(180,280,97,'rgba(245,187,97,.10)');}
};
