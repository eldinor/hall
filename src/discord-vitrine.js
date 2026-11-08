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

 const serverID='1550007780079829022';
 const inviteURL='https://discord.gg/BvVuGvWHME';
 const widgetURL=`https://discord.com/api/guilds/${serverID}/widget.json`;
 let data=null,error=null,updatedAt=null,disposed=false,request=null;
 const logo=new Image();let logoReady=false;
 logo.onload=()=>{if(!disposed){logoReady=true;draw()}};
 const texture=new B.DynamicTexture('Exalted Discord community',{width:768,height:1152},scene,true);
 const context=texture.getContext();
 const text=(value,x,y,size=30,color='#f2f3f5',weight=400)=>{context.font=`${weight} ${size}px "Segoe UI",Arial,sans-serif`;context.fillStyle=color;context.fillText(value,x,y)};
 const rect=(x,y,width,height,color)=>{context.fillStyle=color;context.fillRect(x,y,width,height)};
 const circle=(x,y,radius,color)=>{context.beginPath();context.arc(x,y,radius,0,Math.PI*2);context.fillStyle=color;context.fill()};
 function fittedText(value,x,y,size,color,weight,maxWidth){
  context.font=`${weight} ${size}px "Segoe UI",Arial,sans-serif`;
  let result=String(value);
  if(context.measureText(result).width>maxWidth){while(result.length&&context.measureText(result+'…').width>maxWidth)result=result.slice(0,-1);result+='…'}
  text(result,x,y,size,color,weight);
 }
 function draw(){
  context.clearRect(0,0,768,1152);context.textAlign='left';
  rect(0,0,768,1152,'#1e1f22');rect(0,0,768,170,'#121d46');
  if(logoReady)context.drawImage(logo,40,8,340,340*logo.naturalHeight/logo.naturalWidth);
  text('Discord community',42,151,30,'#e3e6ff');
  circle(52,214,9,data?'#3ba55c':'#80848e');
  text(data?`${data.presence_count} online`:error?'Discord unavailable':'Loading Discord…',76,226,34,'#f2f3f5',600);
  text(error?(data?'Refresh failed · showing last update':'Could not load public server data'):'Exalted community',40,266,27,'#a8abb3');
  rect(40,294,688,2,'#35363c');text('PUBLIC CHANNELS',40,342,27,'#a8abb3',600);
  const channels=[...(data?.channels??[])].sort((a,b)=>a.position-b.position);
  channels.slice(0,3).forEach((channel,index)=>{
   const y=404+index*73;text('›',46,y,40,'#80848e');fittedText(channel.name,100,y,35,'#f2f3f5',400,620);
  });
  if(data&&!channels.length)text('No channels exposed by the widget',40,404,29,'#a8abb3');
  if(channels.length>3)text(`+ ${channels.length-3} more channels`,100,566,24,'#a8abb3');
  rect(40,586,688,2,'#35363c');text('ONLINE MEMBERS',40,638,27,'#a8abb3',600);
  const members=data?.members??[];
  members.slice(0,3).forEach((member,index)=>{
   const y=700+index*72;circle(68,y-8,28,'#7864c6');text(member.username.slice(0,1),57,y+3,29,'#ffffff',600);
   const status=member.status??'online';
   circle(89,y+12,9,'#1e1f22');circle(89,y+12,6,({online:'#3ba55c',idle:'#faa61a',dnd:'#ed4245'})[status]??'#80848e');
   fittedText(member.username,116,y-6,33,'#f2f3f5',600,600);text(status==='dnd'?'Do not disturb':status,116,y+25,23,'#a8abb3');
  });
  if(data&&!members.length)text('No visible online members',40,706,29,'#a8abb3');
  if(members.length>3)text(`+ ${members.length-3} more visible members`,40,934,24,'#a8abb3');
  rect(40,960,688,64,'#5865f2');context.textAlign='center';
  text('Join Discord',384,1004,32,'#ffffff',600);
  context.textAlign='left';texture.update();
 }
 async function refresh(){
  if(disposed||request)return;
  request=new AbortController();const timeout=setTimeout(()=>request?.abort(),12000);
  try{
   const response=await fetch(widgetURL,{signal:request.signal,credentials:'omit'});
   if(!response.ok)throw Error(`Discord widget HTTP ${response.status}`);
   const widget=await response.json();
   if(widget.id!==serverID||typeof widget.name!=='string'||!Array.isArray(widget.channels)||!Array.isArray(widget.members)||!Number.isFinite(widget.presence_count))throw Error('Invalid Discord widget data');
   if(!disposed){data=widget;error=null;updatedAt=new Date().toISOString();draw()}
  }catch(reason){if(!disposed){error=reason.message;draw();console.warn('Discord widget:',reason)}}
  finally{clearTimeout(timeout);request=null}
 }
 draw();logo.src=`${import.meta.env.BASE_URL}assets/branding/exalted-logo.svg`;texture.anisotropicFilteringLevel=8;
 const displayMaterial=new B.StandardMaterial('Discord widget display',scene);displayMaterial.disableLighting=true;displayMaterial.fogEnabled=false;displayMaterial.diffuseColor=B.Color3.Black();displayMaterial.emissiveColor=B.Color3.Black();displayMaterial.emissiveTexture=texture;texture.level=.9;
 const screen=B.MeshBuilder.CreatePlane('Discord widget',{width:2.65,height:3.975,sideOrientation:B.Mesh.DOUBLESIDE},scene);screen.parent=root;screen.position.set(0,3.05,-.14);screen.material=displayMaterial;screen.isPickable=true;screen.metadata={discordVitrine:true,mock:false};
 function isJoinHit(pick){
  if(pick?.pickedMesh!==screen)return false;
  const uv=pick.getTextureCoordinates();if(!uv)return false;
  const x=uv.x*768,y=(1-uv.y)*1152;
  return x>=40&&x<=728&&y>=960&&y<=1024;
 }
 const joinObserver=scene.onPointerObservable.add(info=>{
  if(info.type===B.PointerEventTypes.POINTERTAP&&isJoinHit(info.pickInfo))window.open(inviteURL,'_blank','noopener,noreferrer');
 });
 function update(){const dx=root.position.x-camera.position.x,dz=root.position.z-camera.position.z;if(dx*dx+dz*dz>.0001)root.rotation.y=Math.atan2(dx,dz)}
 update();
 refresh();const refreshTimer=setInterval(refresh,300000);
 scene.onDisposeObservable.add(()=>{disposed=true;logo.onload=null;clearInterval(refreshTimer);request?.abort();scene.onPointerObservable.remove(joinObserver);texture.dispose();displayMaterial.dispose();root.dispose()});
 return {root,screen,update,refresh,isJoinHit,getState:()=>({position:root.position.asArray(),mock:false,joinMock:false,serverID,serverName:data?.name??null,onlineCount:data?.presence_count??null,channels:data?.channels.map(channel=>channel.name)??[],members:data?.members.map(member=>({name:member.username,status:member.status}))??[],inviteURL,updatedAt,error})};
}
