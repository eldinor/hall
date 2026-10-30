import * as B from 'babylonjs';

export function createAtmosphere(scene,lanterns){
 const engine=scene.getEngine();
 const gpu=B.GPUParticleSystem.IsSupported&&(engine.isWebGPU||engine.webGLVersion>1);
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const systems=[],origin=B.Vector3.Zero();
 let profile='cinematic',requested=true,enabled=false,style='';
 const texture=new B.DynamicTexture('Soft air particle',{width:64,height:64},scene,false);
 const context=texture.getContext(),gradient=context.createRadialGradient(32,32,0,32,32,32);
 gradient.addColorStop(0,'rgba(255,255,255,1)');
 gradient.addColorStop(.25,'rgba(255,255,255,.75)');
 gradient.addColorStop(.65,'rgba(255,255,255,.16)');
 gradient.addColorStop(1,'rgba(255,255,255,0)');
 context.fillStyle=gradient;context.fillRect(0,0,64,64);texture.hasAlpha=true;texture.update();
 // Stable GPU spawn slots; CPU particles receive a new slot at each birth.
 const hash=(i,salt)=>{const x=Math.sin((i+1)*127.1+salt*311.7)*43758.5453;return x-Math.floor(x)};
 function make(name,capacity,spawn,travel,life,size,rate){
  const system=gpu?new B.GPUParticleSystem(name,{capacity,randomTextureSize:256},scene):new B.ParticleSystem(name,capacity,scene);
  const emitter=new B.CustomParticleEmitter();let next=0;
  const slot=(index,particle)=>index>=0?index:particle._airSlot;
  emitter.particlePositionGenerator=(index,particle,out)=>{
   if(index<0)particle._airSlot=next++;
   spawn(slot(index,particle),out);
  };
  emitter.particleDestinationGenerator=(index,particle,out)=>{
   const i=slot(index,particle);spawn(i,out);out.addInPlace(travel(i));
  };
  system.particleEmitterType=emitter;system.emitter=origin;system.particleTexture=texture;
  system.minLifeTime=life[0];system.maxLifeTime=life[1];
  system.minSize=size[0];system.maxSize=size[1];system.emitRate=rate;
  system.minEmitPower=1;system.maxEmitPower=1;system.updateSpeed=1/60;
  system.blendMode=B.ParticleSystem.BLENDMODE_STANDARD;
  system.forceDepthWrite=false;system.preWarmCycles=60;system.preWarmStepOffset=20;
  system.minAngularSpeed=0;system.maxAngularSpeed=0;
  systems.push(system);return system;
 }
 const dust=make('Ambient soft dust',192,(i,out)=>{
  out.set((i%2?1:-1)*(4.2+hash(i,1)*6),2.4+hash(i,2)*11,-14+hash(i,3)*64);
 },i=>new B.Vector3((hash(i,4)-.5)*.35,.2+hash(i,5)*.3,(hash(i,6)-.5)*.4),[22,34],[.025,.065],5);
 function fade(system,color,alpha){
  // Changes are infrequent; rebuilding gradients also updates the GPU lookup.
  for(const entry of [...(system.getColorGradients()||[])])system.removeColorGradient(entry.gradient);
  for(const [at,opacity]of [[0,0],[.18,alpha],[.65,alpha*.8],[1,0]])
   system.addColorGradient(at,new B.Color4(color.r,color.g,color.b,opacity));
 }
 fade(dust,B.Color3.FromHexString('#c1cee2'),.23);
 const motes=[];
 for(let shade=0;shade<4;shade++){
  const lamps=lanterns.lanterns.filter(l=>l.shadeIndex===shade);
  const system=make(`Lantern rising motes ${shade+1}`,32,(i,out)=>{
   const lamp=lamps[i%lamps.length],angle=hash(i,7)*Math.PI*2,radius=.3+hash(i,8)*.13;
   out.copyFrom(lamp.root.position).addInPlaceFromFloats(Math.cos(angle)*radius,-.22+hash(i,9)*.18,Math.sin(angle)*radius);
  },i=>new B.Vector3((hash(i,10)-.5)*.07,.32+hash(i,11)*.12,(hash(i,12)-.5)*.07),[3.2,5.2],[.022,.048],lamps.length*1.5);
  system.blendMode=B.ParticleSystem.BLENDMODE_ADD;
  motes.push({system,lamps});
 }
 function sync(){
  const next=requested&&!motion.matches;
  if(next===enabled)return;
  enabled=next;
  for(const system of systems){
   if(enabled){system.emitter=origin;system.start()}
   else{system.stop();system.reset();system.emitter=null}
  }
 }
 function configure(settings){
  const changed=profile!==settings.qualityProfile;profile=settings.qualityProfile;requested=!!settings.dustEnabled;
  const performance=profile==='performance';
  dust.emitRate=performance?2.5:5;
  if(gpu)dust.activeParticleCount=performance?96:192;
  for(const {system,lamps}of motes){system.emitRate=lamps.length*(performance?.65:1.5);if(gpu)system.activeParticleCount=performance?16:32}
  const nextStyle=JSON.stringify([settings.columnColor,settings.globeGlow]);
  if(style!==nextStyle){
   style=nextStyle;
   for(const {system,lamps}of motes){
    const color=lamps[0].shell.material.albedoColor.scale(1/.65);
    fade(system,color,Math.min(.36,settings.globeGlow*.14));
   }
  }
  if(changed&&enabled){enabled=false;for(const system of systems){system.stop();system.reset();system.emitter=null}}
  sync();
 }
 motion.addEventListener('change',sync);
 // Also reconcile before rendering: background browser windows can defer
 // media-query change events when the preference changes back quickly.
 scene.onBeforeRenderObservable.add(sync);
 scene.onDisposeObservable.add(()=>{motion.removeEventListener('change',sync);systems.forEach(s=>s.dispose(false));texture.dispose()});
 return {configure,systems,getState:()=>({backend:gpu?'gpu':'cpu',fallbackReason:gpu?null:'GPU particles unavailable.',profile,enabled,reducedMotion:motion.matches,systems:systems.map(s=>({name:s.name,active:s.getActiveCount(),capacity:s.getCapacity()}))})};
}
