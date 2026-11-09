import{n as e}from"./main-DnueoU3z.js";const a="meshUboDeclaration",o=`#ifdef WEBGL2
uniform mat4 world;uniform float visibility;
#else
layout(std140,column_major) uniform;uniform Mesh
{mat4 world;float visibility;};
#endif
#define WORLD_UBO
`;e.IncludesShadersStore[a]||(e.IncludesShadersStore[a]=o);const s={name:a,shader:o},n="mainUVVaryingDeclaration",i=`#ifdef MAINUV{X}
varying vec2 vMainUV{X};
#endif
`;e.IncludesShadersStore[n]||(e.IncludesShadersStore[n]=i);const t={name:n,shader:i};export{t as a,s as m};
