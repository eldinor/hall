import {chromium} from 'playwright';
import fs from 'node:fs';

const browser=await chromium.launch({channel:'chromium',headless:true,args:['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']});
const folder='outputs/visual/loading';fs.mkdirSync(folder,{recursive:true});
let releaseModule,releaseTexture;
const moduleGate=new Promise(resolve=>releaseModule=resolve),textureGate=new Promise(resolve=>releaseTexture=resolve);
const errors=[],report={checks:[]};
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.route(/\/src\/entry\.js(?:\?.*)?$/,async route=>{await moduleGate;await route.continue()});
 await page.route('**/materials/limestone/2048/albedo.webp',async route=>{await textureGate;await route.continue()});
 await page.addInitScript(()=>{
  const observer=new MutationObserver(()=>{
   if(document.documentElement?.dataset.appState==='ready'){
    window.startupFrame=window.hall?.scene.getFrameId()||0;
    observer.disconnect();
   }
  });observer.observe(document,{subtree:true,attributes:true,attributeFilter:['data-app-state']});
 });
 await page.goto('http://127.0.0.1:5173/',{waitUntil:'commit'});
 await page.waitForSelector('#loading',{state:'visible'});
 report.checks.push(await page.evaluate(()=>{
  const loading=document.querySelector('#loading'),header=document.querySelector('header');
  if(window.hall||document.querySelector('style[data-vite-dev-id]')||getComputedStyle(loading).position!=='fixed'||!getComputedStyle(loading).backgroundImage.includes('radial-gradient')||loading.querySelector('.hall-label').textContent!=='The Hall'||!loading.querySelector('.wordmark')||getComputedStyle(header).visibility!=='hidden')throw Error('Unstyled interface visible before module load');
  return {beforeJavaScript:true,inlineLoader:true,interfaceHidden:true};
 }));
 await page.waitForTimeout(1900);
 if(await page.locator('#boot-phase').textContent()!=='initialising')throw Error('Entry module was not held for the first-paint check');
 await page.screenshot({path:folder+'/before-javascript.png'});
 releaseModule();
 await page.waitForFunction(()=>window.hall,null,{timeout:120000});
 if(!await page.evaluate(()=>document.documentElement.dataset.appState==='loading'&&!document.querySelector('#loading').classList.contains('done')&&getComputedStyle(document.querySelector('header')).visibility==='hidden'))throw Error('Interface revealed before textures loaded');
 report.checks.push({waitingForTextures:true});
 releaseTexture();
 await page.waitForFunction(()=>document.documentElement.dataset.appState==='ready',null,{timeout:120000});
 report.checks.push(await page.evaluate(()=>{
  if(!window.startupFrame||getComputedStyle(document.querySelector('header')).visibility!=='visible'||!document.querySelector('#loading').classList.contains('done'))throw Error('Loader did not transition after a rendered frame');
  if(document.querySelector('#boot-bar').style.width!=='100%'||document.querySelector('#boot-phase').textContent!=='ready')throw Error('Loading progress did not finish');
  return {firstRenderedFrame:startupFrame,interfaceRevealed:true,progressComplete:true};
 }));
 await page.waitForTimeout(1000);await page.screenshot({path:folder+'/ready.png'});
 await page.close();
 const failure=await browser.newPage();
 await failure.addInitScript(()=>{Object.defineProperty(navigator,'gpu',{value:undefined});const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:get.call(this,type,...args)}});
 await failure.goto('http://127.0.0.1:5173/');
 await failure.waitForFunction(()=>document.documentElement.dataset.appState==='error',null,{timeout:30000});
 report.checks.push(await failure.evaluate(()=>{if(document.querySelector('#error').hidden||getComputedStyle(document.querySelector('header')).visibility!=='hidden'||document.querySelector('#loading').classList.contains('done'))throw Error('Failure revealed the unready interface');return {startupFailureCovered:true}}));
 if(errors.length)throw Error(errors.join('\n'));
 console.log(JSON.stringify(report,null,2));
}catch(error){errors.push(error.message);throw error}
finally{releaseModule();releaseTexture();fs.writeFileSync(folder+'/report.json',JSON.stringify({...report,errors},null,2));await browser.close()}
