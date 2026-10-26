import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173/');
 await page.waitForFunction(()=>window.hall&&document.querySelector('#loading').classList.contains('done'),{timeout:60000});
 const results=await page.evaluate(()=>{
  hall.engine.stopRenderLoop();const results=[];
  for(const position of [[0,4,-17],[3,6,18],[-3,9,45]]){
   hall.camera.position.set(...position);hall.scene.render();
   for(const panel of hall.frames){
    const root=panel.parent;root.computeWorldMatrix(true);panel.computeWorldMatrix(true);
    const V=panel.position.constructor;
    const front=panel.getDirection(new V(0,0,-1));front.y=0;front.normalize();
    const toCamera=hall.camera.position.subtract(root.position);toCamera.y=0;toCamera.normalize();
    const alignment=front.x*toCamera.x+front.z*toCamera.z;
    const up=panel.getDirection(new V(0,1,0));
    const attached=root.getChildMeshes().length;
    if(alignment<.999||Math.abs(up.y-1)>.001||attached<10)throw Error(`${root.name}: alignment=${alignment}, up=${up.y}, children=${attached}`);
   }
   results.push({position,exhibits:hall.frames.length,facingCamera:true,upright:true});
  }
  hall.camera.position.set(0,4.6,-17);hall.scene.render();return results;
 });
 await page.screenshot({path:'qa-billboards.png'});
 await page.evaluate(()=>hall.openArticle(7));
 if(await page.locator('#article-title').textContent()!=='A World Beyond')throw Error('Article interaction failed');
 if(errors.length)throw Error(errors.join('\n'));
 console.log(JSON.stringify({results,errors},null,2));
} finally {await browser.close()}
