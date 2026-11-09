import{n as e,B as n}from"./main-DnueoU3z.js";import{c as o}from"./clipPlaneFragmentDeclaration-DmWLgbKA.js";import{p as d}from"./packingFunctions-CNUPDraR.js";import"./entry-DTYZBklM.js";const r="depthPixelShader",a=`#ifdef ALPHATEST
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
varying float vDepthMetric;
#ifdef PACKED
#include<packingFunctions>
#endif
#ifdef STORE_CAMERASPACE_Z
varying vec4 vViewPos;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
discard;
#endif
#ifdef STORE_CAMERASPACE_Z
#ifdef PACKED
gl_FragColor=pack(vViewPos.z);
#else
gl_FragColor=vec4(vViewPos.z,0.0,0.0,1.0);
#endif
#else
#ifdef NONLINEARDEPTH
#ifdef PACKED
gl_FragColor=pack(gl_FragCoord.z);
#else
gl_FragColor=vec4(gl_FragCoord.z,0.0,0.0,0.0);
#endif
#else
#ifdef PACKED
gl_FragColor=pack(vDepthMetric);
#else
gl_FragColor=vec4(vDepthMetric,0.0,0.0,1.0);
#endif
#endif
#endif
}`;e.ShadersStore[r]||(e.ShadersStore[r]=a);const f=[o,d,n];for(const i of f)e.IncludesShadersStore[i.name]||(e.IncludesShadersStore[i.name]=i.shader);const g={name:r,shader:a};export{g as depthPixelShader};
