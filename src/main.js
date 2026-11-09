import {CreateBox} from '@babylonjs/core/Meshes/Builders/boxBuilder.js';
import {CreateTube} from '@babylonjs/core/Meshes/Builders/tubeBuilder.js';
import {CreateRibbon} from '@babylonjs/core/Meshes/Builders/ribbonBuilder.js';
import {CreateCylinder} from '@babylonjs/core/Meshes/Builders/cylinderBuilder.js';
import {CreateSphere} from '@babylonjs/core/Meshes/Builders/sphereBuilder.js';
import {CreateGround} from '@babylonjs/core/Meshes/Builders/groundBuilder.js';
import {CreateTorus} from '@babylonjs/core/Meshes/Builders/torusBuilder.js';
import {CreatePlane} from '@babylonjs/core/Meshes/Builders/planeBuilder.js';
import {CreatePolyhedron} from '@babylonjs/core/Meshes/Builders/polyhedronBuilder.js';
import {Scene} from '@babylonjs/core/scene.js';
import {Color4,Color3} from '@babylonjs/core/Maths/math.color.js';
import {Vector3} from '@babylonjs/core/Maths/math.vector.js';
import {UniversalCamera} from '@babylonjs/core/Cameras/universalCamera.js';
import {HemisphericLight} from '@babylonjs/core/Lights/hemisphericLight.js';
import {DefaultRenderingPipeline} from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline.js';
import {ImageProcessingConfiguration} from '@babylonjs/core/Materials/imageProcessingConfiguration.js';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial.js';
import {Mesh} from '@babylonjs/core/Meshes/mesh.js';
import {PointLight} from '@babylonjs/core/Lights/pointLight.js';
import {Light} from '@babylonjs/core/Lights/light.js';
import {MirrorTexture} from '@babylonjs/core/Materials/Textures/mirrorTexture.js';
import {Plane} from '@babylonjs/core/Maths/math.plane.js';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode.js';
import {Texture} from '@babylonjs/core/Materials/Textures/texture.js';
import {DynamicTexture} from '@babylonjs/core/Materials/Textures/dynamicTexture.js';
import {Constants} from '@babylonjs/core/Engines/constants.js';
import {ClusteredLightContainer} from '@babylonjs/core/Lights/Clustered/clusteredLightContainer.js';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial.js';
import {PointerEventTypes} from '@babylonjs/core/Events/pointerEvents.js';
import {Scalar} from '@babylonjs/core/Maths/math.scalar.js';
import './babylon-features.js';
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
import {loadingPhase,finishLoading} from './loading.js';

const $=s=>document.querySelector(s);
function startupError(error){console.error(error);document.documentElement.dataset.appState='error';$('#error').hidden=false}
start().catch(startupError);
async function start(){
 await loadingPhase('creating device',.05);
 const {engine,canvas,rendererInfo}=await createRenderer($('#scene'));
 await loadingPhase('building scene',.12);
 engine.setHardwareScalingLevel(Math.min(window.devicePixelRatio,1.6)===window.devicePixelRatio?1:window.devicePixelRatio/1.6);
 const scene=new Scene(engine);scene.clearColor=new Color4(.037,.031,.065,1);scene.fogMode=Scene.FOGMODE_EXP2;scene.fogDensity=.006;scene.fogColor=new Color3(.075,.06,.12);
 const v=(x,y,z)=>new Vector3(x,y,z), C=h=>Color3.FromHexString(h);
 const spawnPosition=v(0,4.6,-15),spawnTarget=v(2.7,8.5,28);
 const camera=new UniversalCamera('Visitor',spawnPosition.clone(),scene);camera.setTarget(spawnTarget);camera.minZ=.15;camera.fov=.86;camera.speed=.42;camera.inertia=.8;camera.angularSensibility=3600;camera.attachControl(canvas,true);camera.keysUp=[87,38];camera.keysDown=[83,40];camera.keysLeft=[65,37];camera.keysRight=[68,39];
 scene.collisionsEnabled=true;camera.checkCollisions=true;
 // Camera presets have different eye heights; the walking body stays on the floor.
 camera.ellipsoid.set(.45,1,.45);
 function syncWalkingCollider(){camera.ellipsoidOffset.y=2-camera.position.y}
 syncWalkingCollider();scene.onBeforeAnimationsObservable.add(syncWalkingCollider);
 const hemi=new HemisphericLight('Vault ambient',v(0,1,0),scene);hemi.intensity=.35;hemi.diffuse=C('#b3abdc');hemi.groundColor=C('#49405c');
 const fill=new HemisphericLight('Blue window fill',v(-1,.4,0),scene);fill.intensity=.15;fill.diffuse=C('#9180db');
 const columnLights=[];
 let columnLightCluster=null;
 const fallbackLightCount=2;
 camera.maxZ=350;
 // HDR postprocessing runs on the visitor camera, including its intermediate MSAA target.
 const pipeline=new DefaultRenderingPipeline('EXALTED rendering',true,scene,[camera],false);
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
 imageProcessing.toneMappingType=ImageProcessingConfiguration.TONEMAPPING_ACES;
 imageProcessing.exposure=1.2;
 imageProcessing.contrast=1.1;
 imageProcessing.vignetteEnabled=true;
 imageProcessing.vignetteWeight=1.1;
 // Visual-system setup attaches AO before the default pipeline's HDR passes.
 function mat(name,color,emission=0){const m=new StandardMaterial(name,scene);m.diffuseColor=C(color);m.specularColor=new Color3(.22,.2,.18);m.emissiveColor=C(color).scale(emission);return m}
 const surfaces=createArchitecturalMaterials(scene);
 const {stone,dark,gold,black,floorMat}=surfaces;
 const warm=mat('Warm gold light','#e4ae59',1),purple=mat('Violet light','#9362ea',1.3);
 const columnLightColors=['#6b96ff','#80b7ff','#9ed7ff','#6284f5'].map(C);
 const lanterns=createLanterns(scene,columnLightColors,gold);
 const windowGlass=createWindowGlass(scene);
 function box(name,w,h,d,x,y,z,m,parent){const rounded=/footing|Column base|capital|pedestal|Pedestal|backing|upright|lintel|Sanctuary step/.test(name);const b=rounded?beveledBox(name,w,h,d,scene):CreateBox(name,{width:w,height:h,depth:d},scene);b.position=v(x,y,z);b.material=m;if(parent)b.parent=parent;return b}
 function tube(name,path,r,m){const b=CreateTube(name,{path,radius:r,tessellation:16,cap:Mesh.CAP_ALL},scene);b.material=m;return b}
 function arch(x,z,width,spring,rise,r,m,along=false){let p=[v(-width/2,0,0),v(-width/2,spring,0)];for(let i=0;i<=44;i++){let t=Math.PI-i/44*Math.PI;p.push(v(width/2*Math.cos(t),spring+rise*Math.pow(Math.sin(t),.78),0))}p.push(v(width/2,0,0));p=p.map(a=>along?v(x,a.y,z+a.x):v(x+a.x,a.y,z));return tube('Vaulted arch',p,r,m)}
 // Barrel vault shell, with structural ribs left fully readable against it.
 const vaultPaths=[];for(let j=0;j<2;j++){const p=[];for(let i=0;i<=80;i++){let t=Math.PI*i/80;p.push(v(12.5*Math.cos(t),15+9*Math.pow(Math.sin(t),.78),j?58:-20))}vaultPaths.push(p)}
 const roof=CreateRibbon('Continuous vaulted ceiling',{pathArray:vaultPaths,sideOrientation:Mesh.DOUBLESIDE},scene);roof.material=dark;
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
  const col=CreateCylinder('Clustered nave pier',{height:11.8,diameter:1.05,tessellation:32},scene);col.position=v(side*11.5,6.9,z);col.material=stone;
  for(let q=0;q<4;q++){let a=q*Math.PI/2;let c=CreateCylinder('Pier fluting',{height:12.2,diameter:.28,tessellation:16},scene);c.position=v(side*11.5+Math.sin(a)*.57,7,z+Math.cos(a)*.57);c.material=stone}
  box('Carved capital',1.7,.5,1.7,side*11.5,12.8,z,stone);
  const shadeIndex=columnLights.length%columnLightColors.length;
  const lampPosition=lanterns.create(side,z,shadeIndex);
  // Keep source lights out of scene.lights until the cluster takes ownership.
  const light=new PointLight(`Column globe ${side<0?'left':'right'} ${z}`,lampPosition,scene,true);
  light.diffuse=columnLightColors[shadeIndex].clone();light.specular=columnLightColors[shadeIndex].scale(.3);
  light.intensity=1.3;light.range=14;light.falloffType=Light.FALLOFF_DEFAULT;
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
  const boss=CreateSphere('Vault keystone',{diameter:.65,segments:12},scene);boss.position=v(0,23.5,z);boss.material=gold;
 }
 tube('Crown ridge',[v(0,23.65,-18),v(0,23.65,58)],.12,gold);
 // Polished marble floor with real planar reflections.
 const floor=CreateGround('Polished marble floor',{width:28,height:84},scene);floor.position.z=18;
 floor.material=floorMat;
 const mirror=new MirrorTexture('Floor reflection',1024,scene,true);mirror.mirrorPlane=new Plane(0,-1,0,-.025);mirror.renderParticles=false;mirror.gammaSpace=false;mirror.level=1.1;floorMat.reflectionTexture=mirror;
 for(let z=-22;z<60;z+=4){box('Floor transverse joint',26,.007,.025,0,.015,z,black)}for(let x=-12;x<=12;x+=4)box('Floor longitudinal joint',.025,.007,82,x,.018,18,black);
 for(const x of [-3,3])box('Central aisle brass inlay',.045,.02,76,x,.03,18,gold);
 for(let z=-8;z<50;z+=10){const ring=CreateTorus('Aisle medallion',{diameter:2.3,thickness:.025,tessellation:64},scene);ring.position=v(0,.035,z);ring.material=gold;const inner=CreateTorus('Inner medallion',{diameter:1.9,thickness:.018,tessellation:48},scene);inner.position=v(0,.04,z);inner.material=gold}
 const frames=[];
 const isV2=document.body.dataset.hallVersion==='2';
 const isV3=document.body.dataset.hallVersion==='3';
 const usesVitrinePages=article=>isV2&&article.artSeed===5;
 const usesPdfVitrine=article=>isV3&&article.artSeed===5;
 const isTestVitrine=article=>isV2&&article.index<2;
 const hasArticlePopup=article=>!usesVitrinePages(article)&&!usesPdfVitrine(article)&&!isTestVitrine(article);
 articles.forEach((article,i)=>{
  const side=i%2===0?-1:1,z=2+Math.floor(i/2)*11;const root=new TransformNode('Exhibit '+(i+1),scene);root.position=v(side*7.8,0,z);
  // Cylindrical billboards use the exhibit's -Z article face and stay level.
  root.rotation.y=Math.atan2(root.position.x-camera.position.x,root.position.z-camera.position.z);
  const landscape=isTestVitrine(article),backWidth=landscape?6.3:4.2,backHeight=landscape?4.2:6.3;
  const plinth=box('Black marble pedestal',landscape?6.65:4.55,.95,1.65,0,.48,0,black,root);plinth.material=black;
  box('Pedestal brass foot',landscape?6.75:4.65,.065,1.75,0,.08,0,warm,root);box('Pedestal cornice',landscape?6.85:4.75,.16,1.85,0,.99,0,gold,root);
  box('Exhibit backing',backWidth,backHeight,.24,0,4.35,0,black,root);
  for(const x of [-backWidth/2-.02,backWidth/2+.02]){box('Gilded upright',.09,backHeight+.2,.3,x,4.35,-.03,gold,root);box('Luminous inner edge',.022,backHeight-.04,.025,x-Math.sign(x)*.074,4.35,-.19,side<0?warm:purple,root)}
  for(const offset of [-1,1]){const y=4.35+offset*(backHeight/2+.08);box('Gilded lintel',backWidth+.12,.09,.3,0,y,-.03,gold,root);box('Luminous edge',backWidth-.1,.022,.025,0,y-offset*.09,-.19,side<0?warm:purple,root)}
  let tex;
  if(landscape){article.image=null}
  else if(article.cover){article.image=import.meta.env.BASE_URL+(usesPdfVitrine(article)?'covers/runelast-page-1.webp':article.cover);tex=new Texture(article.image,scene,false,true,Texture.TRILINEAR_SAMPLINGMODE);tex.wrapU=tex.wrapV=Texture.CLAMP_ADDRESSMODE}
  else{const image=paintWorld(article);tex=new DynamicTexture('Original artwork '+i,image,scene,false);tex.update()}
  const am=mat(article.title,'#ffffff');am.diffuseTexture=tex;am.emissiveTexture=tex;am.emissiveColor=new Color3(.7,.7,.7);am.specularColor=Color3.Black();
  if(landscape){am.disableLighting=true;am.fogEnabled=false;am.diffuseTexture=null;am.emissiveTexture=null;am.emissiveColor=C('#101321')}
  else if(article.paragraphs){am.disableLighting=true;am.fogEnabled=false;am.diffuseTexture=null;am.diffuseColor=Color3.Black();am.emissiveColor=Color3.Black();am.metadata={textureOnlyGlow:true}}
  // Fit supplied portraits inside the existing vitrine; backing and frame stay fixed.
  const imageAspect=usesPdfVitrine(article)?529.5/768:article.coverAspect??4.05/6.18;
  const panel=CreatePlane('Artwork '+(i+1),{width:landscape?6.18:Math.min(4.05,6.18*imageAspect),height:landscape?4.05:Math.min(6.18,4.05/imageAspect),sideOrientation:Mesh.DOUBLESIDE},scene);panel.parent=root;panel.position=v(0,4.35,-.145);panel.material=am;panel.metadata=landscape?{testVitrine:true,displayRole:'article'}:{article:i};panel.isPickable=!landscape;frames.push(panel);
  if(usesVitrinePages(article)){
   const secondPage=new Texture(`${import.meta.env.BASE_URL}covers/venez_Page_2.png`,scene,false,true,Texture.TRILINEAR_SAMPLINGMODE);secondPage.wrapU=secondPage.wrapV=Texture.CLAMP_ADDRESSMODE;
   panel.metadata.imagePages=[{texture:tex,aspect:imageAspect},{texture:secondPage,aspect:971/1408}];panel.metadata.pageIndex=0;
  }
  const emblem=CreatePolyhedron('Plinth crystal',{type:1,size:.15},scene);emblem.parent=root;emblem.position=v(0,.52,-.85);emblem.material=purple;
 });
 // The final portal repeats the arch motif in nested, luminous layers.
 box('Apse back wall',27,25,1,0,12.5,58,dark);
 for(let i=0;i<4;i++){box('Sanctuary step',13-i*1.3,.25,6-i*.8,0,.13+i*.25,51+i*.55,stone);box('Step lighting',13-i*1.3,.025,.035,0,.27+i*.25,48+i*.95,warm)}
 for(let i=0;i<4;i++)arch(0,56-i*.35,8+i*1.15,10,6+i*.6,.14,i%2?gold:stone);
 arch(0,54.5,7.5,10,5.6,.04,purple);
 // Contain the complete 1086 x 1448 cover inside the former 7 x 13 portal field.
 const coverAspect=1086/1448,coverWidth=7,coverHeight=coverWidth/coverAspect;
 const coverTexture=new Texture(`${import.meta.env.BASE_URL}covers/Exalted_Jaina_Cover_Smaller_Type.webp`,scene);
 coverTexture.wrapU=coverTexture.wrapV=Texture.CLAMP_ADDRESSMODE;coverTexture.anisotropicFilteringLevel=8;coverTexture.level=.8;
 const portalMat=mat('Central magazine cover','#ffffff');portalMat.disableLighting=true;portalMat.fogEnabled=false;portalMat.specularColor=Color3.Black();portalMat.emissiveTexture=coverTexture;
 const portal=CreatePlane('Portal field',{width:coverWidth,height:coverHeight},scene);portal.position=v(0,7.5,56.5);portal.material=portalMat;
 const crystalHeight=7;
 const crystal=CreatePolyhedron('Floating astral crystal',{type:1,size:1.15},scene);crystal.position=v(0,crystalHeight,52);crystal.scaling.setAll(.55);
 const crystalMaterial=purple.clone('Astral crystal color cycle');crystal.material=crystalMaterial;
 const crystalViolet=crystalMaterial.diffuseColor.clone(),crystalBlue=C('#3649b9');
 let crystalColorTime=0;
 const wire=CreatePolyhedron('Astral brass cage',{type:1,size:1.6},scene);wire.position=crystal.position.clone();wire.scaling.setAll(.55);const wm=mat('Wire brass','#eac58c',1);wm.wireframe=true;wire.material=wm;
 const signTex=new DynamicTexture('Sanctuary inscription',{width:1024,height:256},scene,false),sg=signTex.getContext();sg.clearRect(0,0,1024,256);sg.textAlign='center';sg.fillStyle='#e6c692';sg.font='600 72px "Segoe UI", Arial, sans-serif';sg.fillText('EXALTED',512,110);sg.fillStyle='#929bff';sg.font='29px "Segoe UI", Arial, sans-serif';sg.fillText('Interactive 3D magazine',512,172);signTex.hasAlpha=true;signTex.update();const sm=mat('Gold inscription','#ffffff',.8);sm.diffuseTexture=signTex;sm.emissiveTexture=signTex;sm.useAlphaFromDiffuseTexture=true;const sign=CreatePlane('Hall inscription',{width:8,height:2},scene);sign.position=v(0,1.6,49);sign.material=sm;
 const crownTexture=new Texture(`${import.meta.env.BASE_URL}assets/branding/exalted-crown.png`,scene);crownTexture.hasAlpha=true;
 const crownMat=mat('EXALTED logo crown','#ffffff');crownMat.disableLighting=true;crownMat.fogEnabled=false;crownMat.diffuseTexture=crownTexture;crownMat.emissiveTexture=crownTexture;crownMat.useAlphaFromDiffuseTexture=true;
 const crown=CreatePlane('EXALTED crown',{width:1.15,height:1.15*190/255},scene);crown.position=v(0,2.9,49);crown.material=crownMat;crown.isPickable=false;crown.metadata={exaltedCrown:true};
 // Give the purple artwork its own soft halo instead of overexposing its fill.
 // The halo texture cuts out the crown's interior, keeping its fill saturated.
 const crownHaloTexture=new Texture(`${import.meta.env.BASE_URL}assets/branding/exalted-crown-halo.png`,scene);crownHaloTexture.hasAlpha=true;crownHaloTexture.level=3;
 const crownHaloMat=mat('Crown purple halo','#ffffff');crownHaloMat.disableLighting=true;crownHaloMat.fogEnabled=false;crownHaloMat.diffuseTexture=crownHaloTexture;crownHaloMat.emissiveTexture=crownHaloTexture;crownHaloMat.useAlphaFromDiffuseTexture=true;crownHaloMat.alphaMode=Constants.ALPHA_ADD;crownHaloMat.disableDepthWrite=true;
 const crownHalo=CreatePlane('EXALTED crown halo',{width:1.15*335/255,height:1.15*270/255},scene);crownHalo.position=v(0,2.9,49.01);crownHalo.material=crownHaloMat;crownHalo.isPickable=false;crownHalo.metadata={exaltedCrownHalo:true};
 // Exhibit children must retain their parent so pedestals and frames billboard together.
 for(const mesh of scene.meshes)projectArchitecturalUVs(mesh);
 const groups=new Map();for(const m of [...scene.meshes]){if([floor,crystal,wire,sign].includes(m)||m.metadata||m.parent)continue;m.computeWorldMatrix(true);if(!groups.has(m.material))groups.set(m.material,[]);groups.get(m.material).push(m)}
 for(const meshes of groups.values()){if(meshes.length>1){const merged=Mesh.MergeMeshes(meshes,true,true,undefined,false,false);if(merged)merged.isPickable=false}}
 for(const mesh of scene.meshes)if(!mesh.parent&&!mesh.metadata?.skybox&&![crystal,wire].includes(mesh))mesh.freezeWorldMatrix();
 const htmlVitrine=isV2?(await import('./html-vitrine.js')).createHtmlVitrine({scene,camera,canvas,parents:frames.slice(0,2).map(frame=>frame.parent),articles:articles.slice(0,2)}):null;
 const entrancePortal=createEntrancePortal({scene,camera});
 const hubPortal=createHubPortal({scene,camera});
 const discordVitrine=document.body.dataset.hallVersion==='3'?(await import('./discord-vitrine.js')).createDiscordVitrine({scene,camera,position:v(-hubPortal.root.position.x,0,hubPortal.root.position.z),materials:{black,gold,warm,purple}}):null;
 const paperPopupNavigation={onPopupOpen:()=>{stopTour();travel=null;keyboardNavigation.clear();camera.detachControl()},onPopupClose:()=>resumeNavigation()};
 const paperSheet=isV3?(await import('./paper-sheet.js')).createPaperSheet({scene,...paperPopupNavigation}):null;
 const secondPaperSheet=isV3?(await import('./paper-sheet.js')).createPaperSheet({scene,cover:'covers/cover1.webp',coverAspect:1055/1491,position:[-8.4,0,18.5],rotationY:-.28+Math.PI/2+Math.PI+Math.PI/4,...paperPopupNavigation}):null;
 const rearGroundFog=null;
 scene.meshes.forEach(m=>{if(!m.metadata)m.isPickable=false});mirror.renderList=scene.meshes.filter(m=>m!==floor&&!m.metadata?.htmlVitrine&&!m.metadata?.paperLabel);
 // Create clustering after merging so Babylon's internal light proxy stays separate.
 if(ClusteredLightContainer.IsLightSupported(columnLights[0])){
  columnLightCluster=new ClusteredLightContainer('Column globe cluster',columnLights,scene);
  columnLightCluster.horizontalTiles=32;columnLightCluster.verticalTiles=18;
  columnLightCluster.depthSlices=32;columnLightCluster.maxRange=14;
 }else{
  // Retain local illumination on older GPUs without compiling fourteen light slots.
  for(const light of columnLights){light.setEnabled(false);scene.addLight(light)}
  for(const material of scene.materials)if(material instanceof StandardMaterial||material instanceof PBRMaterial)material.maxSimultaneousLights=2+fallbackLightCount;
 }
 const views={entrance:{pos:spawnPosition,target:spawnTarget},nave:{pos:v(0,3.1,10),target:v(0,9,49)},portal:{pos:v(0,3.2,37),target:v(0,5,55)}};let travel=null,touring=false,tourStartedAt=0,selected=0;
 const tourDuration=30000;
 const tourHighlights=[{at:.2,article:0},{at:.4,article:3},{at:.6,article:4},{at:.8,article:7}];
 function moveTo(pos,target,duration=2200){
  keyboardNavigation.clear();camera.movement.resetPanVelocity();camera.movement.resetRotationVelocity();camera.cameraDirection.setAll(0);camera.cameraRotation.set(0,0);
  const proxy=new UniversalCamera('pose',pos,scene);proxy.setTarget(target);
  const fromRotation=camera.rotation.clone(),toRotation=proxy.rotation.clone();
  const yaw=toRotation.y-fromRotation.y;
  toRotation.y=fromRotation.y+Math.atan2(Math.sin(yaw),Math.cos(yaw));
  travel={from:camera.position.clone(),to:pos.clone(),r0:fromRotation,r1:toRotation,time:0,duration};proxy.dispose();
 }
 function setView(name){stopTour();document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));moveTo(views[name].pos,views[name].target)}
 function stopTour(){touring=false;$('#tour').innerHTML='▷ <span>Guided tour</span>'}
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
 canvas.addEventListener('wheel',e=>{if($('#article').open||$('#controls').open)return;e.preventDefault();stopTour();travel=null;syncWalkingCollider();const direction=camera.getForwardRay().direction;camera._collideWithWorld(direction.scale(Math.sign(e.deltaY)*1.15));},{passive:false});
 function resumeNavigation(){if(document.querySelector('dialog[open]'))return;camera.attachControl(canvas,true);canvas.focus({preventScroll:true})}
 const keyboardNavigation=createKeyboardNavigation({scene,camera,canvas,onNavigate:()=>{camera.attachControl(canvas,true);stopTour();travel=null;document.body.classList.add('exploring')}});
 const pdfViewer=isV3?(await import('./pdf-viewer.js')).createPdfViewer({url:`${import.meta.env.BASE_URL}covers/runelast.pdf`,scene,onOpen:()=>{stopTour();travel=null;keyboardNavigation.clear();camera.detachControl()},onClose:resumeNavigation}):null;
 canvas.addEventListener('keydown',()=>{stopTour();travel=null;document.body.classList.add('exploring')});canvas.addEventListener('pointerdown',()=>{travel=null;stopTour();resumeNavigation()});
 function turnVitrinePage(panel){
  const {imagePages}=panel.metadata;panel.metadata.pageIndex=(panel.metadata.pageIndex+1)%imagePages.length;
  const next=imagePages[panel.metadata.pageIndex],originalAspect=imagePages[0].aspect;
  next.texture.level=panel.material.emissiveTexture.level;panel.material.emissiveTexture=next.texture;
  panel.scaling.x=Math.min(4.05,6.18*next.aspect)/Math.min(4.05,6.18*originalAspect);
  panel.scaling.y=Math.min(6.18,4.05/next.aspect)/Math.min(6.18,4.05/originalAspect);
 }
 scene.onPointerObservable.add(info=>{
  const picked=info.pickInfo?.pickedMesh;
  if(picked?.metadata?.imagePages&&(info.type===PointerEventTypes.POINTERTAP||info.type===PointerEventTypes.POINTERDOUBLETAP))turnVitrinePage(picked);
  else if(info.type===PointerEventTypes.POINTERTAP&&picked?.metadata?.article!==undefined){if(usesPdfVitrine(articles[picked.metadata.article]))pdfViewer.open();else openArticle(picked.metadata.article)}
  if(info.type===PointerEventTypes.POINTERMOVE)canvas.style.cursor=(picked===discordVitrine?.screen?discordVitrine.isJoinHit(info.pickInfo):picked?.metadata)?'pointer':'grab';
 });
 function renderArticleBody(expanded=false){
  const article=articles[selected],paragraphs=article.paragraphs||[article.description];
  const showingPreview=!expanded&&!!article.preview;
  const visibleParagraphs=showingPreview?[article.preview]:paragraphs.slice(0,expanded?paragraphs.length:1);
  $('#article-description').replaceChildren(...visibleParagraphs.map((text,index)=>{
   const paragraph=document.createElement('p'),runs=showingPreview?null:article.formattedParagraphs?.[index]?.runs;
   if(!runs){paragraph.textContent=text;return paragraph}
   // Word runs are content only: build safe text nodes and semantic formatting.
   for(const run of runs){
    let node=document.createTextNode(run.text);
    if(run.italic){const emphasis=document.createElement('em');emphasis.append(node);node=emphasis}
    if(run.bold){const strong=document.createElement('strong');strong.append(node);node=strong}
    paragraph.append(node);
   }
   return paragraph;
  }));
  $('#read-more').hidden=expanded||paragraphs.length<=1;
  $('#read-more').setAttribute('aria-expanded',String(expanded));
 }
 function openArticle(i){
  const index=(i+8)%8;if(!hasArticlePopup(articles[index]))return;
  selected=index;const article=articles[selected];
  $('#article-art').style.backgroundImage=`url(${article.image})`;
  const enlargeable=article.artSeed===2;
  $('#article-art').classList.toggle('can-expand',enlargeable);
  if(enlargeable){$('#article-art').setAttribute('role','button');$('#article-art').tabIndex=0;$('#article-art').setAttribute('aria-label','Enlarge Halloween artwork');$('#article-art').setAttribute('aria-haspopup','dialog')}
  else for(const attribute of ['role','tabindex','aria-label','aria-haspopup'])$('#article-art').removeAttribute(attribute);
  $('#article-category').textContent=article.category;$('#article-title').textContent=article.title;
  for(const key of ['subtitle','byline']){const element=$('#article-'+key);element.textContent=article[key]||'';element.hidden=!article[key]}
  renderArticleBody();
  $('#article').classList.toggle('has-full-article',!!article.paragraphs);
  $('#article .article-note').hidden=!!article.paragraphs;
  $('#article-index').textContent=`${String(selected+1).padStart(2,'0')} / 08`;
  if(!$('#article').open){stopTour();$('#article').showModal();camera.detachControl()}
  $('#article').scrollTop=0;
 }
 $('#read-more').onclick=()=>renderArticleBody(true);
 function enlargeArtwork(){const article=articles[selected];if(article.artSeed!==2)return;$('#enlarged-artwork').src=article.image;$('#enlarged-artwork').alt=article.title;$('#artwork-viewer').showModal()}
 $('#article-art').onclick=enlargeArtwork;
 $('#article-art').addEventListener('keydown',event=>{if(articles[selected].artSeed===2&&(event.key==='Enter'||event.key===' ')){event.preventDefault();enlargeArtwork()}});
 $('#close-artwork').onclick=()=>$('#artwork-viewer').close();
 $('#artwork-viewer').addEventListener('click',event=>{if(event.target===$('#artwork-viewer'))$('#artwork-viewer').close()});
 function adjacentArticle(direction){let index=selected;do{index=(index+direction+articles.length)%articles.length}while(!hasArticlePopup(articles[index]));openArticle(index)}
 $('#close').onclick=()=>$('#article').close();$('#article').addEventListener('close',resumeNavigation);$('#previous').onclick=()=>adjacentArticle(-1);$('#next').onclick=()=>adjacentArticle(1);
 $('#help').onclick=()=>{$('#controls').showModal();camera.detachControl()};$('#close-help').onclick=$('#got-it').onclick=()=>$('#controls').close();$('#controls').addEventListener('close',resumeNavigation);
 for(const dialog of [$('#article'),$('#controls')]){
  let pressedOutside=false;
  const outside=event=>{const rect=dialog.getBoundingClientRect();return event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom};
  dialog.addEventListener('pointerdown',event=>{pressedOutside=event.button===0&&event.target===dialog&&outside(event)});
  dialog.addEventListener('click',event=>{if(pressedOutside&&event.target===dialog&&outside(event))dialog.close();pressedOutside=false});
 }
 $('#tour').onclick=()=>{if(touring){stopTour();return}keyboardNavigation.clear();camera.movement.resetPanVelocity();camera.movement.resetRotationVelocity();camera.cameraDirection.setAll(0);camera.cameraRotation.set(0,0);camera.position.copyFrom(views.entrance.pos);camera.setTarget(views.entrance.target);touring=true;tourStartedAt=performance.now();travel=null;$('#tour').innerHTML='Ⅱ <span>Pause tour</span>';};
 $('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){console.warn('Fullscreen unavailable',e)}};
 // Native media playback streams the track without downloading/decoding it up front.
 const audio=new Audio();audio.preload='none';audio.loop=true;audio.volume=.6;
 let volumeSlider=null,soundControl=null,volumeHideTimer=null;
 const showVolume=()=>{clearTimeout(volumeHideTimer);if(volumeSlider)volumeSlider.hidden=audio.paused||!!audio.error};
 const hideVolumeLater=()=>{
  clearTimeout(volumeHideTimer);
  volumeHideTimer=setTimeout(()=>{if(volumeSlider?.matches(':active')){hideVolumeLater();return}if(volumeSlider)volumeSlider.hidden=true},450);
 };
 if(isV3){
  soundControl=document.createElement('div');soundControl.className='sound-control';
  const soundButton=$('#sound');soundButton.before(soundControl);soundControl.append(soundButton);
  volumeSlider=document.createElement('input');volumeSlider.id='sound-volume';volumeSlider.className='sound-volume';
  volumeSlider.type='range';volumeSlider.min='0';volumeSlider.max='100';volumeSlider.step='1';volumeSlider.value=String(Math.round(audio.volume*100));
  volumeSlider.setAttribute('aria-label','Ambient sound volume');volumeSlider.hidden=true;
  const syncVolume=()=>{const value=Math.round(audio.volume*100);volumeSlider.value=String(value);volumeSlider.setAttribute('aria-valuetext',`${value}%`);volumeSlider.title=`Volume: ${value}%`};
  volumeSlider.addEventListener('input',()=>{audio.volume=Number(volumeSlider.value)/100;syncVolume()});
  soundControl.addEventListener('pointerenter',showVolume);
  soundControl.addEventListener('pointerleave',hideVolumeLater);
  soundControl.addEventListener('focusin',showVolume);
  soundControl.addEventListener('focusout',event=>{if(!soundControl.contains(event.relatedTarget)&&!soundControl.matches(':hover'))hideVolumeLater()});
  soundControl.append(volumeSlider);syncVolume();
 }
 const syncSound=()=>{const on=!audio.paused&&!audio.error;$('#sound').innerHTML=`♫ <span>SOUND ${on?'ON':'OFF'}</span>`;$('#sound').setAttribute('aria-label',`${on?'Disable':'Enable'} ambient sound`);$('#sound').setAttribute('aria-pressed',String(on));if(volumeSlider){if(!on){clearTimeout(volumeHideTimer);volumeSlider.hidden=true}else if(soundControl.matches(':hover')||soundControl.contains(document.activeElement))showVolume()}};
 ['play','pause','error'].forEach(event=>audio.addEventListener(event,syncSound));
 $('#sound').onclick=async()=>{
  if(!audio.paused){audio.pause();return}
  if(!audio.getAttribute('src'))audio.src=`${import.meta.env.BASE_URL}assets/intro.mp3`;
  try{await audio.play()}catch(error){if(error.name!=='AbortError')console.warn('Sound playback unavailable',error);syncSound()}
 };
 syncSound();scene.onDisposeObservable.add(()=>{clearTimeout(volumeHideTimer);audio.pause();audio.removeAttribute('src');audio.load();if(soundControl){soundControl.before($('#sound'));soundControl.remove()}});
 const atmosphere=createAtmosphere(scene,lanterns);
 await loadingPhase('loading materials',.62);
 const visuals=createVisualSystem({scene,engine,camera,pipeline,mirror,surfaces,windowGlass,atmosphere,hubPortal,columnLightCluster});
 const lightingDebug=createLightingDebug({scene,camera,canvas,rendererInfo,ambient:hemi,fill,columnLights,columnLightCluster,columnLightColors,lanterns,frames,windowGlass,pipeline,imageProcessing,visuals,Color3:Color3});
 visuals.setProfile=qualityProfile=>lightingDebug.setSettings({qualityProfile});
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 scene.onBeforeRenderObservable.add(()=>{let dt=Math.min(engine.getDeltaTime(),50);if(!reduced){lanterns.update(dt);crystal.rotation.y+=dt*.00025;wire.rotation.y-=dt*.00013;crystal.position.y=crystalHeight+Math.sin(performance.now()*.0007)*.2;
  crystalColorTime=(crystalColorTime+dt)%16000;
  const blueAmount=(1-Math.cos(crystalColorTime*Math.PI*2/16000))*.5;
  Color3.LerpToRef(crystalViolet,crystalBlue,blueAmount,crystalMaterial.diffuseColor);
  crystalMaterial.diffuseColor.scaleToRef(1.3,crystalMaterial.emissiveColor);
 }
  if(travel){travel.time+=dt;let t=Math.min(1,travel.time/travel.duration);t=t*t*(3-2*t);camera.position=Vector3.Lerp(travel.from,travel.to,t);camera.rotation=Vector3.Lerp(travel.r0,travel.r1,t);if(t>=1)travel=null}
  if(touring){
   const t=Math.min((performance.now()-tourStartedAt)/tourDuration,1);
   const pathT=t*t*(3-2*t);
   camera.position=Vector3.Lerp(views.entrance.pos,views.portal.pos,pathT);
   camera.position.x+=Math.sin(t*Math.PI*4)*Math.sin(t*Math.PI)*1.4;
   let target=Vector3.Lerp(views.entrance.target,views.portal.target,pathT);
   // Blend unit directions so a nearby exhibit does not cause a sudden turn
   // at the end of a world-space target interpolation.
   for(const highlight of tourHighlights){
    const distance=Math.abs(t-highlight.at);
    const blend=Scalar.Clamp((distance-.025)/.07,0,1);
    const weight=1-blend*blend*(3-2*blend);
    if(weight>0){
     const exhibit=frames[highlight.article].parent;
     const forward=target.subtract(camera.position).normalize();
     const artwork=v(exhibit.position.x,4.35,exhibit.position.z).subtract(camera.position).normalize();
     target=camera.position.add(Vector3.Lerp(forward,artwork,weight).normalize().scale(10));
    }
   }
   camera.setTarget(target);if(t>=1)stopTour();
  }
  camera.position.x=Scalar.Clamp(camera.position.x,-9.3,9.3);camera.position.z=Scalar.Clamp(camera.position.z,-23,47);camera.position.y=Scalar.Clamp(camera.position.y,2.2,10);
  const portalInteractionEnabled=document.documentElement.dataset.appState==='ready'&&!touring&&!travel&&!document.querySelector('dialog[open]');
  entrancePortal.update(dt/1000,portalInteractionEnabled);
  hubPortal.update(dt/1000,portalInteractionEnabled);
  if(!columnLightCluster){
   const nearest=[...columnLights].sort((a,b)=>Vector3.DistanceSquared(a.position,camera.position)-Vector3.DistanceSquared(b.position,camera.position)).slice(0,fallbackLightCount);
   for(const light of columnLights){const enabled=nearest.includes(light);if(light.isEnabled()!==enabled)light.setEnabled(enabled)}
  }
  // Update once for the visitor camera so floor reflections share the same pose.
  for(const panel of frames){const root=panel.parent;const dx=root.position.x-camera.position.x,dz=root.position.z-camera.position.z;if(dx*dx+dz*dz>.0001)root.rotation.y=Math.atan2(dx,dz)}
  discordVitrine?.update();
 });
 // Keep the HTML loader up until all surface maps and scene resources are
 // ready, then let a complete rendered frame reach the canvas before revealing UI.
 visuals.ready.then(async()=>{
  await loadingPhase('compiling pipelines',.78);
  await scene.whenReadyAsync();
  await loadingPhase('warming render targets',.92);
  scene.onAfterRenderObservable.addOnce(()=>{
   finishLoading().then(()=>{
   document.documentElement.dataset.appState='ready';
   $('#loading').classList.add('done');$('#loading').setAttribute('aria-hidden','true');
   // Camera keyboard events are delivered only to the focused input canvas.
   // Preserve focus if the visitor has already started interacting with a control.
   if(document.activeElement===document.body)resumeNavigation();
   }).catch(startupError);
  });
 }).catch(startupError);
 engine.runRenderLoop(()=>scene.render());window.addEventListener('resize',()=>engine.resize());
 // Exposed read-only diagnostics and inspection helpers for browser QA.
 window.hall={scene,camera,frames,articles,setView,openArticle,engine,rendererInfo,pipeline,columnLights,columnLightCluster,lightingDebug,windowGlass,visuals,lanterns,atmosphere,entrancePortal,hubPortal,rearGroundFog,htmlVitrine,discordVitrine,pdfViewer,paperSheet,get qualityProfile(){return visuals.getProfile()},get renderMetrics(){return visuals.getMetrics()}};
}
