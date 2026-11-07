import * as B from 'babylonjs';
import {beveledBox,projectArchitecturalUVs} from './architecture.js';

export function createDiscordVitrine({scene,camera,position,materials}){
 const root=new B.TransformNode('Discord community vitrine',scene);root.position.copyFrom(position);
 function box(name,width,height,depth,x,y,z,material){
  const mesh=beveledBox(name,width,height,depth,scene);mesh.parent=root;mesh.position.set(x,y,z);mesh.material=material;mesh.isPickable=false;mesh.metadata={discordVitrine:true};projectArchitecturalUVs(mesh);return mesh;
 }
 box('Discord pedestal',3,.8,1.35,0,.4,0,materials.black);
 box('Discord pedestal foot',3.1,.055,1.45,0,.07,0,materials.warm);
 box('Discord pedestal cornice',3.15,.15,1.5,0,.87,0,materials.gold);
 box('Discord display backing',2.8,4.1,.22,0,3.05,0,materials.black);
 for(const x of [-1.43,1.43]){
  box('Discord frame upright',.08,4.28,.28,x,3.05,-.025,materials.gold);
  box('Discord blue edge',.02,4.08,.025,x-Math.sign(x)*.07,3.05,-.17,materials.purple);
 }
 for(const y of [.94,5.16])box('Discord frame lintel',2.94,.08,.28,0,y,-.025,materials.gold);

 const texture=new B.DynamicTexture('Mock Discord community',{width:768,height:1152},scene,true);
 const context=texture.getContext();
 const text=(value,x,y,size=30,color='#f2f3f5',weight=400)=>{context.font=`${weight} ${size}px "Segoe UI",Arial,sans-serif`;context.fillStyle=color;context.fillText(value,x,y)};
 const rect=(x,y,width,height,color)=>{context.fillStyle=color;context.fillRect(x,y,width,height)};
 const circle=(x,y,radius,color)=>{context.beginPath();context.arc(x,y,radius,0,Math.PI*2);context.fillStyle=color;context.fill()};
 rect(0,0,768,1152,'#1e1f22');rect(0,0,768,170,'#5865f2');
 text('EXALTED',40,78,52,'#ffffff',700);text('Discord community',42,128,30,'#e3e6ff');
 rect(597,28,135,48,'#303775');text('DEMO',617,63,29,'#ffffff',700);
 circle(52,214,9,'#3ba55c');text('42 online',76,226,34,'#f2f3f5',600);
 text('Sample community preview',40,266,27,'#a8abb3');
 rect(40,294,688,2,'#35363c');text('CHANNELS',40,342,27,'#a8abb3',600);
 for(const [index,name]of ['announcements','general','gaming'].entries()){
  const y=404+index*73;text('#',46,y,40,'#80848e');text(name,100,y,35);
 }
 rect(40,586,688,2,'#35363c');text('SAMPLE MEMBERS',40,638,27,'#a8abb3',600);
 const members=[{name:'Nova',color:'#7864c6'},{name:'Pixel',color:'#357aa0'},{name:'Rune',color:'#aa7451'},{name:'Echo',color:'#4e947d'}];
 members.forEach((member,index)=>{
  const y=700+index*82;circle(68,y-8,28,member.color);text(member.name[0],57,y+3,29,'#ffffff',600);
  circle(89,y+12,9,'#1e1f22');circle(89,y+12,6,'#3ba55c');text(member.name,116,y-6,33,'#f2f3f5',600);text('Sample member',116,y+25,23,'#a8abb3');
 });
 rect(40,1030,688,64,'#35363c');text('Join Discord',278,1074,32,'#a8abb3',600);
 text('Invite link not set · demo only',151,1130,27,'#a8abb3');
 texture.update();texture.anisotropicFilteringLevel=8;
 const displayMaterial=new B.StandardMaterial('Discord demo display',scene);displayMaterial.disableLighting=true;displayMaterial.fogEnabled=false;displayMaterial.diffuseColor=B.Color3.Black();displayMaterial.emissiveColor=B.Color3.Black();displayMaterial.emissiveTexture=texture;texture.level=.9;
 const screen=B.MeshBuilder.CreatePlane('Mock Discord widget',{width:2.65,height:3.975,sideOrientation:B.Mesh.DOUBLESIDE},scene);screen.parent=root;screen.position.set(0,3.05,-.14);screen.material=displayMaterial;screen.isPickable=false;screen.metadata={discordVitrine:true,mock:true};
 function update(){const dx=root.position.x-camera.position.x,dz=root.position.z-camera.position.z;if(dx*dx+dz*dz>.0001)root.rotation.y=Math.atan2(dx,dz)}
 update();
 scene.onDisposeObservable.add(()=>{texture.dispose();displayMaterial.dispose();root.dispose()});
 return {root,screen,update,getState:()=>({position:root.position.asArray(),mock:true,serverName:'Exalted',sampleOnlineCount:42,inviteURL:null})};
}
