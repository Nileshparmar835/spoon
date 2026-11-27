// Draw an interval so a long export has a bounded native-memory lifetime.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { once } = require('node:events');
const { createCanvas, Path2D, GlobalFonts } = require('@napi-rs/canvas');
const root = path.resolve(__dirname, '..');
const [width, first, end] = process.argv.slice(2).map(Number);
const canvas = createCanvas(width, width * 16 / 9);
GlobalFonts.registerFromPath(path.join(root,'art/DejaVuSerif-Bold.ttf'),'Story');
GlobalFonts.registerFromPath(path.join(root,'art/DejaVuSans-Bold.ttf'),'Label');
const context = vm.createContext({
  window: {}, Path2D, document: {
    querySelector: () => canvas, createElement: () => createCanvas(192,192)
  }
});
for (const file of ['drawing.js','scenes.js','player.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,'art',file),'utf8'),context,{filename:file});
}
context.window.loadEpisode(JSON.parse(fs.readFileSync(path.join(root,'output/edit.json'),'utf8')));
async function main(){
  for(let n=first;n<end;n++){
    context.window.drawFrame(n/30);
    if(!process.stdout.write(canvas.toBuffer('image/jpeg',94)))await once(process.stdout,'drain');
  }
}
main().catch(e=>{console.error(e);process.exitCode=1});
