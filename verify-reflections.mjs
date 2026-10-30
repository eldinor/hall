const url=process.env.HALL_URL||'http://127.0.0.1:5173/';
import {chromium} from 'playwright';
import fs from 'node:fs';
import sharp from 'sharp';
const hardware=process.argv.includes('--hardware');
const backend=process.argv.includes('--backend')?process.argv[process.argv.indexOf('--backend')+1]:null;
const browser=await chromium.launch({channel:backend?'chromium':undefined,headless:!hardware,args:backend?['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']:hardware?['--use-angle=d3d11','--force_high_performance_gpu']:['--enable-webgl','--ignore-gpu-blocklist']});
const directory='outputs/visual/reflections'+(backend?'-'+backend:'');fs.mkdirSync(directory,{recursive:true});
const report={mode:hardware?'hardware visual check':'headless correctness',checks:[]},errors=[];
async function difference(a,b,region){const buffers=await Promise.all([a,b].map(file=>sharp(file).extract(region).removeAlpha().raw().toBuffer()));let total=0;for(let i=0;i<buffers[0].length;i++)total+=Math.abs(buffers[0][i]-buffers[1][i]);return total/buffers[0].length}
try{
 const page=await browser.newPage({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
 if(backend==='webgl')await page.addInitScript(()=>localStorage.setItem('exalted-renderer-v1','webgl'));
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto(url);await page.waitForFunction(()=>window.hall&&document.documentElement.dataset.appState==='ready',null,{timeout:120000});
 report.rendererInfo=await page.evaluate(()=>hall.rendererInfo);
 if(backend&&report.rendererInfo.activeBackend!==backend)throw Error('Expected '+backend+', got '+report.rendererInfo.activeBackend);
 await page.evaluate(()=>{document.querySelector('#light-debug').open=false});await page.waitForTimeout(800);await page.screenshot({path:directory+'/entrance.png'});
 for(const [name,position,target,region,minimum]of [
  ['floor',[0,2.2,-8],[0,.9,22],{left:450,top:580,width:1020,height:370},3],
  ['pedestal-base',[-5,2.2,-.5],[-7.8,.65,2],{left:220,top:580,width:1400,height:240},.3]
 ]){
  await page.evaluate(({name,position,target})=>{const V=hall.camera.position.constructor;hall.camera.position.set(...position);hall.camera.setTarget(new V(...target));window.reflectionMaterial=hall.scene.materials.find(m=>m.name===(name==='floor'?'Smoky reflective marble':'Obsidian plinth'));window.savedReflection=reflectionMaterial.reflectionTexture;}, {name,position,target});
  await page.waitForTimeout(1000);await page.screenshot({path:directory+'/'+name+'-on.png'});
  await page.evaluate(()=>reflectionMaterial.reflectionTexture=null);await page.waitForTimeout(1000);await page.screenshot({path:directory+'/'+name+'-off.png'});
  const delta=await difference(directory+'/'+name+'-on.png',directory+'/'+name+'-off.png',region);
  report.checks.push({surface:name,meanPixelDifference:delta});if(delta<minimum)throw Error(name+' reflection has no visible contribution');
  await page.evaluate(()=>{reflectionMaterial.reflectionTexture=savedReflection});
 }
 await page.evaluate(()=>hall.visuals.setProfile('performance'));await page.waitForTimeout(1000);
 const target=await page.evaluate(async()=>{const m=hall.visuals.mirror,p=await m.readPixels();let bright=0;for(let i=0;i<p.length;i+=4)if(p[i]+p[i+1]+p[i+2]>30)bright++;return {size:m.getSize().width,brightPixels:bright,blurX:m.blurKernelX,blurY:m.blurKernelY}});
 report.checks.push({performanceTarget:target});if(target.size!==512||target.brightPixels<1000)throw Error('Performance mirror target is empty');
 if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify(report,null,2));
}catch(error){errors.push(error.message);throw error}
finally{fs.writeFileSync(directory+'/report.json',JSON.stringify({...report,errors},null,2));await browser.close()}
