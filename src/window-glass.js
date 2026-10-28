import * as B from 'babylonjs';

// A reusable pressed-glass block: square footprint, rounded corners, beveled
// shoulders and slightly cushioned faces, so highlights catch each brick edge.
function createBlockGeometry(){
 const positions=[-.12,0,0],indices=[],normals=[];
 const half=.288,corner=.035;
 const outline=[[-half,-half+corner],[-half+corner,-half],[half-corner,-half],[half,-half+corner],[half,half-corner],[half-corner,half],[-half+corner,half],[-half,half-corner]];
 const rings=[[-.12,.5],[-.11,.91],[-.085,1],[.085,1],[.11,.91],[.12,.5]];
 for(const [x,scale] of rings)for(const [y,z] of outline)positions.push(x,y*scale,z*scale);
 for(let i=0;i<8;i++)indices.push(0,1+(i+1)%8,1+i);
 for(let ring=0;ring<rings.length-1;ring++)for(let i=0;i<8;i++){
  const a=1+ring*8+i,next=1+ring*8+(i+1)%8,b=a+8,bNext=next+8;
  indices.push(a,next,b,next,bNext,b);
 }
 const back=positions.length/3;positions.push(.12,0,0);
 const lastRing=1+(rings.length-1)*8;
 for(let i=0;i<8;i++)indices.push(back,lastRing+i,lastRing+(i+1)%8);
 // Babylon's default left-handed winding needs outward-facing block surfaces.
 for(let i=0;i<indices.length;i+=3){const next=indices[i+1];indices[i+1]=indices[i+2];indices[i+2]=next}
 B.VertexData.ComputeNormals(positions,indices,normals);
 const data=new B.VertexData();data.positions=positions;data.indices=indices;data.normals=normals;return data;
}

export function createWindowGlass(scene){
 // One prefiltered HDR environment supplies sky, glass reflections and refraction.
 const reflection=B.CubeTexture.CreateFromPrefilteredData(`${import.meta.env.BASE_URL}environments/night.env`,scene);
 scene.environmentTexture=reflection;
 const skyTexture=reflection.clone();skyTexture.coordinatesMode=B.Texture.SKYBOX_MODE;skyTexture.level=.7;
 const skybox=B.MeshBuilder.CreateBox('Night skybox',{size:300},scene);
 skybox.infiniteDistance=true;skybox.isPickable=false;skybox.applyFog=false;
 skybox.metadata={skybox:true};
 const skyMaterial=new B.StandardMaterial('Night sky',scene);
 skyMaterial.backFaceCulling=false;skyMaterial.disableLighting=true;skyMaterial.disableDepthWrite=true;skyMaterial.fogEnabled=false;
 skyMaterial.diffuseColor=B.Color3.Black();skyMaterial.specularColor=B.Color3.Black();skyMaterial.reflectionTexture=skyTexture;
 skybox.material=skyMaterial;
 reflection.rotationY=skyTexture.rotationY=110*Math.PI/180;
 const materials=[];
 for(const side of [-1,1]){
  const glass=new B.PBRMaterial(`Glass block material ${side}`,scene);
  glass.albedoColor=B.Color3.White();glass.emissiveColor=B.Color3.Black();glass.metallic=0;glass.roughness=.045;
  // Alpha transmission keeps the sky visible; the refracted environment
  // and Fresnel highlights reveal the rounded faces of the 24 cm glass blocks.
  glass.transparencyMode=B.PBRMaterial.PBRMATERIAL_ALPHABLEND;glass.alpha=.22;
  glass.useRadianceOverAlpha=true;glass.useSpecularOverAlpha=true;
  glass.environmentIntensity=.55;glass.reflectionTexture=reflection;
  glass.usePhysicalLightFalloff=false;
  glass.subSurface.isRefractionEnabled=true;glass.subSurface.refractionIntensity=1;
  glass.subSurface.indexOfRefraction=1.52;glass.subSurface.tintColor=B.Color3.White();
  glass.subSurface.useAlbedoToTintRefraction=false;glass.subSurface.linkRefractionWithTransparency=false;
  glass.subSurface.minimumThickness=.24;glass.subSurface.maximumThickness=.24;
  glass.subSurface.refractionTexture=reflection;glass.subSurface.useThicknessAsDepth=true;
  materials.push(glass);
 }
 const geometry=createBlockGeometry();let prototype=null,blockCount=0;
 function createBlock(side,y,z){
  const block=prototype?prototype.clone(`Square glass block ${++blockCount}`,null,true):new B.Mesh(`Square glass block ${++blockCount}`,scene);
  if(!prototype){geometry.applyToMesh(block);prototype=block}
  block.position.set(side*12.35,y,z);block.material=materials[side<0?0:1];return block;
 }
 return {materials,refractions:[reflection],exteriors:[skybox],reflection,skybox,skyTexture,createBlock,get blockCount(){return blockCount},blockDimensions:{width:.576,height:.576,thickness:.24,joint:.024}};
}
