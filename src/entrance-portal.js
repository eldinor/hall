import * as B from 'babylonjs';
import vertexWGSL from './shaders/entrance-portal/portal.vertex.wgsl?raw';
import ringWGSL from './shaders/entrance-portal/ring.fragment.wgsl?raw';
import surfaceWGSL from './shaders/entrance-portal/surface.fragment.wgsl?raw';
import vertexGLSL from './shaders/entrance-portal/portal.vertex.glsl?raw';
import ringGLSL from './shaders/entrance-portal/ring.fragment.glsl?raw';
import surfaceGLSL from './shaders/entrance-portal/surface.fragment.glsl?raw';

export const entrancePortalDestination='https://eldinor.github.io/exalted-sandbox/';
const portalScale=3;
const apertureRadius=1.18*portalScale;
const interactionDistance=4.5;
const facingThreshold=.75;

export function createEntrancePortal({scene,camera,onEnter=()=>window.location.assign(entrancePortalDestination)}){
 const webgpu=scene.getEngine().isWebGPU;
 const store=webgpu?B.ShaderStore.ShadersStoreWGSL:B.ShaderStore.ShadersStore;
 store.hallEntranceRingVertexShader=webgpu?vertexWGSL:vertexGLSL;
 store.hallEntranceRingPixelShader=webgpu?ringWGSL:ringGLSL;
 store.hallEntranceSurfaceVertexShader=webgpu?vertexWGSL:vertexGLSL;
 store.hallEntranceSurfacePixelShader=webgpu?surfaceWGSL:surfaceGLSL;
 const root=new B.TransformNode('Entrance return portal',scene);
 root.position.set(0,4.6,-20.2);root.scaling.setAll(portalScale);
 const ring=B.MeshBuilder.CreateTorus('Entrance portal ring',{diameter:2.65,thickness:.24,tessellation:96},scene);
 ring.parent=root;ring.rotation.x=Math.PI*.5;
 const surface=B.MeshBuilder.CreateDisc('Entrance portal surface',{radius:1.18,tessellation:96,sideOrientation:B.Mesh.DOUBLESIDE},scene);
 surface.parent=root;
 function material(name,shader){
  const m=new B.ShaderMaterial(name,scene,shader,{
   shaderLanguage:webgpu?B.ShaderLanguage.WGSL:B.ShaderLanguage.GLSL,
   attributes:['position','normal'],uniforms:['world','viewProjection','cameraPos','portalTime','portalReveal'],
   needAlphaBlending:shader==='hallEntranceSurface'
  });
  m.backFaceCulling=false;m.setFloat('portalTime',0);m.setFloat('portalReveal',1);m.setVector3('cameraPos',camera.position);
  return m;
 }
 ring.material=material('Entrance portal energy ring','hallEntranceRing');
 surface.material=material('Entrance portal currents','hallEntranceSurface');
 surface.material.alphaMode=B.Constants.ALPHA_COMBINE;surface.material.disableDepthWrite=true;
 const meshes=[ring,surface];
 for(const mesh of meshes){mesh.isPickable=false;mesh.checkCollisions=false;mesh.metadata={entrancePortal:true}}
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const prompt=document.createElement('p');prompt.id='entrance-portal-prompt';prompt.className='portal-prompt';prompt.hidden=true;
 prompt.textContent='Press E to return to Sandbox';prompt.setAttribute('role','status');prompt.setAttribute('aria-live','polite');document.body.append(prompt);
 const toPortal=new B.Vector3();
 let time=0,entered=false,interactionEnabled=false,canInteract=false;
 function refreshPrompt(){
  const focusedControl=document.activeElement?.closest('#light-debug,input,textarea,select,[contenteditable]:not([contenteditable="false"])');
  canInteract=false;
  if(interactionEnabled&&!entered&&document.hasFocus()&&!document.hidden&&!document.querySelector('dialog[open]')&&!focusedControl){
   root.position.subtractToRef(camera.position,toPortal);
   const distance=toPortal.length();
   if(distance>0.05&&distance<=interactionDistance){
    toPortal.scaleInPlace(1/distance);
    canInteract=B.Vector3.Dot(camera.getForwardRay().direction,toPortal)>=facingThreshold;
   }
  }
  prompt.hidden=!canInteract;
 }
 function update(dt,enabled=true){
  if(!motion.matches)time+=dt;
  for(const mesh of meshes){mesh.material.setFloat('portalTime',time);mesh.material.setVector3('cameraPos',camera.position)}
  interactionEnabled=enabled;refreshPrompt();
 }
 function keydown(event){
  if((event.code!=='KeyE'&&(event.code||event.key?.toLowerCase()!=='e'))||event.repeat||event.ctrlKey||event.altKey||event.metaKey||event.isComposing)return;
  refreshPrompt();if(!canInteract)return;
  event.preventDefault();event.stopPropagation();entered=true;canInteract=false;prompt.hidden=true;
  window.dispatchEvent(new CustomEvent('exalted:portal-entered',{detail:{id:'gallery-entrance-portal',position:{x:root.position.x,y:root.position.y,z:root.position.z},destination:entrancePortalDestination}}));
  onEnter();
 }
 const blur=()=>{canInteract=false;prompt.hidden=true};
 document.addEventListener('keydown',keydown,true);document.addEventListener('focusin',refreshPrompt);window.addEventListener('blur',blur);
 scene.onDisposeObservable.add(()=>{document.removeEventListener('keydown',keydown,true);document.removeEventListener('focusin',refreshPrompt);window.removeEventListener('blur',blur);prompt.remove();for(const mesh of meshes){mesh.material.dispose();mesh.dispose()}root.dispose()});
 return {root,ring,surface,update,getState:()=>({destination:entrancePortalDestination,entered,canInteract,time,position:root.position.asArray(),apertureRadius,interactionDistance})};
}
