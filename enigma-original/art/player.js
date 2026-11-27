// Render from absolute audio time so preview and final export use identical frames.
const clean=s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,'');
const texture=document.createElement('canvas');texture.width=192;texture.height=192;
const tg=texture.getContext('2d'),pixels=tg.createImageData(192,192);
for(let i=0;i<pixels.data.length;i+=4){const n=rand(i)*255;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=n;pixels.data[i+3]=17}
tg.putImageData(pixels,0,0);
const grain=g.createPattern(texture,'repeat');
let edit,wordIndex;
window.loadEpisode=data=>{
 edit=data;
 for(const b of edit.beats){if(!scenes[b.id])throw Error('Missing scene '+b.id);
 b.words=edit.words.filter(w=>w.start>=b.start-.001&&w.start<b.speech_end)}
};
window.drawFrame=function(t){
 let i=edit.beats.findIndex((b,k)=>k===edit.beats.length-1||edit.beats[k+1].start>t);
 let b=edit.beats[i],end=edit.beats[i+1]?.start??edit.duration;
 let age=t-b.start,progress=clamp(age/(end-b.start));
 function on(text,occ=1){const hit=b.words.filter(w=>clean(w.text)===clean(text))[occ-1];if(!hit)throw Error('Missing cue '+text+' in '+b.id);return t-hit.start}
 g.setTransform(cv.width/360,0,0,cv.height/640,0,0);g.lineCap='round';g.lineJoin='round';
 g.save();
 let zoom=1.012+.037*smooth(progress);
 g.translate(180,340);g.scale(zoom,zoom);g.translate(-180,-340);
 scenes[b.id](t,{p:progress,age,on});g.restore();
 g.fillStyle=grain;g.fillRect(0,0,360,640);
 let vig=g.createRadialGradient(180,326,107,180,330,377);
 vig.addColorStop(0,'rgba(3,5,15,0)');vig.addColorStop(.65,'rgba(4,6,18,.16)');vig.addColorStop(1,'rgba(3,4,12,.77)');rect(0,0,360,640,vig);
 const word=b.words.find((w,k)=>w.start<=t&&(b.words[k+1]?.start??w.end+.18)>t);
 if(word){let txt=word.text, emphasis=clean(txt)===clean(b.accent||'__');
 let size=Math.min(29,Math.max(20,240/(txt.length*.72)));g.save();g.translate(180,156);let pop=1+.045*(1-clamp((t-word.start)/.12));g.scale(pop,pop);
 g.font=size+'px Story';g.textAlign='center';g.textBaseline='middle';
 g.shadowColor='#11121b';g.shadowBlur=4;g.shadowOffsetY=2;g.lineWidth=2.6;g.strokeStyle='#26202b';g.strokeText(txt,0,0);
 g.fillStyle=emphasis?(['dark','waiting','disappear'].includes(clean(txt))?'#ffa38b':'#ffda82'):'#fff7e5';g.fillText(txt,0,0);g.restore()}
 if(i===edit.beats.length-1){layer(smooth((t-edit.duration+.49)/.49),()=>rect(0,0,360,640,'#121624'))}
};
