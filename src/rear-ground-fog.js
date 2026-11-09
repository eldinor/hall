import {CreatePlane} from '@babylonjs/core/Meshes/Builders/planeBuilder.js';
import {ShaderStore} from '@babylonjs/core/Engines/shaderStore.js';
import {Mesh} from '@babylonjs/core/Meshes/mesh.js';
import {ShaderMaterial} from '@babylonjs/core/Materials/shaderMaterial.js';
import {ShaderLanguage} from '@babylonjs/core/Materials/shaderLanguage.js';

const vertexGLSL=`precision highp float;
attribute vec3 position;
uniform mat4 world;
uniform mat4 worldViewProjection;
varying vec3 vFogWorld;
void main(){vFogWorld=(world*vec4(position,1.)).xyz;gl_Position=worldViewProjection*vec4(position,1.);}`;
const vertexWGSL=`attribute position: vec3f;
uniform world: mat4x4f;
uniform worldViewProjection: mat4x4f;
varying vFogWorld: vec3f;
@vertex fn main(input: VertexInputs)->FragmentInputs {
 vertexOutputs.vFogWorld=(uniforms.world*vec4f(vertexInputs.position,1.)).xyz;
 vertexOutputs.position=uniforms.worldViewProjection*vec4f(vertexInputs.position,1.);
}`;
const fragmentGLSL=`precision highp float;
varying vec3 vFogWorld;
uniform float fogTime;
float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise21(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),f.x),mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.,1.)),f.x),f.y);}
void main(){
 vec2 p=vec2(vFogWorld.x*.10+fogTime*.008,vFogWorld.y*.26-fogTime*.012);
 float cloud=.6*noise21(p)+.3*noise21(p*2.03)+.1*noise21(p*4.07);
 float height=vFogWorld.y+(cloud-.5)*1.8;
 float density=clamp((1.-smoothstep(2.5,11.5,height))*1.2,0.,1.);
 density*=1.-smoothstep(14.,21.,abs(vFogWorld.x));
 vec3 color=mix(vec3(.028,.034,.048),vec3(.070,.085,.115),.3+.5*cloud);
 gl_FragColor=vec4(color,density);
}`;
const fragmentWGSL=`varying vFogWorld: vec3f;
uniform fogTime: f32;
fn hash21(p:vec2f)->f32{return fract(sin(dot(p,vec2f(127.1,311.7)))*43758.5453);}
fn noise21(p:vec2f)->f32{let i=floor(p);var f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2f(1.,0.)),f.x),mix(hash21(i+vec2f(0.,1.)),hash21(i+vec2f(1.,1.)),f.x),f.y);}
@fragment fn main(input:FragmentInputs)->FragmentOutputs {
 let p=vec2f(input.vFogWorld.x*.10+uniforms.fogTime*.008,input.vFogWorld.y*.26-uniforms.fogTime*.012);
 let cloud=.6*noise21(p)+.3*noise21(p*2.03)+.1*noise21(p*4.07);
 let height=input.vFogWorld.y+(cloud-.5)*1.8;
 var density=clamp((1.-smoothstep(2.5,11.5,height))*1.2,0.,1.);
 density*=1.-smoothstep(14.,21.,abs(input.vFogWorld.x));
 let color=mix(vec3f(.028,.034,.048),vec3f(.070,.085,.115),.3+.5*cloud);
 fragmentOutputs.color=vec4f(color,density);
}`;

export function createRearGroundFog(scene){
 const webgpu=scene.getEngine().isWebGPU,store=webgpu?ShaderStore.ShadersStoreWGSL:ShaderStore.ShadersStore;
 store.hallRearFogVertexShader=webgpu?vertexWGSL:vertexGLSL;store.hallRearFogPixelShader=webgpu?fragmentWGSL:fragmentGLSL;
 const mesh=CreatePlane('Rear exterior ground fog',{width:44,height:16,sideOrientation:Mesh.DOUBLESIDE},scene);
 // Outside the back wall and portal: normal depth testing keeps the room clear.
 mesh.position.set(0,7,-27);mesh.isPickable=false;mesh.checkCollisions=false;mesh.applyFog=false;mesh.metadata={rearGroundFog:true};mesh.freezeWorldMatrix();
 const material=new ShaderMaterial('Rear low mist',scene,'hallRearFog',{shaderLanguage:webgpu?ShaderLanguage.WGSL:ShaderLanguage.GLSL,attributes:['position'],uniforms:['world','worldViewProjection','fogTime'],needAlphaBlending:true});
 material.backFaceCulling=false;material.disableDepthWrite=true;material.setFloat('fogTime',0);mesh.material=material;
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');let time=0;
 function update(dt){if(!motion.matches)time+=dt;material.setFloat('fogTime',time)}
 scene.onDisposeObservable.add(()=>{material.dispose();mesh.dispose()});
 return {mesh,update,getState:()=>({position:mesh.position.asArray(),time,fadeTop:11.5,enabled:mesh.isEnabled()})};
}
