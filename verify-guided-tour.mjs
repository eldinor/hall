import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const url=process.env.HALL_URL||'http://127.0.0.1:5173/';
const browser=await chromium.launch({channel:'chromium',headless:true,args:['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']});
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
   try{
    // Starting from another view must use the actual current entrance pose.
    hall.camera.position.set(3,6,30);document.querySelector('#tour').click();const start=time;
    assert(hall.camera.position.equalsWithEpsilon(spawn),'Tour does not start at spawn');
    for(let ms=0;ms<=30000;ms+=500){
     time=start+ms;hall.scene.onBeforeRenderObservable.notifyObservers(hall.scene);
     assert(hall.camera.position.z>=spawn.z&&hall.camera.position.z<=37,'Tour overshot its path');
     assert(Math.abs(hall.camera.position.x)<1.5,'Tour left the centre aisle');
     samples.push(hall.camera.position.asArray());
    }
    const finish=hall.camera.position.clone();assert(finish.equalsWithEpsilon(new (spawn.constructor)(0,3.2,37)),'Tour ends too close to central pedestal');
    assert(!document.querySelector('#tour').textContent.includes('Pause'),'Tour did not finish');
    time+=5000;hall.scene.onBeforeRenderObservable.notifyObservers(hall.scene);assert(hall.camera.position.equalsWithEpsilon(finish),'Tour continued after finishing');
    document.querySelector('#tour').click();const restart=time;
    for(const [ms,index]of [[6000,0],[12000,5],[18000,2],[24000,7]]){
     time=restart+ms;hall.scene.onBeforeRenderObservable.notifyObservers(hall.scene);
     const target=hall.frames[index].parent.position.clone();target.y=4.35;
     const expected=target.subtract(hall.camera.position).normalize(),actual=hall.camera.getForwardRay().direction;
     assert(expected.x*actual.x+expected.y*actual.y+expected.z*actual.z>.999,'Artwork highlight missed');
    }
    document.querySelector('#tour').click();
    return {spawn:spawn.asArray(),finish:finish.asArray(),samples:samples.length,highlights:4,durationSeconds:30};
   }finally{performance.now=realNow;hall.engine.runRenderLoop(()=>hall.scene.render())}
  });
  await page.locator('#tour').click();await page.keyboard.press('w');
  assert.equal(await page.evaluate(()=>document.querySelector('#tour').textContent.includes('Pause')),false);
  assert.deepEqual(errors,[]);console.log({backend,...result,keyboardCancellation:true});await page.close();
 }
}finally{await browser.close()}
