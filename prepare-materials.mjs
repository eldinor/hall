import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import crypto from 'node:crypto';
import sharp from 'sharp';

const sources=[['limestone','beige_wall_001'],['marble','Marble012'],['brass','metal_plate']];
const manifest={license:'CC0-1.0',providers:['Poly Haven','ambientCG'],materials:[]};
const selectedRole=process.argv.includes('--role')?process.argv[process.argv.indexOf('--role')+1]:null;
if(selectedRole&&fs.existsSync('public/materials/manifest.json'))manifest.materials=JSON.parse(fs.readFileSync('public/materials/manifest.json')).materials.filter(m=>m.role!==selectedRole);
fs.mkdirSync('outputs/asset-source',{recursive:true});
for(const [role,id]of sources){
 if(selectedRole&&role!==selectedRole)continue;
 const cache=path.resolve('outputs/asset-source',id);fs.mkdirSync(cache,{recursive:true});
 if(role==='marble'&&!fs.existsSync(path.join(cache,'Marble012_2K-JPG_Color.jpg'))){
  const zip=path.resolve('outputs/asset-source/Marble012_2K-JPG.zip');
  if(!fs.existsSync(zip)){const result=spawnSync('curl.exe',['-fLsS','--retry','2','https://ambientcg.com/get?file=Marble012_2K-JPG.zip','-o',zip],{stdio:'inherit'});if(result.status!==0)throw Error('Marble source download failed')}
  const result=spawnSync('powershell.exe',['-NoProfile','-Command',`Expand-Archive -LiteralPath '${zip}' -DestinationPath '${cache}' -Force`],{stdio:'inherit'});if(result.status!==0)throw Error('Marble archive extraction failed');
 }
 const metadataFile=`outputs/asset-source/${id}.json`;
 if(role!=='marble'&&!fs.existsSync(metadataFile)){const result=spawnSync('curl.exe',['-fLsS','--retry','2',`https://api.polyhaven.com/files/${id}`,'-o',metadataFile],{stdio:'inherit'});if(result.status!==0)throw Error(`Metadata download failed: ${id}`)}
 const metadata=role==='marble'?null:JSON.parse(fs.readFileSync(metadataFile));
 const entry={role,source:role==='marble'?'https://ambientcg.com/view?id=Marble012':`https://polyhaven.com/a/${id}`,author:role==='limestone'?'Dimitrios Savva (photography), Rico Cilliers (processing)':role==='marble'?'Lennart Demes':'Rob Tuytel',files:[]};
 for(const [map,key]of [['albedo','Diffuse'],['normal','nor_gl'],['orm','arm']]){
  const source=role==='marble'?{url:'https://ambientcg.com/get?file=Marble012_2K-JPG.zip'}:metadata[key]['2k'].jpg;
  const local=role==='marble'?path.join(cache,`Marble012_2K-JPG_${{albedo:'Color',normal:'NormalGL',orm:'Roughness'}[map]}.jpg`):path.join(cache,`${map}.jpg`);
  if(role!=='marble'&&(!fs.existsSync(local)||fs.statSync(local).size!==source.size)){const result=spawnSync('curl.exe',['-fLsS','--retry','2',source.url,'-o',local],{stdio:'inherit'});if(result.status!==0)throw Error(`Download failed: ${source.url}`)}
  if(source.md5&&crypto.createHash('md5').update(fs.readFileSync(local)).digest('hex')!==source.md5)throw Error(`Source checksum mismatch: ${local}`);
  let image=sharp(local).removeAlpha();
  if(role==='brass'&&map!=='normal')image=image.blur(32);
  const original=await image.raw().toBuffer({resolveWithObject:true});
  if(role==='brass'&&map==='albedo')for(let i=0;i<original.data.length;i+=3){const luma=(original.data[i]*.2126+original.data[i+1]*.7152+original.data[i+2]*.0722)/255;const value=Math.round(255*(.93+.02*luma));original.data[i]=value;original.data[i+1]=value;original.data[i+2]=value}
  // Small architectural trims need a calm finish at walking distance.
  // Flat normals avoid subpixel brush scratches sparkling along thin tubes.
  if(role==='brass'&&map==='normal')for(let i=0;i<original.data.length;i+=3){original.data[i]=128;original.data[i+1]=128;original.data[i+2]=255}
  if(map==='orm')for(let i=0;i<original.data.length;i+=original.info.channels){
   const rough=original.data[i+1]/255;
   original.data[i]=role==='limestone'?Math.max(210,original.data[i]):255;
   original.data[i+1]=Math.round(255*(role==='limestone'?.65+.25*rough:role==='brass'?.53+.015*rough:.12+.22*rough));
   original.data[i+2]=role==='brass'?255:0;
  }
  // Sparse fine wear in the polished surface's roughness, never painted highlights.
  if(role==='marble'&&map==='orm')for(let n=0;n<120;n++){const x=(n*613)%2048,y=(n*827)%2048;for(let k=0;k<35;k++){const xx=(x+k)%2048,yy=(y+Math.floor(k*.14))%2048;const i=(yy*2048+xx)*original.info.channels;original.data[i+1]=Math.min(120,original.data[i+1]+20)}}
  for(const size of [1024,2048]){
   const directory=path.resolve('public/materials',role,String(size));fs.mkdirSync(directory,{recursive:true});
   const filename=map+(map==='albedo'?'.webp':'.png');const destination=path.join(directory,filename);
   let image=sharp(original.data,{raw:original.info}).resize(size,size);
   image=map==='albedo'?image.webp({quality:88}):image.png({compressionLevel:9});
   await image.toFile(destination);
   entry.files.push({path:`${role}/${size}/${filename}`,size,sha256:crypto.createHash('sha256').update(fs.readFileSync(destination)).digest('hex'),source:source.url});
  }
 }
 manifest.materials.push(entry);console.log(`Prepared ${role}: 1K and 2K albedo / normal / ORM`);
}
fs.writeFileSync('public/materials/manifest.json',JSON.stringify(manifest,null,2));
