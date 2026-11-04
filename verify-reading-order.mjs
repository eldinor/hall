import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const title=file=>JSON.parse(fs.readFileSync(`src/content/${file}.json`,'utf8')).title;
const expected=[
 [title('gta-vi'),-7.8,2],[title('wow-forever'),7.8,2],
 [title('faker-worlds-2026'),-7.8,13],[title('runescape-gold-rush'),7.8,13],
 [title('halloween-gamers-dilemma'),-7.8,24],['The Silent Observatory',7.8,24],
 ['The Last Citadel',-7.8,35],['A World Beyond',7.8,35]
];
const browser=await chromium.launch({channel:'chromium',headless:true,args:['--enable-unsafe-webgpu','--use-angle=d3d11','--ignore-gpu-blocklist']});
try{
 for(const preference of ['auto','webgl']){
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(value=>localStorage.setItem('exalted-renderer-v1',value),preference);
  await page.goto('http://127.0.0.1:5173/');
  await page.waitForFunction(()=>window.hall&&document.documentElement.dataset.appState==='ready',null,{timeout:120000});
  const state=await page.evaluate(()=>({backend:hall.rendererInfo.activeBackend,articles:hall.articles.map(a=>({title:a.title,index:a.index,category:a.category})),frames:hall.frames.map(p=>({number:p.metadata.article,x:p.parent.position.x,z:p.parent.position.z}))}));
  assert.deepEqual(state.articles.map(a=>a.title),expected.map(e=>e[0]));
  assert.deepEqual(state.frames,expected.map(([,x,z],number)=>({number,x,z})));
  for(let i=0;i<8;i++){assert.equal(state.articles[i].index,i);assert.ok(state.articles[i].category.endsWith(String(i+1).padStart(2,'0')))}
  await page.evaluate(()=>hall.openArticle(0));
  for(let i=0;i<8;i++){
   assert.equal(await page.locator('#article-title').textContent(),expected[i][0]);
   assert.equal(await page.locator('#article-index').textContent(),`${String(i+1).padStart(2,'0')} / 08`);
   assert.equal(await page.locator('#article-description > p').count(),1);
   await page.locator('#next').click();
  }
  assert.equal(await page.locator('#article-title').textContent(),expected[0][0]);
  for(let i=7;i>=0;i--){await page.locator('#previous').click();assert.equal(await page.locator('#article-title').textContent(),expected[i][0])}
  await page.locator('#close').click();assert.deepEqual(errors,[]);
  console.log(JSON.stringify({backend:state.backend,pairedNumbering:true,positionsPreserved:true,nextPrevious:true,wraparound:true}));
  await page.close();
 }
}finally{await browser.close()}
