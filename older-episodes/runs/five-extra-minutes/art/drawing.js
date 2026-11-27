// 2.5D engine: flat canvas drawing, projected through a real camera so it reads as 3D.
const cv=document.querySelector('canvas');
let g=cv.getContext('2d',{alpha:false});
const TAU=Math.PI*2,sin=Math.sin,cos=Math.cos,abs=Math.abs,min=Math.min,max=Math.max;
const clamp=(x,a=0,b=1)=>max(a,min(b,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const lerp=(a,b,x)=>a+(b-a)*x;
const back=x=>{x=clamp(x);return 1+2.2*(x-1)**3+1.2*(x-1)**2};
function rand(n){const v=sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)}
function rgb(h){return [1,3,5].map(i=>parseInt(h.slice(i,i+2),16))}
// shade(colour, k): k<0 toward cool shadow, k>0 toward warm light
function shade(h,k){const c=rgb(h),to=k<0?[18,12,44]:[255,240,208],a=abs(k);return 'rgb('+c.map((v,i)=>Math.round(lerp(v,to[i],a))).join(',')+')'}
function lin(x0,y0,x1,y1,stops){const q=g.createLinearGradient(x0,y0,x1,y1);stops.forEach((c,i)=>q.addColorStop(i/(stops.length-1),c));return q}
function rad(x,y,r0,X,Y,r1,stops){const q=g.createRadialGradient(x,y,r0,X,Y,r1);stops.forEach((c,i)=>q.addColorStop(i/(stops.length-1),c));return q}
function fill(f){g.fillStyle=f;g.fill()}
function ell(x,y,rx,ry,f,rot=0){g.beginPath();g.ellipse(x,y,max(0,rx),max(0,ry),rot,0,TAU);fill(f)}
function rr(x,y,w,h,r,f){g.beginPath();g.roundRect(x,y,w,h,r);fill(f)}
function poly(pts,f){g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();fill(f)}
function svg(d,f){fill.call(null,'transparent');g.fillStyle=f;g.fill(new Path2D(d))}
function stroke(d,c,w){g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.stroke(new Path2D(d))}
function seg(x,y,X,Y,c,w){g.beginPath();g.moveTo(x,y);g.lineTo(X,Y);g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.stroke()}
function glow(x,y,r,col,a=1){g.save();g.globalCompositeOperation='lighter';g.globalAlpha*=a;ell(x,y,r,r,rad(x,y,0,x,y,r,['rgba('+col+',.85)','rgba('+col+',.25)','rgba('+col+',0)']));g.restore()}
function text(t,x,y,size,c,font='Story',align='center'){g.font=size+'px '+font;g.textAlign=align;g.textBaseline='middle';g.fillStyle=c;g.fillText(t,x,y)}
function at(x,y,s,fn,rot=0){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);fn();g.restore()}

// ---------- camera ----------
const F=500,CX=180,HOR=300;
let cam={x:0,y:0,z:0};
function pr(x,y,z){const d=F/max(40,F+z-F-cam.z);return [CX+(x-cam.x)*d,HOR+(y-cam.y)*d,d]}
// World: z=500 maps 1:1 on screen. Larger z is farther away. y grows downward; floor is y=190.
const FLOOR=190;
function board(x,y,z,fn,s=1){if(z-cam.z<60)return;const [X,Y,d]=pr(x,y,z);at(X,Y,d*s,fn)}
function quad(p,f){poly(p.map(v=>pr(...v)),f)}
// Solid box with only the camera-facing sides drawn, each lit differently.
function box(x0,x1,y0,y1,z0,z1,col,o={}){
 const A=pr(x0,y0,z0),B=pr(x1,y1,z0);
 if(cam.y<y0)quad([[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]],shade(col,o.top??.22));
 if(cam.y>y1)quad([[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],shade(col,-.55));
 if(cam.x<x0)quad([[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0]],shade(col,o.side??-.34));
 if(cam.x>x1)quad([[x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0]],shade(col,o.side??-.34));
 quad([[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]],lin(0,A[1],0,B[1],[shade(col,.07),col,shade(col,-.24)]));
 g.strokeStyle=shade(col,.35);g.lineWidth=.8*A[2];g.globalAlpha*=.55;g.beginPath();g.moveTo(A[0],A[1]);g.lineTo(B[0],A[1]);g.stroke();g.globalAlpha/=.55;
}
function shadow(x,z,rx,a=.45,y=FLOOR){const [X,Y,d]=pr(x,y,z);ell(X,Y,rx*d,rx*d*.2,rad(X,Y,0,X,Y,rx*d,['rgba(8,4,22,'+a+')','rgba(8,4,22,0)']))}
// Depth of field: draw into a small buffer, then enlarge it.
const buffers={};
function soft(k,fn){
 if(k>=.99){fn();return}
 const key=String(k);const W=Math.ceil(cv.width*k),H=Math.ceil(cv.height*k);
 if(!buffers[key]){const c=document.createElement('canvas',W,H);c.width=W;c.height=H;buffers[key]=c}
 const c=buffers[key],old=g,m=g.getTransform();g=c.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W,H);
 g.setTransform(m.a*k,m.b*k,m.c*k,m.d*k,m.e*k,m.f*k);g.lineCap='round';fn();g=old;
 g.save();g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(c,0,0,cv.width,cv.height);g.restore();
}
function motes(t,n,col,z0=200,z1=800,rise=7){for(let i=0;i<n;i++){const z=lerp(z0,z1,rand(i+5));const x=rand(i+9)*560-280+sin(t*.5+i)*12;const y=((rand(i+17)*620-t*rise*(.5+rand(i)))%620+620)%620-340;
 if(z-cam.z<80)continue;const [X,Y,d]=pr(x,y,z);const near=clamp((d-1.2)/1.5);const r=(.8+rand(i+31)*1.2)*d*(1+near*4);
 glow(X,Y,r*2.4,col,(.35+.3*sin(t*1.7+i))*(1-near*.7))}}
function shaft(pts,col,a){g.save();g.globalCompositeOperation='lighter';const P=pts.map(v=>pr(...v));poly(P,lin(P[0][0],P[0][1],P[2][0],P[2][1],['rgba('+col+','+a+')','rgba('+col+',0)']));g.restore()}
