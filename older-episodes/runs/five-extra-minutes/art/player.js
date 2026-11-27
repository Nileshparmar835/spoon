// Draw any moment of the film from absolute audio time.
const grainCv=document.createElement('canvas',256,256);grainCv.width=256;grainCv.height=256;
{const x=grainCv.getContext('2d'),d=x.createImageData(256,256);for(let i=0;i<d.data.length;i+=4){const n=rand(i*.013)*255;d.data[i]=d.data[i+1]=d.data[i+2]=n;d.data[i+3]=9}x.putImageData(d,0,0)}
const VOICE={narrator:'#ffe08a',nora:'#7ff0e4',theo:'#ffc04d',orrin:'#e7b8ff'};
let edit,grain;
window.loadEpisode=data=>{edit=data;for(const b of edit.beats){if(!scenes[b.id])throw Error('Missing scene '+b.id);b.words=edit.words.filter(w=>w.start>=b.start-.001&&w.start<b.speech_end)}};
function chunks(words){const out=[];let cur=[];for(const w of words){if(cur.length&&(cur[0].part!==w.part||cur.length>=4||cur.map(v=>v.text).join(' ').length+w.text.length>20)){out.push(cur);cur=[]}cur.push(w);if(/[.!?,]$/.test(w.text)){out.push(cur);cur=[]}}if(cur.length)out.push(cur);return out}
function captions(b,t){const list=chunks(b.words);let i=-1;list.forEach((c,k)=>{if(t>=c[0].start-.04)i=k});if(i<0)return;const c=list[i],last=c[c.length-1];if(t>last.end+.45)return;
 let size=25;g.font=size+'px Story';let width=g.measureText(c.map(w=>w.text).join(' ')).width;if(width>312){size*=312/width;g.font=size+'px Story';width=312}
 const space=g.measureText(' ').width;let x=180-width/2;const y=558,pop=back((t-c[0].start+.04)/.16)*.1+.9;
 g.save();g.translate(180,y);g.scale(pop,pop);g.translate(-180,-y);rr(180-width/2-13,y-22,width+26,44,14,'rgba(18,8,34,.58)');g.textAlign='left';g.textBaseline='middle';
 for(const w of c){const on=t>=w.start&&t<(c[c.indexOf(w)+1]?.start??w.end+.45);g.lineJoin='round';g.lineWidth=3.5;g.strokeStyle='#1b0d28';g.strokeText(w.text,x,y);g.fillStyle=on?VOICE[w.who]:'#fff9ee';g.fillText(w.text,x,y);x+=g.measureText(w.text).width+space}g.restore()}
window.drawFrame=function(t){
 let i=edit.beats.findIndex((b,k)=>k===edit.beats.length-1||edit.beats[k+1].start>t);
 const b=edit.beats[i],end=edit.beats[i+1]?.start??edit.duration,age=t-b.start;
 let part=0;b.parts.forEach((q,k)=>{if(t>=q.start-.12)part=k});const q=b.parts[part];
 const f=t*30,n=Math.floor(f),mouth=lerp(edit.mouth[n]||0,edit.mouth[n+1]||0,f-n);
 const c={t,age,p:clamp(age/(end-b.start)),part,partStart:q.start,mouth,speaker:t>=q.start&&t<=q.end?q.who:null,
  on(w){const h=b.words.find(v=>v.text===w);if(!h)throw Error('Missing cue '+w+' in '+b.id);return t-h.start}};
 g.setTransform(cv.width/360,0,0,cv.height/640,0,0);g.globalAlpha=1;g.lineCap='round';g.lineJoin='round';
 cam={x:0,y:0,z:0};rr(-10,-10,380,660,0,'#160c28');g.save();scenes[b.id](t,c);g.restore();
 // colour grade, vignette, grain
 g.save();g.globalCompositeOperation='soft-light';rr(0,0,360,640,0,lin(0,0,360,640,['rgba(255,170,90,.38)','rgba(255,255,255,0)','rgba(70,60,200,.42)']));g.restore();
 rr(0,0,360,640,0,rad(180,305,150,180,320,430,['rgba(8,2,22,0)','rgba(8,2,22,.18)','rgba(8,2,22,.68)']));
 grain=grain||g.createPattern(grainCv,'repeat');g.save();g.translate(Math.floor(rand(n)*60),Math.floor(rand(n+3)*60));g.fillStyle=grain;g.fillRect(-70,-70,440,720);g.restore();
 captions(b,t);
 if(b.id==='shop'){const a=smooth(age*2.5)*(1-smooth((age-2.6)*2.5));g.save();g.globalAlpha=a;g.shadowColor='#12061f';g.shadowBlur=18;text('THE FIVE',180,72,31,'#fff3d4');text('EXTRA MINUTES',180,108,27,'#ffd36b');g.restore()}
 const dip=max(i?1-age/.2:1-t/.6,0);if(dip>0)rr(0,0,360,640,0,'rgba(14,6,28,'+clamp(dip)*(i?.7:1)+')');
 const out=smooth((t-edit.duration+.7)/.7);if(out>0)rr(0,0,360,640,0,'rgba(10,5,22,'+out+')');
};
