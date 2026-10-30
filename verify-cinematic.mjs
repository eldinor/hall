const url=process.env.HALL_URL||'http://127.0.0.1:5173/';
import {chromium} from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';

const manifest=JSON.parse(fs.readFileSync('public/materials/manifest.json'));
for(const material of manifest.materials)for(const file of material.files){const data=fs.readFileSync('public/materials/'+file.path);if(crypto.createHash('sha256').update(data).digest('hex')!==file.sha256)throw Error('Asset checksum mismatch: '+file.path);const info=await sharp(data).metadata();if(info.width!==file.size||info.height!==file.size)throw Error('Incorrect texture size')}
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
const errors=[],report={assetFiles:manifest.materials.flatMap(m=>m.files).length,checks:[]};
try{
 const context=await browser.newContext({viewport:{width:1280,height:850},deviceScaleFactor:1});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.addInitScript(()=>{if(!localStorage.getItem('qa-seeded')){localStorage.setItem('exalted-lighting-v1',JSON.stringify({ambient:.27,fill:.4,columns:2.6,columnPalette:'blue-v1',glassProfile:'blocks-v1',columnColor:'#ffffff'}));localStorage.setItem('qa-seeded','1')}});
 const bounded=async(promise,label)=>{let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Timed out: '+label)),45000)})])}finally{clearTimeout(timer)}};
 const wait=async()=>{await page.waitForFunction(()=>window.hall&&document.querySelector('#loading').classList.contains('done'),{timeout:120000});await bounded(page.evaluate(()=>hall.visuals.ready),'visual readiness')};
 await page.goto(url);await wait();
 console.log('Checking cinematic state and saved-settings migration');
 report.checks.push(await page.evaluate(()=>{
  const assert=(condition,message)=>{if(!condition)throw Error(message)};const state=hall.visuals.getState(),settings=hall.lightingDebug.getSettings();
  assert(state.profile==='cinematic'&&state.textureSize===2048&&state.reflectionSize===1024,'Incorrect Cinematic profile');
  assert(state.aoActive&&state.shadowLights===0&&state.shadowMapSizes.length===0,'Incorrect cinematic AO/shadow state');
  assert(settings.schemaVersion===2&&settings.ambient===.27&&settings.fill===.15&&settings.columns===2.6,'Saved settings migration failed');
  assert(hall.columnLights.length===14&&new Set(hall.columnLights.map(l=>l.diffuse.toHexString())).size===4,'Blue light palette changed');
  assert(!hall.scene.shadowsEnabled&&!hall.scene.lights.some(l=>['DirectionalLight','SpotLight'].includes(l.getClassName())||l.getShadowGenerator?.()),'Extra light or shadows restored');
  assert(hall.frames.length===8&&hall.windowGlass.blockCount===1800,'Exhibit or glass-block count changed');
  const architecture=hall.scene.materials.filter(m=>m.metadata?.architectural);
  assert(architecture.length===5&&architecture.every(m=>m.getClassName()==='PBRMaterial'&&m.albedoTexture&&m.bumpTexture&&m.metallicTexture),'Architectural materials incomplete');
  assert(hall.visuals.shadows.length===0&&hall.visuals.spots.length===0,'Shadow rig remains');
  const passes=hall.camera._postProcesses.filter(Boolean).map(p=>p.name);
  assert(passes.indexOf('ssaoCombine')<passes.indexOf('imageProcessing'),'AO applied after tone mapping');
  assert(hall.camera._postProcesses.filter(Boolean)[0].samples===4,'Scene capture lacks MSAA');
  assert(!hall.pipeline.depthOfFieldEnabled&&!hall.pipeline.chromaticAberrationEnabled&&!hall.pipeline.grainEnabled,'Readability effects changed');
  return {cinematic:true,pbrMaterials:architecture.length,shadowMaps:state.shadowMapSizes,migration:true};
 }));
 console.log('Switching to Performance');
 await bounded(page.evaluate(()=>hall.visuals.setProfile('performance')),'Performance profile');
 report.checks.push(await page.evaluate(()=>{const s=hall.visuals.getState();if(hall.scene.geometryBufferRenderer||s.aoActive||s.shadowLights!==0||s.shadowMapSizes.length!==0||s.reflectionSize!==512||s.textureSize!==1024||hall.pipeline.samples>2)throw Error('Incorrect Performance profile');return {performance:true,...s}}));
 console.log('Switching back to Cinematic');
 await bounded(page.evaluate(()=>hall.visuals.setProfile('cinematic')),'Cinematic profile');
 await page.evaluate(()=>hall.lightingDebug.setSettings({shadowsEnabled:false,aoEnabled:false}));
 if(await page.evaluate(()=>hall.visuals.getState().aoActive||hall.visuals.spots.some(l=>l.shadowEnabled)))throw Error('Effects did not disable');
 await page.evaluate(()=>hall.lightingDebug.setSettings({shadowsEnabled:true,aoEnabled:true,shadowStrength:.5,aoRadius:.4}));
 await page.reload();await wait();
 console.log('Checking articles, controls, billboards and tour');
 await page.evaluate(()=>hall.engine.stopRenderLoop());
 if(!await page.evaluate(()=>hall.lightingDebug.getSettings().aoRadius===.4&&!('shadowsEnabled' in hall.lightingDebug.getSettings())&&!document.querySelector('[name=shadowsEnabled]')&&hall.qualityProfile==='cinematic'))throw Error('Settings did not persist');
 for(let i=0;i<8;i++){console.log('Article '+(i+1));await page.evaluate(index=>hall.openArticle(index),i);if(!await page.locator('#article').isVisible())throw Error('Article did not open');if(await page.locator('#article-title').textContent()!==await page.evaluate(index=>hall.articles[index].title,i))throw Error('Wrong article');await page.locator('#close').click()}
 await page.locator('#help').click();await page.locator('#got-it').click();
 report.checks.push(await page.evaluate(()=>{
  hall.engine.stopRenderLoop();const assert=(c,m)=>{if(!c)throw Error(m)},V=hall.camera.position.constructor,Ray=hall.camera.getForwardRay().constructor;
  for(const xyz of [[0,4,-17],[3,6,18],[-3,9,45]]){hall.camera.position.set(...xyz);hall.scene.onBeforeRenderObservable.notifyObservers(hall.scene);for(const panel of hall.frames){panel.computeWorldMatrix(true);const front=panel.getDirection(new V(0,0,-1));front.y=0;front.normalize();const target=hall.camera.position.subtract(panel.parent.position);target.y=0;target.normalize();assert(front.x*target.x+front.z*target.z>.999,'Billboard not facing camera');assert(Math.abs(panel.getDirection(new V(0,1,0)).y-1)<.001,'Billboard tilted')}}
  const roof=hall.scene.meshes.find(m=>m.name.startsWith('Continuous vaulted ceiling'));assert(roof,'Roof not found');roof.computeWorldMatrix(true);
  for(const side of [-1,1])for(const z of [8,18]){const start=new V(0,7,10),target=new V(side*12.35,14.05,z),ray=new Ray(start,target.subtract(start).normalize(),50);assert(!ray.intersectsMesh(roof).hit,'Roof obstructs upper window blocks')}
  const realNow=performance.now.bind(performance);let time=realNow();performance.now=()=>time;document.querySelector('#tour').click();const start=time;
  for(const [ms,index]of [[6000,0],[12000,5],[18000,2],[24000,7]]){time=start+ms;hall.scene.onBeforeRenderObservable.notifyObservers(hall.scene);const p=hall.frames[index].parent.position.clone();p.y=4.35;const wanted=p.subtract(hall.camera.position).normalize(),actual=hall.camera.getForwardRay().direction;assert(wanted.x*actual.x+wanted.y*actual.y+wanted.z*actual.z>.999,'Tour missed article')}
  time=start+30000;hall.scene.onBeforeRenderObservable.notifyObservers(hall.scene);assert(!document.querySelector('#tour').textContent.includes('Pause'),'Tour exceeded 30 seconds');performance.now=realNow;
  return {allArticles:true,billboards:true,upperWindowsClear:true,tour30Seconds:true};
 }));
 await page.locator('#lighting-reset').click();if(!await page.evaluate(()=>hall.lightingDebug.getSettings().ambient===.35&&hall.lightingDebug.getSettings().fill===.15))throw Error('Reset defaults wrong');
 console.log('Checking mobile placeholder');
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto(url);await mobile.waitForFunction(()=>document.documentElement.dataset.appState==='mobile');
 report.checks.push(await mobile.evaluate(()=>{if(window.hall||document.documentElement.scrollWidth>innerWidth||document.querySelector('#mobile-placeholder').hidden)throw Error('Mobile placeholder/layout failure');return {mobilePlaceholder:true,noOverflow:true}}));
 await mobile.close();await context.close();
 report.errors=errors;if(errors.length)throw Error(errors.join('\n'));
 console.log(JSON.stringify(report,null,2));
}finally{fs.mkdirSync('outputs/visual',{recursive:true});fs.writeFileSync('outputs/visual/acceptance.json',JSON.stringify({...report,errors},null,2));await browser.close()}
