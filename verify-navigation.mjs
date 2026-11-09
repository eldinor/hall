import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const url=process.env.HALL_URL||'http://127.0.0.1:5173/';
const browser=await chromium.launch({channel:'chromium',headless:true,args:['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']});
try{
 for(const backend of ['webgpu','webgl']){
  const page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  if(backend==='webgl')await page.addInitScript(()=>localStorage.setItem('exalted-renderer-v1','webgl'));
  await page.goto(url);
  await page.waitForFunction(()=>window.hall&&document.documentElement.dataset.appState==='ready',null,{timeout:120000});
  assert.equal(await page.evaluate(()=>hall.rendererInfo.activeBackend),backend);
  assert.equal(await page.evaluate(()=>hall.engine.constructor.Version),JSON.parse(fs.readFileSync('package.json','utf8')).dependencies['@babylonjs/core'],'Running server has a stale Babylon.js dependency');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'scene');
  async function move(key,axis,sign){
   // Leave ample room inside the walking bounds and remove residual inertia.
   await page.evaluate(()=>{const c=hall.camera;c.position.set(0,4.6,0);c.rotation.set(0,0,0);c.movement.resetPanVelocity()});
   await page.keyboard.down(key);
   try{await page.waitForFunction(({axis,sign})=>hall.camera.position[axis]*sign>.1,{axis,sign},{timeout:15000})}
   catch(error){console.error(key,await page.evaluate(()=>({focus:document.activeElement.id,attached:hall.camera.inputs.attachedToElement,keys:hall.camera.inputs.attached.keyboard._keys,position:hall.camera.position.asArray(),dialogs:document.querySelectorAll('dialog[open]').length,frames:hall.scene.getFrameId(),observer:!!hall.camera.inputs.attached.keyboard._onKeyboardObserver})));throw error}
   finally{await page.keyboard.up(key)}
  }
  for(const [key,axis,sign] of [['w','z',1],['s','z',-1],['a','x',-1],['d','x',1],['ArrowUp','z',1],['ArrowDown','z',-1],['ArrowLeft','x',-1],['ArrowRight','x',1]])await move(key,axis,sign);
  const walkingSpeed=await page.evaluate(()=>hall.camera.speed);
  // Measure actual camera displacement over identical simulated frames, using
  // real keyboard events. This avoids GPU frame-rate noise in the speed ratio.
  await page.evaluate(()=>hall.engine.stopRenderLoop());
  async function distance(){
   await page.evaluate(()=>{hall.camera.position.set(0,4.6,0);hall.camera.rotation.set(0,0,0);hall.camera.movement.resetPanVelocity()});
   await page.keyboard.down('w');
   try{return await page.evaluate(()=>{
    const engine=hall.engine,getDeltaTime=engine.getDeltaTime,getFps=engine.getFps;
    engine.getDeltaTime=()=>1000/60;engine.getFps=()=>60;
    try{for(let i=0;i<10;i++)hall.camera._checkInputs();return hall.camera.position.z}
    finally{engine.getDeltaTime=getDeltaTime;engine.getFps=getFps}
   })}finally{await page.keyboard.up('w')}
  }
  const walkingDistance=await distance();
  await page.keyboard.down('ShiftLeft');
  const runningDistance=await distance();
  assert.ok(walkingDistance>0&&Math.abs(runningDistance/walkingDistance-2)<.01,'Shift did not double movement speed');
  await page.keyboard.up('ShiftLeft');assert.equal(await page.evaluate(()=>hall.camera.speed),walkingSpeed);
  await page.keyboard.down('ShiftRight');assert.equal(await page.evaluate(()=>hall.camera.speed),walkingSpeed*2);
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
  assert.equal(await page.evaluate(()=>hall.camera.speed),walkingSpeed);
  await page.keyboard.up('ShiftRight');
  await page.evaluate(()=>hall.engine.runRenderLoop(()=>hall.scene.render()));
  // Toolbar focus must not disable navigation or let an active camera move
  // overwrite keyboard movement. Do not manually refocus the canvas here.
  await page.locator('[data-view="nave"]').click();await move('w','z',1);
  await page.locator('#tour').click();await move('a','x',-1);
  await page.evaluate(()=>{document.querySelector('#scene').blur();hall.camera.position.set(0,4.6,0);hall.camera.rotation.set(0,0,0);hall.camera.movement.resetPanVelocity()});
  await page.keyboard.down('d');
  await page.waitForFunction(()=>hall.camera.position.x>.1);
  await page.keyboard.up('d');
  const shortcutPosition=await page.evaluate(()=>{hall.camera.movement.resetPanVelocity();return hall.camera.position.asArray()});
  await page.keyboard.press('Control+a');await page.waitForTimeout(300);
  assert.deepEqual(await page.evaluate(()=>hall.camera.position.asArray()),shortcutPosition);
  // A non-Latin layout still uses the physical W location.
  await page.evaluate(()=>{hall.camera.position.set(0,4.6,0);hall.camera.rotation.set(0,0,0);hall.camera.movement.resetPanVelocity();document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'\u0446',code:'KeyW',keyCode:1062,bubbles:true}))});
  await page.waitForFunction(()=>hall.camera.position.z>.1);
  await page.evaluate(()=>document.body.dispatchEvent(new KeyboardEvent('keyup',{key:'\u0446',code:'KeyW',keyCode:1062,bubbles:true})));
  await page.locator('#help').click();
  const before=await page.evaluate(()=>{hall.camera.movement.resetPanVelocity();return hall.camera.position.asArray()});
  await page.keyboard.down('w');await page.waitForTimeout(300);await page.keyboard.up('w');
  assert.deepEqual(await page.evaluate(()=>hall.camera.position.asArray()),before);
  await page.locator('#got-it').click();
  await page.waitForFunction(()=>document.activeElement.id==='scene'&&hall.camera.inputs.attachedToElement);await move('w','z',1);
  await page.evaluate(()=>hall.openArticle(0));await page.locator('#close').click();
  await page.waitForFunction(()=>document.activeElement.id==='scene'&&hall.camera.inputs.attachedToElement);await move('d','x',1);
  await page.locator('#light-debug > summary').click();
  await page.locator('#lighting-ambient').focus();
  assert.equal(await page.evaluate(()=>hall.camera.inputs.attachedToElement),false);
  await page.keyboard.down('ShiftLeft');assert.equal(await page.evaluate(()=>hall.camera.speed),walkingSpeed);await page.keyboard.up('ShiftLeft');
  const debugPosition=await page.evaluate(()=>{hall.camera.movement.resetPanVelocity();return hall.camera.position.asArray()});
  await page.keyboard.down('w');await page.waitForTimeout(300);await page.keyboard.up('w');
  assert.deepEqual(await page.evaluate(()=>hall.camera.position.asArray()),debugPosition);
  // The roof is not an interactive exhibit. A real canvas click must reclaim input.
  await page.mouse.click(500,120);
  await page.waitForFunction(()=>document.activeElement.id==='scene'&&hall.camera.inputs.attachedToElement);
  await move('w','z',1);
  assert.deepEqual(errors,[]);
  console.log(`${backend}: WASD, arrows, Shift running (2x), focus/blur, non-Latin layout, dialogs and debug controls passed`);
  await page.close();
 }
}finally{await browser.close()}
