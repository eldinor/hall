import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const url=process.env.HALL_URL||'http://127.0.0.1:5173/';
const hubURL='https://alpha.exalted8.com/hub';
const browser=await chromium.launch({channel:'chromium',headless:true,args:['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']});
fs.mkdirSync('outputs/hub-portal',{recursive:true});
const report=[];
try{
 for(const backend of ['webgpu','webgl']){
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error'||/GPUValidationError|uncaptured error/.test(message.text()))errors.push(message.text())});
  if(backend==='webgl')await page.addInitScript(()=>localStorage.setItem('exalted-renderer-v1','webgl'));
  await page.goto(url);await page.waitForFunction(()=>window.hall&&document.documentElement.dataset.appState==='ready',null,{timeout:120000});
  assert.equal(await page.evaluate(()=>hall.rendererInfo.activeBackend),backend);
  await page.evaluate(()=>{document.querySelector('#light-debug').open=false;hall.camera.position.set(0,5,34);hall.camera.setTarget(hall.hubPortal.root.position)});
  await page.waitForFunction(()=>hall.hubPortal.getState().activeFlames>0);
  const state=await page.evaluate(()=>{
   const hub=hall.hubPortal,normal=hub.surface.getDirection(new (hall.camera.position.constructor)(0,0,1));
   return {...hub.getState(),normal:normal.asArray(),label:hub.label.name,collisions:hub.ring.checkCollisions||hub.surface.checkCollisions,aoExcluded:!hall.scene.geometryBufferRenderer.renderList.some(m=>m.metadata?.hubPortal)};
  });
  assert.deepEqual(state.position,[-6,.07,44]);assert.equal(state.label,'To the Hub');assert.equal(state.particleBackend,'gpu');assert.equal(state.collisions,false);assert.ok(Math.abs(state.normal[1])>1&&state.aoExcluded);
  await page.waitForTimeout(1000);await page.screenshot({path:`outputs/hub-portal/${backend}.png`});
  const initialURL=page.url(),prompt=page.locator('#hub-portal-prompt');
  await page.evaluate(()=>{window.hubEvents=[];window.addEventListener('exalted:portal-entered',event=>{if(event.detail.id==='gallery-hub-portal'){hubEvents.push(event.detail);if(!window.allowHubNavigation)event.preventDefault()}})});
  assert.equal(await prompt.isVisible(),false);await page.keyboard.press('e');assert.equal(await page.evaluate(()=>hubEvents.length),0);
  await page.evaluate(()=>{hall.camera.position.set(-6,4.6,36.5);hall.camera.setTarget(hall.hubPortal.root.position)});
  await prompt.waitFor({state:'hidden'});await page.keyboard.press('e');assert.equal(await page.evaluate(()=>hubEvents.length),0);
  await page.evaluate(()=>{hall.camera.position.set(-6,4.6,37.5);hall.camera.setTarget(hall.hubPortal.root.position)});
  await prompt.waitFor({state:'visible'});assert.equal(await page.evaluate(()=>hall.hubPortal.getState().horizontalInteractionRadius),7);
  await page.evaluate(()=>{hall.camera.position.set(-3,4.6,hall.hubPortal.root.position.z);hall.camera.rotation.set(0,0,0)});
  await prompt.waitFor({state:'hidden'});await page.keyboard.press('e');assert.equal(await page.evaluate(()=>hubEvents.length),0);
  await page.evaluate(()=>hall.camera.setTarget(hall.hubPortal.root.position));await prompt.waitFor({state:'visible'});
  await page.evaluate(()=>hall.openArticle(0));await prompt.waitFor({state:'hidden'});await page.keyboard.press('e');assert.equal(await page.evaluate(()=>hubEvents.length),0);
  await page.locator('#close').click();await prompt.waitFor({state:'visible'});await page.keyboard.press('e');
  assert.equal(await prompt.textContent(),'Opening the Hub…');
  assert.deepEqual(await page.evaluate(()=>hubEvents),[{id:'gallery-hub-portal',position:{x:-6,y:.07,z:44},destination:hubURL}]);
  await page.evaluate(()=>document.querySelector('#scene').dispatchEvent(new KeyboardEvent('keydown',{code:'KeyE',key:'e',repeat:true,bubbles:true})));
  assert.equal(await page.evaluate(()=>hubEvents.length),1);assert.equal(page.url(),initialURL);
  await page.screenshot({path:`outputs/hub-portal/${backend}-event.png`});
  await page.evaluate(()=>hall.camera.position.set(0,5,34));await prompt.waitFor({state:'hidden'});
  await page.evaluate(()=>hall.visuals.setProfile('performance'));
  assert.equal(await page.evaluate(()=>hall.hubPortal.flames.emitRate),55);
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>!hall.hubPortal.getState().flamesEnabled);
  const frozen=await page.evaluate(()=>hall.hubPortal.getState().time);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>hall.hubPortal.getState().time),frozen);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>hall.hubPortal.getState().flamesEnabled);
  await page.route(hubURL,route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Hub navigation test</title>'}));
  await page.evaluate(()=>{window.allowHubNavigation=true;hall.camera.position.set(-3,4.6,44);hall.camera.setTarget(hall.hubPortal.root.position);document.querySelector('#scene').focus()});
  await prompt.waitFor({state:'visible'});
  await Promise.all([page.waitForURL(hubURL),page.keyboard.press('e')]);
  assert.deepEqual(errors,[]);report.push({backend,...state,qualityProfile:true,reducedMotion:true,hubEvent:true,visibleConfirmation:true,navigationURL:page.url()});await page.close();
 }
 console.log(JSON.stringify(report,null,2));
}finally{fs.writeFileSync('outputs/hub-portal/report.json',JSON.stringify(report,null,2));await browser.close()}
