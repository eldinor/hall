import * as B from 'babylonjs';

export function beveledBox(name,width,height,depth,scene){
 const half=[width/2,height/2,depth/2],radius=Math.min(.045,Math.min(width,height,depth)*.2),core=half.map(v=>v-radius);
 const positions=[],normals=[],indices=[],uvs=[];
 function face(points,normal){
  const direction=B.Vector3.Cross(points[1].subtract(points[0]),points[2].subtract(points[0]));
  if(B.Vector3.Dot(direction,normal)>0)points.reverse();
  const start=positions.length/3;
  for(let i=0;i<points.length;i++){positions.push(...points[i].asArray());normals.push(...normal.asArray());uvs.push(i===1||i===2?1:0,i>=2?1:0)}
  for(let i=1;i<points.length-1;i++)indices.push(start,start+i,start+i+1);
 }
 const V=a=>new B.Vector3(...a);
 for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){
  const other=[0,1,2].filter(v=>v!==axis),normal=[0,0,0];normal[axis]=sign;
  face([[-1,-1],[1,-1],[1,1],[-1,1]].map(([s,t])=>{const p=[0,0,0];p[axis]=sign*half[axis];p[other[0]]=s*core[other[0]];p[other[1]]=t*core[other[1]];return V(p)}),V(normal));
 }
 for(let a=0;a<3;a++)for(let b=a+1;b<3;b++)for(const sa of [-1,1])for(const sb of [-1,1]){
  const c=3-a-b,normal=[0,0,0];normal[a]=sa;normal[b]=sb;
  const p=(edge,t)=>{const v=[0,0,0];v[a]=sa*(edge?core[a]:half[a]);v[b]=sb*(edge?half[b]:core[b]);v[c]=t*core[c];return V(v)};
  face([p(0,-1),p(0,1),p(1,1),p(1,-1)],V(normal).normalize());
 }
 for(const sx of [-1,1])for(const sy of [-1,1])for(const sz of [-1,1])face([V([sx*half[0],sy*core[1],sz*core[2]]),V([sx*core[0],sy*half[1],sz*core[2]]),V([sx*core[0],sy*core[1],sz*half[2]])],V([sx,sy,sz]).normalize());
 const mesh=new B.Mesh(name,scene),data=new B.VertexData();Object.assign(data,{positions,normals,indices,uvs});data.applyToMesh(mesh);return mesh;
}

export function projectArchitecturalUVs(mesh){
 const meters=mesh.material?.metadata?.tileMeters;if(!meters)return;
 mesh.computeWorldMatrix(true);const matrix=mesh.getWorldMatrix(),positions=mesh.getVerticesData(B.VertexBuffer.PositionKind),normals=mesh.getVerticesData(B.VertexBuffer.NormalKind),uvs=[];
 for(let i=0;i<positions.length;i+=3){
  const p=B.Vector3.TransformCoordinates(B.Vector3.FromArray(positions,i),matrix),n=B.Vector3.TransformNormal(B.Vector3.FromArray(normals,i),matrix).normalize();
  if(Math.abs(n.y)>=Math.max(Math.abs(n.x),Math.abs(n.z)))uvs.push(p.x/meters,p.z/meters);
  else if(Math.abs(n.x)>=Math.abs(n.z))uvs.push(p.z/meters,p.y/meters);
  else uvs.push(p.x/meters,p.y/meters);
 }
 mesh.setVerticesData(B.VertexBuffer.UVKind,uvs);
}
