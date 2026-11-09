import{n as i}from"./main-DnueoU3z.js";import"./entry-DTYZBklM.js";const r="lightProxyPixelShader",o=`flat varying vec2 vLimits;flat varying highp uint vMask;void main(void) {if (gl_FragCoord.y<vLimits.x || gl_FragCoord.y>vLimits.y) {discard;}
gl_FragColor=vec4(vMask,0,0,1);}
`;i.ShadersStore[r]||(i.ShadersStore[r]=o);const e={name:r,shader:o};export{e as lightProxyPixelShader};
