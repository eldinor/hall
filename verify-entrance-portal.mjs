import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const url=process.env.HALL_URL||'http://127.0.0.1:5173/';
const browser=await chromium.launch({channel:'chromium',headless:true,args:['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']});
fs.mkdirSync('outputs/entrance-portal',{recursive:true});
const report=[];
try{
 for(const backend of ['webgpu','webgl']){
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error'||/GPUValidationError|uncaptured error/i.test(message.text()))errors.push(message.text())});
  if(backend==='webgl')await page.addInitScript(()=>localStorage.setItem('exalted-renderer-v1','webgl'));
  await page.goto(url);await page.waitForFunction(()=>window.hall&&document.documentElement.dataset.appState==='ready',null,{timeout:120000});
  assert.equal(await page.evaluate(()=>hall.rendererInfo.activeBackend),backend);
  const initial=await page.evaluate(()=>({portal:hall.entrancePortal.getState(),spawn:hall.camera.position.asArray(),meshes:hall.scene.meshes.filter(m=>m.metadata?.entrancePortal).map(m=>({name:m.name,pickable:m.isPickable,ready:m.material.isReady(m)}))}));
  assert.equal(initial.portal.entered,false);assert.equal(initial.portal.destination,'https://eldinor.github.io/exalted-sandbox/');
  assert.ok(initial.portal.position[2]<initial.spawn[2]);assert.ok(initial.portal.position[2]>-23);
  assert.equal(initial.meshes.length,2);assert.ok(initial.meshes.every(m=>m.ready&&!m.pickable));
  // The walking body must stop at the wall, including elevated camera presets.
  for(const eyeHeight of [2.2,3.1,4.6]){
   await page.evaluate(y=>{hall.camera.position.set(8,y,-20.9);hall.camera.rotation.set(0,Math.PI,0);hall.camera.movement.resetPanVelocity()},eyeHeight);
   await page.keyboard.down('w');
   try{await page.waitForFunction(()=>hall.camera.position.z< -21,null,{timeout:15000});await page.waitForTimeout(250)}finally{await page.keyboard.up('w')}
   assert.ok(await page.evaluate(()=>hall.camera.position.z>=-21.06),'Keyboard passed through the back wall');
   await page.mouse.move(500,120);
   for(let i=0;i<4;i++)await page.mouse.wheel(0,200);
   assert.ok(await page.evaluate(()=>hall.camera.position.z>=-21.06),'Wheel passed through the back wall');
  }
  await page.evaluate(()=>{document.querySelector('#light-debug').open=false;hall.camera.position.set(0,4.6,-13);hall.camera.setTarget(hall.entrancePortal.root.position)});
  await page.waitForTimeout(800);await page.screenshot({path:`outputs/entrance-portal/${backend}.png`});
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
  const frozen=await page.evaluate(()=>hall.entrancePortal.getState().time);await page.waitForTimeout(200);
  assert.equal(await page.evaluate(()=>hall.entrancePortal.getState().time),frozen);
  await page.emulateMedia({reducedMotion:'no-preference'});
  const prompt=page.locator('#entrance-portal-prompt');
  assert.equal(await prompt.isVisible(),false);
  let redirects=0;
  await page.route('https://eldinor.github.io/exalted-sandbox/**',async route=>{redirects++;await route.fulfill({contentType:'text/html',body:'<h1>Sandbox destination intercepted by gallery QA</h1>'})});
  await page.evaluate(()=>{hall.camera.position.set(0,4.6,-18.2);hall.camera.setTarget(hall.entrancePortal.root.position);hall.camera.movement.resetPanVelocity()});
  await prompt.waitFor({state:'visible'});assert.equal(await prompt.textContent(),'Press E to return to Sandbox');
  await page.evaluate(()=>hall.camera.rotation.set(0,0,0));await prompt.waitFor({state:'hidden'});
  await page.keyboard.press('e');assert.equal(redirects,0);
  await page.evaluate(()=>{hall.camera.position.z=-13;hall.camera.setTarget(hall.entrancePortal.root.position)});await prompt.waitFor({state:'hidden'});
  await page.keyboard.press('e');assert.equal(redirects,0);
  await page.evaluate(()=>{hall.camera.position.z=-18.2;hall.camera.setTarget(hall.entrancePortal.root.position)});await prompt.waitFor({state:'visible'});
  await page.locator('#tour').click();await prompt.waitFor({state:'hidden'});await page.keyboard.press('e');assert.equal(redirects,0);await page.locator('#tour').click();
  await page.evaluate(()=>{hall.camera.position.set(0,4.6,-18.2);hall.camera.setTarget(hall.entrancePortal.root.position);document.querySelector('#light-debug').open=true;document.querySelector('#lighting-ambient').focus()});
  await prompt.waitFor({state:'hidden'});await page.keyboard.press('e');assert.equal(redirects,0);
  await page.evaluate(()=>{document.querySelector('#light-debug').open=false;document.querySelector('#scene').focus()});await prompt.waitFor({state:'visible'});
  await page.evaluate(()=>hall.openArticle(0));await prompt.waitFor({state:'hidden'});await page.keyboard.press('e');assert.equal(redirects,0);await page.locator('#close').click();await prompt.waitFor({state:'visible'});
  // Walk through the plane without E: no collision or automatic navigation.
  assert.equal(await page.evaluate(()=>hall.entrancePortal.ring.checkCollisions||hall.entrancePortal.surface.checkCollisions),false);
  await page.keyboard.down('w');
  try{await page.waitForFunction(()=>hall.camera.position.z<hall.entrancePortal.root.position.z-.1,null,{timeout:15000})}finally{await page.keyboard.up('w')}
  assert.equal(redirects,0);assert.equal(await page.evaluate(()=>hall.entrancePortal.getState().entered),false);
  // Turning back toward the portal from its other side still permits E.
  await page.evaluate(()=>{hall.camera.movement.resetPanVelocity();hall.camera.setTarget(hall.entrancePortal.root.position)});await prompt.waitFor({state:'visible'});
  await page.keyboard.press('e');await page.waitForURL('https://eldinor.github.io/exalted-sandbox/',{timeout:15000});
  assert.equal(redirects,1);assert.deepEqual(errors,[]);
  report.push({backend,position:initial.portal.position,shadersReady:true,reducedMotion:true,nearAndFacingPrompt:true,hiddenWhenAwayOrBusy:true,walkThroughWithoutNavigation:true,pressERedirect:true,errors});
  await page.close();
 }
 console.log(JSON.stringify(report,null,2));
}finally{fs.writeFileSync('outputs/entrance-portal/report.json',JSON.stringify(report,null,2));await browser.close()}
