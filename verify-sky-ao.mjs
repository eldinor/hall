import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import sharp from 'sharp';

const base=process.env.HALL_URL||'http://127.0.0.1:5174';
await mkdir('outputs/sky-ao',{recursive:true});
const browser=await chromium.launch({channel:'chromium',headless:true,args:['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']});
try{
 for(const backend of ['auto','webgl']){
  const page=await browser.newPage({viewport:{width:1400,height:850},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(value=>localStorage.setItem('exalted-renderer-v1',value),backend);
  await page.goto(base);
  await page.waitForFunction(()=>window.hall&&document.documentElement.dataset.appState==='ready',null,{timeout:120000});
  // Rebuild AO as well as testing the initial pipeline and persisted controls.
  await page.evaluate(async()=>{await hall.lightingDebug.setSettings({qualityProfile:'performance'});await hall.lightingDebug.setSettings({qualityProfile:'cinematic',aoEnabled:true,aoStrength:1.5,aoRadius:1})});
  for(const view of ['rear','window']){
   await page.evaluate(view=>{hall.camera.position.set(0,4.6,10);hall.camera.setTarget(view==='rear'?hall.entrancePortal.root.position:hall.camera.position.clone().set(13,10,13))},view);
   await page.waitForTimeout(500);
   const picture=await page.screenshot({path:`outputs/sky-ao/${backend}-${view}.png`});
   const region=view==='rear'?{left:550,top:150,width:300,height:90}:{left:655,top:380,width:90,height:90};
   const {data,info}=await sharp(picture).extract(region).removeAlpha().raw().toBuffer({resolveWithObject:true});
   let black=0;for(let i=0;i<data.length;i+=info.channels)if(data[i]+data[i+1]+data[i+2]<6)black++;
   assert.ok(black/(info.width*info.height)<.01,`${backend} ${view}: black sky cutout`);
  }
  await page.reload();
  await page.waitForFunction(()=>window.hall&&document.documentElement.dataset.appState==='ready',null,{timeout:120000});
  assert.equal(await page.evaluate(()=>hall.visuals.getState().settings.aoStrength),1.5);
  assert.deepEqual(errors,[]);
  console.log(`${backend}: sky and portal clear at strong AO, profile switching and persistence pass`);
  await page.close();
 }
}finally{await browser.close()}
