import * as B from 'babylonjs';
import './style.css';
import {articles,paintWorld} from './art.js';
import {createLightingDebug} from './lighting-debug.js';
import {createWindowGlass} from './window-glass.js';
import {beveledBox,projectArchitecturalUVs} from './architecture.js';
import {createArchitecturalMaterials} from './materials.js';
import {createVisualSystem} from './visuals.js';
import {createLanterns} from './lanterns.js';
import {createAtmosphere} from './atmosphere.js';
import {createRenderer,renderingSamples} from './renderer.js';
import {createKeyboardNavigation} from './keyboard-navigation.js';
import {createEntrancePortal} from './entrance-portal.js';
import {createHubPortal} from './hub-portal.js';
import {createRearGroundFog} from './rear-ground-fog.js';

const $=s=>document.querySelector(s);
function startupError(error){console.error(error);document.documentElement.dataset.appState='error';$('#error').hidden=false}
start().catch(startupError);
async function start(){
 const {engine,canvas,rendererInfo}=await createRenderer($('#scene'));
 engine.setHardwareScalingLevel(Math.min(window.devicePixelRatio,1.6)===window.devicePixelRatio?1:window.devicePixelRatio/1.6);
 const scene=new B.Scene(engine);scene.clearColor=new B.Color4(.037,.031,.065,1);scene.fogMode=B.Scene.FOGMODE_EXP2;scene.fogDensity=.006;scene.fogColor=new B.Color3(.075,.06,.12);
 const v=(x,y,z)=>new B.Vector3(x,y,z), C=h=>B.Color3.FromHexString(h);
 const spawnPosition=v(0,4.6,-15),spawnTarget=v(2.7,8.5,28);
 const camera=new B.UniversalCamera('Visitor',spawnPosition.clone(),scene);camera.setTarget(spawnTarget);camera.minZ=.15;camera.fov=.86;camera.speed=.42;camera.inertia=.8;camera.angularSensibility=3600;camera.attachControl(canvas,true);camera.keysUp=[87,38];camera.keysDown=[83,40];camera.keysLeft=[65,37];camera.keysRight=[68,39];
 scene.collisionsEnabled=true;camera.checkCollisions=true;
 // Camera presets have different eye heights; the walking body stays on the floor.
 camera.ellipsoid.set(.45,1,.45);
 function syncWalkingCollider(){camera.ellipsoidOffset.y=2-camera.position.y}
 syncWalkingCollider();scene.onBeforeAnimationsObservable.add(syncWalkingCollider);
 const hemi=new B.HemisphericLight('Vault ambient',v(0,1,0),scene);hemi.intensity=.35;hemi.diffuse=C('#b3abdc');hemi.groundColor=C('#49405c');
 const fill=new B.HemisphericLight('Blue window fill',v(-1,.4,0),scene);fill.intensity=.15;fill.diffuse=C('#9180db');
 const columnLights=[];
 let columnLightCluster=null;
 const fallbackLightCount=2;
 camera.maxZ=350;
 // HDR postprocessing runs on the visitor camera, including its intermediate MSAA target.
 const pipeline=new B.DefaultRenderingPipeline('EXALTED rendering',true,scene,[camera],false);
 pipeline.samples=renderingSamples(engine,'cinematic');
 pipeline.fxaaEnabled=pipeline.samples<2;
 pipeline.bloomEnabled=true;
 pipeline.bloomThreshold=.85;
 pipeline.bloomWeight=.22;
 pipeline.bloomKernel=64;
 pipeline.bloomScale=.5;
 pipeline.sharpenEnabled=true;
 pipeline.sharpen.edgeAmount=.15;
 pipeline.sharpen.colorAmount=1;
 pipeline.imageProcessingEnabled=true;
 const imageProcessing=scene.imageProcessingConfiguration;
 imageProcessing.toneMappingEnabled=true;
 imageProcessing.toneMappingType=B.ImageProcessingConfiguration.TONEMAPPING_ACES;
 imageProcessing.exposure=1.2;
 imageProcessing.contrast=1.1;
 imageProcessing.vignetteEnabled=true;
 imageProcessing.vignetteWeight=1.1;
 // Visual-system setup attaches AO before the default pipeline's HDR passes.
 function mat(name,color,emission=0){const m=new B.StandardMaterial(name,scene);m.diffuseColor=C(color);m.specularColor=new B.Color3(.22,.2,.18);m.emissiveColor=C(color).scale(emission);return m}
 const surfaces=createArchitecturalMaterials(scene);
 const {stone,dark,gold,black,floorMat}=surfaces;
 const warm=mat('Warm gold light','#e4ae59',1),purple=mat('Violet light','#9362ea',1.3);
 const columnLightColors=['#6b96ff','#80b7ff','#9ed7ff','#6284f5'].map(C);
 const lanterns=createLanterns(scene,columnLightColors,gold);
 const windowGlass=createWindowGlass(scene);
 function box(name,w,h,d,x,y,z,m,parent){const rounded=/footing|Column base|capital|pedestal|Pedestal|backing|upright|lintel|Sanctuary step/.test(name);const b=rounded?beveledBox(name,w,h,d,scene):B.MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);b.position=v(x,y,z);b.material=m;if(parent)b.parent=parent;return b}
 function tube(name,path,r,m){const b=B.MeshBuilder.CreateTube(name,{path,radius:r,tessellation:16,cap:B.Mesh.CAP_ALL},scene);b.material=m;return b}
 function arch(x,z,width,spring,rise,r,m,along=false){let p=[v(-width/2,0,0),v(-width/2,spring,0)];for(let i=0;i<=44;i++){let t=Math.PI-i/44*Math.PI;p.push(v(width/2*Math.cos(t),spring+rise*Math.pow(Math.sin(t),.78),0))}p.push(v(width/2,0,0));p=p.map(a=>along?v(x,a.y,z+a.x):v(x+a.x,a.y,z));return tube('Vaulted arch',p,r,m)}
 // Barrel vault shell, with structural ribs left fully readable against it.
 const vaultPaths=[];for(let j=0;j<2;j++){const p=[];for(let i=0;i<=80;i++){let t=Math.PI*i/80;p.push(v(12.5*Math.cos(t),15+9*Math.pow(Math.sin(t),.78),j?58:-20))}vaultPaths.push(p)}
 const roof=B.MeshBuilder.CreateRibbon('Continuous vaulted ceiling',{pathArray:vaultPaths,sideOrientation:B.Mesh.DOUBLESIDE},scene);roof.material=dark;
 // Match the side-wall stone dado while leaving the entrance sky open above it.
 const entranceBackWall=box('Entrance low back wall',26,2,1,0,1,-22,stone);
 entranceBackWall.metadata={entranceBackWall:true};entranceBackWall.isPickable=false;entranceBackWall.checkCollisions=true;
 const aisleLightBackZ=-19.8,aisleLightFrontZ=54.5;
 for(const side of [-1,1]){
 // Keep solid stone between the windows, with real openings behind the glass.
 box('Lower outer wall',1,5.3,80,side*13,2.65,18,dark);
 box('Upper outer wall',1,1.1,80,side*13,15.75,18,dark);
 let wallStart=-22;
 for(let center=-2;center<=48;center+=10){const edge=center-3.1;box('Window wall pier',1,10,edge-wallStart,side*13,10.3,(wallStart+edge)/2,dark);wallStart=center+3.1}
 box('Last window wall pier',1,10,58-wallStart,side*13,10.3,(wallStart+58)/2,dark);
 box('Stone dado',.8,2,79,side*12.3,1,18,stone);
 for(let z=-7;z<=53;z+=10){
  box('Column footing',2.3,.65,2.3,side*11.5,.32,z,stone);box('Column base',1.7,.7,1.7,side*11.5,1,z,stone);
  const col=B.MeshBuilder.CreateCylinder('Clustered nave pier',{height:11.8,diameter:1.05,tessellation:32},scene);col.position=v(side*11.5,6.9,z);col.material=stone;
  for(let q=0;q<4;q++){let a=q*Math.PI/2;let c=B.MeshBuilder.CreateCylinder('Pier fluting',{height:12.2,diameter:.28,tessellation:16},scene);c.position=v(side*11.5+Math.sin(a)*.57,7,z+Math.cos(a)*.57);c.material=stone}
  box('Carved capital',1.7,.5,1.7,side*11.5,12.8,z,stone);
  const shadeIndex=columnLights.length%columnLightColors.length;
  const lampPosition=lanterns.create(side,z,shadeIndex);
  // Keep source lights out of scene.lights until the cluster takes ownership.
  const light=new B.PointLight(`Column globe ${side<0?'left':'right'} ${z}`,lampPosition,scene,true);
  light.diffuse=columnLightColors[shadeIndex].clone();light.specular=columnLightColors[shadeIndex].scale(.3);
  light.intensity=1.3;light.range=14;light.falloffType=B.Light.FALLOFF_DEFAULT;
  columnLights.push(light);
  // Square glass masonry with fine joints, enclosed only by the outer arch.
  if(z<53){const wz=z+5;arch(side*12.2,wz,7,11,4,.12,gold,true);
   for(let row=0;row<15;row++)for(let column=0;column<10;column++)windowGlass.createBlock(side,5.65+row*.6,wz+(column-4.5)*.6);
  }
 }
 // The arcade above the exhibition frames echoes the larger nave ribs.
 for(let z=-2;z<51;z+=10)arch(side*11.3,z,9,10.5,4.4,.19,stone,true);
 box('Aisle gold light',.055,.035,aisleLightFrontZ-aisleLightBackZ,side*10.2,.09,(aisleLightFrontZ+aisleLightBackZ)/2,warm);
 }
 box('Entrance gold light',20.455,.035,.055,0,.09,aisleLightBackZ,warm);
 for(let z=-7;z<=53;z+=10){arch(0,z,23,12.5,11,.34,stone);arch(0,z-.28,22.7,12.4,10.8,.055,gold);
  for(let side of [-1,1]){const p=[];for(let i=0;i<=34;i++){const t=i/34;p.push(v(side*11.4*(1-t),12.7+10.6*Math.sin(t*Math.PI/2),z+5*t))}tube('Diagonal vault rib',p,.13,stone)}
  const boss=B.MeshBuilder.CreateSphere('Vault keystone',{diameter:.65,segments:12},scene);boss.position=v(0,23.5,z);boss.material=gold;
 }
 tube('Crown ridge',[v(0,23.65,-18),v(0,23.65,58)],.12,gold);
 // Polished marble floor with real planar reflections.
 const floor=B.MeshBuilder.CreateGround('Polished marble floor',{width:28,height:84},scene);floor.position.z=18;
 floor.material=floorMat;
 const mirror=new B.MirrorTexture('Floor reflection',1024,scene,true);mirror.mirrorPlane=new B.Plane(0,-1,0,-.025);mirror.renderParticles=false;mirror.gammaSpace=false;mirror.level=1.1;floorMat.reflectionTexture=mirror;
 for(let z=-22;z<60;z+=4){box('Floor transverse joint',26,.007,.025,0,.015,z,black)}for(let x=-12;x<=12;x+=4)box('Floor longitudinal joint',.025,.007,82,x,.018,18,black);
 for(const x of [-3,3])box('Central aisle brass inlay',.045,.02,76,x,.03,18,gold);
 for(let z=-8;z<50;z+=10){const ring=B.MeshBuilder.CreateTorus('Aisle medallion',{diameter:2.3,thickness:.025,tessellation:64},scene);ring.position=v(0,.035,z);ring.material=gold;const inner=B.MeshBuilder.CreateTorus('Inner medallion',{diameter:1.9,thickness:.018,tessellation:48},scene);inner.position=v(0,.04,z);inner.material=gold}
 const frames=[];
 articles.forEach((article,i)=>{
  const side=i<4?-1:1,z=2+(i%4)*11;const root=new B.TransformNode('Exhibit '+(i+1),scene);root.position=v(side*7.8,0,z);
  // Cylindrical billboards use the exhibit's -Z article face and stay level.
  root.rotation.y=Math.atan2(root.position.x-camera.position.x,root.position.z-camera.position.z);
  const plinth=box('Black marble pedestal',4.55,.95,1.65,0,.48,0,black,root);plinth.material=black;
  box('Pedestal brass foot',4.65,.065,1.75,0,.08,0,warm,root);box('Pedestal cornice',4.75,.16,1.85,0,.99,0,gold,root);
  box('Exhibit backing',4.2,6.3,.24,0,4.35,0,black,root);
  for(const x of [-2.12,2.12]){box('Gilded upright',.09,6.5,.3,x,4.35,-.03,gold,root);box('Luminous inner edge',.022,6.26,.025,x*.965,4.35,-.19,i<4?warm:purple,root)}
  for(const y of [1.12,7.58]){box('Gilded lintel',4.32,.09,.3,0,y,-.03,gold,root);box('Luminous edge',4.1,.022,.025,0,y+(y<2?.09:-.09),-.19,i<4?warm:purple,root)}
  let tex;
  if(article.cover){article.image=import.meta.env.BASE_URL+article.cover;tex=new B.Texture(article.image,scene,false,true,B.Texture.TRILINEAR_SAMPLINGMODE)}
  else{const image=paintWorld(article);tex=new B.DynamicTexture('Original artwork '+i,image,scene,false);tex.update()}
  const am=mat(article.title,'#ffffff');am.diffuseTexture=tex;am.emissiveTexture=tex;am.emissiveColor=new B.Color3(.7,.7,.7);am.specularColor=B.Color3.Black();
  const panel=B.MeshBuilder.CreatePlane('Artwork '+(i+1),{width:4.05,height:6.18,sideOrientation:B.Mesh.DOUBLESIDE},scene);panel.parent=root;panel.position=v(0,4.35,-.145);panel.material=am;panel.metadata={article:i};frames.push(panel);
  const emblem=B.MeshBuilder.CreatePolyhedron('Plinth crystal',{type:1,size:.15},scene);emblem.parent=root;emblem.position=v(0,.52,-.85);emblem.material=purple;
 });
 // The final portal repeats the arch motif in nested, luminous layers.
 box('Apse back wall',27,25,1,0,12.5,58,dark);
 for(let i=0;i<4;i++){box('Sanctuary step',13-i*1.3,.25,6-i*.8,0,.13+i*.25,51+i*.55,stone);box('Step lighting',13-i*1.3,.025,.035,0,.27+i*.25,48+i*.95,warm)}
 for(let i=0;i<4;i++)arch(0,56-i*.35,8+i*1.15,10,6+i*.6,.14,i%2?gold:stone);
 arch(0,54.5,7.5,10,5.6,.04,purple);
 const portalMat=mat('Portal twilight','#473579',.5);const portal=B.MeshBuilder.CreatePlane('Portal field',{width:7,height:13},scene);portal.position=v(0,7.5,56.5);portal.material=portalMat;
 const crystal=B.MeshBuilder.CreatePolyhedron('Floating astral crystal',{type:1,size:1.15},scene);crystal.position=v(0,7,52);crystal.material=purple;
 const wire=B.MeshBuilder.CreatePolyhedron('Astral brass cage',{type:1,size:1.6},scene);wire.position=crystal.position.clone();const wm=mat('Wire brass','#eac58c',1);wm.wireframe=true;wire.material=wm;
 const signTex=new B.DynamicTexture('Sanctuary inscription',{width:1024,height:256},scene,false),sg=signTex.getContext();sg.clearRect(0,0,1024,256);sg.textAlign='center';sg.fillStyle='#e6c692';sg.font='600 72px "Segoe UI", Arial, sans-serif';sg.fillText('EXALTED',512,110);sg.font='29px "Segoe UI", Arial, sans-serif';sg.fillText('Interactive 3D magazine',512,172);signTex.hasAlpha=true;signTex.update();const sm=mat('Gold inscription','#ffffff',.8);sm.diffuseTexture=signTex;sm.emissiveTexture=signTex;sm.useAlphaFromDiffuseTexture=true;const sign=B.MeshBuilder.CreatePlane('Hall inscription',{width:8,height:2},scene);sign.position=v(0,2.7,49);sign.material=sm;
 // Exhibit children must retain their parent so pedestals and frames billboard together.
 for(const mesh of scene.meshes)projectArchitecturalUVs(mesh);
 const groups=new Map();for(const m of [...scene.meshes]){if([floor,crystal,wire,sign].includes(m)||m.metadata||m.parent)continue;m.computeWorldMatrix(true);if(!groups.has(m.material))groups.set(m.material,[]);groups.get(m.material).push(m)}
 for(const meshes of groups.values()){if(meshes.length>1){const merged=B.Mesh.MergeMeshes(meshes,true,true,undefined,false,false);if(merged)merged.isPickable=false}}
 for(const mesh of scene.meshes)if(!mesh.parent&&!mesh.metadata?.skybox&&![crystal,wire].includes(mesh))mesh.freezeWorldMatrix();
 const entrancePortal=createEntrancePortal({scene,camera});
 const hubPortal=createHubPortal({scene,camera});
 const rearGroundFog=createRearGroundFog(scene);
 scene.meshes.forEach(m=>{if(!m.metadata)m.isPickable=false});mirror.renderList=scene.meshes.filter(m=>m!==floor);
 // Create clustering after merging so Babylon's internal light proxy stays separate.
 if(B.ClusteredLightContainer.IsLightSupported(columnLights[0])){
  columnLightCluster=new B.ClusteredLightContainer('Column globe cluster',columnLights,scene);
  columnLightCluster.horizontalTiles=32;columnLightCluster.verticalTiles=18;
  columnLightCluster.depthSlices=32;columnLightCluster.maxRange=14;
 }else{
  // Retain local illumination on older GPUs without compiling fourteen light slots.
  for(const light of columnLights){light.setEnabled(false);scene.addLight(light)}
  for(const material of scene.materials)if(material instanceof B.StandardMaterial||material instanceof B.PBRMaterial)material.maxSimultaneousLights=2+fallbackLightCount;
 }
 const views={entrance:{pos:spawnPosition,target:spawnTarget},nave:{pos:v(0,3.1,10),target:v(0,9,49)},portal:{pos:v(0,3.2,37),target:v(0,7.5,55)}};let travel=null,touring=false,tourStartedAt=0,selected=0;
 const tourDuration=30000;
 const tourHighlights=[{at:.2,article:0},{at:.4,article:5},{at:.6,article:2},{at:.8,article:7}];
 function moveTo(pos,target,duration=2200){const proxy=new B.UniversalCamera('pose',pos,scene);proxy.setTarget(target);travel={from:camera.position.clone(),to:pos.clone(),r0:camera.rotation.clone(),r1:proxy.rotation.clone(),time:0,duration};proxy.dispose()}
 function setView(name){stopTour();document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));moveTo(views[name].pos,views[name].target)}
 function stopTour(){touring=false;$('#tour').innerHTML='▷ <span>Guided tour</span>'}
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
 canvas.addEventListener('wheel',e=>{if($('#article').open||$('#controls').open)return;e.preventDefault();stopTour();travel=null;syncWalkingCollider();const direction=camera.getForwardRay().direction;camera._collideWithWorld(direction.scale(Math.sign(e.deltaY)*1.15));},{passive:false});
 function resumeNavigation(){if(document.querySelector('dialog[open]'))return;camera.attachControl(canvas,true);canvas.focus({preventScroll:true})}
 const keyboardNavigation=createKeyboardNavigation({scene,camera,canvas,onNavigate:()=>{camera.attachControl(canvas,true);stopTour();travel=null;document.body.classList.add('exploring')}});
 canvas.addEventListener('keydown',()=>{stopTour();travel=null;document.body.classList.add('exploring')});canvas.addEventListener('pointerdown',()=>{travel=null;stopTour();resumeNavigation()});
 scene.onPointerObservable.add(info=>{if(info.type===B.PointerEventTypes.POINTERTAP&&info.pickInfo?.pickedMesh?.metadata?.article!==undefined)openArticle(info.pickInfo.pickedMesh.metadata.article);if(info.type===B.PointerEventTypes.POINTERMOVE)canvas.style.cursor=info.pickInfo?.pickedMesh?.metadata?'pointer':'grab'});
 function openArticle(i){selected=(i+8)%8;const a=articles[selected];$('#article-art').style.backgroundImage=`url(${a.image})`;$('#article-category').textContent=a.category;$('#article-title').textContent=a.title;$('#article-description').textContent=a.description;$('#article-index').textContent=`${String(selected+1).padStart(2,'0')} / 08`;if(!$('#article').open){stopTour();$('#article').showModal();camera.detachControl()} }
 $('#close').onclick=()=>$('#article').close();$('#article').addEventListener('close',resumeNavigation);$('#previous').onclick=()=>openArticle(selected-1);$('#next').onclick=()=>openArticle(selected+1);
 $('#help').onclick=()=>{$('#controls').showModal();camera.detachControl()};$('#close-help').onclick=$('#got-it').onclick=()=>$('#controls').close();$('#controls').addEventListener('close',resumeNavigation);
 $('#tour').onclick=()=>{if(touring){stopTour();return}keyboardNavigation.clear();camera.movement.resetPanVelocity();camera.movement.resetRotationVelocity();camera.cameraDirection.setAll(0);camera.cameraRotation.set(0,0);camera.position.copyFrom(views.entrance.pos);camera.setTarget(views.entrance.target);touring=true;tourStartedAt=performance.now();travel=null;$('#tour').innerHTML='Ⅱ <span>Pause tour</span>';};
 $('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){console.warn('Fullscreen unavailable',e)}};
 let audio=null;$('#sound').onclick=async()=>{if(!audio){const ac=new(window.AudioContext||window.webkitAudioContext)(),gain=ac.createGain();gain.gain.value=.018;gain.connect(ac.destination);[65.41,98,130.81,196.0].forEach((f,i)=>{const o=ac.createOscillator();o.type='sine';o.frequency.value=f;o.detune.value=i*3;o.connect(gain);o.start()});audio=ac;await ac.resume()}else if(audio.state==='running')await audio.suspend();else await audio.resume();const on=audio.state==='running';$('#sound').innerHTML=`♫ <span>SOUND ${on?'ON':'OFF'}</span>`;$('#sound').setAttribute('aria-label',`${on?'Disable':'Enable'} ambient sound`)};
 const atmosphere=createAtmosphere(scene,lanterns);
 const visuals=createVisualSystem({scene,engine,camera,pipeline,mirror,surfaces,windowGlass,atmosphere,hubPortal,columnLightCluster});
 const lightingDebug=createLightingDebug({scene,camera,canvas,rendererInfo,ambient:hemi,fill,columnLights,columnLightCluster,columnLightColors,lanterns,frames,windowGlass,pipeline,imageProcessing,visuals,Color3:B.Color3});
 visuals.setProfile=qualityProfile=>lightingDebug.setSettings({qualityProfile});
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 scene.onBeforeRenderObservable.add(()=>{let dt=Math.min(engine.getDeltaTime(),50);if(!reduced){lanterns.update(dt);crystal.rotation.y+=dt*.00025;wire.rotation.y-=dt*.00013;crystal.position.y=7+Math.sin(performance.now()*.0007)*.2}
  if(travel){travel.time+=dt;let t=Math.min(1,travel.time/travel.duration);t=t*t*(3-2*t);camera.position=B.Vector3.Lerp(travel.from,travel.to,t);camera.rotation=B.Vector3.Lerp(travel.r0,travel.r1,t);if(t>=1)travel=null}
  if(touring){
   const t=Math.min((performance.now()-tourStartedAt)/tourDuration,1);
   const pathT=t*t*(3-2*t);
   camera.position=B.Vector3.Lerp(views.entrance.pos,views.portal.pos,pathT);
   camera.position.x+=Math.sin(t*Math.PI*4)*Math.sin(t*Math.PI)*1.4;
   let target=B.Vector3.Lerp(views.entrance.target,views.portal.target,pathT);
   // Ease toward alternating exhibits, briefly hold the gaze, then face forward.
   for(const highlight of tourHighlights){
    const distance=Math.abs(t-highlight.at);
    const blend=B.Scalar.Clamp((distance-.025)/.07,0,1);
    const weight=1-blend*blend*(3-2*blend);
    if(weight>0){const exhibit=frames[highlight.article].parent;target=B.Vector3.Lerp(target,v(exhibit.position.x,4.35,exhibit.position.z),weight)}
   }
   camera.setTarget(target);if(t>=1)stopTour();
  }
  camera.position.x=B.Scalar.Clamp(camera.position.x,-9.3,9.3);camera.position.z=B.Scalar.Clamp(camera.position.z,-23,47);camera.position.y=B.Scalar.Clamp(camera.position.y,2.2,10);
  const portalInteractionEnabled=document.documentElement.dataset.appState==='ready'&&!touring&&!travel&&!document.querySelector('dialog[open]');
  entrancePortal.update(dt/1000,portalInteractionEnabled);
  hubPortal.update(dt/1000,portalInteractionEnabled);
  rearGroundFog.update(dt/1000);
  if(!columnLightCluster){
   const nearest=[...columnLights].sort((a,b)=>B.Vector3.DistanceSquared(a.position,camera.position)-B.Vector3.DistanceSquared(b.position,camera.position)).slice(0,fallbackLightCount);
   for(const light of columnLights){const enabled=nearest.includes(light);if(light.isEnabled()!==enabled)light.setEnabled(enabled)}
  }
  // Update once for the visitor camera so floor reflections share the same pose.
  for(const panel of frames){const root=panel.parent;const dx=root.position.x-camera.position.x,dz=root.position.z-camera.position.z;if(dx*dx+dz*dz>.0001)root.rotation.y=Math.atan2(dx,dz)}
 });
 // Keep the HTML loader up until all surface maps and scene resources are
 // ready, then let a complete rendered frame reach the canvas before revealing UI.
 Promise.all([visuals.ready,scene.whenReadyAsync()]).then(()=>{
  scene.onAfterRenderObservable.addOnce(()=>requestAnimationFrame(()=>{
   document.documentElement.dataset.appState='ready';
   $('#loading').classList.add('done');$('#loading').setAttribute('aria-hidden','true');
   // Camera keyboard events are delivered only to the focused input canvas.
   // Preserve focus if the visitor has already started interacting with a control.
   if(document.activeElement===document.body)resumeNavigation();
  }));
 }).catch(startupError);
 engine.runRenderLoop(()=>scene.render());window.addEventListener('resize',()=>engine.resize());
 // Exposed read-only diagnostics and inspection helpers for browser QA.
 window.hall={scene,camera,frames,articles,setView,openArticle,engine,rendererInfo,pipeline,columnLights,columnLightCluster,lightingDebug,windowGlass,visuals,lanterns,atmosphere,entrancePortal,hubPortal,rearGroundFog,get qualityProfile(){return visuals.getProfile()},get renderMetrics(){return visuals.getMetrics()}};
}
