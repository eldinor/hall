import {chromium} from 'playwright';
import fs from 'node:fs';

// Run with the local Vite server active. The source HDR is kept out of the
// visitor bundle; bake a reusable cubemap once instead of converting at startup.
const url=process.env.HALL_URL||'http://127.0.0.1:5173/';
const browser=await chromium.launch({channel:'chromium',headless:true,args:['--use-angle=d3d11','--ignore-gpu-blocklist']});
try{
 const page=await browser.newPage();
 page.on('pageerror',error=>console.error(error.message));
 await page.route('**/__environment-bake',route=>route.fulfill({contentType:'text/html',body:'<canvas id="bake" width="16" height="16"></canvas><script src="/node_modules/babylonjs/babylon.js"></script>'}));
 await page.goto(new URL('__environment-bake',url).href);
 const encoded=await page.evaluate(async()=>{
  const B=window.BABYLON,engine=new B.Engine(document.querySelector('#bake'),false),scene=new B.Scene(engine);
  try{
   const texture=await new Promise((resolve,reject)=>{
    const hdr=new B.HDRCubeTexture('/assets/environment-source/kloppenheim_02_puresky_4k.hdr',scene,1024,false,true,false,true,()=>resolve(hdr),(message,error)=>reject(new Error(message||String(error))));
   });
   const bytes=await B.EnvironmentTextureTools.CreateEnvTextureAsync(texture,{imageType:'image/webp',imageQuality:.95});
   return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=reject;reader.readAsDataURL(new Blob([bytes]))});
  }finally{scene.dispose();engine.dispose()}
 });
 const bytes=Buffer.from(encoded,'base64');
 fs.writeFileSync('public/environments/night-1024.env',bytes);
 console.log(`Baked 1024px night cubemap: ${(bytes.length/1048576).toFixed(2)} MiB`);
}finally{await browser.close()}
