import * as B from 'babylonjs';

// Four shared finishes; the brass mounts join the existing static geometry merge.
export function createLanterns(scene,colors,brass){
 const cores=[],shells=[],halos=[],lanterns=[];
 // A shared radial sprite adds a soft, depth-tested halo without another
 // full-scene glow render target or raising bloom on the artwork and brass.
 const haloTexture=new B.DynamicTexture('Soft lantern halo',{width:128,height:128},scene,false);
 const context=haloTexture.getContext(),gradient=context.createRadialGradient(64,64,0,64,64,64);
 gradient.addColorStop(0,'rgba(255,255,255,.55)');
 gradient.addColorStop(.3,'rgba(255,255,255,.32)');
 gradient.addColorStop(.65,'rgba(255,255,255,.07)');
 gradient.addColorStop(1,'rgba(255,255,255,0)');
 context.fillStyle=gradient;context.fillRect(0,0,128,128);haloTexture.hasAlpha=true;haloTexture.update();
 for(const [i,color]of colors.entries()){
  // The unlit PBR path preserves HDR color and vertex facets before tone mapping.
  // StandardMaterial clamps intense emission to white before the bloom pass.
  const core=new B.PBRMaterial(`Lantern crystal ${i+1}`,scene);
  core.unlit=true;core.metallic=0;core.roughness=.2;
  cores.push(core);
  const shell=new B.PBRMaterial(`Frosted lantern glass ${i+1}`,scene);
  shell.albedoColor=color.scale(.65);shell.metallic=0;shell.roughness=.23;
  shell.alpha=.24;shell.transparencyMode=B.PBRMaterial.PBRMATERIAL_ALPHABLEND;
  shell.clearCoat.isEnabled=true;shell.clearCoat.intensity=1;shell.clearCoat.roughness=.12;
  shell.indexOfRefraction=1.46;shell.environmentIntensity=.85;
  shells.push(shell);
  const halo=new B.StandardMaterial(`Blue lantern halo ${i+1}`,scene);
  halo.disableLighting=true;halo.diffuseColor=B.Color3.Black();
  halo.opacityTexture=haloTexture;halo.alphaMode=B.Engine.ALPHA_ADD;
  halo.disableDepthWrite=true;halo.backFaceCulling=false;
  halos.push(halo);
 }
 function mount(name,path,radius){const mesh=B.MeshBuilder.CreateTube(name,{path,radius,tessellation:8,cap:B.Mesh.CAP_ALL},scene);mesh.material=brass;return mesh}
 function create(side,z,index){
  // Stand clear of the projecting column flutes so the full globe/cradle reads.
  const position=new B.Vector3(side*10.4,10.7,z);
  const root=new B.TransformNode(`Crystal lantern ${lanterns.length+1}`,scene);root.position.copyFrom(position);
  const shell=B.MeshBuilder.CreateSphere('Frosted lantern shell',{diameter:.76,segments:24},scene);
  shell.parent=root;shell.material=shells[index];shell.isPickable=false;shell.metadata={lanternGlass:true};
  const core=B.MeshBuilder.CreatePolyhedron('Suspended lantern crystal',{type:1,size:.23},scene);
  core.parent=root;core.scaling.set(.8,1.1,.8);core.material=cores[index];core.isPickable=false;
  // Face-level variation keeps the crystalline shape visible inside the bloom.
  const normals=core.getVerticesData(B.VertexBuffer.NormalKind),tints=[];
  for(let n=0;n<normals.length;n+=3){const shade=.48+.38*Math.max(0,normals[n]*.4+normals[n+1]*.7-normals[n+2]*.5);tints.push(shade,shade,shade,1)}
  core.setVerticesData(B.VertexBuffer.ColorKind,tints);
  core.rotation.set(.12,index*.7,.12);
  const halo=B.MeshBuilder.CreatePlane('Lantern soft glow',{size:1.8},scene);
  halo.parent=root;halo.billboardMode=B.Mesh.BILLBOARDMODE_ALL;
  halo.material=halos[index];halo.isPickable=false;halo.metadata={lanternHalo:true};
  for(const angle of [Math.PI/4,-Math.PI/4]){
   const path=[];
   for(let i=0;i<=48;i++){const t=i/48*Math.PI*2;path.push(position.add(new B.Vector3(Math.cos(t)*.43*Math.cos(angle),Math.sin(t)*.47,Math.cos(t)*.43*Math.sin(angle))))}
   mount('Lantern brass meridian',path,.017);
  }
  const columnX=side*11.5;
  mount('Lantern curved wall bracket',[
   new B.Vector3(columnX,10.05,z),new B.Vector3(side*11.15,10.05,z),
   new B.Vector3(side*10.91,10.12,z),position.add(new B.Vector3(0,-.5,0))
  ],.035);
  for(const y of [-.49,.49]){const cap=B.MeshBuilder.CreateSphere('Lantern brass finial',{diameter:.1,segments:10},scene);cap.position.copyFrom(position);cap.position.y+=y;cap.material=brass}
  lanterns.push({root,shell,core,halo,shadeIndex:index});
  return new B.Vector3(side*10.8,10.7,z);
 }
 function setGlow(shades,strength){
  for(let i=0;i<cores.length;i++){
   cores[i].albedoColor=shades[i].scale(strength*1.35);
   shells[i].albedoColor=shades[i].scale(.65);
   shells[i].emissiveColor=shades[i].scale(strength*.025);
   halos[i].emissiveColor=shades[i].scale(.85);
   halos[i].alpha=Math.min(strength*.32,1);
  }
 }
 setGlow(colors,2);
 return {create,setGlow,lanterns,update:dt=>{for(const {core}of lanterns)core.rotation.y+=dt*.00012}};
}
