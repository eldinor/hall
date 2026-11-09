import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args=process.argv.slice(2),hardware=args.includes('--hardware');
const option=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const phase=option('--phase','final'),profile=option('--profile','cinematic');
const backend=option('--backend',null);
const directory=path.resolve('outputs/visual',`${phase}-${hardware?'hardware':'correctness'}-${profile}`);
fs.mkdirSync(directory,{recursive:true});
const browser=await chromium.launch({channel:backend?'chromium':undefined,headless:!hardware,args:backend?['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']:hardware?['--use-angle=d3d11','--force_high_performance_gpu','--disable-background-timer-throttling']:['--enable-webgl','--ignore-gpu-blocklist']});
const report={phase,profile,mode:hardware?'hardware benchmark':'headless correctness only',timestamp:new Date().toISOString(),errors:[],views:[]};
try{
 const page=await browser.newPage({viewport:hardware?{width:1920,height:1080}:{width:1600,height:900},deviceScaleFactor:1});
 if(backend==='webgl')await page.addInitScript(()=>localStorage.setItem('exalted-renderer-v1','webgl'));
 if(phase!=='baseline')await page.addInitScript(({selected,effectsOff})=>localStorage.setItem('exalted-lighting-v1',JSON.stringify({schemaVersion:2,qualityProfile:selected,columnPalette:'blue-v1',glassProfile:'blocks-v1',...(effectsOff?{aoEnabled:false,shadowsEnabled:false}:{})})),{selected:profile,effectsOff:args.includes('--effects-off')});
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text())});
 await page.goto(option('--url','http://127.0.0.1:5173/'));
 await page.waitForFunction(()=>window.hall&&document.querySelector('#loading').classList.contains('done'),{timeout:120000});
 report.rendererInfo=await page.evaluate(()=>hall.rendererInfo);
 const expectedBackend=option('--backend',null);if(expectedBackend&&report.rendererInfo.activeBackend!==expectedBackend)throw Error('Expected '+expectedBackend+', got '+report.rendererInfo.activeBackend);
 await page.evaluate(async selected=>{
  if(hall.visuals)await hall.visuals.setProfile(selected);
  document.querySelector('#light-debug').open=false;
  const {SceneInstrumentation}=await import('/node_modules/@babylonjs/core/Instrumentation/sceneInstrumentation.js');
  const instrumentation=new SceneInstrumentation(hall.scene);instrumentation.captureFrameTime=true;instrumentation.captureRenderTime=true;window.qaInstrumentation=instrumentation;
 },profile);
 if(args.includes('--effects-off'))await page.evaluate(()=>hall.lightingDebug.setSettings({shadowsEnabled:false,aoEnabled:false}));
 const views=[['entrance',[0,4.6,-17],[2.7,8.5,28]],['nave',[0,3.1,10],[0,9,49]],['portal',[0,3.2,37],[0,7.5,55]],['windows',[0,7,10],[14,11,13]],['pedestal',[-4.5,2.5,-1],[-7.8,3.2,2]]];
 if(args.includes('--lantern-detail'))views[4]=['lantern',[-8.9,9.7,-9],[-10.4,10.7,-7]];
 if(args.includes('--brass-detail'))views[3]=['brass',[-8.8,8.2,2.5],[-12.2,9,4.5]];
 if(args.includes('--marble-detail')){
  views[1]=['floor',[0,2.2,-8],[0,.9,22]];
  views[4]=['pedestal-base',[-5,2.2,-.5],[-7.8,.65,2]];
 }
 for(const [name,position,target] of views){
  await page.evaluate(({position,target})=>{const V=hall.camera.position.constructor;hall.camera.position.set(...position);hall.camera.setTarget(new V(...target));}, {position,target});
  await page.waitForTimeout(hardware?1800:350);
  if(hardware)await page.evaluate(()=>{window.qaFrames=[];window.qaLastFrame=performance.now();window.qaObserver=hall.scene.onAfterRenderObservable.add(()=>{const now=performance.now();qaFrames.push(now-qaLastFrame);qaLastFrame=now})});
  if(hardware)await page.waitForTimeout(Number(option('--duration','5000')));
  const metrics=await page.evaluate(()=>{
   if(window.qaObserver)hall.scene.onAfterRenderObservable.remove(qaObserver);
   const gl=hall.engine._gl,extension=gl.getExtension('WEBGL_debug_renderer_info');
   const textures=hall.engine.getLoadedTexturesCache();
   const estimatedTextureBytes=textures.reduce((sum,t)=>sum+(t.width||0)*(t.height||0)*(t.isCube?6:1)*(t.type===1?16:t.type===2?8:4)*(t.generateMipMaps?4/3:1),0);
   const times=(window.qaFrames||[]).slice(5).sort((a,b)=>a-b);
   const average=times.length?times.reduce((a,b)=>a+b,0)/times.length:null;
   return {renderer:extension?gl.getParameter(extension.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),browser:navigator.userAgent,renderSize:[hall.engine.getRenderWidth(),hall.engine.getRenderHeight()],meanFrameMs:average,p95FrameMs:times.length?times[Math.floor(times.length*.95)]:null,fps:average?1000/average:null,sceneFrameMs:qaInstrumentation.frameTimeCounter.current,drawCalls:hall.engine._drawCalls?.current,triangles:hall.scene.getActiveIndices()/3,totalTriangles:hall.scene.meshes.reduce((s,m)=>s+m.getTotalIndices()/3,0),textures:textures.length,estimatedTextureMiB:Math.round(estimatedTextureBytes/1048576),quality:hall.visuals?.getProfile()||'baseline',gpuFrameMs:hall.renderMetrics?.gpuFrameMs??null};
  });
  await page.screenshot({path:path.join(directory,`${name}.png`)});
  report.views.push({name,...metrics});console.log(JSON.stringify({view:name,...metrics}));
 }
 report.hardwareVerified=hardware&&report.views.every(v=>/NVIDIA.*3060|3060.*NVIDIA/i.test(v.renderer)&&!/SwiftShader|software/i.test(v.renderer));
 report.targetFPS=60;report.meetsTarget=report.hardwareVerified&&report.views.every(v=>v.fps>=60);
 if(!hardware)report.performanceNote='Headless timings are not used to claim RTX performance.';
 if(hardware&&!report.hardwareVerified)report.performanceNote='The requested RTX 3060 renderer was not active; these results do not establish the hardware target.';
 if(report.errors.length)process.exitCode=1;
}finally{const filename=report.views.length===5?'report.json':'report-incomplete.json';fs.writeFileSync(path.join(directory,filename),JSON.stringify(report,null,2));await browser.close();console.log(`Report: ${directory}/${filename}`)}
