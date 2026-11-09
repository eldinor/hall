import {CreateTorus} from '@babylonjs/core/Meshes/Builders/torusBuilder.js';
import {CreateDisc} from '@babylonjs/core/Meshes/Builders/discBuilder.js';
import {CreatePlane} from '@babylonjs/core/Meshes/Builders/planeBuilder.js';
import {ShaderStore} from '@babylonjs/core/Engines/shaderStore.js';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode.js';
import {Mesh} from '@babylonjs/core/Meshes/mesh.js';
import {ShaderMaterial} from '@babylonjs/core/Materials/shaderMaterial.js';
import {ShaderLanguage} from '@babylonjs/core/Materials/shaderLanguage.js';
import {DynamicTexture} from '@babylonjs/core/Materials/Textures/dynamicTexture.js';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial.js';
import {Color3,Color4} from '@babylonjs/core/Maths/math.color.js';
import {GPUParticleSystem} from '@babylonjs/core/Particles/gpuParticleSystem.js';
import {ParticleSystem} from '@babylonjs/core/Particles/particleSystem.js';
import {CylinderDirectedParticleEmitter} from '@babylonjs/core/Particles/EmitterTypes/cylinderParticleEmitter.js';
import {Vector3} from '@babylonjs/core/Maths/math.vector.js';

const hubDestination='https://alpha.exalted8.com/hub';
import vertexWGSL from './shaders/entrance-portal/portal.vertex.wgsl?raw';
import ringWGSL from './shaders/entrance-portal/ring.fragment.wgsl?raw';
import surfaceWGSL from './shaders/entrance-portal/surface.fragment.wgsl?raw';
import vertexGLSL from './shaders/entrance-portal/portal.vertex.glsl?raw';
import ringGLSL from './shaders/entrance-portal/ring.fragment.glsl?raw';
import surfaceGLSL from './shaders/entrance-portal/surface.fragment.glsl?raw';

export function createHubPortal({scene,camera}){
 const engine=scene.getEngine(),webgpu=engine.isWebGPU;
 const store=webgpu?ShaderStore.ShadersStoreWGSL:ShaderStore.ShadersStore;
 store.hallHubRingVertexShader=webgpu?vertexWGSL:vertexGLSL;
 store.hallHubRingPixelShader=webgpu?ringWGSL:ringGLSL;
 store.hallHubSurfaceVertexShader=webgpu?vertexWGSL:vertexGLSL;
 store.hallHubSurfacePixelShader=webgpu?surfaceWGSL:surfaceGLSL;
 // Centre of the left-hand 4m floor tile beside the sanctuary approach.
 const root=new TransformNode('Hub floor portal',scene);root.position.set(-6,.07,44);root.scaling.setAll(1.1);
 const ring=CreateTorus('Hub portal ring',{diameter:2.65,thickness:.24,tessellation:96},scene);ring.parent=root;
 const surface=CreateDisc('Hub portal surface',{radius:1.18,tessellation:96,sideOrientation:Mesh.DOUBLESIDE},scene);surface.parent=root;surface.rotation.x=Math.PI/2;
 function material(name,shader,transparent=false){
  const m=new ShaderMaterial(name,scene,shader,{shaderLanguage:webgpu?ShaderLanguage.WGSL:ShaderLanguage.GLSL,defines:['#define HUB_PORTAL'],attributes:['position','normal'],uniforms:['world','viewProjection','cameraPos','portalTime','portalReveal'],needAlphaBlending:transparent});
  m.backFaceCulling=false;m.setFloat('portalTime',0);m.setFloat('portalReveal',1);m.setVector3('cameraPos',camera.position);return m;
 }
 ring.material=material('Hub blue energy ring','hallHubRing');surface.material=material('Hub blue currents','hallHubSurface',true);surface.material.disableDepthWrite=true;
 const labelTexture=new DynamicTexture('To the Hub label',{width:1024,height:256},scene,false);
 const labelContext=labelTexture.getContext();labelContext.clearRect(0,0,1024,256);labelContext.font='600 100px "Segoe UI", Arial, sans-serif';labelContext.textAlign='center';labelContext.textBaseline='middle';labelContext.shadowColor='#168dff';labelContext.shadowBlur=18;labelContext.fillStyle='#c7f4ff';labelContext.fillText('To the Hub',512,128);labelTexture.hasAlpha=true;labelTexture.update();
 const labelMaterial=new StandardMaterial('Hub label glow',scene);labelMaterial.disableLighting=true;labelMaterial.diffuseTexture=labelTexture;labelMaterial.emissiveTexture=labelTexture;labelMaterial.emissiveColor=Color3.White();labelMaterial.useAlphaFromDiffuseTexture=true;labelMaterial.backFaceCulling=false;
 const label=CreatePlane('To the Hub',{width:2.4,height:.6},scene);label.position.set(root.position.x,1.7,root.position.z);label.material=labelMaterial;label.billboardMode=Mesh.BILLBOARDMODE_ALL;
 const meshes=[ring,surface,label];for(const mesh of meshes){mesh.isPickable=false;mesh.checkCollisions=false;mesh.metadata={hubPortal:true}}

 const flameTexture=new DynamicTexture('Blue flame sprite',{width:128,height:256},scene,false),ctx=flameTexture.getContext();
 ctx.clearRect(0,0,128,256);const gradient=ctx.createLinearGradient(0,0,0,256);gradient.addColorStop(0,'rgba(0,80,255,0)');gradient.addColorStop(.25,'rgba(25,110,255,.6)');gradient.addColorStop(.65,'rgba(55,195,255,.95)');gradient.addColorStop(1,'rgba(210,250,255,1)');ctx.fillStyle=gradient;ctx.shadowColor='#168dff';ctx.shadowBlur=12;
 ctx.beginPath();ctx.moveTo(64,250);ctx.bezierCurveTo(9,225,28,175,40,143);ctx.bezierCurveTo(51,175,30,116,58,10);ctx.bezierCurveTo(85,72,69,110,94,148);ctx.bezierCurveTo(119,198,112,241,64,250);ctx.closePath();ctx.fill();flameTexture.hasAlpha=true;flameTexture.update();
 const gpu=GPUParticleSystem.IsSupported&&(webgpu||engine.webGLVersion>1);
 const flames=gpu?new GPUParticleSystem('Hub blue flames',{capacity:256,randomTextureSize:256},scene):new ParticleSystem('Hub blue flames',128,scene);
 flames.emitter=root.position;flames.particleEmitterType=new CylinderDirectedParticleEmitter(1.46,.025,0,new Vector3(-.08,1,-.08),new Vector3(.08,1.2,.08));flames.particleTexture=flameTexture;
 flames.minLifeTime=.6;flames.maxLifeTime=.95;flames.minSize=.35;flames.maxSize=.6;flames.minScaleX=.7;flames.maxScaleX=1.1;flames.minScaleY=1.6;flames.maxScaleY=2.5;
 flames.minEmitPower=.3;flames.maxEmitPower=.65;flames.updateSpeed=1/120;flames.emitRate=110;flames.blendMode=ParticleSystem.BLENDMODE_ADD;flames.forceDepthWrite=false;flames.preWarmCycles=30;
 for(const [at,color]of [[0,new Color4(.3,.85,1.4,0)],[.12,new Color4(.3,.85,1.4,.9)],[.5,new Color4(.03,.3,1.25,.8)],[1,new Color4(0,.08,.8,0)]])flames.addColorGradient(at,color);
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');let time=0,enabled=false,profile='cinematic';
 const prompt=document.createElement('p');prompt.id='hub-portal-prompt';prompt.className='portal-prompt';prompt.hidden=true;prompt.setAttribute('role','status');prompt.setAttribute('aria-live','polite');document.body.append(prompt);
 const horizontalInteractionRadius=7;
 const toPortal=new Vector3();let interactionEnabled=false,canInteract=false,activationCount=0,confirmationUntil=0;
 function refreshPrompt(){
  const focusedControl=document.activeElement?.closest('#light-debug,input,textarea,select,[contenteditable]:not([contenteditable="false"])');
  canInteract=false;
  if(interactionEnabled&&document.hasFocus()&&!document.hidden&&!document.querySelector('dialog[open]')&&!focusedControl){
   root.position.subtractToRef(camera.position,toPortal);
   // The visitor's eye is above this floor portal: proximity is measured on
   // the floor, while facing still uses the full 3D direction toward its centre.
   const distance=toPortal.length();
   if(toPortal.x*toPortal.x+toPortal.z*toPortal.z<=horizontalInteractionRadius*horizontalInteractionRadius&&Math.abs(toPortal.y)<=6&&distance>.05){
    toPortal.scaleInPlace(1/distance);canInteract=Vector3.Dot(camera.getForwardRay().direction,toPortal)>=.75;
   }
  }
  prompt.hidden=!canInteract;
  const message=performance.now()<confirmationUntil?'Opening the Hub…':'Press E to enter the Hub';
  if(prompt.textContent!==message)prompt.textContent=message;
 }
 function keydown(event){
  const isE=event.code?event.code==='KeyE':event.key?.toLowerCase()==='e';
  if(!isE||event.repeat||event.ctrlKey||event.altKey||event.metaKey||event.isComposing)return;
  refreshPrompt();if(!canInteract)return;
  event.preventDefault();event.stopPropagation();activationCount++;confirmationUntil=performance.now()+2500;
  const proceed=window.dispatchEvent(new CustomEvent('exalted:portal-entered',{cancelable:true,detail:{id:'gallery-hub-portal',position:{x:root.position.x,y:root.position.y,z:root.position.z},destination:hubDestination}}));
  refreshPrompt();
  if(proceed)window.location.assign(hubDestination);
 }
 const blur=()=>{canInteract=false;prompt.hidden=true};
 document.addEventListener('keydown',keydown,true);document.addEventListener('focusin',refreshPrompt);window.addEventListener('blur',blur);
 function sync(){const next=!motion.matches;if(next===enabled)return;enabled=next;if(enabled)flames.start();else{flames.stop();flames.reset()}}
 function configure(settings){profile=settings.qualityProfile;flames.emitRate=profile==='performance'?55:110;if(gpu)flames.activeParticleCount=profile==='performance'?128:256;sync()}
 function update(dt,allowInteraction=true){sync();if(!motion.matches)time+=dt;for(const mesh of [ring,surface]){mesh.material.setFloat('portalTime',time);mesh.material.setVector3('cameraPos',camera.position)}interactionEnabled=allowInteraction;refreshPrompt()}
 scene.onDisposeObservable.add(()=>{document.removeEventListener('keydown',keydown,true);document.removeEventListener('focusin',refreshPrompt);window.removeEventListener('blur',blur);prompt.remove();flames.dispose(false);flameTexture.dispose();labelTexture.dispose();for(const mesh of meshes){mesh.material.dispose();mesh.dispose()}root.dispose()});
 return {root,ring,surface,label,flames,configure,update,getState:()=>({position:root.position.asArray(),profile,time,flamesEnabled:enabled,particleBackend:gpu?'gpu':'cpu',activeFlames:flames.getActiveCount(),canInteract,activationCount,horizontalInteractionRadius,destination:hubDestination})};
}
