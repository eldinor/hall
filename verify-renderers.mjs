import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const url=process.env.HALL_URL||'http://127.0.0.1:5173/';
// Use full Chromium: the Windows headless shell cannot load Dawn's DXC library.
const browser=await chromium.launch({channel:process.env.HALL_BROWSER_CHANNEL||'chromium',headless:true,args:['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']});
const report={checks:[],errors:[]};
fs.mkdirSync('outputs/renderers',{recursive:true});
const ready=page=>page.waitForFunction(()=>document.documentElement.dataset.appState==='ready',null,{timeout:120000});
async function fresh(width=1100){
 const page=await browser.newPage({viewport:{width,height:800}});
 page.on('pageerror',error=>report.errors.push(error.message));
 return page;
}
async function exercise(page,backend){
 await ready(page);
 await page.waitForFunction(()=>window.hall?.renderMetrics.backend,null,{timeout:30000});
 assert.equal(await page.evaluate(()=>hall.rendererInfo.activeBackend),backend,JSON.stringify(await page.evaluate(()=>hall.rendererInfo)));
 assert.equal(await page.evaluate(()=>hall.renderMetrics.backend),backend);
 assert.equal(await page.evaluate(()=>hall.engine.isWebGPU),backend==='webgpu');
 for(const quality of ['performance','cinematic']){
  await page.evaluate(q=>hall.visuals.setProfile(q),quality);
  await page.waitForTimeout(500);
  const state=await page.evaluate(()=>({visuals:hall.visuals.getState(),samples:hall.pipeline.samples,fxaa:hall.pipeline.fxaaEnabled,particles:hall.atmosphere.getState(),mirror:hall.visuals.mirror.getSize().width}));
  assert.equal(state.visuals.profile,quality);
  assert.equal(state.visuals.skySize,quality==='cinematic'?1024:512);
  assert.equal(state.mirror,quality==='cinematic'?1024:512);
  assert.equal(state.visuals.aoActive,quality==='cinematic');
  if(backend==='webgpu'){assert.equal(state.samples,quality==='cinematic'?4:1);assert.equal(state.fxaa,quality==='performance')}
  assert.equal(state.particles.enabled,true);
  assert.equal(state.particles.backend,'gpu');
  assert.equal(state.particles.fallbackReason,null);
 }
 await page.evaluate(()=>hall.lightingDebug.setSettings({aoEnabled:false,dustEnabled:false}));
 assert.equal(await page.evaluate(()=>hall.visuals.getState().aoActive||hall.atmosphere.getState().enabled),false);
 await page.evaluate(()=>hall.lightingDebug.setSettings({aoEnabled:true,dustEnabled:true}));
 await page.evaluate(()=>hall.openArticle(0));await page.locator('#next').click();
 assert.equal(await page.locator('#article-title').textContent(),"Worlds 2026 and the Demon King’s Unfinished Story");await page.locator('#close').click();
 await page.locator('[data-view="nave"]').click();await page.waitForTimeout(2400);
 await page.setViewportSize({width:1000,height:760});
 await page.waitForTimeout(300);
 assert.equal(await page.evaluate(()=>hall.engine.getRenderWidth()),1000);
 await page.screenshot({path:`outputs/renderers/${backend}.png`});
 report.checks.push({backend,info:await page.evaluate(()=>hall.rendererInfo),metrics:await page.evaluate(()=>hall.renderMetrics),qualityProfiles:true,interactions:true});
}
try{
 // Small screens must not even import the scene module or request its resources.
 for(const width of [390,850]){
  const page=await fresh(width),requests=[];
  page.on('request',request=>requests.push(request.url()));
  await page.addInitScript(()=>{window.contextRequests=[];const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){window.contextRequests.push(type);return original.call(this,type,...args)}});
  await page.goto(url);await page.waitForFunction(()=>document.documentElement.dataset.appState==='mobile');
  assert.equal(await page.locator('#mobile-placeholder').isVisible(),true);
  assert.equal(await page.locator('#mobile-title').textContent(),'3D is available on desktop only.');
  assert.deepEqual(await page.evaluate(()=>({hall:!!window.hall,contexts:window.contextRequests,overflow:document.documentElement.scrollWidth>innerWidth})),{hall:false,contexts:[],overflow:false});
  assert.equal(requests.some(u=>/babylon|main[.-].*\.(js|css)|\/materials\/|\/environments\/|\/webgpu\//.test(u)),false);
  await page.screenshot({path:`outputs/renderers/mobile-${width}.png`});
  report.checks.push({mobileWidth:width,no3DRequests:true});await page.close();
 }
 const fallback=await fresh(851);
 await fallback.addInitScript(()=>{
  if(!localStorage.getItem('exalted-renderer-v1'))localStorage.setItem('exalted-renderer-v1','invalid-value');
  window.adapterRequests=0;
  Object.defineProperty(navigator,'gpu',{value:{requestAdapter:async()=>{window.adapterRequests++;return null}}});
 });
 await fallback.goto(url);await exercise(fallback,'webgl');
 assert.match(await fallback.evaluate(()=>hall.rendererInfo.fallbackReason),/unavailable/);
 assert.equal(await fallback.evaluate(()=>hall.rendererInfo.preference),'auto');
 // Selection changes reload and persist without altering lighting preferences.
 await fallback.locator('#light-debug > summary').click();await fallback.locator('#renderer-preference').selectOption('webgl');await fallback.waitForLoadState('load');await ready(fallback);
 assert.equal(await fallback.evaluate(()=>hall.rendererInfo.preference),'webgl');
 assert.equal(await fallback.evaluate(()=>window.adapterRequests),0);
 assert.equal(await fallback.evaluate(()=>hall.lightingDebug.getSettings().qualityProfile),'cinematic');
 assert.equal(await fallback.evaluate(()=>hall.rendererInfo.fallbackReason),null);
 await fallback.reload();await ready(fallback);assert.equal(await fallback.locator('#renderer-preference').inputValue(),'webgl');
 await fallback.locator('#light-debug > summary').click();await fallback.locator('#renderer-preference').selectOption('auto');await fallback.waitForLoadState('load');await ready(fallback);
 assert.equal(await fallback.evaluate(()=>hall.rendererInfo.preference),'auto');
 await fallback.setViewportSize({width:850,height:800});await fallback.waitForFunction(()=>document.documentElement.dataset.appState==='mobile'&&!window.hall);
 await fallback.setViewportSize({width:851,height:800});await ready(fallback);
 report.checks.push({savedChoice:true,breakpointRoundTrip:true});await fallback.close();

 const rejected=await fresh();
 await rejected.addInitScript(()=>{
  const gpu=navigator.gpu;
  Object.defineProperty(navigator,'gpu',{value:{requestAdapter:async()=>({requestDevice:async()=>{throw new Error('Injected initialization failure')},features:new Set(),limits:{},info:{}}),getPreferredCanvasFormat:()=>gpu?.getPreferredCanvasFormat()||'bgra8unorm'}});
 });
 await rejected.goto(url);await ready(rejected);
 assert.equal(await rejected.evaluate(()=>hall.rendererInfo.activeBackend),'webgl');
 assert.match(await rejected.evaluate(()=>hall.rendererInfo.fallbackReason),/Injected initialization failure/);
 report.checks.push({initializationFallback:true});await rejected.close();

 const failure=await fresh();
 await failure.addInitScript(()=>{Object.defineProperty(navigator,'gpu',{value:undefined});const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:get.call(this,type,...args)}});
 await failure.goto(url);await failure.waitForFunction(()=>document.documentElement.dataset.appState==='error');assert.equal(await failure.locator('#error').isVisible(),true);
 report.checks.push({bothUnavailable:true});await failure.close();

 const noStorage=await fresh();
 await noStorage.addInitScript(()=>{Object.defineProperty(navigator,'gpu',{value:undefined});Storage.prototype.getItem=()=>{throw new Error('Storage blocked')};Storage.prototype.setItem=()=>{throw new Error('Storage blocked')}});
 await noStorage.goto(url);await ready(noStorage);assert.equal(await noStorage.evaluate(()=>hall.rendererInfo.preference),'auto');
 await noStorage.locator('#light-debug > summary').click();await noStorage.locator('#renderer-preference').selectOption('webgl');assert.match(await noStorage.locator('.light-debug-feedback').textContent(),/requires browser storage/);
 report.checks.push({storageUnavailable:true});await noStorage.close();

 const webgpu=await fresh();
 const shaderErrors=[];
 webgpu.on('console',message=>{if(message.type()==='error'||/GPUValidationError|uncaptured error|invalid due to a previous error/i.test(message.text()))shaderErrors.push(message.text())});
 await webgpu.goto(url);await exercise(webgpu,'webgpu');
 assert.deepEqual(shaderErrors,[]);
 await webgpu.close();
 assert.deepEqual(report.errors,[]);
 console.log(JSON.stringify(report,null,2));
}finally{fs.writeFileSync('outputs/renderers/report.json',JSON.stringify(report,null,2));await browser.close()}
