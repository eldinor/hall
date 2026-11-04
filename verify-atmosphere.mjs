import {chromium} from 'playwright';
import fs from 'node:fs';

const hardware=process.argv.includes('--hardware');
const backend=process.argv.includes('--backend')?process.argv[process.argv.indexOf('--backend')+1]:null;
const url=process.env.HALL_URL||'http://127.0.0.1:5173/';
const browser=await chromium.launch({channel:backend?'chromium':undefined,headless:!hardware,args:backend?['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']:hardware?['--use-angle=d3d11','--force_high_performance_gpu']:['--enable-webgl','--ignore-gpu-blocklist']});
const errors=[],report={mode:hardware?'hardware browser':'headless correctness',checks:[]};
const folder='outputs/visual/particles';fs.mkdirSync(folder,{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1920,height:1080}});
 if(backend==='webgl')await page.addInitScript(()=>localStorage.setItem('exalted-renderer-v1','webgl'));
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'||/GPUValidationError|uncaptured error|invalid due to a previous error/i.test(m.text()))errors.push(m.text())});
 await page.goto(url);
 await page.waitForFunction(()=>window.hall&&document.querySelector('#loading').classList.contains('done'),{timeout:120000});
 report.rendererInfo=await page.evaluate(()=>hall.rendererInfo);
 if(backend&&report.rendererInfo.activeBackend!==backend)throw Error('Expected '+backend+', got '+report.rendererInfo.activeBackend);
 await page.evaluate(()=>hall.visuals.ready);await page.waitForTimeout(2500);
 report.checks.push(await page.evaluate(()=>{
  const assert=(c,m)=>{if(!c)throw Error(m)},a=hall.atmosphere,s=a.getState();
  assert(s.backend==='gpu'&&s.fallbackReason===null&&a.systems.every(p=>p.getClassName()==='GPUParticleSystem'),'Supported renderer did not use GPU particles');
  assert(s.enabled&&s.systems.length===5&&s.systems.every(p=>p.active>0),'Air particles did not populate');
  assert(!hall.scene.meshes.some(m=>m.name==='Ambient motes'),'Old line mesh remains');
  assert(hall.visuals.mirror.renderParticles===false&&hall.scene.reflectionProbes.every(p=>p.renderParticles===false),'Particles leak into reflections');
  assert(hall.scene.geometryBufferRenderer.getGBuffer().renderParticles===false,'Particles leak into occlusion pass');
  assert(!hall.scene.shadowsEnabled&&!hall.scene.lights.some(l=>['SpotLight','DirectionalLight'].includes(l.getClassName())),'Removed lighting restored');
  for(const system of a.systems){const gradients=system.getColorGradients();assert(gradients[0].color1.a===0&&gradients.at(-1).color1.a===0,'Particles pop at birth/death')}
  document.querySelector('#light-debug').open=false;
  return s;
 }));
 await page.screenshot({path:folder+'/entrance.png'});
 await page.evaluate(()=>{const V=hall.camera.position.constructor;hall.camera.position.set(-8.9,9.7,-9);hall.camera.setTarget(new V(-10.4,10.7,-7));});
 await page.waitForTimeout(1000);await page.screenshot({path:folder+'/lantern.png'});
 await page.evaluate(()=>hall.lightingDebug.setSettings({dustEnabled:false}));
 if(!await page.evaluate(()=>!hall.atmosphere.getState().enabled&&hall.atmosphere.systems.every(s=>s.emitter===null)))throw Error('Toggle left particles visible');
 await page.evaluate(()=>hall.lightingDebug.setSettings({dustEnabled:true}));
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>!hall.atmosphere.getState().enabled);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>hall.atmosphere.getState().enabled,null,{timeout:10000});
 await page.evaluate(()=>hall.visuals.setProfile('performance'));await page.waitForTimeout(500);
 report.checks.push(await page.evaluate(()=>{const s=hall.atmosphere.getState();if(s.profile!=='performance'||!s.enabled||hall.atmosphere.systems[0].emitRate!==2.5)throw Error('Performance density failed');return {toggle:true,reducedMotion:true,performance:s}}));
 await page.close();
 const fallback=await browser.newPage({viewport:{width:1024,height:768}});fallback.on('pageerror',e=>errors.push(e.message));fallback.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await fallback.addInitScript(()=>{localStorage.setItem('exalted-renderer-v1','webgl');const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'?null:get.call(this,type,...args)};localStorage.setItem('exalted-lighting-v1',JSON.stringify({schemaVersion:2,qualityProfile:'performance',columnPalette:'blue-v1',glassProfile:'blocks-v1'}));});
 await fallback.goto(url);await fallback.waitForFunction(()=>window.hall&&document.querySelector('#loading').classList.contains('done'),{timeout:120000});await fallback.waitForTimeout(1500);
 report.checks.push(await fallback.evaluate(()=>{const s=hall.atmosphere.getState();if(s.backend!=='cpu'||!s.enabled||s.systems.some(p=>p.active<1))throw Error('CPU particle fallback failed');return {fallback:s}}));
 if(errors.length)throw Error(errors.join('\n'));
 console.log(JSON.stringify(report,null,2));
}catch(error){errors.push(error.message);throw error}
finally{fs.writeFileSync(folder+'/report.json',JSON.stringify({...report,errors},null,2));await browser.close()}
