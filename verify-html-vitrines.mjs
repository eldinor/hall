import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'vite';
import sharp from 'sharp';

const server=await createServer({server:{host:'127.0.0.1',port:5188}});
await server.listen();
const browser=await chromium.launch({channel:'chromium',headless:true,args:['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']});
try{
 for(const backend of ['auto','webgl']){
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(value=>localStorage.setItem('exalted-renderer-v1',value),backend);
  await page.goto(server.resolvedUrls.local[0]+'v2.html');
  await page.waitForFunction(()=>window.hall&&document.documentElement.dataset.appState==='ready',null,{timeout:120000});
  await page.locator('#loading').waitFor({state:'hidden'});
  const displays=await page.evaluate(()=>hall.frames.slice(0,2).map(mesh=>({size:mesh.getBoundingInfo().boundingBox.extendSize.scale(2).asArray(),role:mesh.metadata.displayRole})));
  assert.ok(displays.every(display=>display.size[0]>display.size[1]&&display.role==='article'));
  assert.equal(await page.locator('iframe').count(),0);
  for(const [index,x] of [[0,-7.8],[1,7.8]]){
   const number=String(index+1).padStart(2,'0'),reader=page.locator(`#article-${number}-vitrine-content`);
   assert.equal(await reader.locator('h2').innerText(),await page.evaluate(i=>hall.articles[i].title,index));
   await page.evaluate(x=>{hall.camera.position.set(x,4.35,-9);hall.camera.setTarget(hall.camera.position.clone().set(x,4.35,2))},x);
   await page.waitForTimeout(500);
   const more=reader.getByRole('button',{name:'Read more'}),bounds=await more.boundingBox();
   await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await page.waitForTimeout(100);await more.click();
   assert.equal(await page.locator(`#article-${number}-vitrine-body p`).count(),await page.evaluate(i=>hall.articles[i].paragraphs.length,index));
   assert.ok(await reader.locator('strong').count()>0);
   const scroll=page.locator(`#article-${number}-vitrine-scroll`),scrollBounds=await scroll.boundingBox();
   const position=await page.evaluate(()=>hall.camera.position.asArray());
   await page.mouse.move(scrollBounds.x+scrollBounds.width/2,scrollBounds.y+scrollBounds.height/2);await page.mouse.wheel(0,500);
   await page.waitForFunction(number=>document.querySelector(`#article-${number}-vitrine-scroll`).scrollTop>0,number);
   assert.deepEqual(await page.evaluate(()=>hall.camera.position.asArray()),position);
   assert.equal(await reader.getByRole('button',{name:'Back to hall'}).count(),0);
   await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement===document.querySelector('#scene'));
  }
  await page.evaluate(()=>{const mesh=hall.frames[1].clone('HTML occluder');mesh.position.z=-1;mesh.scaling.setAll(.25);mesh.material=mesh.material.clone('occluder red');mesh.material.emissiveColor.set(1,0,0);window.testOccluder=mesh});
  await page.waitForTimeout(250);
  const pixel=await sharp(await page.screenshot()).extract({left:720,top:500,width:1,height:1}).removeAlpha().raw().toBuffer();
  assert.ok(pixel[0]>pixel[1]+50,'Foreground geometry should occlude HTML');
  await page.evaluate(()=>{testOccluder.material.dispose();testOccluder.dispose();hall.openArticle(0)});
  assert.equal(await page.locator('#article').evaluate(dialog=>dialog.open),false);
  await page.evaluate(()=>hall.openArticle(7));await page.locator('#next').click();
  assert.equal(await page.locator('#article-index').innerText(),'03 / 08');assert.deepEqual(errors,[]);
  console.log(`${backend}: both local HTML articles, scrolling, focus, occlusion and reader checks passed`);await page.close();
 }
 const page=await browser.newPage({viewport:{width:1280,height:850}}),addonRequests=[];
 page.on('request',request=>{if(request.url().includes('babylonjs-addons'))addonRequests.push(request.url())});
 await page.goto(server.resolvedUrls.local[0]);await page.waitForFunction(()=>window.hall&&document.documentElement.dataset.appState==='ready',null,{timeout:120000});
 assert.equal(await page.evaluate(()=>hall.htmlVitrine),null);await page.evaluate(()=>hall.openArticle(0));
 assert.equal(await page.locator('#article').evaluate(dialog=>dialog.open),true);assert.deepEqual(addonRequests,[]);
 console.log('Main edition retains portrait articles without loading the HTML add-on');await page.close();
}finally{await browser.close();await server.close()}
