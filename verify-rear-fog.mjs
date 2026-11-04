import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import sharp from 'sharp';

const url=process.env.HALL_URL||'http://127.0.0.1:5173/';
const browser=await chromium.launch({channel:'chromium',headless:true,args:['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']});
fs.mkdirSync('outputs/rear-fog',{recursive:true});const report=[];
async function difference(a,b,region){const pixels=await Promise.all([a,b].map(bytes=>sharp(bytes).extract(region).removeAlpha().raw().toBuffer()));let total=0;for(let i=0;i<pixels[0].length;i++)total+=Math.abs(pixels[0][i]-pixels[1][i]);return total/pixels[0].length}
try{
 for(const backend of ['webgpu','webgl']){
  const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error'||/GPUValidationError|uncaptured error/.test(message.text()))errors.push(message.text())});
  if(backend==='webgl')await page.addInitScript(()=>localStorage.setItem('exalted-renderer-v1','webgl'));
  await page.goto(url);await page.waitForFunction(()=>window.hall&&document.documentElement.dataset.appState==='ready',null,{timeout:120000});
  assert.equal(await page.evaluate(()=>hall.rendererInfo.activeBackend),backend);
  const state=await page.evaluate(()=>{const fog=hall.rearGroundFog;document.querySelector('#light-debug').open=false;return {...fog.getState(),collisions:fog.mesh.checkCollisions,pickable:fog.mesh.isPickable,ready:fog.mesh.material.isReady(fog.mesh)}});
  assert.deepEqual(state.position,[0,7,-27]);assert.equal(state.collisions,false);assert.equal(state.pickable,false);assert.equal(state.ready,true);assert.equal(state.time,0);
  await page.evaluate(()=>{hall.camera.position.set(0,4.6,0);const V=hall.camera.position.constructor;hall.camera.setTarget(new V(0,6,-27))});await page.waitForTimeout(500);
  const backOn=await page.screenshot({path:`outputs/rear-fog/${backend}-back-on.png`});
  await page.evaluate(()=>hall.rearGroundFog.mesh.setEnabled(false));await page.waitForTimeout(100);
  const backOff=await page.screenshot({path:`outputs/rear-fog/${backend}-back-off.png`});
  const lowerChange=await difference(backOn,backOff,{left:220,top:380,width:170,height:100});
  const upperChange=await difference(backOn,backOff,{left:300,top:140,width:140,height:70});
  assert.ok(lowerChange>1,'Rear fog did not mask the low sky');assert.ok(upperChange<.15,'Rear fog obscured the upper sky');
  await page.evaluate(()=>{hall.camera.position.set(0,4.6,-15);const V=hall.camera.position.constructor;hall.camera.setTarget(new V(2.7,8.5,28))});await page.waitForTimeout(200);
  const frontOff=await page.screenshot();await page.evaluate(()=>hall.rearGroundFog.mesh.setEnabled(true));await page.waitForTimeout(100);const frontOn=await page.screenshot();
  const frontChange=await difference(frontOn,frontOff,{left:80,top:170,width:1100,height:500});assert.ok(frontChange<.15,'Rear fog affected the forward gallery view');
  await page.evaluate(()=>hall.visuals.setProfile('performance'));assert.equal(await page.evaluate(()=>hall.rearGroundFog.mesh.material.isReady(hall.rearGroundFog.mesh)),true);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>hall.rearGroundFog.getState().time>0);
  assert.deepEqual(errors,[]);report.push({backend,lowerChange,upperChange,frontChange,reducedMotion:true,performanceProfile:true});await page.close();
 }
 console.log(JSON.stringify(report,null,2));
}finally{fs.writeFileSync('outputs/rear-fog/report.json',JSON.stringify(report,null,2));await browser.close()}
