precision highp float;
varying vec3 vLocal;
varying vec3 vWorld;
varying vec3 vNormal;
uniform vec3 cameraPos;
uniform float portalTime;
uniform float portalReveal;
float hash21(vec2 p){vec2 q=fract(p*vec2(123.34,456.21));return fract((q.x+q.y)*(q.x*q.y+45.32));}
void main(){
 vec2 p=vLocal.xy/1.18;
 float radius=length(p);if(radius>1.0)discard;
 float angle=atan(p.y,p.x),t=portalTime;
 float spiralA=.5+.5*sin(angle*7.0-radius*18.0-t*2.8);
 float spiralB=.5+.5*sin(angle*-11.0-radius*27.0+t*4.1);
 float filaments=pow(clamp(spiralA*.66+spiralB*.50-.34,0.0,1.0),3.4);
 float sparkGate=step(.93,hash21(floor(vec2(angle*10.0,radius*24.0+t*2.0))));
 float sparks=sparkGate*pow(.5+.5*sin(angle*31.0-radius*43.0+t*7.5),18.0);
 float depth=1.0-radius,innerPulse=.72+.28*sin(t*2.0-radius*9.0);
 float coreWave=.5+.5*sin(t*4.4+radius*17.0-angle*2.0),core=pow(depth,2.15);
 vec3 violet=vec3(.34,.025,1.15),blue=vec3(.015,.52,1.35),cyan=vec3(.025,1.12,1.50);
 vec3 color=mix(vec3(.004,.002,.025),violet*.24,depth);
 color+=mix(violet,blue,spiralB)*filaments*(.48+.52*depth);
 color+=cyan*sparks*1.8;
 color+=mix(violet,cyan,spiralA)*core*innerPulse*.78;
 color+=mix(cyan,vec3(.72,.30,1.65),spiralB)*core*coreWave*.72;
 color+=vec3(.10,.42,.92)*pow(depth,4.5)*(.75+.25*sin(t*6.2))*1.15;
 float reveal=smoothstep(0.0,.78,portalReveal);
 float alpha=(1.0-smoothstep(.82,1.0,radius))*reveal*(.76+filaments*.20);
#ifdef HUB_PORTAL
 color=vec3(color.b*.10,color.g*.65+color.b*.30,color.b*1.35);
#endif
 gl_FragColor=vec4(color*reveal,alpha);
}
