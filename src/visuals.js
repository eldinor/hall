import * as B from 'babylonjs';
import {renderingSamples} from './renderer.js';

export const qualityProfiles={
 cinematic:{textureSize:2048,reflectionSize:1024,skySize:1024,samples:4,ao:true},
 performance:{textureSize:1024,reflectionSize:512,skySize:512,samples:2,ao:false}
};

export function createVisualSystem({scene,engine,camera,pipeline,mirror,surfaces,windowGlass,atmosphere,hubPortal,columnLightCluster}){
 let profile=null,ao=null,aoActive=false,ready=Promise.resolve(),lastError=null,currentSettings={},generation=0;
 scene.shadowsEnabled=false;
 // Plinth marble retains the interior capture. Thin brass trims use the
 // prefiltered environment: the raw probe adds sharp, unstable strip highlights.
 const probe=new B.ReflectionProbe('Pedestal marble reflections',256,scene,true);
 probe.renderParticles=false;probe.position.set(0,1.2,18);probe.renderList=[];probe.cubeTexture.gammaSpace=false;probe.cubeTexture.refreshRate=B.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
 surfaces.gold.reflectionTexture=windowGlass.reflection;surfaces.black.reflectionTexture=probe.cubeTexture;
 const reflectionMeshes=scene.meshes.filter(m=>!m.metadata?.htmlVitrine&&!m.metadata?.paperLabel&&m.name!=='Polished marble floor'&&!windowGlass.materials.includes(m.material)&&m.material!==surfaces.gold&&m.material!==surfaces.black);
 let reflectionSignature='';
 // Keep empty legacy diagnostics for callers inspecting the former shadow rig.
 const spots=[],shadows=[];
 const lightBudget=columnLightCluster?3:4;
 for(const material of scene.materials)if('maxSimultaneousLights' in material)material.maxSimultaneousLights=lightBudget;
 const instrumentation=new B.EngineInstrumentation(engine);instrumentation.captureGPUFrameTime=!!engine.getCaps().timerQuery;
 const sceneInstrumentation=new B.SceneInstrumentation(scene);sceneInstrumentation.captureFrameTime=true;sceneInstrumentation.captureRenderTime=true;
 const intervals=[];let previous=performance.now(),metrics={},frames=0;
 scene.onAfterRenderObservable.add(()=>{
  const now=performance.now();intervals.push(now-previous);previous=now;if(intervals.length>120)intervals.shift();
  if(++frames%30)return;
  const ordered=[...intervals].sort((a,b)=>a-b),mean=intervals.reduce((a,b)=>a+b,0)/intervals.length;
  const rendererInfo=engine.getInfo();
  const textures=engine.getLoadedTexturesCache(),bytes=textures.reduce((sum,t)=>sum+(t.width||0)*(t.height||0)*(t.isCube?6:1)*(t.type===1?16:t.type===2?8:4)*(t.generateMipMaps?4/3:1),0);
  metrics={profile,fps:Math.round(1000/mean),frameMs:mean,p95FrameMs:ordered[Math.floor(ordered.length*.95)],gpuFrameMs:instrumentation.gpuFrameTimeCounter.current>0?instrumentation.gpuFrameTimeCounter.current/1e6:null,cpuFrameMs:sceneInstrumentation.frameTimeCounter.current,drawCalls:engine._drawCalls.current,triangles:Math.round(scene.getActiveIndices()/3),textures:textures.length,estimatedTextureMiB:Math.round(bytes/1048576),backend:engine.isWebGPU?'webgpu':'webgl',renderer:[rendererInfo.vendor,rendererInfo.renderer,rendererInfo.version].filter(Boolean).join(' / '),renderSize:[engine.getRenderWidth(),engine.getRenderHeight()]};
 });
 function rebuildAO(enabled,samples){
  if(enabled===aoActive)return false;
  if(ao){ao.dispose(false);scene.disableGeometryBufferRenderer();ao=null}
  aoActive=enabled;
  if(enabled){
   const geometry=scene.enableGeometryBufferRenderer();
   if(geometry){
    geometry.getGBuffer().renderParticles=false;
    geometry.renderList=scene.meshes.filter(m=>!m.metadata?.htmlVitrine&&!m.metadata?.paperLabel&&!windowGlass.materials.includes(m.material)&&!m.metadata?.skybox&&!m.metadata?.lanternGlass&&!m.metadata?.lanternHalo&&!m.metadata?.entrancePortal&&!m.metadata?.hubPortal&&!m.metadata?.rearGroundFog);
    // Geometry-buffer depth defaults to zero in empty sky pixels. SSAO treats
    // those as foreground, blacking out windows and the portal at high strength.
    // Clear only linear depth to far distance; leave the other attachments alone.
    const gBuffer=geometry.getGBuffer(),depthIndex=geometry.getTextureIndex(B.GeometryBufferRenderer.DEPTH_TEXTURE_TYPE);
    const depthLayout=engine.buildTextureLayout(Array.from({length:gBuffer.count},(_,index)=>index===depthIndex));
    const allLayout=engine.buildTextureLayout(Array.from({length:gBuffer.count},()=>true));
    const farDepth=new B.Color4(camera.maxZ,0,0,1);
    gBuffer.onClearObservable.add(()=>{farDepth.r=camera.maxZ;engine.clearAttachments(farDepth,depthLayout,true,false,false);engine.bindAttachments(allLayout)});
    ao=new B.SSAO2RenderingPipeline('EXALTED contact occlusion',scene,{ssaoRatio:.5,blurRatio:.5},[camera],geometry);
    ao.samples=16;ao.radius=.35;ao.totalStrength=.55;ao.base=.15;ao.maxZ=100;ao.textureSamples=samples;ao.bilateralSamples=8;
   }else aoActive=false;
  }
  return true;
 }
 function applySettings(settings){
  currentSettings={...settings};const selected=qualityProfiles[settings.qualityProfile]?settings.qualityProfile:'cinematic',config=qualityProfiles[selected];
  const changed=profile!==selected;profile=selected;
  const samples=renderingSamples(engine,selected);
  const wantAO=config.ao&&settings.aoEnabled&&B.SSAO2RenderingPipeline.IsSupported;
  const aoChanged=rebuildAO(wantAO,samples);
  if(ao){ao.radius=settings.aoRadius;ao.totalStrength=settings.aoStrength;ao.textureSamples=samples}
  if(changed){
   engine.setHardwareScalingLevel(Math.max(1,window.devicePixelRatio/(profile==='cinematic'?1.6:1)));
   // The mirror's blur chain returns a black target with this render setup.
   // Keep the capture intact; the marble's PBR roughness supplies the polish.
   mirror.resize(config.reflectionSize);
   pipeline.samples=samples;pipeline.fxaaEnabled=samples<2;
   pipeline.depthOfFieldEnabled=false;pipeline.chromaticAberrationEnabled=false;pipeline.grainEnabled=false;
   const version=++generation;
   ready=Promise.all([surfaces.setResolution(config.textureSize),windowGlass.setSkyResolution(config.skySize)]).then(()=>{if(version===generation){lastError=null;probe.renderList=reflectionMeshes;probe.cubeTexture.resetRefreshCounter()}}).catch(error=>{lastError=error.message;console.error(error);throw error});
  }
  scene.fogDensity=settings.fogDensity;
  atmosphere.configure(settings);
  hubPortal.configure(settings);
  const signature=JSON.stringify([settings.ambient,settings.fill,settings.ambientColor,settings.fillColor,settings.columns,settings.columnColor,settings.globeGlow,settings.skyBrightness,settings.skyRotation]);
  if(signature!==reflectionSignature){reflectionSignature=signature;probe.cubeTexture.resetRefreshCounter()}
  // SSAO must precede bloom/tone mapping; rebuilding the default pipeline
  // reattaches its passes after the newly attached AO passes.
  if(changed||aoChanged)pipeline.prepare();
  return ready;
 }
 scene.onDisposeObservable.add(()=>{instrumentation.dispose();sceneInstrumentation.dispose();if(ao)ao.dispose(true);probe.dispose()});
 return {applySettings,get ready(){return ready},getProfile:()=>profile,getMetrics:()=>({...metrics}),getState:()=>({profile,aoActive,shadowLights:0,shadowMapSizes:[],textureSize:surfaces.getResolution(),skySize:windowGlass.skyTexture.getSize().width,reflectionSize:mirror.getSize().width,error:lastError,settings:{...currentSettings}}),get ao(){return ao},spots,shadows,mirror};
}
