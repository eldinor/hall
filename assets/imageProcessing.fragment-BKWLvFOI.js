import{n as e,H as a}from"./main-DnueoU3z.js";import{i as n,a as i}from"./imageProcessingFunctions-8e1ugvHL.js";import"./entry-DTYZBklM.js";const t="imageProcessingPixelShader",s=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<imageProcessingDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=textureSample(textureSampler,textureSamplerSampler,input.vUV);result=vec4f(max(result.rgb,vec3f(0.)),result.a);
#ifdef IMAGEPROCESSING
#ifndef FROMLINEARSPACE
result=vec4f(toLinearSpaceVec3(result.rgb),result.a);
#endif
result=applyImageProcessing(result);
#else
#ifdef FROMLINEARSPACE
result=applyImageProcessing(result);
#endif
#endif
fragmentOutputs.color=result;}`;e.ShadersStoreWGSL[t]||(e.ShadersStoreWGSL[t]=s);const l=[n,a,i];for(const r of l)e.IncludesShadersStoreWGSL[r.name]||(e.IncludesShadersStoreWGSL[r.name]=r.shader);const S={name:t,shader:s};export{S as imageProcessingPixelShaderWGSL};
