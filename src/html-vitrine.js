import {HtmlMesh} from '@babylonjs/addons/htmlMesh/htmlMesh.js';
import {HtmlMeshRenderer} from '@babylonjs/addons/htmlMesh/htmlMeshRenderer.js';
import {createArticleHtml} from './article-html.js';

export function createHtmlVitrine({scene,camera,canvas,parents,articles}){
 scene.clearColor.a=0;
 document.body.style.isolation='isolate';
 const renderer=new HtmlMeshRenderer(scene,{_containerId:'hall-html-vitrines'});
 const contents=[],readers=new Map();
 const htmlMeshes=articles.map((article,index)=>{
  const number=article.index+1;
  const mesh=new HtmlMesh(scene,`article-${String(number).padStart(2,'0')}-vitrine-html`,{captureOnPointerEnter:false});
  mesh.parent=parents[index];mesh.position.set(0,4.35,-.17);mesh.checkCollisions=false;mesh.metadata={htmlVitrine:true,articleNumber:number};
  const content=createArticleHtml(article);contents.push(content);readers.set(mesh,content.querySelector('.vitrine-reader'));
  mesh.setContent(content,6.18,4.05);mesh.setContentSizePx(1280,839);
  return mesh;
 });
 let captured=null;
 function setCapture(active){
  if(active===captured)return;
  const previous=captured;if(previous)previous.releasePointerEvents();captured=active;
  if(active){active.capturePointerEvents();camera.detachControl()}
  else if(!document.querySelector('dialog[open]')&&!document.querySelector('#light-debug:focus-within')){camera.attachControl(canvas,true);if(previous?.element.contains(document.activeElement))canvas.focus({preventScroll:true})}
 }
 function release(){setCapture(null);if(!document.querySelector('dialog[open]')){camera.attachControl(canvas,true);canvas.focus({preventScroll:true})}}
 const routePointer=event=>{
  if(document.querySelector('dialog[open]')||event.target.closest?.('header,footer')){setCapture(null);return}
  if(!htmlMeshes.some(candidate=>{const bounds=candidate.element.getBoundingClientRect();return event.clientX>=bounds.left&&event.clientX<=bounds.right&&event.clientY>=bounds.top&&event.clientY<=bounds.bottom})){setCapture(null);return}
  const canvasBounds=canvas.getBoundingClientRect();
  // Include architecture so an occluded reader does not capture mouse input.
  const hit=scene.pick(event.clientX-canvasBounds.left,event.clientY-canvasBounds.top,candidate=>candidate.isEnabled()&&candidate.isVisible&&candidate.visibility>0&&!candidate.metadata?.skybox&&!candidate.metadata?.lanternHalo);
  setCapture(htmlMeshes.includes(hit?.pickedMesh)?hit.pickedMesh:null);
 };
 document.addEventListener('pointermove',routePointer,true);
 const scrollArticle=event=>{
  const reader=readers.get(captured);
  if(!reader||event.ctrlKey||document.querySelector('dialog[open]'))return;
  const multiplier=event.deltaMode===1?30:event.deltaMode===2?reader.clientHeight:1;
  reader.scrollTop+=event.deltaY*multiplier;
  // CSS3D scroll input belongs to the reader, not the camera's walk handler.
  event.preventDefault();event.stopImmediatePropagation();
 };
 document.addEventListener('wheel',scrollArticle,{capture:true,passive:false});
 scene.onBeforeRenderObservable.add(()=>{if(captured&&document.querySelector('dialog[open]'))setCapture(null)});
 const escape=event=>{if(event.key==='Escape'&&contents.some(content=>content.contains(document.activeElement)))release()};
 document.addEventListener('keydown',escape,true);
 scene.onDisposeObservable.add(()=>{document.removeEventListener('keydown',escape,true);document.removeEventListener('pointermove',routePointer,true);document.removeEventListener('wheel',scrollArticle,true);for(const mesh of htmlMeshes)mesh.dispose();renderer.dispose();document.body.style.pointerEvents='auto'});
 return {mesh:htmlMeshes[0],articleMesh:htmlMeshes[1],meshes:htmlMeshes,release,getState:()=>({articleNumbers:articles.map(article=>article.index+1),width:6.18,height:4.05})};
}
