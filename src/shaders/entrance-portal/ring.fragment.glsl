precision highp float;
varying vec3 vLocal;
varying vec3 vWorld;
varying vec3 vNormal;
uniform vec3 cameraPos;
uniform float portalTime;
uniform float portalReveal;
void main(){
 vec3 N=normalize(vNormal),V=normalize(cameraPos-vWorld);
 float fresnel=pow(1.0-clamp(abs(dot(N,V)),0.0,1.0),2.0);
 float angle=atan(vLocal.z,vLocal.x);
 float bands=.5+.5*sin(angle*11.0-portalTime*4.2+sin(angle*3.0+portalTime));
 float sparks=pow(.5+.5*sin(angle*29.0+portalTime*7.0),12.0);
 float pulse=.78+.22*sin(portalTime*2.5);
 vec3 violet=vec3(.48,.07,1.30),cyan=vec3(.03,1.10,1.55);
 vec3 color=vec3(.025,.008,.10);
 color+=mix(violet,cyan,bands)*(.48+bands*.72)*pulse;
 color+=mix(cyan,vec3(.85,.35,1.75),bands)*fresnel*1.55;
 color+=vec3(.75,.55,1.85)*sparks*1.8;
#ifdef HUB_PORTAL
 color=vec3(color.b*.10,color.g*.65+color.b*.30,color.b*1.35);
#endif
 gl_FragColor=vec4(color*smoothstep(0.0,.72,portalReveal),1.0);
}
