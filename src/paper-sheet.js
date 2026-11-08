import * as B from 'babylonjs';

const collections=new WeakMap();

function recordCollection(scene,onPopupOpen,onPopupClose){
 let state=collections.get(scene);
 if(!state){
  state={count:0,winPlayed:false,audio:null,timer:null,popup:null,status:null,disposing:false};collections.set(scene,state);
  scene.onDisposeObservable.add(()=>{
   state.disposing=true;clearTimeout(state.timer);state.popup?.remove();state.status?.remove();
   document.querySelector('.collected-papers')?.remove();
   if(state.audio){state.audio.pause();state.audio.removeAttribute('src');state.audio.load()}
   collections.delete(scene);
  });
 }
 state.count++;
 const collection=document.querySelector('.collected-papers');
 let progress=collection.querySelector('.collection-piece-count');
 if(!progress){
  progress=document.createElement('div');progress.className='collection-piece-count';
  progress.setAttribute('role','status');collection.prepend(progress);
 }
 progress.textContent=`Article Pieces Collected: ${state.count} of 2`;
 if(state.count===2&&!state.winPlayed){
  state.winPlayed=true;
  state.audio=new Audio(`${import.meta.env.BASE_URL}assets/win.mp3`);
  state.audio.loop=false;
  const schedulePopup=()=>{
   if(state.timer!==null||state.disposing)return;
   state.timer=setTimeout(()=>{
    document.querySelector('.collected-papers')?.remove();
    const status=document.createElement('button');status.type='button';status.className='collection-status';
    status.setAttribute('aria-haspopup','dialog');status.setAttribute('aria-controls','collection-complete');status.textContent='Articles Collected: 1 of 1';
    document.querySelector('.header-right').append(status);state.status=status;
    const popup=document.createElement('dialog');popup.id='collection-complete';
    popup.setAttribute('aria-labelledby','collection-complete-title');
    popup.innerHTML='<button type="button" class="collection-close" aria-label="Close">×</button><h2 id="collection-complete-title">Contragulations!</h2><p>You collected the full Exalted article.</p><button type="button" class="primary">Read article (demo button)</button>';
    state.popup=popup;document.body.append(popup);
    popup.querySelector('.collection-close').onclick=()=>popup.close();
    let startedOutside=false;
    const outside=event=>{const r=popup.getBoundingClientRect();return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom};
    popup.addEventListener('pointerdown',event=>{startedOutside=outside(event)});
    popup.addEventListener('click',event=>{if(startedOutside&&outside(event))popup.close()});
    popup.addEventListener('close',()=>{if(!state.disposing)onPopupClose?.()});
    const openPopup=()=>{
     if(state.disposing||popup.open)return;
     startedOutside=false;onPopupOpen?.();popup.showModal();
    };
    status.onclick=openPopup;
    openPopup();
   },1000);
  };
  state.audio.addEventListener('playing',schedulePopup,{once:true});
  state.audio.play().catch(error=>{console.warn('Collection sound could not play:',error);schedulePopup()});
 }
}

// A static, gently curled magazine sheet. Ground UVs keep the cover intact.
export function createPaperSheet({scene,cover='covers/Official_Cover_Art_portrait.webp',coverAspect=1080/1920,position=[8.4,0,7.5],rotationY=-.28+Math.PI/2,onPopupOpen,onPopupClose}){
 const coverUrl=import.meta.env.BASE_URL+cover;
 const root=new B.TransformNode('Curved paper test',scene);
 // Tuck each sheet between exhibits, toward the outer side of the aisle.
 root.position.set(...position);
 root.scaling.setAll(.5);
 root.rotation.y=rotationY;
 const width=3,height=width/coverAspect,thickness=.008;
 const front=B.MeshBuilder.CreateGround('Printed paper face',{width,height,subdivisions:48,updatable:true},scene);
 front.parent=root;
 const positions=front.getVerticesData(B.VertexBuffer.PositionKind);
 for(let i=0;i<positions.length;i+=3){
  const x=positions[i]/(width/2),z=positions[i+2]/(height/2);
  // Mostly flat, with a curling long edge and one softly raised corner.
  positions[i+1]=.08+.14*Math.pow(Math.max(0,x),6)
   +.23*Math.pow(Math.max(0,-x),5)*Math.pow(Math.max(0,-z),5)
   +.025*Math.sin(z*Math.PI)*Math.sin(x*Math.PI);
 }
 const indices=front.getIndices(),normals=[];
 B.VertexData.ComputeNormals(positions,indices,normals);
 front.updateVerticesData(B.VertexBuffer.PositionKind,positions);
 front.updateVerticesData(B.VertexBuffer.NormalKind,normals);
 front.refreshBoundingInfo();
 const ink=new B.PBRMaterial('Matte printed paper',scene);
 ink.albedoTexture=new B.Texture(coverUrl,scene);
 ink.albedoTexture.wrapU=ink.albedoTexture.wrapV=B.Texture.CLAMP_ADDRESSMODE;
 ink.albedoTexture.anisotropicFilteringLevel=16;
 ink.metallic=0;ink.roughness=.88;ink.environmentIntensity=.35;
 front.material=ink;

 const back=new B.Mesh('Paper reverse',scene),backData=new B.VertexData();
 backData.positions=positions.map((value,index)=>index%3===1?value-thickness:value);
 backData.indices=[];
 for(let i=0;i<indices.length;i+=3)backData.indices.push(indices[i],indices[i+2],indices[i+1]);
 backData.normals=[];B.VertexData.ComputeNormals(backData.positions,backData.indices,backData.normals);
 backData.applyToMesh(back);back.parent=root;
 const stock=new B.PBRMaterial('Warm white paper stock',scene);
 stock.albedoColor=B.Color3.FromHexString('#eee9dc');stock.metallic=0;stock.roughness=.95;
 back.material=stock;

 // Close the perimeter so raised corners have a thin, visible paper edge.
 const edges=new B.Mesh('Paper cut edges',scene),edgeData=new B.VertexData();
 edgeData.positions=[];edgeData.indices=[];
 const count=49,perimeter=[];
 for(let col=0;col<count;col++)perimeter.push(col);
 for(let row=1;row<count;row++)perimeter.push(row*count+count-1);
 for(let col=count-2;col>=0;col--)perimeter.push((count-1)*count+col);
 for(let row=count-2;row>0;row--)perimeter.push(row*count);
 for(let i=0;i<perimeter.length;i++){
  const a=perimeter[i]*3,b=perimeter[(i+1)%perimeter.length]*3,offset=edgeData.positions.length/3;
  for(const [vertex,drop] of [[a,0],[b,0],[a,thickness],[b,thickness]])
   edgeData.positions.push(positions[vertex],positions[vertex+1]-drop,positions[vertex+2]);
  edgeData.indices.push(offset,offset+1,offset+2,offset+1,offset+3,offset+2);
 }
 edgeData.normals=[];B.VertexData.ComputeNormals(edgeData.positions,edgeData.indices,edgeData.normals);
 edgeData.applyToMesh(edges);edges.parent=root;edges.material=stock;
 const sheetMeshes=[front,back,edges];
 for(const mesh of sheetMeshes){mesh.isPickable=true;mesh.metadata={paperSheet:true};mesh.freezeWorldMatrix()}

 const labelTexture=new B.DynamicTexture('Paper hover text',{width:1024,height:256},scene,false);
 labelTexture.hasAlpha=true;
 const ctx=labelTexture.getContext();
 ctx.clearRect(0,0,1024,256);
 ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.shadowColor='#080610';ctx.shadowBlur=12;ctx.shadowOffsetY=3;
 ctx.fillStyle='#e5cfa8';ctx.font='600 58px "Segoe UI", Arial, sans-serif';
 ctx.fillText('Piece of article',512,56);
 ctx.fillStyle='#6ca6ff';ctx.font='44px "Segoe UI", Arial, sans-serif';
 ctx.fillText('Press F to take',512,128);
 ctx.fillStyle='#ddd9ec';ctx.font='40px "Segoe UI", Arial, sans-serif';
 ctx.fillText('Collect all pieces to read',512,198);
 labelTexture.update();
 const labelMaterial=new B.StandardMaterial('Paper hover label',scene);
 labelMaterial.diffuseTexture=labelTexture;labelMaterial.emissiveTexture=labelTexture;
 labelMaterial.useAlphaFromDiffuseTexture=true;labelMaterial.disableLighting=true;
 labelMaterial.fogEnabled=false;labelMaterial.specularColor=B.Color3.Black();
 const label=B.MeshBuilder.CreatePlane('Piece of article hover label',{width:3.8,height:.95},scene);
 label.position.copyFrom(root.position);label.position.y=1.15;
 label.billboardMode=B.Mesh.BILLBOARDMODE_ALL;
 label.material=labelMaterial;label.isPickable=false;label.metadata={paperLabel:true};
 label.setEnabled(false);

 const canvas=scene.getEngine().getRenderingCanvas();
 let pointerInside=false,collected=false,thumbnail=null;
 const enter=()=>{pointerInside=true};
 const leave=()=>{pointerInside=false;label.setEnabled(false)};
 canvas?.addEventListener('pointerenter',enter);
 canvas?.addEventListener('pointermove',enter);
 canvas?.addEventListener('pointerleave',leave);
 const take=event=>{
  if((event.code!=='KeyF'&&event.key?.toLowerCase()!=='f')||event.repeat
   ||event.ctrlKey||event.altKey||event.metaKey||event.isComposing
   ||collected||!pointerInside||!label.isEnabled()||document.querySelector('dialog[open]')
   ||event.target instanceof Element&&event.target.closest('#light-debug,input,textarea,select,[contenteditable],.vitrine-article'))return;
  event.preventDefault();event.stopPropagation();
  collected=true;label.setEnabled(false);root.dispose();
  thumbnail=document.createElement('div');thumbnail.className='collected-paper';
  thumbnail.setAttribute('role','status');thumbnail.setAttribute('aria-label','Article piece collected');
  const image=document.createElement('img');image.src=coverUrl;image.alt='Collected article piece';
  let collection=document.querySelector('.collected-papers');
  if(!collection){collection=document.createElement('div');collection.className='collected-papers';document.querySelector('.header-right').append(collection)}
  thumbnail.append(image);collection.append(thumbnail);
  recordCollection(scene,onPopupOpen,onPopupClose);
 };
 document.addEventListener('keydown',take,true);
 scene.onBeforeRenderObservable.add(()=>{
  if(collected)return;
  let hovered=false;
  if(pointerInside&&!document.querySelector('dialog[open]')){
   const hit=scene.pick(scene.pointerX,scene.pointerY,mesh=>sheetMeshes.includes(mesh));
   if(hit?.hit){
    // Include opaque architecture in this check, even when it is not clickable.
    const obstruction=scene.pick(scene.pointerX,scene.pointerY,mesh=>
     mesh.isEnabled()&&mesh.isVisible&&mesh.visibility>0&&!mesh.metadata?.paperLabel
     &&!mesh.metadata?.skybox&&mesh.material&&!mesh.material.needAlphaBlendingForMesh(mesh));
    hovered=!obstruction?.hit||obstruction.distance>=hit.distance-.02;
   }
  }
  label.setEnabled(hovered);
 });
 scene.onDisposeObservable.add(()=>{
  canvas?.removeEventListener('pointerenter',enter);
  canvas?.removeEventListener('pointermove',enter);
  canvas?.removeEventListener('pointerleave',leave);
  document.removeEventListener('keydown',take,true);
  const collection=thumbnail?.parentElement;
  thumbnail?.remove();if(collection&&!collection.childElementCount)collection.remove();
 });
 return {root,front,back,edges,label,get collected(){return collected}};
}
