import{n as o}from"./main-DnueoU3z.js";const e="sceneUboDeclaration",n=`layout(std140,column_major) uniform;uniform Scene {mat4 viewProjection;
#ifdef MULTIVIEW
mat4 viewProjectionR;
#endif 
mat4 view;mat4 projection;vec4 vEyePosition;mat4 inverseProjection;};
`;o.IncludesShadersStore[e]||(o.IncludesShadersStore[e]=n);const r={name:e,shader:n};export{r as s};
