precision highp float;
attribute vec3 position;
attribute vec3 normal;
uniform mat4 world;
uniform mat4 viewProjection;
varying vec3 vLocal;
varying vec3 vWorld;
varying vec3 vNormal;
void main(){
 vec4 worldPosition=world*vec4(position,1.0);
 vLocal=position;vWorld=worldPosition.xyz;
 vNormal=normalize((world*vec4(normal,0.0)).xyz);
 gl_Position=viewProjection*worldPosition;
}
