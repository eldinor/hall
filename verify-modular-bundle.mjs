import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import {preview} from 'vite';
import {chromium} from 'playwright';

const server=await preview({preview:{host:'127.0.0.1',port:5192,strictPort:true}});
const browser=await chromium.launch({channel:'chromium',headless:true,args:['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']});
const report=[];
fs.mkdirSync('outputs/modular-bundle',{recursive:true});
try{
 const backends=process.argv.includes('--webgpu-only')?['auto']:['webgl','auto'];
 for(const backend of backends)for(const edition of ['index.html','v2.html','v3.html']){
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],scripts=new Set();
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
  page.on('request',request=>{if(request.resourceType()==='script')scripts.add(request.url())});
  await page.route('https://discord.com/api/guilds/*/widget.json',route=>route.fulfill({json:{id:'1550007780079829022',name:'Exalted',presence_count:1,channels:[{name:'Community Lounge',position:1}],members:[{username:'Labris',status:'online'}],instant_invite:null}}));
  await page.addInitScript(value=>localStorage.setItem('exalted-renderer-v1',value),backend);
  await page.goto(server.resolvedUrls.local[0]+edition);
  await page.waitForFunction(()=>['ready','error'].includes(document.documentElement.dataset.appState),null,{timeout:120000});
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.appState),'ready',JSON.stringify(errors));
  await page.locator('#loading').waitFor({state:'hidden'});
  await page.waitForTimeout(1200);
  assert.deepEqual(errors,[]);
  const startup=await page.evaluate(()=>({backend:hall.rendererInfo.activeBackend,frames:hall.frames.length,cluster:!!hall.columnLightCluster,particles:hall.atmosphere.getState(),visuals:hall.visuals.getState(),glass:hall.windowGlass.blockCount,reflection:hall.visuals.mirror.getSize().width}));
  assert.equal(startup.backend,backend==='auto'?'webgpu':'webgl');
  assert.equal(startup.frames,8);assert.equal(startup.particles.backend,'gpu');assert.equal(startup.visuals.aoActive,true);assert.equal(startup.reflection,1024);
  const initialScripts=[...scripts];
  const sizes=initialScripts.filter(url=>url.startsWith(server.resolvedUrls.local[0])).reduce((total,url)=>{
   const file=path.join('dist',new URL(url).pathname);if(!fs.existsSync(file))return total;
   const bytes=fs.readFileSync(file);total.raw+=bytes.length;total.gzip+=gzipSync(bytes).length;return total;
  },{raw:0,gzip:0});
  assert.ok(sizes.raw<6000000,'Startup should no longer include the monolithic bundle');
  for(const quality of ['performance','cinematic']){
   await page.evaluate(quality=>hall.visuals.setProfile(quality),quality);await page.waitForTimeout(250);
   assert.equal(await page.evaluate(()=>hall.visuals.getState().profile),quality);
  }
  // Exercise picking and walking registrations, not just scene construction.
  assert.equal(await page.evaluate(()=>{const ray=hall.scene.createPickingRay(640,450);return !!ray&&!!hall.scene.pickWithRay(ray)}),true);
  const beforeWalk=await page.evaluate(()=>hall.camera.position.asArray());
  await page.locator('#scene').focus();await page.keyboard.down('w');await page.waitForTimeout(180);await page.keyboard.up('w');
  assert.notDeepEqual(await page.evaluate(()=>hall.camera.position.asArray()),beforeWalk);
  await page.evaluate(position=>{hall.camera.position.set(...position);hall.camera.cameraDirection.setAll(0)},beforeWalk);
  for(let i=0;i<8;i++){
   if(edition==='v2.html'&&[0,1,3].includes(i)||edition!=='v2.html'&&i===3)continue;
   await page.evaluate(i=>hall.openArticle(i),i);
   assert.equal(await page.locator('#article').evaluate(dialog=>dialog.open),true);await page.locator('#close').click();
  }
  if(edition==='v2.html'){
   assert.equal(await page.evaluate(()=>hall.htmlVitrine.meshes.length),2);
   assert.equal(await page.locator('.vitrine-article').count(),2);
   await page.locator('#article-01-vitrine-content button').evaluate(button=>button.click());
   assert.ok(await page.locator('#article-01-vitrine-body p').count()>1);
   await page.evaluate(()=>{const reader=document.querySelector('#article-01-vitrine-scroll');reader.scrollTop=500});
   assert.ok(await page.locator('#article-01-vitrine-scroll').evaluate(reader=>reader.scrollTop)>0);
  }
  if(edition!=='v2.html'){
   assert.equal(await page.evaluate(()=>hall.paperSheet.collected),false);
   assert.equal(await page.evaluate(()=>hall.scene.meshes.filter(mesh=>mesh.name==='Printed paper face').length),2);
   assert.equal(await page.evaluate(()=>hall.discordVitrine.getState().inviteURL),'https://discord.gg/BvVuGvWHME');
   assert.equal(await page.evaluate(()=>hall.discordVitrine.getState().onlineCount),1);
   await page.evaluate(()=>hall.pdfViewer.open());assert.equal(await page.locator('#article-pdf canvas').count(),2);
   await page.locator('#pdf-zoom').click();assert.equal(await page.locator('#pdf-zoom').getAttribute('aria-pressed'),'true');
   await page.keyboard.press('Escape');
  }
  assert.deepEqual(errors,[]);
  await page.screenshot({path:`outputs/modular-bundle/${backend}-${edition}.png`});
  report.push({edition,...startup,initialScriptCount:initialScripts.length,initialJavaScriptBytes:sizes});
  console.log(JSON.stringify({edition,backend:startup.backend,initialJavaScriptBytes:sizes,passed:true}));
  await page.close();
 }
 fs.writeFileSync('outputs/modular-bundle/report.json',JSON.stringify(report,null,2));
}finally{await browser.close();await new Promise(resolve=>server.httpServer.close(resolve))}
