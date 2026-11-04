import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const url=process.env.HALL_URL||'http://127.0.0.1:5173/';
const browser=await chromium.launch({channel:'chromium',headless:true,args:['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']});
fs.mkdirSync('outputs/guided-tour',{recursive:true});
try{
 for(const backend of ['webgpu','webgl']){
  const page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  if(backend==='webgl')await page.addInitScript(()=>localStorage.setItem('exalted-renderer-v1','webgl'));
  await page.goto(url);await page.waitForFunction(()=>window.hall&&document.documentElement.dataset.appState==='ready',null,{timeout:120000});
  assert.equal(await page.evaluate(()=>hall.rendererInfo.activeBackend),backend);
  const result=await page.evaluate(()=>{
   hall.engine.stopRenderLoop();const spawn=hall.camera.position.clone(),realNow=performance.now.bind(performance);let time=realNow();performance.now=()=>time;
   const samples=[],assert=(condition,message)=>{if(!condition)throw Error(message)};
   let lastDirection=null,maxTurnRate=0;
   window.inspectMagazineCaption=()=>{
    const V=spawn.constructor,sign=hall.scene.getMeshByName('Hall inscription');
    hall.scene.updateTransformMatrix(true);sign.computeWorldMatrix(true);
    const viewport=hall.camera.viewport.toGlobal(innerWidth,innerHeight);
    const points=[[180,135],[840,135],[840,185],[180,185]].map(([x,y])=>V.Project(new V((x/1024-.5)*8,(.5-y/256)*2,0),sign.getWorldMatrix(),hall.scene.getTransformMatrix(),viewport));
    const footer=document.querySelector('footer').getBoundingClientRect();
    assert(points.every(p=>p.z>0&&p.z<1&&p.x>0&&p.x<innerWidth&&p.y>0&&p.y<footer.top-12),'Magazine caption is cropped or covered by the footer');
    return {captionBottom:Math.max(...points.map(p=>p.y)),footerTop:footer.top};
   };
   try{
    // Starting from another view must use the actual current entrance pose.
    hall.camera.position.set(3,6,30);document.querySelector('#tour').click();const start=time;
    assert(hall.camera.position.equalsWithEpsilon(spawn),'Tour does not start at spawn');
    for(let ms=0;ms<=30000;ms+=100){
     time=start+ms;hall.scene.onBeforeRenderObservable.notifyObservers(hall.scene);
     assert(hall.camera.position.z>=spawn.z&&hall.camera.position.z<=37,'Tour overshot its path');
     assert(Math.abs(hall.camera.position.x)<1.5,'Tour left the centre aisle');
     const direction=hall.camera.getForwardRay().direction.clone();
     assert(direction.z>0,'Tour turns behind an exhibit');
     if(lastDirection){const dot=direction.x*lastDirection.x+direction.y*lastDirection.y+direction.z*lastDirection.z;maxTurnRate=Math.max(maxTurnRate,Math.acos(Math.max(-1,Math.min(1,dot)))/.1)}
     lastDirection=direction;
     samples.push(hall.camera.position.asArray());
    }
    const finish=hall.camera.position.clone();assert(finish.equalsWithEpsilon(new (spawn.constructor)(0,3.2,37)),'Tour ends too close to central pedestal');
    assert(maxTurnRate<2,'An article turn accelerates too sharply');
    const tourFraming=inspectMagazineCaption();window.tourEndDirection=hall.camera.getForwardRay().direction.clone();
    assert(!document.querySelector('#tour').textContent.includes('Pause'),'Tour did not finish');
    time+=5000;hall.scene.onBeforeRenderObservable.notifyObservers(hall.scene);assert(hall.camera.position.equalsWithEpsilon(finish),'Tour continued after finishing');
    document.querySelector('#tour').click();const restart=time;
    for(const [ms,index]of [[6000,0],[12000,3],[18000,4],[24000,7]]){
     time=restart+ms;hall.scene.onBeforeRenderObservable.notifyObservers(hall.scene);
     const target=hall.frames[index].parent.position.clone();target.y=4.35;
     const expected=target.subtract(hall.camera.position).normalize(),actual=hall.camera.getForwardRay().direction;
     assert(expected.x*actual.x+expected.y*actual.y+expected.z*actual.z>.999,'Artwork highlight missed');
    }
    document.querySelector('#tour').click();
    hall.camera.position.copyFrom(finish);hall.camera.setTarget(finish.add(window.tourEndDirection));
    return {spawn:spawn.asArray(),finish:finish.asArray(),samples:samples.length,highlights:4,durationSeconds:30,maxTurnRateDegrees:maxTurnRate*180/Math.PI,tourFraming};
   }finally{performance.now=realNow;hall.engine.runRenderLoop(()=>hall.scene.render())}
  });
  await page.evaluate(()=>{document.querySelector('#light-debug').open=false});
  await page.waitForTimeout(300);await page.screenshot({path:`outputs/guided-tour/${backend}-tour-end.png`});
  await page.evaluate(()=>{hall.camera.position.set(2,5,30);hall.camera.rotation.y=Math.PI*2-.05;window.presetYaws=[];window.presetObserver=hall.scene.onAfterRenderObservable.add(()=>presetYaws.push(hall.camera.rotation.y))});
  await page.locator('[data-view="portal"]').click();
  await page.waitForFunction(()=>hall.camera.position.subtract(new (hall.camera.position.constructor)(0,3.2,37)).lengthSquared()<1e-8,null,{timeout:15000});
  const preset=await page.evaluate(()=>{
   hall.scene.onAfterRenderObservable.remove(presetObserver);
   const direction=hall.camera.getForwardRay().direction,expected=tourEndDirection;
   if(direction.x*expected.x+direction.y*expected.y+direction.z*expected.z<.9999)throw Error('Portal button and tour end use different framing');
   if(Math.max(...presetYaws)-Math.min(...presetYaws)>Math.PI)throw Error('Portal button turns through the long yaw arc');
   return inspectMagazineCaption();
  });
  await page.screenshot({path:`outputs/guided-tour/${backend}-portal-button.png`});
  await page.setViewportSize({width:1024,height:768});await page.waitForTimeout(200);
  const compact=await page.evaluate(()=>inspectMagazineCaption());
  await page.locator('#tour').click();await page.keyboard.press('w');
  assert.equal(await page.evaluate(()=>document.querySelector('#tour').textContent.includes('Pause')),false);
  assert.deepEqual(errors,[]);console.log({backend,...result,portalButton:preset,compactFraming:compact,keyboardCancellation:true});await page.close();
 }
}finally{await browser.close()}
