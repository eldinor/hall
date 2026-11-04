import * as B from 'babylonjs';

export function createArchitecturalMaterials(scene){
 const materials={},cache=new Map();let resolution=null,request=0;
 const definitions={stone:['limestone','#f4ead5',0,2.5,.35],dark:['limestone','#51495e',0,3,.25],gold:['brass','#c3ad82',1,1.2,.8],black:['marble','#4b5261',0,2,1.35],floorMat:['marble','#68798f',0,4,1.2]};
 for(const [key,[role,tint,metallic,tileMeters,environmentIntensity]]of Object.entries(definitions)){
  const m=new B.PBRMaterial({stone:'Ivory limestone',dark:'Dark carved stone',gold:'Satin champagne brass',black:'Obsidian plinth',floorMat:'Smoky reflective marble'}[key],scene);
  m.albedoColor=B.Color3.FromHexString(tint);m.metallic=metallic;m.roughness=1;m.environmentIntensity=environmentIntensity;
  m.directIntensity=key==='gold'?1:1.7;
  if(role==='marble'){
   m.roughness=key==='floorMat'?.45:.55;
   m.clearCoat.isEnabled=true;m.clearCoat.intensity=1;
   m.clearCoat.roughness=key==='floorMat'?.055:.09;
  }
  if(key==='floorMat')m.directIntensity=1;
  if(key==='black'){m.indexOfRefraction=1.65;m.clearCoat.indexOfRefraction=1.65}
  m.usePhysicalLightFalloff=false;m.maxSimultaneousLights=6;m.enableSpecularAntiAliasing=true;
  m.useRoughnessFromMetallicTextureAlpha=false;m.useRoughnessFromMetallicTextureGreen=true;m.useMetallnessFromMetallicTextureBlue=true;m.useAmbientOcclusionFromMetallicTextureRed=true;m.ambientTextureStrength=.4;
  m.metadata={architectural:true,role,tileMeters};materials[key]=m;
 }
 function load(role,size){
  const key=role+size;if(cache.has(key))return cache.get(key);
  const task=Promise.all(['albedo.webp','normal.png','orm.png'].map((file,index)=>new Promise((resolve,reject)=>{
   const texture=new B.Texture(`${import.meta.env.BASE_URL}materials/${role}/${size}/${file}`,scene,false,true,B.Texture.TRILINEAR_SAMPLINGMODE,()=>resolve(texture),message=>reject(new Error(message||`Missing ${role}/${file}`)));
   texture.gammaSpace=index===0;texture.anisotropicFilteringLevel=8;texture.wrapU=texture.wrapV=B.Texture.WRAP_ADDRESSMODE;
   if(index===1)texture.level=role==='limestone'?.2:role==='marble'?.035:.15;
  })));cache.set(key,task);return task;
 }
 async function setResolution(size){
  const version=++request;
  const roles=['limestone','marble','brass'];const sets=await Promise.all(roles.map(role=>load(role,size)));
  if(version!==request)return;
  for(const m of Object.values(materials)){const [albedo,normal,orm]=sets[roles.indexOf(m.metadata.role)];m.albedoTexture=albedo;m.bumpTexture=normal;m.metallicTexture=orm}
  resolution=size;
  // Keep the previous maps until the replacement is ready, then release them.
  // A lower quality selection should also release the higher-resolution GPU data.
  for(const [key,task]of cache)if(!key.endsWith(String(size))){cache.delete(key);task.then(textures=>textures.forEach(texture=>texture.dispose()),()=>{})}
 }
 return {...materials,setResolution,getResolution:()=>resolution};
}
