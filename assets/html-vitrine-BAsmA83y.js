import{r as $n}from"./main-DHr6LKof.js";import"./entry-6wh2mR4s.js";var we={exports:{}},Yn=we.exports,yr;function jn(){return yr||(yr=1,(function(D,K){(function(v,a){a(K,$n())})(Yn,function(v,a){function y(n,e,t,i){return new(t||(t=Promise))(function(r,s){function o(u){try{l(i.next(u))}catch(h){s(h)}}function c(u){try{l(i.throw(u))}catch(h){s(h)}}function l(u){var h;u.done?r(u.value):(h=u.value,h instanceof t?h:new t(function(d){d(h)})).then(o,c)}l((i=i.apply(n,e||[])).next())})}typeof SuppressedError=="function"&&SuppressedError,a.MaterialDefines;const W="originOffsetKm",$="inverseViewportSize",me=[{name:W,size:3,type:"vec3"},{name:"_atmoPbrPadding1",size:1,type:"float"},{name:$,size:2,type:"vec2"}],b={x:0,y:0,z:0},ee=["atmosphereFunctions","atmosphereUboDeclaration","atmosphereFragmentDeclaration"],U=["atmosphereFunctions","atmosphereUboDeclaration"],Y={loaded:!1,loadPromise:null,nextRetryTime:0},Te={loaded:!1,loadPromise:null,nextRetryTime:0};function ge(n){return n===1?Te:Y}function te(n){const e=a.ShaderStore.GetIncludesShadersStore(n),t=n===1?U:ee;for(const i of t)if(e[i]===void 0)return!1;return!0}function A(n){return y(this,void 0,void 0,function*(){const e=ge(n);if(e.loaded||te(n))e.loaded=!0;else{e.loadPromise||(e.loadPromise=(function(t){return y(this,void 0,void 0,function*(){t===1?yield Promise.all([Promise.resolve().then(function(){return Zr}),Promise.resolve().then(function(){return $r})]):yield Promise.all([Promise.resolve().then(function(){return Yr}),Promise.resolve().then(function(){return jr}),Promise.resolve().then(function(){return Xr})])})})(n));try{yield e.loadPromise,e.loaded=!0}catch(t){throw e.loadPromise=null,t}}})}class M extends a.MaterialPluginBase{constructor(e,t,i=!1){super(e,"AtmospherePBRMaterialPlugin",600,{USE_CUSTOM_REFLECTION:!1,CUSTOM_FRAGMENT_BEFORE_FOG:i,USE_AERIAL_PERSPECTIVE_LUT:i&&t.isAerialPerspectiveLutEnabled,APPLY_AERIAL_PERSPECTIVE_INTENSITY:i&&t.aerialPerspectiveIntensity!==1,APPLY_AERIAL_PERSPECTIVE_RADIANCE_BIAS:i&&t.aerialPerspectiveRadianceBias!==0,SAMPLE_TRANSMITTANCE_LUT:!0,EXCLUDE_RAY_MARCHING_FUNCTIONS:!0},!1,!0,!0),this._atmosphere=t,this._isAerialPerspectiveEnabled=i,this.doNotSerialize=!0,this._pluginManager._addPlugin(this),this._ensureShaderIncludesLoaded()}isCompatible(){return!0}getUniformBuffersNames(e){const t=this._atmosphere.uniformBuffer;if(t.useUbo){const i=this._material.shaderLanguage===1?"atmosphere":t.name;e.push(i)}}getUniforms(){return e=this._atmosphere,{ubo:me,fragment:`uniform vec2 ${$};
uniform vec3 ${W};
`,externalUniforms:e.uniformBuffer.getUniformNames()};var e}isReadyForSubMesh(){var e;if(!this._ensureShaderIncludesLoaded())return!1;const t=this._atmosphere;if(!(!((e=t.transmittanceLut)===null||e===void 0)&&e.hasLutData)||t.diffuseSkyIrradianceLut&&!t.diffuseSkyIrradianceLut.hasLutData)return!1;if(this._isAerialPerspectiveEnabled&&t.isAerialPerspectiveLutEnabled){const i=t.aerialPerspectiveLutRenderTarget;if(!(i!=null&&i.isReady()))return!1}return!0}_ensureShaderIncludesLoaded(){const e=this._material.shaderLanguage,t=ge(e);return t.loaded||te(e)?(t.loaded=!0,!0):(!t.loadPromise&&Date.now()>=t.nextRetryTime&&this._tryLoadShaderIncludesAsync(e,t),!1)}_tryLoadShaderIncludesAsync(e,t){return y(this,void 0,void 0,function*(){try{yield A(e)}catch(i){a.Logger.Error(`AtmospherePBRMaterialPlugin: Failed to load atmosphere shader includes; the atmosphere material will not render until they load. Retrying in 5s. ${i}`),t.nextRetryTime=Date.now()+5e3}})}static PreloadShaderIncludesAsync(){return y(this,arguments,void 0,function*(e=0){yield A(e)})}getActiveTextures(e){var t,i;const r=this._atmosphere;if(this._isAerialPerspectiveEnabled&&r.isAerialPerspectiveLutEnabled){const o=r.aerialPerspectiveLutRenderTarget;o&&e.push(o)}const s=(i=(t=r.transmittanceLut)===null||t===void 0?void 0:t.renderTarget)!==null&&i!==void 0?i:null;s&&e.push(s)}bindForSubMesh(e){var t,i;const r=this._atmosphere,s=r.scene,o=s.getEngine(),c=e.currentEffect;c&&this._atmosphere.bindUniformBufferToEffect(c),e.updateVector3(W,s.floatingOriginMode?a.Vector3ScaleToRef(s.floatingOriginOffset,.001,b):a.Vector3FromFloatsToRef(0,r.physicalProperties.planetRadius,0,b));const l=o.getRenderWidth(),u=o.getRenderHeight();if(e.updateFloat2($,1/l,1/u),this._isAerialPerspectiveEnabled&&r.isAerialPerspectiveLutEnabled){const d=r.aerialPerspectiveLutRenderTarget;e.setTexture("aerialPerspectiveLut",d)}const h=(i=(t=r.transmittanceLut)===null||t===void 0?void 0:t.renderTarget)!==null&&i!==void 0?i:null;e.setTexture("transmittanceLut",h)}prepareDefines(e){const t=e.USE_CUSTOM_REFLECTION,i=e.USE_AERIAL_PERSPECTIVE_LUT,r=e.APPLY_AERIAL_PERSPECTIVE_INTENSITY,s=e.APPLY_AERIAL_PERSPECTIVE_RADIANCE_BIAS;e.USE_CUSTOM_REFLECTION=this._atmosphere.diffuseSkyIrradianceLut!==null&&!!e.USEIRRADIANCEMAP,e.USE_AERIAL_PERSPECTIVE_LUT=this._isAerialPerspectiveEnabled&&this._atmosphere.isAerialPerspectiveLutEnabled,e.APPLY_AERIAL_PERSPECTIVE_INTENSITY=this._isAerialPerspectiveEnabled&&this._atmosphere.aerialPerspectiveIntensity!==1,e.APPLY_AERIAL_PERSPECTIVE_RADIANCE_BIAS=this._isAerialPerspectiveEnabled&&this._atmosphere.aerialPerspectiveRadianceBias!==0,t===e.USE_CUSTOM_REFLECTION&&i===e.USE_AERIAL_PERSPECTIVE_LUT&&r===e.APPLY_AERIAL_PERSPECTIVE_INTENSITY&&s===e.APPLY_AERIAL_PERSPECTIVE_RADIANCE_BIAS||e.markAllAsDirty()}getSamplers(e){e.push("transmittanceLut"),this._isAerialPerspectiveEnabled&&this._atmosphere.isAerialPerspectiveLutEnabled&&e.push("aerialPerspectiveLut")}getCustomCode(e,t){if(e!=="fragment")return null;const i=this._atmosphere.scene.getEngine().supportsUniformBuffers?"-light0.vLightData.xyz":"-vLightData0.xyz",r=t===1||this._atmosphere.uniformBuffer.useUbo?"#include<atmosphereUboDeclaration>":"#include<atmosphereFragmentDeclaration>";return t===0?{CUSTOM_FRAGMENT_DEFINITIONS:this._isAerialPerspectiveEnabled&&this._atmosphere.isAerialPerspectiveLutEnabled?`uniform sampler2D transmittanceLut;\r
precision highp sampler2DArray;\r
uniform sampler2DArray aerialPerspectiveLut;\r
${r}\r
#include<atmosphereFunctions>`:`uniform sampler2D transmittanceLut;\r
${r}\r
#include<atmosphereFunctions>`,CUSTOM_LIGHT0_COLOR:`
            {
                vec3 positionGlobal = 0.001 * vPositionW + ${W};
                float positionRadius = length(positionGlobal);
                vec3 geocentricNormal = positionGlobal / positionRadius;
                vec3 directionToLight = ${i};
                float cosAngleLightToZenith = dot(directionToLight, geocentricNormal);
                diffuse0 = lightIntensity * sampleTransmittanceLut(transmittanceLut, positionRadius, cosAngleLightToZenith);
            }
`,CUSTOM_REFLECTION:`
            {
                vec3 positionGlobal =  0.001 * vPositionW + ${W};
                float positionRadius = length(positionGlobal);
                vec3 geocentricNormal = positionGlobal / positionRadius;

                vec3 directionToLight = ${i};
                float cosAngleLightToZenith = dot(directionToLight, geocentricNormal);

                vec2 uv = vec2(0.5 + 0.5 * cosAngleLightToZenith, (positionRadius - planetRadius) / atmosphereThickness);
                float irradianceScaleT = 0.5 * dot(normalW, geocentricNormal) + 0.5;
                float irradianceScale = ((-0.6652 * irradianceScaleT) + 1.5927) * irradianceScaleT + 0.1023;
                vec3 environmentIrradiance = lightIntensity * sampleReflection(irradianceSampler, uv).rgb;

                // Add a contribution here to estimate indirect lighting.
                const float r = 0.2;
                float indirect = getLuminanceUnclamped(environmentIrradiance) / max(0.00001, 1. - r);
                environmentIrradiance *= irradianceScale;
                environmentIrradiance += indirect;

                environmentIrradiance += additionalDiffuseSkyIrradiance;

                const float diffuseBrdf = 1. / PI;
                environmentIrradiance *= diffuseBrdf * diffuseSkyIrradianceIntensity;

                reflectionOut.environmentIrradiance = environmentIrradiance;
                reflectionOut.environmentRadiance.rgb = reflectionOut.environmentIrradiance;
            }
`,CUSTOM_FRAGMENT_BEFORE_FOG:`
            #if USE_AERIAL_PERSPECTIVE_LUT
            {
                float distanceFromCameraKm = 0.001 * distance(vEyePosition.xyz, vPositionW);
                vec4 aerialPerspective = vec4(0.);
                if (sampleAerialPerspectiveLut(
                        gl_FragCoord.xy * ${$},
                        true,
                        distanceFromCameraKm,
                        NumAerialPerspectiveLutLayers,
                        AerialPerspectiveLutKMPerSlice,
                        AerialPerspectiveLutRangeKM,
                        aerialPerspective)) {
                    finalColor = aerialPerspective + (1. - aerialPerspective.a) * finalColor;
                }
            }
            #endif
`}:{CUSTOM_FRAGMENT_DEFINITIONS:this._isAerialPerspectiveEnabled&&this._atmosphere.isAerialPerspectiveLutEnabled?`var transmittanceLutSampler: sampler;\r
var transmittanceLut: texture_2d<f32>;\r
var aerialPerspectiveLutSampler: sampler;\r
var aerialPerspectiveLut: texture_2d_array<f32>;\r
${r}\r
#include<atmosphereFunctions>`:`var transmittanceLutSampler: sampler;\r
var transmittanceLut: texture_2d<f32>;\r
${r}\r
#include<atmosphereFunctions>`,CUSTOM_LIGHT0_COLOR:`
            {
                var positionGlobal = 0.001 * fragmentInputs.vPositionW + uniforms.${W};
                var positionRadius = length(positionGlobal);
                var geocentricNormal = positionGlobal / positionRadius;
                var directionToLight = ${i};
                var cosAngleLightToZenith = dot(directionToLight, geocentricNormal);
                diffuse0 = atmosphere.lightIntensity * sampleTransmittanceLut(transmittanceLut, positionRadius, cosAngleLightToZenith);
            }
`,CUSTOM_REFLECTION:`
            {
                var positionGlobal =  0.001 * fragmentInputs.vPositionW + uniforms.${W};
                var positionRadius = length(positionGlobal);
                var geocentricNormal = positionGlobal / positionRadius;

                var directionToLight = ${i};
                var cosAngleLightToZenith = dot(directionToLight, geocentricNormal);

                var uv = vec2f(0.5 + 0.5 * cosAngleLightToZenith, (positionRadius - atmosphere.planetRadius) / atmosphere.atmosphereThickness);
                var irradianceScaleT = 0.5 * dot(normalW, geocentricNormal) + 0.5;
                var irradianceScale = ((-0.6652 * irradianceScaleT) + 1.5927) * irradianceScaleT + 0.1023;
                var environmentIrradiance = atmosphere.lightIntensity * textureSample(irradianceSampler, irradianceSamplerSampler, uv).rgb;

                // Add a contribution here to estimate indirect lighting.
                const r = 0.2;
                var indirect = getLuminanceUnclamped(environmentIrradiance) / max(0.00001, 1.0 - r);
                environmentIrradiance *= irradianceScale;
                environmentIrradiance += indirect;

                environmentIrradiance += atmosphere.additionalDiffuseSkyIrradiance;

                const diffuseBrdf = 1.0 / PI;
                environmentIrradiance *= diffuseBrdf * atmosphere.diffuseSkyIrradianceIntensity;

                reflectionOut.environmentIrradiance = environmentIrradiance;
                reflectionOut.environmentRadiance = vec4f(reflectionOut.environmentIrradiance, reflectionOut.environmentRadiance.a);
            }
`,CUSTOM_FRAGMENT_BEFORE_FOG:`
            #if USE_AERIAL_PERSPECTIVE_LUT
            {
                var distanceFromCameraKm = 0.001 * distance(scene.vEyePosition.xyz, fragmentInputs.vPositionW);
                var aerialPerspective = vec4f(0.);
                if (sampleAerialPerspectiveLut(
                        fragmentInputs.position.xy * uniforms.${$},
                        true,
                        distanceFromCameraKm,
                        NumAerialPerspectiveLutLayers,
                        AerialPerspectiveLutKMPerSlice,
                        AerialPerspectiveLutRangeKM,
                        &aerialPerspective)) {
                    finalColor = aerialPerspective + (1. - aerialPerspective.a) * finalColor;
                }
            }
            #endif
`}}}const G=new a.Ray(a.Vector3.Zero(),a.Vector3.Zero());class N{constructor(){this._inverseViewProjectionMatrixWithoutTranslation=a.Matrix.Identity(),this._directionToLightRelativeToCameraGeocentricNormal=a.Vector3.Up(),this._cosAngleLightToZenith=0,this._cameraRadius=0,this._clampedCameraRadius=0,this._cameraHeight=0,this._clampedCameraHeight=0,this._cameraPositionGlobal=new a.Vector3,this._clampedCameraPositionGlobal=new a.Vector3,this._cosCameraHorizonAngleFromZenith=0,this._sinCameraAtmosphereHorizonAngleFromNadir=0,this._cameraGeocentricNormal=a.Vector3.Up(),this._cameraForward=a.Vector3.Down(),this._cameraNearPlane=0,this._cameraPosition=new a.Vector3,this._viewport=new a.Vector4,this._lastViewMatrix=a.Matrix.Identity(),this._lastProjectionMatrix=a.Matrix.Identity(),this._inverseViewMatrixWithoutTranslation=a.Matrix.Identity(),this._inverseProjectionMatrix=a.Matrix.Identity()}get inverseViewProjectionMatrixWithoutTranslation(){return this._inverseViewProjectionMatrixWithoutTranslation}get directionToLightRelativeToCameraGeocentricNormal(){return this._directionToLightRelativeToCameraGeocentricNormal}get cosAngleLightToZenith(){return this._cosAngleLightToZenith}get cameraRadius(){return this._cameraRadius}get clampedCameraRadius(){return this._clampedCameraRadius}get cameraHeight(){return this._cameraHeight}get clampedCameraHeight(){return this._clampedCameraHeight}get cameraPositionGlobal(){return this._cameraPositionGlobal}get clampedCameraPositionGlobal(){return this._clampedCameraPositionGlobal}get cosCameraHorizonAngleFromZenith(){return this._cosCameraHorizonAngleFromZenith}get sinCameraAtmosphereHorizonAngleFromNadir(){return this._sinCameraAtmosphereHorizonAngleFromNadir}get cameraGeocentricNormal(){return this._cameraGeocentricNormal}get cameraForward(){return this._cameraForward}get cameraNearPlane(){return this._cameraNearPlane}get cameraPosition(){return this._cameraPosition}get viewport(){return this._viewport}update(e,t,i,r,s,o){this._cameraNearPlane=e.minZ,this._cameraForward.copyFrom(e.getForwardRayToRef(G,1).direction);const c=e.getScene(),l=c.getEngine();this._viewport.copyFromFloats(0,0,l.getRenderWidth(),l.getRenderHeight());const u=e.getViewMatrix(),h=e.getProjectionMatrix(),d=this._lastViewMatrix,m=this._lastProjectionMatrix;d.equals(u)&&m.equals(h)||(d.copyFrom(u),d.setTranslation(a.Vector3.ZeroReadOnly),d.invertToRef(this._inverseViewMatrixWithoutTranslation),m.copyFrom(h),m.invertToRef(this._inverseProjectionMatrix),this._inverseProjectionMatrix.multiplyToRef(this._inverseViewMatrixWithoutTranslation,this._inverseViewProjectionMatrixWithoutTranslation));const p=this._cameraPosition.copyFrom(e.globalPosition).scaleToRef(.001,this._cameraPositionGlobal);c.floatingOriginMode?(p.normalizeToRef(this._cameraGeocentricNormal),this._cameraGeocentricNormal.scaleAndAddToRef(o,p)):(p.y+=t+o,p.normalizeToRef(this._cameraGeocentricNormal)),this._cameraRadius=p.length(),this._cameraHeight=this._cameraRadius-t,this._clampedCameraRadius=this._cameraRadius,this._clampedCameraRadius<i?(this._clampedCameraRadius=i,this._cameraGeocentricNormal.scaleToRef(i,this._clampedCameraPositionGlobal)):this._clampedCameraPositionGlobal.copyFrom(p),this._cosCameraHorizonAngleFromZenith=z(t,this._clampedCameraRadius),this._sinCameraAtmosphereHorizonAngleFromNadir=Math.min(1,r/this._clampedCameraRadius),this._clampedCameraHeight=this._clampedCameraRadius-t;{this._cosAngleLightToZenith=a.Vector3Dot(s,this._cameraGeocentricNormal);const f=Math.sqrt(Math.max(0,1-this._cosAngleLightToZenith*this._cosAngleLightToZenith));this._directionToLightRelativeToCameraGeocentricNormal.copyFromFloats(f,this._cosAngleLightToZenith,0),this._directionToLightRelativeToCameraGeocentricNormal.normalize()}}}const z=(n,e)=>{const t=Math.min(1,n/e);return-Math.sqrt(1-t*t)},F=new a.Vector3(.005802,.013558,.0331),se=new a.Vector3(.003996,.003996,.003996),be=new a.Vector3(444e-6,444e-6,444e-6),Ar=new a.Vector3(65e-5,.001881,85e-6);class jt{get planetRadius(){return this._planetRadius}set planetRadius(e){this._planetRadius!==e&&(this._planetRadius=e,this._recomputeDimensionalParameters(),this.onChangedObservable.notifyObservers(this))}get planetRadiusSquared(){return this._planetRadiusSquared}get planetRadiusOffset(){return this._planetRadiusOffset}set planetRadiusOffset(e){this._planetRadiusOffset!==e&&(this._planetRadiusOffset=e,this._recomputeDimensionalParameters(),this.onChangedObservable.notifyObservers(this))}get planetRadiusWithOffset(){return this._planetRadiusWithOffset}get atmosphereThickness(){return this._atmosphereThickness}set atmosphereThickness(e){this._atmosphereThickness!==e&&(this._atmosphereThickness=e,this._recomputeDimensionalParameters(),this.onChangedObservable.notifyObservers(this))}get atmosphereRadius(){return this._atmosphereRadius}get atmosphereRadiusSquared(){return this._atmosphereRadiusSquared}get horizonDistanceToAtmosphereEdge(){return this._horizonDistanceToAtmosphereEdge}get horizonDistanceToAtmosphereEdgeSquared(){return this._horizonDistanceToAtmosphereEdgeSquared}get rayleighScatteringScale(){return this._rayleighScatteringScale}set rayleighScatteringScale(e){this._rayleighScatteringScale!==e&&(this._rayleighScatteringScale=e,this._recomputeRayleighScattering(),this.onChangedObservable.notifyObservers(this))}get peakRayleighScattering(){return this._peakRayleighScattering}set peakRayleighScattering(e){this._peakRayleighScattering.equals(e)||(this._peakRayleighScattering.copyFrom(e),this._recomputeRayleighScattering(),this.onChangedObservable.notifyObservers(this))}get rayleighScattering(){return this._rayleighScattering}get mieScatteringScale(){return this._mieScatteringScale}set mieScatteringScale(e){this._mieScatteringScale!==e&&(this._mieScatteringScale=e,this._recomputeMieScattering(),this.onChangedObservable.notifyObservers(this))}get peakMieScattering(){return this._peakMieScattering}set peakMieScattering(e){this._peakMieScattering.equals(e)||(this._peakMieScattering.copyFrom(e),this._recomputeMieScattering(),this.onChangedObservable.notifyObservers(this))}get mieScattering(){return this._mieScattering}get mieAbsorptionScale(){return this._mieAbsorptionScale}set mieAbsorptionScale(e){this._mieAbsorptionScale!==e&&(this._mieAbsorptionScale=e,this._recomputeMieAbsorption(),this.onChangedObservable.notifyObservers(this))}get peakMieAbsorption(){return this._peakMieAbsorption}set peakMieAbsorption(e){this._peakMieAbsorption.equals(e)||(this._peakMieAbsorption.copyFrom(e),this._recomputeMieAbsorption(),this.onChangedObservable.notifyObservers(this))}get mieAbsorption(){return this._mieAbsorption}get mieExtinction(){return this._mieExtinction}get ozoneAbsorptionScale(){return this._ozoneAbsorptionScale}set ozoneAbsorptionScale(e){this._ozoneAbsorptionScale!==e&&(this._ozoneAbsorptionScale=e,this._recomputeOzoneAbsorption(),this.onChangedObservable.notifyObservers(this))}get peakOzoneAbsorption(){return this._peakOzoneAbsorption}set peakOzoneAbsorption(e){this._peakOzoneAbsorption.equals(e)||(this._peakOzoneAbsorption.copyFrom(e),this._recomputeOzoneAbsorption(),this.onChangedObservable.notifyObservers(this))}get ozoneAbsorption(){return this._ozoneAbsorption}constructor(e){var t,i,r,s,o,c,l,u,h,d,m;this.onChangedObservable=new a.Observable,this._peakRayleighScattering=new a.Vector3,this._peakMieScattering=new a.Vector3,this._peakMieAbsorption=new a.Vector3,this._peakOzoneAbsorption=new a.Vector3,this._planetRadiusWithOffset=0,this._planetRadiusSquared=0,this._atmosphereRadius=0,this._atmosphereRadiusSquared=0,this._horizonDistanceToAtmosphereEdge=0,this._horizonDistanceToAtmosphereEdgeSquared=0,this._rayleighScattering=new a.Vector3,this._mieScattering=new a.Vector3,this._mieAbsorption=new a.Vector3,this._mieExtinction=new a.Vector3,this._ozoneAbsorption=new a.Vector3,this._planetRadius=(t=e==null?void 0:e.planetRadius)!==null&&t!==void 0?t:6360,this._planetRadiusOffset=(i=e==null?void 0:e.planetRadiusOffset)!==null&&i!==void 0?i:.01,this._atmosphereThickness=(r=e==null?void 0:e.atmosphereThickness)!==null&&r!==void 0?r:100,this._rayleighScatteringScale=(s=e==null?void 0:e.rayleighScatteringScale)!==null&&s!==void 0?s:1,this._peakRayleighScattering.copyFrom((o=e==null?void 0:e.peakRayleighScattering)!==null&&o!==void 0?o:F),this._mieScatteringScale=(c=e==null?void 0:e.mieScatteringScale)!==null&&c!==void 0?c:1,this._peakMieScattering.copyFrom((l=e==null?void 0:e.peakMieScattering)!==null&&l!==void 0?l:se),this._mieAbsorptionScale=(u=e==null?void 0:e.mieAbsorptionScale)!==null&&u!==void 0?u:1,this._peakMieAbsorption.copyFrom((h=e==null?void 0:e.peakMieAbsorption)!==null&&h!==void 0?h:be),this._ozoneAbsorptionScale=(d=e==null?void 0:e.ozoneAbsorptionScale)!==null&&d!==void 0?d:1,this._peakOzoneAbsorption.copyFrom((m=e==null?void 0:e.peakOzoneAbsorption)!==null&&m!==void 0?m:Ar),this._recomputeDimensionalParameters(),this._recomputeRayleighScattering(),this._recomputeMieScattering(),this._recomputeMieAbsorption(),this._recomputeOzoneAbsorption()}_recomputeDimensionalParameters(){this._planetRadiusWithOffset=this._planetRadius+this._planetRadiusOffset,this._planetRadiusSquared=this._planetRadius*this._planetRadius,this._atmosphereRadius=this._planetRadius+this._atmosphereThickness,this._atmosphereRadiusSquared=this._atmosphereRadius*this._atmosphereRadius,this._horizonDistanceToAtmosphereEdgeSquared=this._atmosphereRadiusSquared-this._planetRadiusSquared,this._horizonDistanceToAtmosphereEdge=Math.sqrt(this._horizonDistanceToAtmosphereEdgeSquared)}_recomputeRayleighScattering(){this._peakRayleighScattering.scaleToRef(this._rayleighScatteringScale,this._rayleighScattering)}_recomputeMieScattering(){this._peakMieScattering.scaleToRef(this._mieScatteringScale,this._mieScattering),this._recomputeMieExtinction()}_recomputeMieAbsorption(){this._peakMieAbsorption.scaleToRef(this._mieAbsorptionScale,this._mieAbsorption),this._recomputeMieExtinction()}_recomputeMieExtinction(){this._mieAbsorption.addToRef(this._mieScattering,this._mieExtinction)}_recomputeOzoneAbsorption(){this._peakOzoneAbsorption.scaleToRef(this._ozoneAbsorptionScale,this._ozoneAbsorption)}}const Oe=()=>({r:Number.NaN,g:Number.NaN,b:Number.NaN,a:Number.NaN}),Lr=Oe(),Pr=Oe(),Er=Oe(),Rr=Oe(),Xt=n=>n/255;function Qt(n,e,t,i,r,s,o=Xt){if(t<=0||i<=0)throw new Error("Sample2DRgbaToRef: widthPx and heightPx must be positive.");const c=t*i*4;if(r.length<c)throw new Error(`Sample2DRgbaToRef: data length (${r.length}) is less than required (${c}).`);n=a.Clamp(n),e=a.Clamp(e);const l=Math.max(n*t-.5,0),u=Math.max(e*i-.5,0),h=Math.floor(l),d=Math.min(h+1,t-1),m=Math.floor(u),p=Math.min(m+1,i-1),f=De(h,m,t,i,r,Lr,o),_=De(h,p,t,i,r,Pr,o),S=De(d,m,t,i,r,Er,o),g=De(d,p,t,i,r,Rr,o),L=l-h,x=u-m,R=1-L,C=1-x,O=R*C,w=L*C,B=R*x,Q=L*x;return s.r=f.r*O+S.r*w+_.r*B+g.r*Q,s.g=f.g*O+S.g*w+_.g*B+g.g*Q,s.b=f.b*O+S.b*w+_.b*B+g.b*Q,s.a=f.a*O+S.a*w+_.a*B+g.a*Q,s}const De=(n,e,t,i,r,s,o=Xt)=>{const c=a.Clamp(n,0,t-1),l=4*(a.Clamp(e,0,i-1)*t+c);return o?(s.r=o(r[l]),s.g=o(r[l+1]),s.b=o(r[l+2]),s.a=o(r[l+3])):(s.r=r[l],s.g=r[l+1],s.b=r[l+2],s.a=r[l+3]),s},Ze={x:Number.NaN,y:Number.NaN},Ne={r:Number.NaN,g:Number.NaN,b:Number.NaN,a:Number.NaN};class Kt{get isDirty(){return this._isDirty}get isDisposed(){return this._isDisposed}get renderTarget(){if(this._isDisposed||this._renderTarget===null)throw new Error;return this._renderTarget}get hasLutData(){return this._lutData[0]!==void 0}constructor(e){this._renderTarget=null,this._effectWrapper=null,this._effectRenderer=null,this._isDirty=!0,this._isDisposed=!1,this._needsReadPixels=!1,this._lutData=new Float32Array(0),a.RegisterEnginesExtensionsEngineRenderTarget(),a.RegisterEnginesExtensionsEngineReadTexture(),this._atmosphere=e;const t=e.scene,i=t.getEngine(),r="atmo-diffuseSkyIrradiance",s=i.getCaps().textureHalfFloatRender?a.Constants.TEXTURETYPE_HALF_FLOAT:a.Constants.TEXTURETYPE_UNSIGNED_BYTE,o=this._renderTarget=new a.RenderTargetTexture(r,{width:64,height:16},t,{generateMipMaps:!1,type:s,samplingMode:a.Constants.TEXTURE_BILINEAR_SAMPLINGMODE,generateDepthBuffer:!1,gammaSpace:!1});o.wrapU=a.Constants.TEXTURE_CLAMP_ADDRESSMODE,o.wrapV=a.Constants.TEXTURE_CLAMP_ADDRESSMODE,o.anisotropicFilteringLevel=1,o.skipInitialClear=!0;const c=e.uniformBuffer,l=c.useUbo,u=i.isWebGPU&&!a.EffectWrapper.ForceGLSL,h=u?"atmosphere":c.name;this._effectWrapper=new a.EffectWrapper({engine:i,name:r,vertexShader:"fullscreenTriangle",fragmentShader:"diffuseSkyIrradiance",attributeNames:["position"],uniformNames:["depth",...l?[]:c.getUniformNames()],uniformBuffers:l?[h]:[],defines:["#define POSITION_VEC2","#define NUM_SAMPLES 128u","#define CUSTOM_IRRADIANCE_FILTERING_INPUT","#define CUSTOM_IRRADIANCE_FILTERING_FUNCTION"],samplers:["transmittanceLut","multiScatteringLut"],useShaderStore:!0,shaderLanguage:u?1:0,extraInitializationsAsync:()=>y(this,void 0,void 0,function*(){yield Promise.all(u?[Promise.resolve().then(function(){return pe}),Promise.resolve().then(function(){return Jr})]:[Promise.resolve().then(function(){return fe}),Promise.resolve().then(function(){return rn})]);let d=(u?a.ShaderStore.IncludesShadersStoreWGSL:a.ShaderStore.IncludesShadersStore).hdrFilteringFunctions;d=d.replace(/^CUSTOM_IRRADIANCE_FILTERING_INPUT\s*$/gm,""),d=d.replace(/^CUSTOM_IRRADIANCE_FILTERING_FUNCTION\s*$/gm,u?"var c = integrateForIrradiance(n, Ls, vec3f(0., filteringInfo.x, 0.));":"vec3 c = integrateForIrradiance(n, Ls, vec3(0., filteringInfo.x, 0.));");const m=u?a.ShaderStore.ShadersStoreWGSL:a.ShaderStore.ShadersStore;let p=m.diffuseSkyIrradiancePixelShader;p=p.replace("#include<hdrFilteringFunctions>",d),m.diffuseSkyIrradiancePixelShader=p})}),this._effectRenderer=new a.EffectRenderer(i,{indices:[0,2,1],positions:[-1,-1,-1,3,3,-1]}),t.environmentTexture=o,t.environmentTexture.irradianceTexture=o,t.environmentIntensity=1,t.environmentTexture.isRenderTarget=!1}getDiffuseSkyIrradianceToRef(e,t,i,r,s){const o=this._atmosphere,c=o.additionalDiffuseSkyIrradiance,l=o.physicalProperties;if(this._lutData[0]===void 0||t>l.atmosphereRadius)return s.r=c.r,s.g=c.g,s.b=c.b,s;((h,d,m,p)=>{const f=a.Clamp(.5+.5*m),_=a.Clamp((d-h.planetRadius)/h.atmosphereThickness);p.x=.984375*f+.0078125,p.y=.9375*_+.03125})(l,t,a.Vector3Dot(e,i),Ze),Qt(Ze.x,Ze.y,64,16,this._lutData,Ne,null);const u=o.diffuseSkyIrradianceIntensity;return s.r=u*(r*Ne.r+c.r),s.g=u*(r*Ne.g+c.g),s.b=u*(r*Ne.b+c.b),s}render(){var e;const t=this._effectWrapper;if(!this._isDirty||!(t!=null&&t.isReady())||!(!((e=this._renderTarget)===null||e===void 0)&&e.isReady()))return!1;const i=this._effectRenderer;i.saveStates();const r=this._atmosphere.scene.getEngine();r.bindFramebuffer(this.renderTarget.renderTarget,void 0,void 0,void 0,!0),i.setViewport(),i.applyEffectWrapper(t);const s=t.effect;return i.bindBuffers(s),s.setTexture("transmittanceLut",this._atmosphere.transmittanceLut.renderTarget),s.setTexture("multiScatteringLut",this._atmosphere.multiScatteringLutRenderTarget),this._atmosphere.bindUniformBufferToEffect(s),s.setFloat("depth",0),i.draw(),i.restoreStates(),r.restoreDefaultFramebuffer(),this._isDirty=!1,this._needsReadPixels=!0,this._atmosphere.scene.onAfterRenderObservable.addOnce(()=>y(this,void 0,void 0,function*(){yield this.readPixelsAsync()})),!0}readPixelsAsync(){return y(this,void 0,void 0,function*(){if(!this._needsReadPixels||this._isDisposed)return;this._needsReadPixels=!1;const e=yield this.renderTarget.readPixels(0,0,void 0,!0,!0);if(e&&!this._isDisposed){const t=e,i=this._lutData=new Float32Array(t.length);if(t instanceof Uint16Array)for(let r=0;r<t.length;r++)i[r]=a.FromHalfFloat(t[r]);else for(let r=0;r<t.length;r++)i[r]=t[r]/255}})}markDirty(){this._isDirty=!0}dispose(){var e,t;this._renderTarget&&(this._renderTarget.irradianceTexture=null,this._renderTarget.dispose()),this._renderTarget=null,(e=this._effectWrapper)===null||e===void 0||e.dispose(),this._effectWrapper=null,(t=this._effectRenderer)===null||t===void 0||t.dispose(),this._effectRenderer=null,this._isDisposed=!0}}const xr=.001953125,Cr=.00390625,Ue={x:Number.NaN,y:Number.NaN},ve={r:Number.NaN,g:Number.NaN,b:Number.NaN},Fe={x:Number.NaN,y:Number.NaN,z:Number.NaN},Ve={r:Number.NaN,g:Number.NaN,b:Number.NaN,a:Number.NaN};class Jt{get isDirty(){return this._isDirty}get renderTarget(){if(this._isDisposed||this._renderTarget===null)throw new Error;return this._renderTarget}get hasLutData(){return this._lutData[0]!==void 0}constructor(e){this.onUpdatedObservable=new a.Observable,this._lutData=new Float32Array(0),this._isDirty=!0,this._isDisposed=!1,this._needsReadPixels=!1,a.RegisterEnginesExtensionsEngineRenderTarget(),a.RegisterEnginesExtensionsEngineReadTexture(),this._atmosphere=e;const t=this._atmosphere.scene,i=t.getEngine(),r="atmo-transmittance",s=this._renderTarget=new a.RenderTargetTexture(r,{width:256,height:64},t,{type:a.Constants.TEXTURETYPE_UNSIGNED_BYTE,samplingMode:a.Constants.TEXTURE_BILINEAR_SAMPLINGMODE,generateDepthBuffer:!1,gammaSpace:!1});s.wrapU=a.Constants.TEXTURE_CLAMP_ADDRESSMODE,s.wrapV=a.Constants.TEXTURE_CLAMP_ADDRESSMODE,s.anisotropicFilteringLevel=1,s.skipInitialClear=!0;const o=e.uniformBuffer,c=o.useUbo,l=i.isWebGPU&&!a.EffectWrapper.ForceGLSL,u=l?"atmosphere":o.name;this._effectWrapper=new a.EffectWrapper({engine:i,name:r,vertexShader:"fullscreenTriangle",fragmentShader:"transmittance",attributeNames:["position"],uniformNames:["depth",...c?[]:o.getUniformNames()],uniformBuffers:c?[u]:[],defines:["#define POSITION_VEC2"],useShaderStore:!0,shaderLanguage:l?1:0,extraInitializations:(h,d)=>{d.push(...l?[Promise.resolve().then(function(){return pe}),Promise.resolve().then(function(){return an})]:[Promise.resolve().then(function(){return fe}),Promise.resolve().then(function(){return on})])}}),this._effectRenderer=new a.EffectRenderer(i,{indices:[0,2,1],positions:[-1,-1,-1,3,3,-1]})}getTransmittedColorToRef(e,t,i,r){if(this._lutData[0]!==void 0){const s=a.Vector3Dot(e,i);((o,c,l,u,h)=>{if(l>o.atmosphereRadius)return void(h.r=h.g=h.b=h.a=1);((m,p,f,_)=>{const S=p*p,g=Math.sqrt(Math.max(0,S-m.planetRadiusSquared)),L=S*(f*f-1)+m.atmosphereRadiusSquared,x=Math.max(0,-p*f+Math.sqrt(Math.max(0,L))),R=Math.max(0,m.atmosphereRadius-p),C=g+m.horizonDistanceToAtmosphereEdge,O=(x-R)/Math.max(1e-6,C-R),w=g/Math.max(1e-6,m.horizonDistanceToAtmosphereEdge);_.x=.99609375*O+xr,_.y=.984375*w+.0078125})(o,l,u,Ue),Qt(Ue.x,Ue.y,256,64,c,h,null);const d=a.Clamp(a.SmoothStep(1,0,a.Clamp((Ue.x-.998046875)/Cr)));h.r*=d,h.g*=d,h.b*=d,h.a*=d})(this._atmosphere.physicalProperties,this._lutData,t,s,Ve),r.r=Ve.r,r.g=Ve.g,r.b=Ve.b}else r.r=r.g=r.b=1;return r}updateLightParameters(e,t,i){const r=e.direction;Fe.x=-r.x,Fe.y=-r.y,Fe.z=-r.z,this.getTransmittedColorToRef(Fe,t,i,ve),e.diffuse.copyFromFloats(ve.r,ve.g,ve.b),e.specular.copyFromFloats(ve.r,ve.g,ve.b)}render(){var e;const t=this._effectWrapper;if(!this._isDirty||!(t!=null&&t.isReady())||!(!((e=this._renderTarget)===null||e===void 0)&&e.isReady()))return!1;const i=this._effectRenderer;i.saveStates();const r=this._atmosphere.scene.getEngine();r.bindFramebuffer(this.renderTarget.renderTarget,void 0,void 0,void 0,!0),i.setViewport(),i.applyEffectWrapper(t);const s=t.effect;return i.bindBuffers(s),this._atmosphere.bindUniformBufferToEffect(s),s.setFloat("depth",0),i.draw(),i.restoreStates(),r.restoreDefaultFramebuffer(),this._isDirty=!1,this._needsReadPixels=!0,this._atmosphere.scene.onAfterRenderObservable.addOnce(()=>y(this,void 0,void 0,function*(){yield this.readPixelsAsync()})),!0}readPixelsAsync(){return y(this,void 0,void 0,function*(){if(!this._needsReadPixels||this._isDisposed)return;this._needsReadPixels=!1;const e=yield this.renderTarget.readPixels(0,0,void 0,void 0,!0);if(e&&!this._isDisposed){const t=e,i=this._lutData=new Float32Array(t.length);if(t instanceof Uint16Array)for(let r=0;r<t.length;r++)i[r]=a.FromHalfFloat(t[r]);else for(let r=0;r<t.length;r++)i[r]=t[r]/255;this.onUpdatedObservable.notifyObservers()}})}markDirty(){this._isDirty=!0}dispose(){var e,t,i;(e=this._renderTarget)===null||e===void 0||e.dispose(),this._renderTarget=null,(t=this._effectWrapper)===null||t===void 0||t.dispose(),this._effectWrapper=null,(i=this._effectRenderer)===null||i===void 0||i.dispose(),this._effectRenderer=null,this._isDisposed=!0}}let Mr=0;const Ee=(n,e,t,i,r,s,o,c=!1,l)=>{var u;const h=(u=o==null?void 0:o.map(d=>`#define ${d}`))!==null&&u!==void 0?u:[];return new a.EffectWrapper({engine:n,name:e,vertexShader:"fullscreenTriangle",fragmentShader:t,attributeNames:["position"],uniformNames:i,uniformBuffers:s,samplerNames:r,defines:h,useShaderStore:!0,shaderLanguage:c?1:0,extraInitializations:l})},ei=(n,e,t)=>{const i=e.useUbo,r=n.isWebGPU&&!a.EffectWrapper.ForceGLSL,s=r?"atmosphere":e.name,o=["#define POSITION_VEC2"];return t.equals(a.Color3.BlackReadOnly)||o.push("#define USE_GROUND_ALBEDO"),new a.EffectWrapper({engine:n,name:"atmo-multiScattering",vertexShader:"fullscreenTriangle",fragmentShader:"multiScattering",attributeNames:["position"],uniformNames:["depth",...i?[]:e.getUniformNames()],uniformBuffers:i?[s]:[],samplerNames:["transmittanceLut"],defines:o,useShaderStore:!0,shaderLanguage:r?1:0,extraInitializations:(c,l)=>{l.push(...r?[Promise.resolve().then(function(){return pe}),Promise.resolve().then(function(){return cn})]:[Promise.resolve().then(function(){return fe}),Promise.resolve().then(function(){return hn})])}})},$e=(n,e,t,i)=>{const r=t.getEngine().getCaps(),s=r.textureHalfFloatRender?a.Constants.TEXTURETYPE_HALF_FLOAT:r.textureFloatRender?a.Constants.TEXTURETYPE_FLOAT:a.Constants.TEXTURETYPE_UNSIGNED_BYTE,o=Object.assign({generateMipMaps:!1,generateDepthBuffer:!1,generateStencilBuffer:!1,gammaSpace:!1,samplingMode:a.Constants.TEXTURE_BILINEAR_SAMPLINGMODE,type:s,format:a.Constants.TEXTUREFORMAT_RGBA},i),c=new a.RenderTargetTexture(n,e,t,o);return c.wrapU=a.Constants.TEXTURE_CLAMP_ADDRESSMODE,c.wrapV=a.Constants.TEXTURE_CLAMP_ADDRESSMODE,c.anisotropicFilteringLevel=1,c.skipInitialClear=!0,c},Ae=(n,e,t,i,r,s=0,o=a.Constants.ALPHA_DISABLE,c=!0,l,u=a.Constants.LEQUAL,h=!0)=>{if(i!==null&&!i.isReady()||!(t!=null&&t.isReady()))return;e.saveStates();const d=n.getDepthWrite();l!==void 0&&n.setDepthWrite(l);const m=n.getDepthFunction();n.setDepthFunction(u);const p=n.getAlphaMode();n.setAlphaMode(o,!0);const f=n.depthCullingState.cull;e.setViewport(),e.applyEffectWrapper(t,c),n.depthCullingState.cull=!1;const _=t.effect;_.setFloat("depth",s),r(e,i==null?void 0:i.renderTarget,_,n),n.depthCullingState.cull=f,n.setAlphaMode(p,!0),d!==void 0&&n.setDepthWrite(d),m&&n.setDepthFunction(m),e.restoreStates(),h&&n.restoreDefaultFramebuffer()},ti=(n,e,t,i,r)=>{const s=e.useUbo,o=n.isWebGPU&&!a.EffectWrapper.ForceGLSL,c=o?"atmosphere":e.name,l=["POSITION_VEC2","COMPUTE_WORLD_RAY"];t&&l.push("USE_SKY_VIEW_LUT"),i||l.push("OUTPUT_TO_SRGB"),r&&l.push("APPLY_TRANSMITTANCE_BLENDING");const u=t?["skyViewLut"]:["transmittanceLut","multiScatteringLut"];return Ee(n,"atmo-skyCompositor","compositeSky",["depth",...s?[]:e.getUniformNames()],u,s?[c]:[],l,o,(h,d)=>{d.push(...o?[Promise.resolve().then(function(){return pe}),Promise.resolve().then(function(){return mn})]:[Promise.resolve().then(function(){return fe}),Promise.resolve().then(function(){return fn})])})},ii=(n,e,t,i,r,s,o,c)=>{const l=e.useUbo,u=n.isWebGPU&&!a.EffectWrapper.ForceGLSL,h=u?"atmosphere":e.name,d=["POSITION_VEC2","COMPUTE_WORLD_RAY"];t&&d.push("USE_AERIAL_PERSPECTIVE_LUT"),i&&d.push("USE_SKY_VIEW_LUT"),o!==1&&d.push("APPLY_AERIAL_PERSPECTIVE_INTENSITY"),r||d.push("OUTPUT_TO_SRGB"),s&&d.push("APPLY_TRANSMITTANCE_BLENDING"),c!==0&&d.push("APPLY_AERIAL_PERSPECTIVE_RADIANCE_BIAS");const m=["transmittanceLut","multiScatteringLut","depthTexture"];return i&&m.push("skyViewLut"),t&&m.push("aerialPerspectiveLut"),Ee(n,"atmo-aerialPerspectiveCompositor","compositeAerialPerspective",["depth",...l?[]:e.getUniformNames()],m,l?[h]:[],d,u,(p,f)=>{f.push(...u?[Promise.resolve().then(function(){return pe}),Promise.resolve().then(function(){return Tn})]:[Promise.resolve().then(function(){return fe}),Promise.resolve().then(function(){return Ln})])})},ri=(n,e,t,i,r,s,o,c)=>{const l=e.useUbo,u=n.isWebGPU&&!a.EffectWrapper.ForceGLSL,h=u?"atmosphere":e.name,d=["POSITION_VEC2","COMPUTE_WORLD_RAY"];t&&d.push("USE_SKY_VIEW_LUT"),s!==1&&d.push("APPLY_AERIAL_PERSPECTIVE_INTENSITY"),i||d.push("OUTPUT_TO_SRGB"),c&&d.push("HAS_DEPTH_TEXTURE"),r&&d.push("APPLY_TRANSMITTANCE_BLENDING"),o!==0&&d.push("APPLY_AERIAL_PERSPECTIVE_RADIANCE_BIAS");const m=["transmittanceLut","multiScatteringLut"];return t&&m.push("skyViewLut"),c&&m.push("depthTexture"),Ee(n,"atmo-globeAtmosphereCompositor","compositeGlobeAtmosphere",["depth",...l?[]:e.getUniformNames()],m,l?[h]:[],d,u,(p,f)=>{f.push(...u?[Promise.resolve().then(function(){return pe}),Promise.resolve().then(function(){return En})]:[Promise.resolve().then(function(){return fe}),Promise.resolve().then(function(){return xn})])})},oe=100,Ye=n=>(e,t)=>{const i=e.getMesh(),r=t.getMesh(),s=i.isHtmlMesh,o=r.isHtmlMesh;return s?o&&i.absolutePosition.z<=r.absolutePosition.z?1:-1:o?1:n(e,t)};class ke{constructor(e,{parentContainerId:t=null,_containerId:i="css-container",enableOverlayRender:r=!0,defaultOpaqueRenderOrder:s=a.RenderingGroup.PainterSortCompare,defaultAlphaTestRenderOrder:o=a.RenderingGroup.PainterSortCompare,defaultTransparentRenderOrder:c=a.RenderingGroup.defaultTransparentSortCompare}={}){this._cache={cameraData:{fov:0,position:new a.Vector3,style:""},htmlMeshData:new WeakMap},this._width=0,this._height=0,this._heightHalf=0,this._temp={scaleTransform:new a.Vector3,rotationTransform:new a.Quaternion,positionTransform:new a.Vector3,objectMatrix:a.Matrix.Identity(),cameraWorldMatrix:a.Matrix.Identity(),cameraRotationMatrix:a.Matrix.Identity(),cameraWorldMatrixAsArray:new Array(16)},this._lastDevicePixelRatio=window.devicePixelRatio,this._cameraMatrixUpdated=!0,this._previousCanvasDocumentPosition={top:0,left:0},this._renderObserver=null,this._onCameraMatrixChanged=l=>{this._cameraWorldMatrix=l.getWorldMatrix(),this._cameraMatrixUpdated=!0},typeof document<"u"&&(this._containerId=i,this._init(e,t,r,s,o,c))}dispose(){var e,t;this._renderObserver&&(this._renderObserver.remove(),this._renderObserver=null),(e=this._overlayElements)===null||e===void 0||e.container.remove(),this._overlayElements=null,(t=this._inSceneElements)===null||t===void 0||t.container.remove(),this._inSceneElements=null}_init(e,t,i,r,s,o){var c;if(typeof document>"u")return;let l=t?document.getElementById(t):document.body;l||(l=document.body);const u=`${this._containerId}_in_scene`;if(this._inSceneElements=this._createRenderLayerElements(u),l.insertBefore(this._inSceneElements.container,l.firstChild),i){const g=`${this._containerId}_overlay`;this._overlayElements=this._createRenderLayerElements(g);const L=+((c=e.getEngine().getRenderingCanvas().style.zIndex)!==null&&c!==void 0?c:"0")+1;this._overlayElements.container.style.zIndex=`${L}`,this._overlayElements.container.style.pointerEvents="none",l.insertBefore(this._overlayElements.container,l.firstChild)}this._engine=e.getEngine();const h=this._engine.getRenderingCanvasClientRect();if(!h)throw new Error("Failed to get client rect for rendering canvas");let d,m;this._setSize(h.width,h.height),this._engine.onResizeObservable.add(()=>{const g=this._engine.getRenderingCanvasClientRect();g&&this._setSize(g.width,g.height)});const p=()=>{const g=e.activeCamera;g&&(d=g.onProjectionMatrixChangedObservable.add(()=>{this._onCameraMatrixChanged(g)}),m=g.onViewMatrixChangedObservable.add(()=>{this._onCameraMatrixChanged(g)}))};p(),e.onActiveCameraChanged.add(()=>{var g,L;d&&((g=e.activeCamera)===null||g===void 0||g.onProjectionMatrixChangedObservable.remove(d)),m&&((L=e.activeCamera)===null||L===void 0||L.onViewMatrixChangedObservable.remove(m)),p()});const f=Ye(r),_=Ye(s),S=Ye(o);e.setRenderingOrder(0,f,_,S),this._renderObserver=e.onBeforeRenderObservable.add(()=>{this._render(e,e.activeCamera)})}_createRenderLayerElements(e){const t=document.getElementById(e);t&&t.remove();const i=document.createElement("div");i.id=e,i.style.position="absolute",i.style.width="100%",i.style.height="100%",i.style.zIndex="-1";const r=document.createElement("div");r.style.overflow="hidden";const s=document.createElement("div");return s.style.webkitTransformStyle="preserve-3d",s.style.transformStyle="preserve-3d",s.style.pointerEvents="none",r.appendChild(s),i.appendChild(r),{container:i,domElement:r,cameraElement:s}}_getSize(){return{width:this._width,height:this._height}}_setSize(e,t){if(this._width=e,this._height=t,this._heightHalf=this._height/2,!this._inSceneElements||!this._overlayElements)return;const i=[this._inSceneElements.domElement,this._overlayElements.domElement,this._inSceneElements.cameraElement,this._overlayElements.cameraElement];for(const r of i)r&&(r.style.width=`${e}px`,r.style.height=`${t}px`)}_getCameraCssMatrix(e){const t=e.m;return`matrix3d(${this._epsilon(t[0])},${this._epsilon(-t[1])},${this._epsilon(t[2])},${this._epsilon(t[3])},${this._epsilon(t[4])},${this._epsilon(-t[5])},${this._epsilon(t[6])},${this._epsilon(t[7])},${this._epsilon(t[8])},${this._epsilon(-t[9])},${this._epsilon(t[10])},${this._epsilon(t[11])},${this._epsilon(t[12])},${this._epsilon(-t[13])},${this._epsilon(t[14])},${this._epsilon(t[15])})`}_getHtmlContentCssMatrix(e,t){const i=e.m,r=t?-1:1;return`matrix3d(${this._epsilon(i[0])},${this._epsilon(i[1])},${this._epsilon(i[2]*-r)},${this._epsilon(i[3])},${this._epsilon(-i[4])},${this._epsilon(-i[5])},${this._epsilon(i[6]*r)},${this._epsilon(-i[7])},${this._epsilon(i[8]*-r)},${this._epsilon(i[9]*-r)},${this._epsilon(i[10])},${this._epsilon(i[11]*r)},${this._epsilon(i[12]*r)},${this._epsilon(i[13]*r)},${this._epsilon(i[14]*r)},${this._epsilon(i[15])})`}_getTransformationMatrix(e,t){var i;if(this._cameraWorldMatrix||(this._cameraWorldMatrix=(i=e.getScene().activeCamera)===null||i===void 0?void 0:i.getWorldMatrix()),!this._cameraWorldMatrix)return a.Matrix.Identity();const r=e.getWorldMatrix();let s=1,o=1;e.sourceWidth&&e.sourceHeight&&(s=e.width/(e.sourceWidth/oe),o=e.height/(e.sourceHeight/oe));const c=this._temp.scaleTransform,l=this._temp.rotationTransform,u=this._temp.positionTransform,h=this._temp.objectMatrix;r.decompose(c,l,u),c.x*=s,c.y*=o,a.Matrix.ComposeToRef(c,l,u,h);const d=t?-1:1,m=e.getAbsolutePosition();return h.setRowFromFloats(3,(-this._cameraWorldMatrix.m[12]+m.x)*oe*d,(-this._cameraWorldMatrix.m[13]+m.y)*oe*d,(this._cameraWorldMatrix.m[14]-m.z)*oe,this._cameraWorldMatrix.m[15]*ke.PROJECTION_SCALE_FACTOR*oe),h.multiplyAtIndex(3,oe),h.multiplyAtIndex(7,oe),h.multiplyAtIndex(11,oe),h}_renderHtmlMesh(e,t){var i,r;if(!e.element||!e.element.firstElementChild)return;let s=this._cache.htmlMeshData.get(e);s||(s={style:""},this._cache.htmlMeshData.set(e,s));const o=e._isCanvasOverlay?(i=this._overlayElements)===null||i===void 0?void 0:i.cameraElement:(r=this._inSceneElements)===null||r===void 0?void 0:r.cameraElement;e.element.parentNode!==o&&o.appendChild(e.element),e.requiresUpdate&&this._updateBaseScaleFactor(e);const c=this._getTransformationMatrix(e,t);let l=`translate(-50%, -50%) ${this._getHtmlContentCssMatrix(c,t)}`;l+=t?`matrix3d(${e.billboardMode!==a.TransformNode.BILLBOARDMODE_NONE?1:-1}, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)`:"",s.style!==l&&(e.element.style.webkitTransform=l,e.element.style.transform=l),e._markAsUpdated()}_render(e,t){var i,r,s,o;let c=!1;const l=e.useRightHandedSystem;this._updateContainerPositionIfNeeded(),this._cameraMatrixUpdated&&(this._cameraMatrixUpdated=!1,c=!0),t.position.x===this._cache.cameraData.position.x&&t.position.y===this._cache.cameraData.position.y&&t.position.z===this._cache.cameraData.position.z||(this._cache.cameraData.position.copyFrom(t.position),c=!0),window.devicePixelRatio!==this._lastDevicePixelRatio&&(this._lastDevicePixelRatio=window.devicePixelRatio,a.Logger.Log("In render - dpr changed: ",this._lastDevicePixelRatio),c=!0);const u=e.meshes.filter(S=>S.isHtmlMesh&&(c||S.requiresUpdate));if(c=c||u.length>0,!c)return;const h=t.getProjectionMatrix().m[5]*this._heightHalf;if(this._cache.cameraData.fov!==h){const S=[(i=this._overlayElements)===null||i===void 0?void 0:i.domElement,(r=this._inSceneElements)===null||r===void 0?void 0:r.domElement];if(t.mode==a.Camera.PERSPECTIVE_CAMERA)for(const g of S)g&&(g.style.webkitPerspective=h+"px",g.style.perspective=h+"px");else for(const g of S)g&&(g.style.webkitPerspective="",g.style.perspective="");this._cache.cameraData.fov=h}t.parent===null&&t.computeWorldMatrix();const d=this._temp.cameraWorldMatrix;d.copyFrom(t.getWorldMatrix());const m=this._temp.cameraRotationMatrix;d.getRotationMatrix().transposeToRef(m);const p=this._temp.cameraWorldMatrixAsArray;d.copyToArray(p);const f=l?1:-1;p[1]=m.m[1],p[2]=m.m[2]*f,p[4]=m.m[4]*f,p[6]=m.m[6]*f,p[8]=m.m[8]*f,p[9]=m.m[9]*f,a.Matrix.FromArrayToRef(p,0,d);const _=this._getCameraCssMatrix(d);if(this._cache.cameraData.style!==_){const S=[(s=this._inSceneElements)===null||s===void 0?void 0:s.cameraElement,(o=this._overlayElements)===null||o===void 0?void 0:o.cameraElement];for(const g of S)g&&(g.style.webkitTransform=_,g.style.transform=_);this._cache.cameraData.style=_}for(const S of u)this._renderHtmlMesh(S,l)}_updateBaseScaleFactor(e){let t=this._width,i=this._height;const r=(e.width||1)/(e.height||1);r>t/i?t=i*r:i=t/r,e.setContentSizePx(t,i)}_updateContainerPositionIfNeeded(){var e,t;const i=this._engine.getRenderingCanvasClientRect();if(!i)return void a.Logger.Warn("Failed to update html mesh renderer position due to failure to get canvas rect.  HtmlMesh instances may not render correctly");const r=window.scrollY,s=window.scrollX,o=i.top+r,c=i.left+s;if(this._previousCanvasDocumentPosition.top!==o||this._previousCanvasDocumentPosition.left!==c){this._previousCanvasDocumentPosition.top=o,this._previousCanvasDocumentPosition.left=c;const l=[(e=this._inSceneElements)===null||e===void 0?void 0:e.container,(t=this._overlayElements)===null||t===void 0?void 0:t.container];for(const u of l){if(!u)continue;const h=u.offsetParent,d=h.getBoundingClientRect(),m=d.top+r,p=d.left+s,f=this._getAncestorMarginsAndPadding(h),_=window.getComputedStyle(document.body),S=parseInt(_.marginTop,10),g=parseInt(_.marginLeft,10);u.style.top=`${o-m-f.marginTop+f.paddingTop+S}px`,u.style.left=`${c-p-f.marginLeft+f.paddingLeft+g}px`}}}_epsilon(e){return Math.abs(e)<1e-10?0:e}_getAncestorMarginsAndPadding(e){let t=0,i=0,r=0,s=0;for(;e&&e!==document.body&&e!==document.documentElement;){const o=window.getComputedStyle(e);t+=parseInt(o.marginTop,10),i+=parseInt(o.marginLeft,10),r+=parseInt(o.paddingTop,10),s+=parseInt(o.paddingLeft,10),e=e.offsetParent}return{marginTop:t,marginLeft:i,paddingTop:r,paddingLeft:s}}}ke.PROJECTION_SCALE_FACTOR=1e-5;let _e=[];const Re=new Map;let xe=[],H=null;const ni=n=>{le(`In pointerEventsCapture.requestRelease - Pointer events release requested for ${n}`),n&&n!==H?Ir(n)?Re.delete(n):(le(`In pointerEventsCapture.requestRelease - Received release request ${n} but no matching capture request was received`),xe.includes(n)||xe.push(n)):ai()},Ir=n=>{let e=!1;return _e=_e.filter(t=>t!==n||(e=!0,le(`In pointerEventsCapture.cancelRequest - Canceling pointer events capture request ${n}`),!1)),e},ai=()=>{const n=Or();le(`In pointerEventsCapture.transferPointerEventsOwnership - Transferrring pointer events from ${H} to ${n}`),wr(),n&&br(n)},wr=()=>{var n;le(`In pointerEventsCapture.doRelease - Releasing pointer events from ${H}`),H&&((n=Re.get(H))===null||n===void 0||n.release(),Re.delete(H),H=null)},br=n=>{var e;n&&((e=Re.get(n))===null||e===void 0||e.capture()),H=n,le(`In pointerEventsCapture.doCapture - Pointer events now captured by ${n}`)},Or=()=>_e.length>0?_e.shift():null,le=n=>{(typeof window>"u"||window["pointer-events-capture-debug"])&&a.Tools.Log(`${performance.now()} - game.scene.pointerEvents - ${n}
currentOwner: ${H}
queue: ${_e}
unmatched: ${xe}`)};let ce=null,Ce=0;const Ge=new WeakMap,si=n=>{typeof document<"u"&&(Ce===0&&(document.addEventListener("pointermove",ze),document.addEventListener("touchstart",ze),ce=ce??n,a.Logger.Log("PointerEventsCaptureBehavior: Starting observation of pointer move events."),ce.onDisposeObservable.add(oi)),Ce++)},oi=()=>{document.removeEventListener("pointermove",ze),document.removeEventListener("touchstart",ze),ce=null,a.Logger.Log("PointerEventsCaptureBehavior: Stopping observation of pointer move events."),Ce=0},li=()=>{typeof document<"u"&&ce&&(Ce--,Ce<=0&&oi())},ze=n=>{if(!ce)return;const e=ce.getEngine().getRenderingCanvasClientRect();if(!e)return;const{clientX:t,clientY:i}="touches"in n?n.touches[0]:n,r=t-e.left,s=i-e.top;let o;const c=ce.pick(r,s,h=>{const d=Ge.get(h);return h.isEnabled()&&d!==void 0&&d._captureOnPointerEnter});let l;l=c.hit?c.pickedMesh:null;const u=parseInt(H||"");l&&l.uniqueId===u||(!u||l&&l.uniqueId===u||ni(H),l&&(o=Ge.get(l),o.capturePointerEvents()))};class ci{get attachedMesh(){return this._attachedMesh}set attachedMesh(e){this._attachedMesh=e}get attachedNode(){return this._attachedMesh}constructor(e,t,{captureOnPointerEnter:i=!0}={}){this._captureCallback=e,this._releaseCallback=t,this.name="PointerEventsCaptureBehavior",this._attachedMesh=null,this._captureOnPointerEnter=i,typeof document>"u"&&a.Logger.Warn("Creating an instance of PointerEventsCaptureBehavior outside of a browser.  The behavior will not work.")}set captureOnPointerEnter(e){this._captureOnPointerEnter!==e&&(this._captureOnPointerEnter=e,this._attachedMesh&&(this._captureOnPointerEnter?si(this._attachedMesh.getScene()):li()))}init(){}attach(e){this.attachedMesh=e,Ge.set(e,this),this._captureOnPointerEnter&&si(e.getScene())}detach(){this.attachedMesh&&(Ge.delete(this.attachedMesh),this._captureOnPointerEnter&&li(),this.attachedMesh=null)}dispose(){this.detach()}releasePointerEvents(){this.attachedMesh&&ni(this.attachedMesh.uniqueId.toString())}capturePointerEvents(){var e,t,i;this.attachedMesh&&(e=this.attachedMesh.uniqueId.toString(),t=this._captureCallback,i=this._releaseCallback,le(`In pointerEventsCapture.requestCapture - Pointer events capture requested for ${e}`),(r=>{let s=!1;return xe=xe.filter(o=>o!==r||(s=!0,!1)),s})(e)?le(`In pointerEventsCapture.requestCapture - Capture request matched previous release request ${e}.  Cancelling capture request`):(e!==H&&((r,s,o)=>{le(`In pointerEventsCapture.enqueueCaptureRequest - Enqueueing capture request for  ${r}`),_e.includes(r)||(_e.push(r),Re.set(r,{capture:s,release:o}))})(e,t,i),H||ai()))}}const je={CONTAIN:{wrapElement(n){const e=document.createElement("div");e.style.display="flex",e.style.justifyContent="center",e.style.alignItems="center";const t=document.createElement("div");return t.style.visibility="hidden",t.appendChild(n),e.appendChild(t),e},updateSize(n,e,t){const i=n.firstElementChild;n.style.width=`${e}px`,n.style.height=`${t}px`;const[r,s]=[i.offsetWidth,i.offsetHeight],o=Math.min(e/r,t/s);i.style.transform=`scale(${o})`,i.style.visibility="visible"}},COVER:{wrapElement(n){const e=document.createElement("div");e.style.display="flex",e.style.justifyContent="center",e.style.alignItems="center",e.style.overflow="hidden";const t=document.createElement("div");return t.style.visibility="hidden",t.appendChild(n),e.appendChild(t),e},updateSize(n,e,t){const i=n.firstElementChild;n.style.width=`${e}px`,n.style.height=`${t}px`;const[r,s]=[i.offsetWidth,i.offsetHeight],o=Math.max(e/r,t/s);i.style.transform=`scale(${o})`,i.style.visibility="visible"}},STRETCH:{wrapElement(n){const e=document.createElement("div");e.style.display="flex",e.style.justifyContent="center",e.style.alignItems="center";const t=document.createElement("div");return t.style.visibility="hidden",t.appendChild(n),e.appendChild(t),e},updateSize(n,e,t){const i=n.firstElementChild;n.style.width=`${e}px`,n.style.height=`${t}px`;const[r,s]=[i.offsetWidth,i.offsetHeight];i.style.transform=`scale(${e/r}, ${t/s})`,i.style.visibility="visible"}},NONE:{wrapElement:n=>n,updateSize(n,e,t){n&&(n.style.width=`${e}px`,n.style.height=`${t}px`)}}};class Dr extends a.Mesh{get isHtmlMesh(){return!0}get sourceWidth(){return this._sourceWidth}get sourceHeight(){return this._sourceHeight}constructor(e,t,{captureOnPointerEnter:i=!0,isCanvasOverlay:r=!1,fitStrategy:s=je.NONE}={}){super(t,e),this._enabled=!1,this._ready=!1,this._isCanvasOverlay=!1,this._requiresUpdate=!0,this._inverseScaleMatrix=null,this._captureOnPointerEnter=!0,this._pointerEventCaptureBehavior=null,this._sourceWidth=null,this._sourceHeight=null,this._fitStrategy=je.NONE,typeof document<"u"?(this._fitStrategy=s,this._isCanvasOverlay=r,this._createMask(),this._element=this._createElement(),this.setEnabled(!0),this._captureOnPointerEnter=i,this._pointerEventCaptureBehavior=new ci(this.capturePointerEvents.bind(this),this.releasePointerEvents.bind(this),{captureOnPointerEnter:this._captureOnPointerEnter}),this.addBehavior(this._pointerEventCaptureBehavior)):a.Logger.Warn(`Creating an instance of an HtmlMesh with id ${t} outside of a browser.  The mesh will not be visible.`)}get width(){return this._width}get height(){return this._height}get element(){return this._element}get requiresUpdate(){return this._requiresUpdate}set captureOnPointerEnter(e){this._captureOnPointerEnter=e,this._pointerEventCaptureBehavior&&(this._pointerEventCaptureBehavior.captureOnPointerEnter=e)}dispose(){var e;super.dispose(),(e=this._element)===null||e===void 0||e.remove(),this._element=void 0,this._pointerEventCaptureBehavior&&(this._pointerEventCaptureBehavior.dispose(),this._pointerEventCaptureBehavior=null)}_markAsUpdated(){this._requiresUpdate=!1}setContent(e,t,i){this._setAsReady(!1),this._sourceWidth=null,this._sourceHeight=null,this._element&&(this._width=t,this._height=i,this._requiresUpdate=!0,this.scaling.setAll(1),e&&(this._element.appendChild(this._fitStrategy.wrapElement(e)),this._updateScaleIfNecessary()),this.sourceWidth&&this.sourceHeight&&this._setAsReady(!0))}setEnabled(e){this._enabled=e,e&&!this._ready||this._doSetEnabled(e)}setContentSizePx(e,t){this._sourceWidth=e,this._sourceHeight=t,this._element&&this._element.firstElementChild&&(this._fitStrategy.updateSize(this._element.firstElementChild,e,t),this._updateScaleIfNecessary(),this.width&&this.height&&this._setAsReady(!0))}_setAsReady(e){this._ready=e,e?this._doSetEnabled(this._enabled):this._doSetEnabled(!1)}_doSetEnabled(e){var t;this._element&&(e&&!this._worldMatrixUpdateObserver?this._worldMatrixUpdateObserver=this.onAfterWorldMatrixUpdateObservable.add(()=>{this._requiresUpdate=!0}):e||((t=this._worldMatrixUpdateObserver)===null||t===void 0||t.remove(),this._worldMatrixUpdateObserver=null),this._element.style.display=e?"":"none",this._setElementzIndex(-1e4*this.position.z),super.setEnabled(e))}_updateScaleIfNecessary(){this.scaling.setAll(1),this._inverseScaleMatrix&&(this.bakeTransformIntoVertices(this._inverseScaleMatrix),this._inverseScaleMatrix=null);const e=this._width||1,t=this._height||1,i=a.Matrix.Scaling(e,t,1);this.bakeTransformIntoVertices(i),this._inverseScaleMatrix=new a.Matrix,i.invertToRef(this._inverseScaleMatrix)}_createMask(){a.CreatePlaneVertexData({width:1,height:1}).applyToMesh(this);const e=this.getScene();this.checkCollisions=!0;const t=new a.StandardMaterial(`${this.id}-mat`,e);this._isCanvasOverlay||(t.backFaceCulling=!1,t.disableColorWrite=!0,t.disableLighting=!0),this.material=t,this.material.freeze()}_setElementzIndex(e){this._element&&(this._element.style.zIndex=`${e}`)}capturePointerEvents(){this._element&&(this._element.style.pointerEvents="auto",document.getElementsByTagName("body")[0].style.pointerEvents="none")}releasePointerEvents(){this._element&&(document.getElementsByTagName("body")[0].style.pointerEvents="auto",this._element.style.pointerEvents="none")}_createElement(){if(typeof document>"u")return;const e=document.createElement("div");return e.id=this.id,e.style.backgroundColor=this._isCanvasOverlay?"transparent":"#000",e.style.zIndex="1",e.style.position="absolute",e.style.pointerEvents="none",e.style.backfaceVisibility="hidden",e}}var ue;(function(n){n[n.SPACE=32]="SPACE",n[n.TOFU=65532]="TOFU"})(ue||(ue={}));const ui={maxWidth:1/0,lineHeight:1,letterSpacing:1,tabSize:4,whiteSpace:"pre-line",textAlign:"center",translate:{x:-.5,y:-.5}};class hi{get lineHeight(){return this.fontAsset._font.common.lineHeight*this.options.lineHeight}constructor(e,t,i){this.text=e,this.fontAsset=t,this.options=Object.assign(Object.assign({},ui),i);const{paragraph:r,lines:s,glyphs:o,width:c,height:l}=this.options.customLayoutEngine?this.options.customLayoutEngine(e,this.options):this._computeMetrics(e);this.paragraph=r,this.lines=s,this.glyphs=o,this.width=c,this.height=l}_computeMetrics(e){const t=this._collapse(e),i=this._breakLines(t).map(l=>l.trim()),r=[];for(const l of i)r.push(...this._wrap(l,r.length));const s=Math.max(...r.map(l=>l.width)),o=this.lineHeight*r.length;(this.options.textAlign!=="left"||this.options.translate)&&r.forEach(l=>{const u=(()=>{switch(this.options.textAlign){case"right":return s-l.width;case"center":return(s-l.width)/2;default:return 0}})(),h=this.options.translate?this.options.translate.x*s:0,d=this.options.translate?this.options.translate.y*o:0;for(const m of l.glyphs)m.x+=u,m.x+=h,m.y+=d});const c=r.flatMap(l=>l.glyphs);return{paragraph:i.join(`
`),lines:r,glyphs:c,width:s,height:o}}_breakLines(e){return e.split(`
`)}_collapse(e){return e.replace(/\t/g," ".repeat(this.options.tabSize)).replace(/ +/g," ")}_wrap(e,t=0){const i=new Array;let r,s=t,o=new Array,c=0,l=0,u=0,h=u;const d=()=>{i.push({text:e.slice(u,h),glyphs:o,start:u,end:h,width:l})};for(;h<e.length;){const m=h,p=e.charCodeAt(m),f=this.fontAsset._getChar(p),_=f.width;c+=r?this.fontAsset._getKerning(r.id,f.id):0;const S=c+_,g=f.xadvance+this.options.letterSpacing,L=c+g,x=L>this.options.maxWidth||S>this.options.maxWidth;x&&(d(),s++,r=void 0,c=0,l=0,u=h,h=u+1,o=[]);const R=c,C=s*this.lineHeight;o.push({char:f,line:s,position:o.length,x:R,y:C}),x?c=g:(r=f,c=L,l=S,h++)}return o.length>0&&d(),i}}class Xe{get parent(){return this._parent}set parent(e){this._parent=e}get transformMatrix(){return this._transformMatrix}set transformMatrix(e){this._transformMatrix=e}get characterCount(){return this._charMatrices.length/16}constructor(e,t=0,i){this._useVAO=!1,this._vertexBuffers={},this._charMatrices=new Array,this._charUvs=new Array,this._isDirty=!0,this._baseLine=0,this._scalingMatrix=new a.ThinMatrix,this._fontScaleMatrix=new a.ThinMatrix,this._offsetMatrix=new a.ThinMatrix,this._translationMatrix=new a.ThinMatrix,this._baseMatrix=new a.ThinMatrix,this._scaledMatrix=new a.ThinMatrix,this._localMatrix=new a.ThinMatrix,this._finalMatrix=new a.ThinMatrix,this._lineMatrix=new a.ThinMatrix,this._parentWorldMatrix=new a.ThinMatrix,this.color={r:1,g:1,b:1,a:1},this.strokeColor={r:1,g:1,b:1,a:1},this.strokeInsetWidth=0,this.strokeOutsetWidth=0,this.thicknessControl=0,this._parent=null,this._transformMatrix=new a.ThinMatrix,this.isBillboard=!1,this.isBillboardScreenProjected=!1,this.ignoreDepthBuffer=!1,this.writeToDepthBuffer=!1,this._engine=e,this._shaderLanguage=t,this._font=i,this._baseLine=i._font.common.lineHeight*i.scale,this._useVAO=e.getCaps().vertexArrayObject&&!e.disableVertexArrayObjects;const r=new Float32Array([0,0,1,0,0,1,1,1]);this._spriteBuffer=new a.Buffer(e,r,!1,2),this._vertexBuffers.offsets=this._spriteBuffer.createVertexBuffer("offsets",0,2),this._resizeBuffers(128)}_resizeBuffers(e){this._vertexArrayObject&&(this._engine.releaseVertexArrayObject(this._vertexArrayObject),this._vertexArrayObject=null),this._worldBuffer&&(this._worldBuffer.dispose(),this._worldBuffer=null),this._uvBuffer&&(this._uvBuffer.dispose(),this._uvBuffer=null),this._worldBuffer=new a.Buffer(this._engine,new Float32Array(16*e),!0,16),this._vertexBuffers.world0=this._worldBuffer.createVertexBuffer("world0",0,4,16,!0),this._vertexBuffers.world1=this._worldBuffer.createVertexBuffer("world1",4,4,16,!0),this._vertexBuffers.world2=this._worldBuffer.createVertexBuffer("world2",8,4,16,!0),this._vertexBuffers.world3=this._worldBuffer.createVertexBuffer("world3",12,4,16,!0),this._uvBuffer=new a.Buffer(this._engine,new Float32Array(4*e),!0,4),this._vertexBuffers.uvs=this._uvBuffer.createVertexBuffer("uvs",0,4,4,!0)}_setShaders(e,t){var i;(i=this._drawWrapperBase)===null||i===void 0||i.dispose(),this._drawWrapperBase=new a.DrawWrapper(this._engine),this._drawWrapperBase.drawContext&&(this._drawWrapperBase.drawContext.useInstancing=!0),this._drawWrapperBase.effect=this._engine.createEffect({vertexSource:e,fragmentSource:t},["offsets","world0","world1","world2","world3","uvs"],["parentWorld","view","projection","uColor","thickness","uStrokeColor","uStrokeInsetWidth","uStrokeOutsetWidth","mode","transform","uDepthWrite"],["fontAtlas"],"",void 0,void 0,void 0,void 0,this._shaderLanguage),this._drawWrapperBase.effect._refCount++}addParagraph(e,t,i){const r=new hi(e,this._font,t),s=this._font.scale,o=this._font._font.common.scaleW,c=this._font._font.common.scaleH,l=r.glyphs.filter(m=>m.char.page>=0);let u=i;if(!u){const m=r.lineHeight*s,p=r.lines.length*m/2;a.TranslationMatrixToRef(0,this._baseLine-p,0,this._lineMatrix),u=this._lineMatrix}a.ScalingMatrixToRef(s,s,1,this._fontScaleMatrix),a.TranslationMatrixToRef(.5,-.5,0,this._offsetMatrix);const h=this._charUvs.length,d=this._charMatrices.length;l.forEach((m,p)=>{this._charUvs[h+4*p+0]=m.char.x/o,this._charUvs[h+4*p+1]=m.char.y/c,this._charUvs[h+4*p+2]=m.char.width/o,this._charUvs[h+4*p+3]=m.char.height/c;const f=m.x+m.char.xoffset,_=1-(m.y+m.char.yoffset);a.ScalingMatrixToRef(m.char.width,m.char.height,1,this._scalingMatrix),a.MultiplyMatricesToRef(this._offsetMatrix,this._scalingMatrix,this._baseMatrix),a.TranslationMatrixToRef(f*s,_*s,0,this._translationMatrix),a.MultiplyMatricesToRef(this._baseMatrix,this._fontScaleMatrix,this._scaledMatrix),a.MultiplyMatricesToRef(this._scaledMatrix,this._translationMatrix,this._localMatrix),a.MultiplyMatricesToRef(this._localMatrix,u,this._finalMatrix),a.CopyMatrixToArray(this._finalMatrix,this._charMatrices,d+16*p)}),this._isDirty=!0,this._baseLine-=r.lineHeight*s*r.lines.length}clearParagraphs(){this._charMatrices.length=0,this._charUvs.length=0,this._baseLine=0,this._isDirty=!0}render(e,t){const i=this._drawWrapperBase,r=i.effect;if(!r.isReady())return;const s=this._engine;s.setState(!1),s.enableEffect(i),this.ignoreDepthBuffer&&s.setDepthBuffer(!1),this._parent?a.CopyMatrixToRef(this._parent.getWorldMatrix(),this._parentWorldMatrix):a.IdentityMatrixToRef(this._parentWorldMatrix),r.setInt("mode",this.isBillboard?this.isBillboardScreenProjected?2:1:0),r.setMatrix("parentWorld",this._parentWorldMatrix),r.setMatrix("view",e),r.setMatrix("projection",t),r.setMatrix("transform",this.transformMatrix),r.setTexture("fontAtlas",this._font.textures[0]),r.setDirectColor4("uColor",this.color),r.setDirectColor4("uStrokeColor",this.strokeColor),r.setFloat("thickness",.9*this.thicknessControl),r.setFloat("uStrokeInsetWidth",this.strokeInsetWidth),r.setFloat("uStrokeOutsetWidth",this.strokeOutsetWidth);const o=this.writeToDepthBuffer&&!this.ignoreDepthBuffer;r.setFloat("uDepthWrite",o?1:0);const c=this._charMatrices.length/16;this._isDirty&&(this._isDirty=!1,this._worldBuffer.getBuffer().capacity/4<16*c&&this._resizeBuffers(c),this._worldBuffer.update(this._charMatrices),this._uvBuffer.update(this._charUvs)),this._useVAO?(this._vertexArrayObject||(this._vertexArrayObject=s.recordVertexArrayObject(this._vertexBuffers,null,r)),s.bindVertexArrayObject(this._vertexArrayObject,null)):s.bindBuffers(this._vertexBuffers,null,r);const l=s,u=o&&l.currentSampleCount>1,h=l.getAlphaToCoverage();u&&l.setAlphaToCoverage(!0),s.setAlphaMode(u?a.Constants.ALPHA_REPLACE_COLOR:a.Constants.ALPHA_COMBINE,o),o&&s.setDepthWrite(!0),s.drawArraysType(a.Constants.MATERIAL_TriangleStripDrawMode,0,4,c),u&&l.setAlphaToCoverage(h),s.unbindInstanceAttributes(),s.setAlphaMode(a.Constants.ALPHA_DISABLE),this.ignoreDepthBuffer&&s.setDepthBuffer(!0)}dispose(){this._worldBuffer&&(this._worldBuffer.dispose(),this._worldBuffer=null),this._uvBuffer&&(this._uvBuffer.dispose(),this._uvBuffer=null),this._spriteBuffer&&(this._spriteBuffer.dispose(),this._spriteBuffer=null),this._vertexArrayObject&&(this._engine.releaseVertexArrayObject(this._vertexArrayObject),this._vertexArrayObject=null)}static CreateTextRendererAsync(e,t){return y(this,void 0,void 0,function*(){if(t.isWebGPU){const{RegisterEnginesWebGPUExtensionsEngineAlphaToCoverage:c}=yield Promise.resolve(BABYLON);c()}else{const{RegisterEnginesExtensionsEngineAlphaToCoverage:c}=yield Promise.resolve(BABYLON);c()}if(!t.getCaps().instancedArrays||!t._features.supportSpriteInstancing)throw new Error("Instanced arrays are required for MSDF text rendering.");let i,r,s=0;t.isWebGPU?(s=1,i=(yield Promise.resolve().then(function(){return Fr})).msdfVertexShaderWGSL.shader,r=(yield Promise.resolve().then(function(){return Vr})).msdfPixelShaderWGSL.shader):(i=(yield Promise.resolve().then(function(){return Nr})).msdfVertexShader.shader,r=(yield Promise.resolve().then(function(){return Ur})).msdfPixelShader.shader);const o=new Xe(t,s,e);return o._setShaders(i,r),o})}}const Qe="msdfVertexShader",di=`#define BILLBOARD 1
#define BILLBOARDSCREENPROJECTED 2
attribute vec2 offsets;attribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;attribute vec4 uvs;uniform mat4 transform;uniform mat4 parentWorld;uniform mat4 view;uniform mat4 projection;uniform vec3 center;uniform int mode;varying vec2 atlasUV;void main(void) {mat4 world=mat4(world0,world1,world2,world3);vec4 worldPos=transform*(world*vec4(offsets.xy-vec2(0.5,0.5),0.,1.0));if (mode>=BILLBOARD) {vec3 viewPos=(view*parentWorld*vec4(0.,0.,0.,1.0)).xyz; 
if (mode==BILLBOARDSCREENPROJECTED) {viewPos.x/=viewPos.z;viewPos.y/=viewPos.z;viewPos.z=1.0;}
gl_Position=projection*vec4(viewPos+worldPos.xyz,1.0); } else {vec3 viewPos=(view*parentWorld*worldPos).xyz; 
gl_Position=projection*vec4(viewPos,1.0); }
atlasUV=vec2(uvs.x+offsets.x*uvs.z,uvs.y+(1.0-offsets.y)*uvs.w);}`;a.ShaderStore.ShadersStore[Qe]||(a.ShaderStore.ShadersStore[Qe]=di);const mi={name:Qe,shader:di};var Nr={__proto__:null,msdfVertexShader:mi};const Ke="msdfPixelShader",pi=`#extension GL_OES_standard_derivatives : enable
precision highp float;uniform sampler2D fontAtlas;uniform vec4 uColor;uniform vec4 uStrokeColor;uniform float uStrokeInsetWidth;uniform float uStrokeOutsetWidth;uniform float thickness;uniform float uDepthWrite;varying vec2 atlasUV;float median(vec3 msdf) {return max(min(msdf.r,msdf.g),min(max(msdf.r,msdf.g),msdf.b));}
void main(void)
{vec3 s=texture2D(fontAtlas,atlasUV).rgb;float sigDist=median(s)-0.5+thickness;float alpha=clamp(sigDist/max(fwidth(sigDist),1e-5)+0.5,0.0,1.0);float sigDistOutset=sigDist+uStrokeOutsetWidth*0.5;float sigDistInset=sigDist-uStrokeInsetWidth*0.5;float outset=clamp(sigDistOutset/max(fwidth(sigDistOutset),1e-5)+0.5,0.0,1.0);float inset=1.0-clamp(sigDistInset/max(fwidth(sigDistInset),1e-5)+0.5,0.0,1.0);float border=outset*inset;if (uDepthWrite>0.5 && max(alpha,border)<=0.0) {discard;}
vec4 filledFragColor=vec4(uColor.rgb,alpha*uColor.a);vec4 strokedFragColor=vec4(uStrokeColor.rgb,border*uStrokeColor.a);gl_FragColor=mix(filledFragColor,strokedFragColor,border);}`;a.ShaderStore.ShadersStore[Ke]||(a.ShaderStore.ShadersStore[Ke]=pi);const fi={name:Ke,shader:pi};var Ur={__proto__:null,msdfPixelShader:fi};const Je="msdfVertexShader",gi=`#define BILLBOARD 1
#define BILLBOARDSCREENPROJECTED 2
attribute offsets: vec2f;attribute world0: vec4f;attribute world1: vec4f;attribute world2: vec4f;attribute world3: vec4f;attribute uvs: vec4f;uniform transform: mat4x4f;uniform parentWorld: mat4x4f;uniform view: mat4x4f;uniform projection: mat4x4f;uniform mode: u32;varying atlasUV: vec2f;@vertex
fn main(input: VertexInputs)->FragmentInputs {let world=mat4x4<f32>(input.world0,input.world1,input.world2,input.world3);let localOffset=vec4<f32>(input.offsets-vec2<f32>(0.5,0.5),0.0,1.0);let worldPos=uniforms.transform*world*localOffset;if (uniforms.mode>=BILLBOARD) { 
var viewPos=(uniforms.view*uniforms.parentWorld*vec4f(0.,0.,0.,1.0)).xyz;if (uniforms.mode==BILLBOARDSCREENPROJECTED) {viewPos=vec3f(viewPos.x/viewPos.z,viewPos.y/viewPos.z,1.0);} 
vertexOutputs.position=uniforms.projection*vec4<f32>(viewPos+worldPos.xyz,1.0);} else { 
let viewPos=(uniforms.view*uniforms.parentWorld*worldPos).xyz;vertexOutputs.position=uniforms.projection*vec4<f32>(viewPos,1.0);}
vertexOutputs.atlasUV=vec2<f32>(
input.uvs.x+input.offsets.x*input.uvs.z,
input.uvs.y+(1.0-input.offsets.y)*input.uvs.w
);}`;a.ShaderStore.ShadersStoreWGSL[Je]||(a.ShaderStore.ShadersStoreWGSL[Je]=gi);const vi={name:Je,shader:gi};var Fr={__proto__:null,msdfVertexShaderWGSL:vi};const et="msdfPixelShader",_i=`var fontAtlas: texture_2d<f32>;var fontAtlasSampler: sampler;uniform uColor: vec4f;uniform thickness: f32;uniform uStrokeColor: vec4f;uniform uStrokeInsetWidth: f32;uniform uStrokeOutsetWidth: f32;uniform uDepthWrite: f32;varying atlasUV: vec2f;fn median(msdf: vec3<f32>)->f32 {let a=min(msdf.r,msdf.g);let b=max(msdf.r,msdf.g);return max(a,min(b,msdf.b));}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let s=textureSample(fontAtlas,fontAtlasSampler,input.atlasUV).rgb;let sigDist=median(s)-0.5+uniforms.thickness;let afwidth=max(length(vec2<f32>(dpdx(sigDist),dpdy(sigDist))),1e-5);let alpha=clamp(sigDist/afwidth+0.5,0.0,1.0);let sigDistOutset=sigDist+uniforms.uStrokeOutsetWidth*0.5;let sigDistInset=sigDist-uniforms.uStrokeInsetWidth*0.5;let afwidthOutset=max(length(vec2<f32>(dpdx(sigDistOutset),dpdy(sigDistOutset))),1e-5);let afwidthInset=max(length(vec2<f32>(dpdx(sigDistInset),dpdy(sigDistInset))),1e-5);let outset=clamp(sigDistOutset/afwidthOutset+0.5,0.0,1.0);let inset=1.0-clamp(sigDistInset/afwidthInset+0.5,0.0,1.0);let border=outset*inset;if (uniforms.uDepthWrite>0.5 && max(alpha,border)<=0.0) {discard;}
let filledFragColor=vec4<f32>(uniforms.uColor.rgb,alpha*uniforms.uColor.a);let strokedFragColor=vec4<f32>(uniforms.uStrokeColor.rgb,border*uniforms.uStrokeColor.a);fragmentOutputs.color=mix(filledFragColor,strokedFragColor,border);}`;a.ShaderStore.ShadersStoreWGSL[et]||(a.ShaderStore.ShadersStoreWGSL[et]=_i);const Si={name:et,shader:_i};var Vr={__proto__:null,msdfPixelShaderWGSL:Si};const yi=["multiTextureCompositeAlphaBlend","multiTextureCompositeAlphaMax","multiTextureCompositeAdd","multiTextureCompositeMultiply","multiTextureCompositeSubtract","multiTextureCompositeScreen"],Ti=["ALPHA_BLEND","ALPHA_MAX","ADD","MULTIPLY","SUBTRACT","SCREEN"];let Ai=!1;function Li(){Ai||(Ai=!0,a.RegisterEnginesExtensionsEngineTexture2DArrayImageSource(),a.RegisterEnginesWebGPUExtensionsEngineTexture2DArrayImageSource())}class tt extends a.BaseTexture{get composite(){return this._compositeInternal}get layerCount(){return this._layerCount}get arrayTexture(){return this._arrayTexture}getInternalTexture(){return this.composite.getInternalTexture()}isReady(){return this.composite.isReady()}_renderComposite(){this.composite.isReady(),this.composite.executeWhenReady(()=>{this._disposed||this.composite.render()})}getSize(){return this.composite.getSize()}getBaseSize(){return this.composite.getBaseSize()}get samplingMode(){return this.composite.samplingMode}updateSamplingMode(e,t=!1){this.composite.updateSamplingMode(e,t)}readPixels(e,t,i,r,s,o,c,l,u){return this.composite.readPixels(e,t,i,r,s,o,c,l,u)}_readPixelsSync(e,t,i,r,s){return this.composite._readPixelsSync(e,t,i,r,s)}get textureFormat(){return this.composite.textureFormat}get textureType(){return this.composite.textureType}constructor(e,t,i,r){var s,o,c,l,u,h,d,m,p,f,_,S,g;super(i),this.onLoadObservable=new a.Observable,this._pollTimer=null,this._pollInFlight=!1,this._disposed=!1,this._mipSuppressCount=0,Li();let L=!1,x=!1;try{const R=i.getEngine();if(!R||!R.isWebGPU&&R.webGLVersion<2)throw new Error("MultiTexture requires WebGL2 (TEXTURE_2D_ARRAY + sampler2DArray) or WebGPU. This context is WebGL1 or unavailable. Create the engine with WebGL2 enabled, e.g. new Engine(canvas, { webglVersion: 2 }).");if(!Number.isInteger(r.width)||r.width<=0||!Number.isInteger(r.height)||r.height<=0)throw new Error("MultiTexture: width and height must be positive integers.");const C=R.getCaps().texture2DArrayMaxLayerCount;if(r.maxLayers!==void 0&&(!Number.isInteger(r.maxLayers)||r.maxLayers<1))throw new Error(`MultiTexture: maxLayers must be a positive integer (got ${r.maxLayers}).`);if(r.maxLayers===void 0&&t.length===0)throw new Error(`MultiTexture: urls is empty; pass options.maxLayers (positive integer, <= device limit ${C}) to define the array depth.`);if(r.maxLayers!==void 0&&r.maxLayers<t.length)throw new Error(`MultiTexture: maxLayers (${r.maxLayers}) must be >= urls.length (${t.length}).`);const O=(s=r.blendMode)!==null&&s!==void 0?s:v.MultiBlendMode.ALPHA_BLEND,w=(o=r.maxLayers)!==null&&o!==void 0?o:t.length;if(w>C)throw new Error(`MultiTexture: array depth ${w} exceeds the device limit texture2DArrayMaxLayerCount (${C}). Pass a smaller maxLayers (or fewer urls) or use a device with a higher limit.`);const B=Math.max(1,Math.round(r.width*((c=r.rttScale)!==null&&c!==void 0?c:1))),Q=Math.max(1,Math.round(r.height*((l=r.rttScale)!==null&&l!==void 0?l:1))),J=(u=r.generateMipMaps)!==null&&u!==void 0&&u,Z=R.isWebGPU?1:0,P={shaderLanguage:Z,extraInitializationsAsync:()=>y(this,void 0,void 0,function*(){Z===1?yield Promise.all([Promise.resolve().then(function(){return bn}),Promise.resolve().then(function(){return On}),Promise.resolve().then(function(){return Dn}),Promise.resolve().then(function(){return Nn}),Promise.resolve().then(function(){return Un}),Promise.resolve().then(function(){return Fn})]):yield Promise.all([Promise.resolve().then(function(){return Vn}),Promise.resolve().then(function(){return kn}),Promise.resolve().then(function(){return Gn}),Promise.resolve().then(function(){return zn}),Promise.resolve().then(function(){return Bn}),Promise.resolve().then(function(){return Wn})])})};this._compositeInternal=new a.ProceduralTexture(e,{width:B,height:Q},yi[O],i,Object.assign(Object.assign({},P),{skipSceneRegistration:!0}),!1,!1,a.Constants.TEXTURETYPE_UNSIGNED_BYTE),L=!0,this.name=e,this.isRenderTarget=!0,this._mtOptions=Object.assign(Object.assign({},r),{maxLayers:w,blendMode:O,generateMipMaps:J,samplingMode:(h=r.samplingMode)!==null&&h!==void 0?h:a.Texture.TRILINEAR_SAMPLINGMODE,premultiplyAlpha:(d=r.premultiplyAlpha)!==null&&d!==void 0&&d,fit:(m=r.fit)!==null&&m!==void 0?m:"resize",rttScale:(p=r.rttScale)!==null&&p!==void 0?p:1,watch:(f=r.watch)!==null&&f!==void 0&&f,pollInterval:(_=r.pollInterval)!==null&&_!==void 0?_:2e3}),this._maxLayers=w,this._deviceMaxLayerCap=C,this._blendMode=O,this._arrayTexture=new a.RawTexture2DArray(null,r.width,r.height,w,a.Constants.TEXTUREFORMAT_RGBA,i,J,!1,(S=r.samplingMode)!==null&&S!==void 0?S:a.Texture.TRILINEAR_SAMPLINGMODE,a.Constants.TEXTURETYPE_UNSIGNED_BYTE),this._arrayTexture.name=`${this.name}_2DArray`,x=!0,this._layers=t.map(T=>this._createLayerEntry(T)),this._layerCount=this._layers.length,this.urls=t.slice(),this.pixels=new Array(this._layerCount).fill(null),this.composite.defines=this._buildDefines(Ti[O]),this.composite.setTexture("uLayers",this._arrayTexture),this.composite.setInt("uLayerCount",this._layerCount);let E=null;if(typeof OffscreenCanvas<"u"?E=new OffscreenCanvas(r.width,r.height):typeof document<"u"&&(E=document.createElement("canvas"),E.width=r.width,E.height=r.height),!E)throw new Error("MultiTexture: no 2D canvas surface available (requires DOM or OffscreenCanvas).");this._canvas=E,this._ctx=(g=E.getContext("2d",{willReadFrequently:!0}))!==null&&g!==void 0?g:null,this._initialize()}catch(R){if(L)try{this._compositeInternal.dispose()}catch{}if(x)try{this._arrayTexture.dispose()}catch{}if(i.textures){const C=i.textures.indexOf(this);C>=0&&(i.textures.splice(C,1),i.onTextureRemovedObservable.notifyObservers(this))}throw R}}get blendMode(){return this._blendMode}set blendMode(e){e!==this._blendMode&&(this._blendMode=e,this.composite.setFragment(yi[e]),this.composite.defines=this._buildDefines(Ti[e]),this._renderComposite())}updateLayerAsync(e,t){return y(this,void 0,void 0,function*(){if(!Number.isInteger(e)||e<0||e>=this._layerCount)throw new RangeError(`MultiTexture: layer index ${e} out of range [0, ${this._layerCount}).`);const i=this._layers[e];i.url=t,i.etag=null,i.lastModified=null,i.warnedLoadFailure=!1,this.urls[e]=t,yield this._loadEntryOrThrow(i)})}addLayerAsync(e){return y(this,void 0,void 0,function*(){const t=this._layerCount;let i;this._suppressArrayMips();try{t>=this._maxLayers&&this._growArray(),i=this._pushLayerEntry(e),this.composite.setInt("uLayerCount",this._layerCount)}catch(r){throw this._generateArrayMips(),this._reportError(r),r}try{yield this._loadEntryOrThrow(i)}finally{this._generateArrayMips()}return t})}insertLayerAsync(e,t){return y(this,void 0,void 0,function*(){if(!Number.isInteger(e)||e<0||e>this._layerCount)throw new RangeError(`MultiTexture: layer index ${e} out of range [0, ${this._layerCount}].`);let i;this._suppressArrayMips();try{this._layerCount+1>this._maxLayers&&this._growArray(),i=this._createLayerEntry(t),this._layers.splice(e,0,i),this.pixels.splice(e,0,null),this.urls.splice(e,0,t),this._layerCount++;for(let r=this._layerCount-1;r>e;r--)this._reuploadSlot(r);this.composite.setInt("uLayerCount",this._layerCount),this._renderComposite()}catch(r){throw this._generateArrayMips(),this._reportError(r),r}try{yield this._loadEntryOrThrow(i)}finally{this._generateArrayMips()}return e})}removeLayerAsync(e){return y(this,void 0,void 0,function*(){if(!Number.isInteger(e)||e<0||e>=this._layerCount)throw new RangeError(`MultiTexture: layer index ${e} out of range [0, ${this._layerCount}).`);const t=this._layers.splice(e,1)[0];this.pixels.splice(e,1),this.urls.splice(e,1),t.bitmap&&t.bitmap.close(),this._layerCount--,this._suppressArrayMips();try{for(let i=e;i<this._layerCount;i++)this._reuploadSlot(i);this._clearLayerSlot(this._arrayTexture,this._layerCount),this.composite.setInt("uLayerCount",this._layerCount),this._renderComposite()}finally{this._generateArrayMips()}})}dispose(){if(!this._disposed){this._disposed=!0,this._pollTimer!==null&&(clearInterval(this._pollTimer),this._pollTimer=null);for(let e=0;e<this._layers.length;e++){const t=this._layers[e];t.bitmap&&(t.bitmap.close(),t.bitmap=null)}for(let e=0;e<this.pixels.length;e++)this.pixels[e]=null;this._layers.length=0,this._canvas=null,this._ctx=null,this._arrayTexture.dispose(),this.composite.dispose(),super.dispose()}}clone(){const e=new tt(this.name,this.urls.slice(),this.getScene(),{width:this._mtOptions.width,height:this._mtOptions.height,maxLayers:this._maxLayers,blendMode:this._blendMode,generateMipMaps:this._mtOptions.generateMipMaps,samplingMode:this._mtOptions.samplingMode,premultiplyAlpha:this._mtOptions.premultiplyAlpha,fit:this._mtOptions.fit,rttScale:this._mtOptions.rttScale,watch:this._mtOptions.watch,pollInterval:this._mtOptions.pollInterval});return e.hasAlpha=this.hasAlpha,e.level=this.level,e.coordinatesMode=this.coordinatesMode,e}serialize(e=!1){throw new Error("MultiTexture: serialize() is not supported. The scene loader has no MultiTexture parser (urls, capacity, blend mode and watch options cannot round-trip). Use clone() for an in-memory copy, or persist your urls/options to rebuild it.")}_buildDefines(e){return"#define MULTITEXTURE_MAXLAYERS "+this._deviceMaxLayerCap+`
#define MULTITEXTURE_WIDTH `+this._mtOptions.width+`
#define MULTITEXTURE_HEIGHT `+this._mtOptions.height+`
#define MULTITEXTURE_BLEND_`+e+(this._mtOptions.premultiplyAlpha?`
#define MULTITEXTURE_PREMULTIPLY`:"")}_bitmapOptions(){const e={premultiplyAlpha:this._mtOptions.premultiplyAlpha?"premultiply":"none"};return this._mtOptions.fit==="resize"&&this._mtOptions.premultiplyAlpha&&(e.resizeWidth=this._mtOptions.width,e.resizeHeight=this._mtOptions.height,e.resizeQuality="high"),e}_reportError(e){var t,i,r;const s=String((t=e==null?void 0:e.message)!==null&&t!==void 0?t:e);a.Logger.Error(s),(r=(i=this._mtOptions).onError)===null||r===void 0||r.call(i,s,e)}_createLayerEntry(e){return{url:e,etag:null,lastModified:null,bitmap:null,loaded:!1,generation:0,warnedLoadFailure:!1}}_loadEntryOrThrow(e){return y(this,void 0,void 0,function*(){try{yield this._loadEntry(e)}catch(t){throw this._reportError(t),t}})}_loadEntryAndReport(e){return y(this,void 0,void 0,function*(){try{yield this._loadEntry(e)}catch(t){this._reportError(t)}})}_warnWatchFailure(e,t){var i,r;if(e.warnedLoadFailure)return;const s=this._layers.indexOf(e);if(s===-1)return;e.warnedLoadFailure=!0;const o=`MultiTexture: watched layer ${s} (${e.url}) ${t}`;a.Logger.Error(o),(r=(i=this._mtOptions).onError)===null||r===void 0||r.call(i,o)}_uploadToLayer(e,t,i){if(this._mtOptions.premultiplyAlpha)return void a.UploadImageToTexture2DArrayLayer(e,i,t,{premultiplyAlpha:!0});const r=this._canvas,s=this._ctx;r&&s&&(i.width!==this._mtOptions.width||i.height!==this._mtOptions.height)?(s.clearRect(0,0,this._mtOptions.width,this._mtOptions.height),s.drawImage(i,0,0,this._mtOptions.width,this._mtOptions.height),a.UploadImageToTexture2DArrayLayer(e,r,t,{premultiplyAlpha:!1})):a.UploadImageToTexture2DArrayLayer(e,i,t,{premultiplyAlpha:!1})}_reuploadSlot(e,t=this._arrayTexture){const i=this._layers[e].bitmap;i!==null?this._uploadToLayer(t,e,i):this._clearLayerSlot(t,e)}_clearLayerSlot(e,t){this._canvas&&this._ctx&&(this._ctx.clearRect(0,0,this._mtOptions.width,this._mtOptions.height),a.UploadImageToTexture2DArrayLayer(e,this._canvas,t,{premultiplyAlpha:!1}))}_loadEntry(e){return y(this,void 0,void 0,function*(){if(this._disposed)return;const t=++e.generation,i=e.url,r=yield fetch(i);if(!r.ok)throw new Error(`MultiTexture: failed to fetch ${i}: ${r.status} ${r.statusText}`);const s=r.headers.get("etag"),o=r.headers.get("last-modified"),c=yield r.blob(),l=yield createImageBitmap(c,this._bitmapOptions());if(this._mtOptions.fit==="strict"){const u=l.width,h=l.height;if(u!==this._mtOptions.width||h!==this._mtOptions.height){l.close();const d=this._layers.indexOf(e);throw new Error(`MultiTexture: layer ${d} (${i}) is ${u}x${h}, expected ${this._mtOptions.width}x${this._mtOptions.height}. Use fit: "resize" to auto-scale.`)}}this._uploadBitmap(e,l,{etag:s,lastModified:o,generation:t})})}_uploadBitmap(e,t,i){if(this._disposed)return void t.close();const r=this._layers.indexOf(e);r!==-1&&e.generation===i.generation?(this._uploadToLayer(this._arrayTexture,r,t),this._canvas&&this._ctx?(this._ctx.clearRect(0,0,this._mtOptions.width,this._mtOptions.height),this._ctx.drawImage(t,0,0,this._mtOptions.width,this._mtOptions.height),this.pixels[r]=this._ctx.getImageData(0,0,this._mtOptions.width,this._mtOptions.height).data.slice()):this.pixels[r]=null,e.bitmap!==null&&e.bitmap.close(),e.bitmap=t,e.loaded=!0,e.etag=i.etag,e.lastModified=i.lastModified,e.warnedLoadFailure=!1,this._renderComposite()):t.close()}_initialize(){return y(this,void 0,void 0,function*(){var e,t;try{if(this._disposed)return;this._suppressArrayMips();const i=this._layers.slice();let r=0;const s=i.length,o=()=>y(this,void 0,void 0,function*(){let l;for(;(l=r++)<s;)yield this._loadEntryAndReport(i[l])}),c=[];for(let l=0;l<4;l++)c.push(o());yield Promise.all(c),this._disposed||(this.onLoadObservable.notifyObservers(this),(t=(e=this._mtOptions).onLoad)===null||t===void 0||t.call(e),this._renderComposite()),this._mtOptions.watch&&this._startPolling()}catch(i){this._reportError(i)}finally{this._generateArrayMips()}})}_pushLayerEntry(e){const t=this._createLayerEntry(e);return this._layers.push(t),this.pixels.push(null),this.urls.push(e),this._layerCount++,t}_growArray(){var e,t,i;const r=this.getScene(),s=2*this._maxLayers;if(s>this._deviceMaxLayerCap)throw new RangeError(`MultiTexture: cannot grow the array from depth ${this._maxLayers} to ${s}: the device limit texture2DArrayMaxLayerCount is ${this._deviceMaxLayerCap}. Remove a layer, or recreate the MultiTexture with a larger options.maxLayers (<= ${this._deviceMaxLayerCap}) to allow more growth headroom.`);const o=new a.RawTexture2DArray(null,this._mtOptions.width,this._mtOptions.height,s,a.Constants.TEXTUREFORMAT_RGBA,r,(e=this._mtOptions.generateMipMaps)!==null&&e!==void 0&&e,!1,(t=this._mtOptions.samplingMode)!==null&&t!==void 0?t:a.Texture.TRILINEAR_SAMPLINGMODE,a.Constants.TEXTURETYPE_UNSIGNED_BYTE),c=o.getInternalTexture();(i=this._mtOptions.generateMipMaps)!==null&&i!==void 0&&i&&c&&(c.generateMipMaps=!1);for(let l=0;l<this._layerCount;l++)this._reuploadSlot(l,o);this._arrayTexture.dispose(),this._arrayTexture=o,this.composite.setTexture("uLayers",o),this._maxLayers=s,this._renderComposite()}_suppressArrayMips(){var e;if((e=this._mtOptions.generateMipMaps)===null||e===void 0||!e||this._disposed)return;const t=this._arrayTexture.getInternalTexture();t&&(t.generateMipMaps=!1),this._mipSuppressCount++}_generateArrayMips(){var e;if(this._mipSuppressCount>0&&this._mipSuppressCount--,this._mipSuppressCount>0||(e=this._mtOptions.generateMipMaps)===null||e===void 0||!e||this._disposed)return;const t=this._arrayTexture.getInternalTexture();t&&(t.generateMipMaps=!0,this.getScene().getEngine().generateMipmaps(t))}_startPolling(){this._pollTimer!==null||this._disposed||(this._pollTimer=setInterval(()=>{this._poll()},this._mtOptions.pollInterval))}_poll(){return y(this,void 0,void 0,function*(){if(this._pollInFlight)return;if(this._pollInFlight=!0,this._disposed)return void(this._pollInFlight=!1);if(typeof document<"u"&&document.visibilityState==="hidden")return void(this._pollInFlight=!1);const e=this._layers.slice();let t=0;const i=e.length,r=()=>y(this,void 0,void 0,function*(){var o;let c;for(;(c=t++)<i;){const l=e[c];try{if(l.etag===null&&l.lastModified===null){try{yield this._loadEntry(l)}catch(m){this._warnWatchFailure(l,`failed to load: ${String((o=m==null?void 0:m.message)!==null&&o!==void 0?o:m)}`)}continue}const u=yield fetch(l.url,{method:"HEAD"});if(u.status===404){this._warnWatchFailure(l,"returned 404.");continue}if(!u.ok)continue;const h=u.headers.get("etag"),d=u.headers.get("last-modified");if(h===null&&d===null)continue;(h!==null&&h!==l.etag||d!==null&&d!==l.lastModified)&&(yield this._loadEntryAndReport(l))}catch{}}}),s=[];for(let o=0;o<4;o++)s.push(r());yield Promise.all(s),this._pollInFlight=!1})}}var j;function ie(){if(!Le)throw new Error("Recast is not initialized. Please call InitRecast first.");return Le}let Le;v.MultiBlendMode=void 0,(j=v.MultiBlendMode||(v.MultiBlendMode={}))[j.ALPHA_BLEND=0]="ALPHA_BLEND",j[j.ALPHA_MAX=1]="ALPHA_MAX",j[j.ADD=2]="ADD",j[j.MULTIPLY=3]="MULTIPLY",j[j.SUBTRACT=4]="SUBTRACT",j[j.SCREEN=5]="SCREEN";let Be=null;function it(n=[],e=0,t=1){return new(ie()).TileCacheMeshProcess((i,r,s)=>{for(let o=0;o<i.polyCount();++o)r.set(o,e),s.set(o,t);n.length>0&&i.setOffMeshConnections(n)})}function Me(n,e){let t=!1;for(;!t;)t=e.update(n).upToDate}function rt(n){return Ei(n)}function nt(n){var e;return Object.assign(Object.assign({},rt(n)),{tileSize:(e=n.tileSize)!==null&&e!==void 0?e:32})}function Pi(n){var e,t;const i=Object.assign(Object.assign({},nt(n)),{expectedLayersPerTile:(e=n.expectedLayersPerTile)!==null&&e!==void 0?e:1,maxObstacles:(t=n.maxObstacles)!==null&&t!==void 0?t:128});return n.tileCacheMeshProcess?i.tileCacheMeshProcess=n.tileCacheMeshProcess:n.offMeshConnections&&(a.Logger.Warn("offMeshConnections are required but no tileCacheMeshProcess is set. Using fallback DefaultTileCacheMeshProcess."),i.tileCacheMeshProcess=it(n.offMeshConnections)),i}function Ei(n){return Object.fromEntries(Object.entries(n).filter(([e,t])=>t!==void 0))}function Ri(n){return Object.fromEntries(Object.entries(n).filter(([e,t])=>t!==void 0))}class kr{get navigationPlugin(){return this._navigationPlugin}get recastCrowd(){return this._recastCrowd}get transforms(){return this._transforms}get agents(){return Object.freeze(this._agents)}get reachRadii(){return Object.freeze(this._reachRadii)}constructor(e,t,i,r){if(this._transforms=[],this._agents=[],this._reachRadii=[],this._agentDestinationArmed=new Array,this._agentDestination=new Array,this._onBeforeAnimationsObserver=null,this.onReachTargetObservable=new a.Observable,this._navigationPlugin=e,!e.navMesh)throw new Error("There is no NavMesh generated.");this._recastCrowd=new(ie()).Crowd(e.navMesh,{maxAgents:t,maxAgentRadius:i}),this._scene=r,this._engine=r.getEngine(),this._onBeforeAnimationsObserver=r.onBeforeAnimationsObservable.add(()=>{this.update(.001*this._engine.getDeltaTime()*e.timeFactor)})}addAgent(e,t,i){const r=Ri(t),s=this._recastCrowd.addAgent({x:e.x,y:e.y,z:e.z},r);return this._transforms.push(i),this._agents.push(s.agentIndex),this._reachRadii.push(t.reachRadius?t.reachRadius:t.radius),this._agentDestinationArmed.push(!1),this._agentDestination.push(new a.Vector3(0,0,0)),s.agentIndex}getAgentPosition(e){var t,i;const r=(i=(t=this._recastCrowd.getAgent(e))===null||t===void 0?void 0:t.position())!==null&&i!==void 0?i:a.Vector3.ZeroReadOnly;return new a.Vector3(r.x,r.y,r.z)}getAgentPositionToRef(e,t){var i,r;const s=(r=(i=this._recastCrowd.getAgent(e))===null||i===void 0?void 0:i.position())!==null&&r!==void 0?r:a.Vector3.ZeroReadOnly;t.set(s.x,s.y,s.z)}getAgentVelocity(e){var t,i;const r=(i=(t=this._recastCrowd.getAgent(e))===null||t===void 0?void 0:t.velocity())!==null&&i!==void 0?i:a.Vector3.ZeroReadOnly;return new a.Vector3(r.x,r.y,r.z)}getAgentVelocityToRef(e,t){var i,r;const s=(r=(i=this._recastCrowd.getAgent(e))===null||i===void 0?void 0:i.velocity())!==null&&r!==void 0?r:a.Vector3.ZeroReadOnly;t.set(s.x,s.y,s.z)}getAgentNextTargetPath(e){var t,i;const r=(i=(t=this._recastCrowd.getAgent(e))===null||t===void 0?void 0:t.nextTargetInPath())!==null&&i!==void 0?i:a.Vector3.ZeroReadOnly;return new a.Vector3(r.x,r.y,r.z)}getAgentNextTargetPathToRef(e,t){var i,r;const s=(r=(i=this._recastCrowd.getAgent(e))===null||i===void 0?void 0:i.nextTargetInPath())!==null&&r!==void 0?r:a.Vector3.ZeroReadOnly;t.set(s.x,s.y,s.z)}getAgentState(e){var t,i;return(i=(t=this._recastCrowd.getAgent(e))===null||t===void 0?void 0:t.state())!==null&&i!==void 0?i:0}overOffmeshConnection(e){var t,i;return(i=(t=this._recastCrowd.getAgent(e))===null||t===void 0?void 0:t.overOffMeshConnection())!==null&&i!==void 0&&i}agentGoto(e,t){var i;(i=this._recastCrowd.getAgent(e))===null||i===void 0||i.requestMoveTarget(t);const r=this._agents.indexOf(e);r>-1&&(this._agentDestinationArmed[r]=!0,this._agentDestination[r].set(t.x,t.y,t.z))}agentTeleport(e,t){var i;(i=this._recastCrowd.getAgent(e))===null||i===void 0||i.teleport(t)}updateAgentParameters(e,t){const i=this._recastCrowd.getAgent(e);if(!i)return;const r=i.parameters();r&&(t.radius!==void 0&&(r.radius=t.radius),t.height!==void 0&&(r.height=t.height),t.maxAcceleration!==void 0&&(r.maxAcceleration=t.maxAcceleration),t.maxSpeed!==void 0&&(r.maxSpeed=t.maxSpeed),t.collisionQueryRange!==void 0&&(r.collisionQueryRange=t.collisionQueryRange),t.pathOptimizationRange!==void 0&&(r.pathOptimizationRange=t.pathOptimizationRange),t.separationWeight!==void 0&&(r.separationWeight=t.separationWeight),i.updateParameters(r))}removeAgent(e){this._recastCrowd.removeAgent(e);const t=this._agents.indexOf(e);t>-1&&(this._agents.splice(t,1),this._transforms.splice(t,1),this._reachRadii.splice(t,1),this._agentDestinationArmed.splice(t,1),this._agentDestination.splice(t,1))}getAgents(){return this._agents}update(e){if(e<=a.Epsilon)return;const t=this._navigationPlugin.getTimeStep(),i=this._navigationPlugin.getMaximumSubStepCount();if(t<=a.Epsilon)this._recastCrowd.update(e);else{let r=Math.floor(e/t);i&&r>i&&(r=i),r<1&&(r=1);const s=e/r;for(let o=0;o<r;o++)this._recastCrowd.update(s)}for(let r=0;r<this._agents.length;r++){const s=this._agents[r],o=this.getAgentPosition(s);if(this._transforms[r].position=o,this._agentDestinationArmed[r]){const c=o.x-this._agentDestination[r].x,l=o.z-this._agentDestination[r].z,u=this._reachRadii[r],h=this._agentDestination[r].y-this._reachRadii[r],d=this._agentDestination[r].y+this._reachRadii[r],m=c*c+l*l;o.y>h&&o.y<d&&m<u*u&&(this._agentDestinationArmed[r]=!1,this.onReachTargetObservable.notifyObservers({agentIndex:s,destination:this._agentDestination[r]}))}}}setDefaultQueryExtent(e){this._navigationPlugin.setDefaultQueryExtent(e)}getDefaultQueryExtent(){const e=this._navigationPlugin.getDefaultQueryExtent();return new a.Vector3(e.x,e.y,e.z)}getDefaultQueryExtentToRef(e){const t=this._navigationPlugin.getDefaultQueryExtent();e.set(t.x,t.y,t.z)}getCorners(e){var t;const i=(t=this._recastCrowd.getAgent(e))===null||t===void 0?void 0:t.corners();if(!i)return[];const r=[];for(let s=0;s<i.length;s++)r.push(new a.Vector3(i[s].x,i[s].y,i[s].z));return r}dispose(){this._recastCrowd.destroy(),this._onBeforeAnimationsObserver&&(this._scene.onBeforeAnimationsObservable.remove(this._onBeforeAnimationsObserver),this._onBeforeAnimationsObserver=null),this.onReachTargetObservable.clear()}}function at(n){const e=[];if(n.success){const t=n.path.length;for(let i=0;i<t;i++){const r=n.path[i];e.push(new a.Vector3(r.x,r.y,r.z))}}else a.Logger.Warn("Unable to convert navigation path point, because navPath generation has failed.");return e}const Gr=new a.Vector3,zr=new a.Vector3;function xi(n,e,t,i,r){return at((function(s,o,c,l,u){var h,d,m,p,f,_;const S=ie(),g=(h=u==null?void 0:u.filter)!==null&&h!==void 0?h:o.defaultFilter,L=(d=u==null?void 0:u.halfExtents)!==null&&d!==void 0?d:o.defaultQueryHalfExtents,x=(m=u==null?void 0:u.maxSmoothPathPoints)!==null&&m!==void 0?m:2048,R=(p=u==null?void 0:u.maxPathPolys)!==null&&p!==void 0?p:256,C=(f=u==null?void 0:u.stepSize)!==null&&f!==void 0?f:.5,O=(_=u==null?void 0:u.slop)!==null&&_!==void 0?_:.01,w=o.findNearestPoly(c,{filter:g,halfExtents:L});if(!w.success)return{success:!1,error:{type:"START_NEAREST_POLY_FAILED",status:w.status},path:[]};const B=o.findNearestPoly(l,{filter:g,halfExtents:L});if(!B.success)return{success:!1,error:{type:"END_NEAREST_POLY_FAILED",status:B.status},path:[]};const Q=w.nearestRef,J=B.nearestRef,Z=o.findPath(Q,J,c,l,{filter:g,maxPathPolys:R});if(!Z.success)return{success:!1,error:{type:"FIND_PATH_FAILED",status:Z.status},path:[]};if(Z.polys.size<=0)return{success:!1,error:{type:"NO_POLYGON_PATH_FOUND"},path:[]};const P=Z.polys.get(Z.polys.size-1);let E=l;if(P!==J){const k=o.closestPointOnPoly(P,l);if(!k.success)return{success:!1,error:{type:"NO_CLOSEST_POINT_ON_LAST_POLYGON_FOUND",status:k.status},path:[]};E=k.closestPoint}const T=new a.Vector3(c.x,c.y,c.z),Pe=new a.Vector3(E.x,E.y,E.z),I=Array.from(Z.polys.getHeapView()),V=[];for(V.push(T.clone());I.length>0&&V.length<x;){const k=Br(o,T,Pe,O,I,S);if(!k.success)break;const gr=k.steerPosFlag&S.Detour.DT_STRAIGHTPATH_END,vr=k.steerPosFlag&S.Detour.DT_STRAIGHTPATH_OFFMESH_CONNECTION,Hn=k.steerPos,$t=Gr.copyFrom(Hn).subtract(T);let We=Math.sqrt($t.dot($t));We=(gr||vr)&&We<C?1:C/We;const qn=zr.copyFrom(T).addInPlace($t.scale(We)),Yt=o.moveAlongSurface(I[0],T,qn,{filter:g,maxVisitedSize:16});if(!Yt.success)break;const Ie=Yt.resultPosition;Wr(I,R,Yt.visited),Hr(I,s,S);const _r=o.getPolyHeight(I[0],Ie);if(_r.success&&(Ie.y=_r.height),T.copyFromFloats(Ie.x,Ie.y,Ie.z),gr&&st(T,k.steerPos,O,1)){T.copyFrom(Pe),V.length<x&&V.push(new a.Vector3(T.x,T.y,T.z));break}if(vr&&st(T,k.steerPos,O,1)){const Zn=k.steerPosRef;let Sr=0,He=I[0],Se=0;for(;Se<I.length&&He!==Zn;)Sr=He,He=I[Se],Se++;for(let ye=Se;ye<I.length;ye++)I[ye-Se]=I[ye];I.splice(Se,I.length-Se);const qe=s.getOffMeshConnectionPolyEndPoints(Sr,He);if(qe.success&&V.length<x){V.push(new a.Vector3(T.x,T.y,T.z)),1&V.length&&V.push(new a.Vector3(T.x,T.y,T.z)),T.copyFromFloats(qe.end.x,qe.end.y,qe.end.z);const ye=o.getPolyHeight(I[0],T);ye.success&&(T.y=ye.height)}}V.length<x&&V.push(new a.Vector3(T.x,T.y,T.z))}return{success:!0,path:V}})(n,e,t,i,r))}function Br(n,e,t,i,r,s){const o=n.findStraightPath(e,t,r,{maxStraightPathPoints:3});if(!o.success)return{success:!1};const c=[];for(let u=0;u<o.straightPathCount;u++){const h=new a.Vector3(o.straightPath.get(3*u),o.straightPath.get(3*u+1),o.straightPath.get(3*u+2));c.push(h)}let l=0;for(;l<c.length&&!(o.straightPathFlags.get(l)&s.Detour.DT_STRAIGHTPATH_OFFMESH_CONNECTION)&&st(c[l],e,i,1e3);)l++;return l>=o.straightPathCount?{success:!1}:{success:!0,steerPos:c[l],steerPosFlag:o.straightPathFlags.get(l),steerPosRef:o.straightPathRefs.get(l),points:c}}function st(n,e,t,i){const r=e.x-n.x,s=e.y-n.y,o=e.z-n.z;return r*r+o*o<t*t&&Math.abs(s)<i}function Wr(n,e,t){let i=-1,r=-1;for(let l=n.length-1;l>=0;l--){let u=!1;for(let h=t.length-1;h>=0;h--)n[l]===t[h]&&(i=l,r=h,u=!0);if(u)break}if(i===-1||r===-1)return n;const s=t.length-r,o=Math.min(i+1,n.length);let c=Math.max(0,n.length-o);s+c>e&&(c=e-s),c&&n.splice(s,c,...n.slice(o,o+c));for(let l=0;l<s;l++)n[l]=t[t.length-(1+l)];return n}function Hr(n,e,t){if(n.length<3)return;let i=0;const r=[],s=e.getTileAndPolyByRef(n[0]);if(!s.success)return;const o=s.poly,c=s.tile;for(let u=o.firstLink();u!==t.Detour.DT_NULL_LINK;u=c.links(u).next()){const h=c.links(u);h.ref()!==0&&i<16&&(r.push(h.ref()),i++)}let l=0;for(let u=Math.min(6,n.length)-1;u>1&&l===0;u--)for(let h=0;h<i;h++)if(n[u]===r[h]){l=u;break}l>1&&n.splice(1,l-1)}function Ci(n,e){let t,i,r,s=0;const o=[],c=[];for(t=0;t<n.length;t++)if(n[t]){const l=n[t],u=e!=null&&e.doNotReverseIndices?l.getIndices(!1,!0):ot(l);if(!u)continue;const h=l.getVerticesData(a.VertexBuffer.PositionKind,!1,!1);if(!h)continue;const d=[],m=l.computeWorldMatrix(!0);if(l.hasThinInstances){const _=l.thinInstanceGetWorldMatrices();for(let S=0;S<_.length;S++){const g=new a.Matrix;_[S].multiplyToRef(m,g),d.push(g)}}else d.push(m);const p=a.Vector3.Zero(),f=a.Vector3.Zero();for(let _=0;_<d.length;_++){const S=d[_];for(i=0;i<u.length;i++)c.push(u[i]+s);for(r=0;r<h.length;r+=3)a.Vector3.FromArrayToRef(h,r,f),a.Vector3.TransformCoordinatesToRef(f,S,p),o.push(p.x,p.y,p.z);s+=h.length/3}}return[Float32Array.from(o),Uint32Array.from(c)]}function ot(n){const e=n instanceof a.Mesh?n.getIndices(!1,!0):n;if(e)for(let t=0;t<e.length;t+=3)[e[t+1],e[t+2]]=[e[t+2],e[t+1]];return e}function Mi(n,e,t,i){const[r,s]=ie().getNavMeshPositionsAndIndices(n,i),o=new a.Mesh("NavMeshDebug",e),c=new a.VertexData;return c.indices=ot(s),c.positions=r,c.applyToMesh(o,!1),t&&(o.parent=t),o}function lt(n,e){var t,i;const r=ie();if(n.length===0)throw new Error("At least one mesh is needed to create the nav mesh.");const[s,o]=Ci(n,{doNotReverseIndices:e.doNotReverseIndices});if(!s||!o)throw new Error("Unable to get nav mesh. No vertices or indices.");const c=(t=e.tileSize)!==null&&t!==void 0?t:0,l=((i=e.maxObstacles)!==null&&i!==void 0?i:0)>0,u=c>0;l&&(c<32||c>64)&&a.Logger.Warn("NavigationPlugin: Tile cache is enabled. Recommended tileSize is 32 to 64. Other values may lead to unexpected behavior.");const h=l?Pi(e):u?nt(e):rt(e),d=l?r.generateTileCache(s,o,h,e.keepIntermediates):u?r.generateTiledNavMesh(s,o,h,e.keepIntermediates):r.generateSoloNavMesh(s,o,h,e.keepIntermediates);if(!d.success)throw new Error(`Unable to generateSoloNavMesh: ${d.error}`);return{navMesh:d.navMesh,intermediates:d.intermediates,navMeshQuery:new r.NavMeshQuery(d.navMesh),tileCache:"tileCache"in d?d.tileCache:void 0}}function ct(n){n.createNavMeshImpl=(e,t)=>lt(e,t),n.createNavMeshAsyncImpl=(e,t)=>y(this,void 0,void 0,function*(){return yield new Promise(i=>{i(lt(e,t))})})}class Ii{get navMeshQuery(){return this._navMeshQuery}get intermediates(){return this._intermediates}get tileCache(){return this._tileCache}constructor(e){this.name="RecastNavigationJSPlugin",this._maximumSubStepCount=10,this._timeStep=1/60,this._timeFactor=1,e||(e=ie(),ct(this)),this.bjsRECAST=e,this.isSupported()?this.setTimeStep():a.Logger.Error("RecastJS is not available. Please make sure you included the js file.")}setTimeStep(e=1/60){this._timeStep=e}getTimeStep(){return this._timeStep}setMaximumSubStepCount(e=10){this._maximumSubStepCount=e}getMaximumSubStepCount(){return this._maximumSubStepCount}set timeFactor(e){this._timeFactor=Math.max(e,0)}get timeFactor(){return this._timeFactor}createNavMesh(e,t){if(!this.createNavMeshImpl)throw new Error("Function not injected yet. Use the factory to create the plugin.");this._preprocessParameters(t);const i=this.createNavMeshImpl(e,t);return this._processNavMeshResult(i)}createNavMeshAsync(e,t){return y(this,void 0,void 0,function*(){if(!this.createNavMeshAsyncImpl)throw new Error("Function not injected yet. Use the factory to create the plugin.");this._preprocessParameters(t);const i=yield this.createNavMeshAsyncImpl(e,t);return this._processNavMeshResult(i)})}createDebugNavMesh(e){if(!this.navMesh)throw new Error("There is no navMesh generated.");return this.navMesh&&this._tileCache&&Me(this.navMesh,this._tileCache),Mi(this.navMesh,e)}getClosestPoint(e,t){const i=this._navMeshQuery.findClosestPoint(e,t);return new a.Vector3(i.point.x,i.point.y,i.point.z)}getClosestPointToRef(e,t,i){const r=this._navMeshQuery.findClosestPoint(e,i);t.set(r.point.x,r.point.y,r.point.z)}getRandomPointAround(e,t,i){const r=this._navMeshQuery.findRandomPointAroundCircle(e,t,i);return new a.Vector3(r.randomPoint.x,r.randomPoint.y,r.randomPoint.z)}getRandomPointAroundToRef(e,t,i,r){const s=this._navMeshQuery.findRandomPointAroundCircle(e,t,r);i.set(s.randomPoint.x,s.randomPoint.y,s.randomPoint.z)}moveAlong(e,t,i=0,r){const s=this._navMeshQuery.moveAlongSurface(i,e,t,r);return new a.Vector3(s.resultPosition.x,s.resultPosition.y,s.resultPosition.z)}moveAlongToRef(e,t,i,r=0,s){const o=this._navMeshQuery.moveAlongSurface(r,e,t,s);i.set(o.resultPosition.x,o.resultPosition.y,o.resultPosition.z)}computePath(e,t,i){return at(this._navMeshQuery.computePath(e,t,i))}computePathSmooth(e,t,i){return this.navMesh?xi(this.navMesh,this._navMeshQuery,e,t,i):(a.Logger.Error("No navmesh available. Cannot compute smooth path."),[])}createCrowd(e,t,i){const r=new kr(this,e,t,i);return this._crowd=r,r}setDefaultQueryExtent(e){this._navMeshQuery.defaultQueryHalfExtents=e}getDefaultQueryExtent(){return new a.Vector3(this._navMeshQuery.defaultQueryHalfExtents.x,this._navMeshQuery.defaultQueryHalfExtents.y,this._navMeshQuery.defaultQueryHalfExtents.z)}getDefaultQueryExtentToRef(e){e.set(this._navMeshQuery.defaultQueryHalfExtents.x,this._navMeshQuery.defaultQueryHalfExtents.y,this._navMeshQuery.defaultQueryHalfExtents.z)}buildFromNavmeshData(e){const t=this.bjsRECAST.importNavMesh(e);this.navMesh=t.navMesh,this._navMeshQuery=new this.bjsRECAST.NavMeshQuery(this.navMesh)}getNavmeshData(){if(!this.navMesh)throw new Error("There is no NavMesh generated.");return this.bjsRECAST.exportNavMesh(this.navMesh)}buildFromTileCacheData(e,t){const i=this.bjsRECAST.importTileCache(e,t??it([]));this.navMesh=i.navMesh,this._tileCache=i.tileCache,this._navMeshQuery=new this.bjsRECAST.NavMeshQuery(this.navMesh)}getTileCacheData(){if(!this.navMesh||!this._tileCache)throw new Error("There is no TileCache generated.");return this.bjsRECAST.exportTileCache(this.navMesh,this._tileCache)}dispose(){var e,t,i,r;(e=this._crowd)===null||e===void 0||e.dispose(),(t=this.navMesh)===null||t===void 0||t.destroy(),(i=this._navMeshQuery)===null||i===void 0||i.destroy(),(r=this._tileCache)===null||r===void 0||r.destroy()}addCylinderObstacle(e,t,i,r=!1){var s,o;const c=(s=this._tileCache)===null||s===void 0?void 0:s.addCylinderObstacle(e,t,i);return c!=null&&c.success?(!r&&this.navMesh&&this._tileCache&&Me(this.navMesh,this._tileCache),(o=c.obstacle)!==null&&o!==void 0?o:null):null}addBoxObstacle(e,t,i,r=!1){var s,o;const c=(s=this._tileCache)===null||s===void 0?void 0:s.addBoxObstacle(e,t,i);return c!=null&&c.success?(!r&&this.navMesh&&this._tileCache&&Me(this.navMesh,this._tileCache),(o=c.obstacle)!==null&&o!==void 0?o:null):null}removeObstacle(e,t=!1){var i;(i=this._tileCache)===null||i===void 0||i.removeObstacle(e),!t&&this.navMesh&&this._tileCache&&Me(this.navMesh,this._tileCache)}isSupported(){return!!this.bjsRECAST}getRandomSeed(){return this.bjsRECAST.getRandomSeed()}setRandomSeed(e){this.bjsRECAST.setRandomSeed(e)}raycast(e,t){var i;const r=this._navMeshQuery.findNearestPoly(e),s=this._navMeshQuery.raycast(r.nearestRef,e,t);if(0<s.t&&s.t<1){a.TmpVectors.Vector3[0].set(e.x,e.y,e.z),a.TmpVectors.Vector3[1].set(t.x,t.y,t.z);const o=a.Vector3.Distance(a.TmpVectors.Vector3[0],a.TmpVectors.Vector3[1])*((i=s==null?void 0:s.t)!==null&&i!==void 0?i:0),c=a.TmpVectors.Vector3[1].subtract(a.TmpVectors.Vector3[0]).normalize();return{hit:!0,hitPoint:a.TmpVectors.Vector3[0].add(c.multiplyByFloats(o,o,o))}}return{hit:!1}}moveAlongWithVelocity(e,t,i){const{point:r,polyRef:s}=this._navMeshQuery.findClosestPoint({x:e.x,y:e.y,z:e.z},i),{resultPosition:o}=this._navMeshQuery.moveAlongSurface(s,r,{x:r.x+t.x,y:r.y+t.y,z:r.z+t.z},i),c=this._navMeshQuery.getPolyHeight(s,o);return{position:{x:o.x,y:c.success?c.height:o.y,z:o.z},polyRef:s,height:c.height}}_processNavMeshResult(e){if(!(e!=null&&e.navMesh)||!(e!=null&&e.navMeshQuery))throw new Error("Unable to create navmesh. No navMesh or navMeshQuery returned.");return this.navMesh=e.navMesh,this._navMeshQuery=e.navMeshQuery,this._intermediates=e.intermediates,this._tileCache=e.tileCache,{navMesh:e.navMesh,navMeshQuery:e.navMeshQuery,intermediates:e.intermediates,tileCache:e.tileCache}}_preprocessParameters(e){var t,i;e.maxObstacles===void 0&&(e.tileSize=(t=e.tileSize)!==null&&t!==void 0?t:32,e.maxObstacles=128),e.walkableSlopeAngle=Math.max(.1,(i=e.walkableSlopeAngle)!==null&&i!==void 0?i:60)}}function qr(n,e){const{x:t,z:i}=n,{x:r,z:s}=e;let o;return o=Math.abs(r-t)>=Math.abs(s-i)?{x:r,z:i}:{x:t,z:s},o}const X={HEIGHTFIELD_SOLID:"heightfield solid",HEIGHTFIELD_WALKABLE:"heightfield walkable",COMPACT_HEIGHTFIELD_SOLID:"compact heightfield solid",COMPACT_HEIGHTFIELD_REGIONS:"compact heightfield regions",COMPACT_HEIGHTFIELD_DISTANCE:"compact heightfield distance",RAW_CONTOURS:"raw contours",CONTOURS:"contours",POLY_MESH:"poly mesh",POLY_MESH_DETAIL:"poly mesh detail",NAVMESH:"navmesh",NAVMESH_BV_TREE:"navmesh bv tree"};class q{get primitiveTypes(){return this._primitiveTypes}set primitiveTypes(e){this._primitiveTypes=e}constructor(e,t){var i,r,s,o;this._scene=e,this.lineMaterials=[],this.getIntermediates=l=>{const u=[],h=[],d=[],m=[],p=[];if(l){if(l.type==="solo")l.heightfield&&u.push(l.heightfield),l.compactHeightfield&&h.push(l.compactHeightfield),l.contourSet&&d.push(l.contourSet),l.polyMesh&&m.push(l.polyMesh),l.polyMeshDetail&&p.push(l.polyMeshDetail);else if(l.type==="tiled")for(const f of l.tileIntermediates)f.heightfield&&u.push(f.heightfield),f.compactHeightfield&&h.push(f.compactHeightfield),f.contourSet&&d.push(f.contourSet),f.polyMesh&&m.push(f.polyMesh),f.polyMeshDetail&&p.push(f.polyMeshDetail);else if(l.type==="tilecache")for(const f of l.tileIntermediates)f.heightfield&&u.push(f.heightfield),f.compactHeightfield&&h.push(f.compactHeightfield)}return{heightfieldList:u,compactHeightfieldList:h,contourSetList:d,polyMeshList:m,polyMeshDetailList:p}},this._debugDrawerUtils=new(ie()).DebugDrawerUtils,this._primitiveTypes=(i=t==null?void 0:t.primitiveTypes)!==null&&i!==void 0?i:["points","lines","tris","quads"],this.debugDrawerParentNode=((r=t==null?void 0:t.parent)===null||r===void 0?void 0:r.node)instanceof a.TransformNode?t.parent.node:new a.TransformNode((o=(s=t==null?void 0:t.parent)===null||s===void 0?void 0:s.node)!==null&&o!==void 0?o:"nav-mesh-debug-parent",this._scene);const c=t==null?void 0:t.materials;c!=null&&c.triMaterial?this.triMaterial=c.triMaterial:(this.triMaterial=new a.StandardMaterial("nav-debug-tris-material"),this.triMaterial.backFaceCulling=!1,this.triMaterial.specularColor=a.Color3.Black(),this.triMaterial.alpha=.5),c!=null&&c.pointMaterial?this.pointMaterial=c.pointMaterial:(this.pointMaterial=new a.StandardMaterial("nav-debug-points-material"),this.pointMaterial.backFaceCulling=!1,this.pointMaterial.specularColor=a.Color3.Black()),c!=null&&c.lineMaterialOptions?this._lineMaterialOptions=c.lineMaterialOptions:this._lineMaterialOptions={greasedLineMaterialOptions:{width:2,sizeAttenuation:!0},greasedLineMeshOptions:{}},this._pointMesh=a.CreateBox(q.NAV_MESH_DEBUG_NAME_POINTS,{size:.02})}clear(){for(const e of this.debugDrawerParentNode.getChildMeshes())e.dispose()}dispose(){this.clear(),this._debugDrawerUtils.dispose(),this._pointMesh.dispose(),this.triMaterial.dispose(),this.pointMaterial.dispose()}drawPrimitives(e,t){var i;let r=null;for(const s of e)if(this._primitiveTypes.includes(s.type))switch(s.type){case"points":this._drawPoints(s);break;case"lines":{const o=this._drawLines(s,r);r||(r=o);break}case"tris":this._drawTris(s);break;case"quads":this._drawQuads(s)}r==null||r.updateLazy(),((i=t==null?void 0:t.joinMeshes)===null||i===void 0||i)&&this._joinDebugMeshes()}drawHeightfieldSolid(e){const t=this._debugDrawerUtils.drawHeightfieldSolid(e);this.drawPrimitives(t)}drawHeightfieldWalkable(e){const t=this._debugDrawerUtils.drawHeightfieldWalkable(e);this.drawPrimitives(t)}drawCompactHeightfieldSolid(e){const t=this._debugDrawerUtils.drawCompactHeightfieldSolid(e);this.drawPrimitives(t)}drawCompactHeightfieldRegions(e){const t=this._debugDrawerUtils.drawCompactHeightfieldRegions(e);this.drawPrimitives(t)}drawCompactHeightfieldDistance(e){const t=this._debugDrawerUtils.drawCompactHeightfieldDistance(e);this.drawPrimitives(t)}drawHeightfieldLayer(e,t){const i=this._debugDrawerUtils.drawHeightfieldLayer(e,t);this.drawPrimitives(i)}drawHeightfieldLayers(e){const t=this._debugDrawerUtils.drawHeightfieldLayers(e);this.drawPrimitives(t)}drawRegionConnections(e,t=1){const i=this._debugDrawerUtils.drawRegionConnections(e,t);this.drawPrimitives(i)}drawRawContours(e,t=1){const i=this._debugDrawerUtils.drawRawContours(e,t);this.drawPrimitives(i)}drawContours(e,t=1){const i=this._debugDrawerUtils.drawContours(e,t);this.drawPrimitives(i)}drawPolyMesh(e){const t=this._debugDrawerUtils.drawPolyMesh(e);this.drawPrimitives(t)}drawPolyMeshDetail(e){const t=this._debugDrawerUtils.drawPolyMeshDetail(e);this.drawPrimitives(t)}drawNavMesh(e,t=0){const i=this._debugDrawerUtils.drawNavMesh(e,t);this.drawPrimitives(i)}drawNavMeshWithClosedList(e,t,i=0){const r=this._debugDrawerUtils.drawNavMeshWithClosedList(e,t,i);this.drawPrimitives(r)}drawNavMeshNodes(e){const t=this._debugDrawerUtils.drawNavMeshNodes(e);this.drawPrimitives(t)}drawNavMeshBVTree(e){const t=this._debugDrawerUtils.drawNavMeshBVTree(e);this.drawPrimitives(t)}drawNavMeshPortals(e){const t=this._debugDrawerUtils.drawNavMeshPortals(e);this.drawPrimitives(t)}drawNavMeshPolysWithFlags(e,t,i){const r=this._debugDrawerUtils.drawNavMeshPolysWithFlags(e,t,i);this.drawPrimitives(r)}drawNavMeshPoly(e,t,i){const r=this._debugDrawerUtils.drawNavMeshPoly(e,t,i);this.drawPrimitives(r)}draw(e,t,i,r){this.clear();const{heightfieldList:s,compactHeightfieldList:o,contourSetList:c,polyMeshList:l,polyMeshDetailList:u}=this.getIntermediates(t);if(r===X.HEIGHTFIELD_SOLID)for(const h of s)this.drawHeightfieldSolid(h);else if(r===X.HEIGHTFIELD_WALKABLE)for(const h of s)this.drawHeightfieldWalkable(h);else if(r===X.COMPACT_HEIGHTFIELD_SOLID)for(const h of o)this.drawCompactHeightfieldSolid(h);else if(r===X.COMPACT_HEIGHTFIELD_REGIONS)for(const h of o)this.drawCompactHeightfieldRegions(h);else if(r===X.COMPACT_HEIGHTFIELD_DISTANCE)for(const h of o)this.drawCompactHeightfieldDistance(h);else if(r===X.RAW_CONTOURS)for(const h of c)this.drawRawContours(h);else if(r===X.CONTOURS)for(const h of c)this.drawContours(h);else if(r===X.POLY_MESH)for(const h of l)this.drawPolyMesh(h);else if(r===X.POLY_MESH_DETAIL)for(const h of u)this.drawPolyMeshDetail(h);else r===X.NAVMESH?this.drawNavMesh(e):r===X.NAVMESH_BV_TREE&&this.drawNavMeshBVTree(e)}_drawPoints(e){if(e.vertices.length===0)return;const t=new Float32Array(16*e.vertices.length),i=new Float32Array(4*e.vertices.length);for(let r=0;r<e.vertices.length;r++){const[s,o,c,l,u,h,d]=e.vertices[r];i[4*r]=l,i[4*r+1]=u,i[4*r+2]=h,i[4*r+3]=d,a.Matrix.Translation(s,o,c).copyToArray(t,16*r)}this._pointMesh.thinInstanceSetBuffer("matrix",t,16),this._pointMesh.thinInstanceSetBuffer("color",i,4),this._pointMesh.parent=this.debugDrawerParentNode}_drawLines(e,t){if(e.vertices.length===0)return null;const i=[],r=[];for(let l=0;l<e.vertices.length;l+=2){const[u,h,d,m,p,f]=e.vertices[l],[_,S,g,L,x,R]=e.vertices[l+1];i.push([u,h,d,_,S,g]),r.push(new a.Color3(m,p,f)),r.push(new a.Color3(L,x,R))}const s=Object.assign(Object.assign({},this._lineMaterialOptions.greasedLineMeshOptions),{points:i,instance:t??void 0}),o=Object.assign(Object.assign({},this._lineMaterialOptions.greasedLineMaterialOptions),{colors:r}),c=a.CreateGreasedLine(q.NAV_MESH_DEBUG_NAME_LINES,s,o);return c.parent=this.debugDrawerParentNode,this.lineMaterials.push(c.material),c}_drawTris(e){if(e.vertices.length===0)return;const t=new Float32Array(3*e.vertices.length),i=new Float32Array(4*e.vertices.length);for(let o=0;o<e.vertices.length;o++){const[c,l,u,h,d,m]=e.vertices[o];t[3*o+0]=c,t[3*o+1]=l,t[3*o+2]=u,i[4*o+0]=h,i[4*o+1]=d,i[4*o+2]=m,i[4*o+3]=1}const r=new a.VertexData;r.positions=t,r.colors=i;const s=new a.Mesh(q.NAV_MESH_DEBUG_NAME_TRIS);s.isUnIndexed=!0,r.applyToMesh(s),s.material=this.triMaterial,s.parent=this.debugDrawerParentNode}_drawQuads(e){if(e.vertices.length===0)return;const t=[],i=[];for(let o=0;o<e.vertices.length;o+=4){const c=[e.vertices[o],e.vertices[o+1],e.vertices[o+2],e.vertices[o],e.vertices[o+2],e.vertices[o+3]];for(const[l,u,h,d,m,p]of c)t.push(l,u,h),i.push(d,m,p,1)}const r=new a.VertexData;r.positions=t,r.colors=i;const s=new a.Mesh(q.NAV_MESH_DEBUG_NAME_QUADS);s.isUnIndexed=!0,r.applyToMesh(s),s.material=this.triMaterial,s.parent=this.debugDrawerParentNode}_joinDebugMeshes(){const e=this._scene.meshes.filter(i=>i.name===q.NAV_MESH_DEBUG_NAME);e.forEach(i=>{this._convertUnindexedToIndexed(i)});const t=a.Mesh.MergeMeshes(e,!0);t&&(t.name=q.NAV_MESH_DEBUG_NAME,t.parent=this.debugDrawerParentNode)}_convertUnindexedToIndexed(e){const t=a.VertexData.ExtractFromMesh(e).positions;if(!t||t.length%9!=0)return void a.Logger.Warn("Mesh must be fully unindexed with triangles.");const i=t.length/3,r=Array.from({length:i},(o,c)=>c),s=new a.VertexData;s.positions=t,s.indices=r,s.applyToMesh(e,!0)}}q.NAV_MESH_DEBUG_NAME="nav-mesh-debug",q.NAV_MESH_DEBUG_NAME_POINTS="nav-mesh-debug-points",q.NAV_MESH_DEBUG_NAME_TRIS="nav-mesh-debug-tris",q.NAV_MESH_DEBUG_NAME_QUADS="nav-mesh-debug-quads",q.NAV_MESH_DEBUG_NAME_LINES="nav-mesh-debug-lines";const ut="atmosphereFunctions",wi=`#include<intersectionFunctions>
const MultiScatteringLutSize=vec2f(32.,32.);const MultiScatteringLutDomainInUVSpace=(MultiScatteringLutSize-vec2f(1.))/MultiScatteringLutSize;const MultiScatteringLutHalfTexelSize=vec2f(.5)/MultiScatteringLutSize;const NumAerialPerspectiveLutLayers=32.;const AerialPerspectiveLutSize=vec3f(16.,64.,NumAerialPerspectiveLutLayers);const DiffuseSkyIrradianceLutSize=vec2f(64.,16.);const DiffuseSkyIrradianceLutDomainInUVSpace=(DiffuseSkyIrradianceLutSize-vec2f(1.))/DiffuseSkyIrradianceLutSize;const DiffuseSkyIrradianceLutHalfTexelSize=vec2f(.5)/DiffuseSkyIrradianceLutSize;const SkyViewLutSize=vec2f(128.,128.);const SkyViewLutDomainInUVSpace=(SkyViewLutSize-vec2f(1.))/SkyViewLutSize;const SkyViewLutHalfTexelSize=vec2f(.5)/SkyViewLutSize;const AerialPerspectiveLutKMPerSlice=4.;const AerialPerspectiveLutRangeKM=AerialPerspectiveLutKMPerSlice*NumAerialPerspectiveLutLayers;const TransmittanceLutSize=vec2f(256.,64.);const TransmittanceLutDomainInUVSpace=(TransmittanceLutSize-vec2f(1.))/TransmittanceLutSize;const TransmittanceLutHalfTexelSize=vec2f(.5)/TransmittanceLutSize;const TransmittanceHorizonRange=2.*TransmittanceLutHalfTexelSize.x;const TransmittanceMaxUnoccludedU=1.-.5*TransmittanceHorizonRange;const TransmittanceMinOccludedU=1.+.5*TransmittanceHorizonRange;fn uvToUnit(uv: vec2f,domainInUVSpace: vec2f,halfTexelSize: vec2f)->vec2f {return (uv-halfTexelSize)/domainInUVSpace;}
fn unitToUV(unit: vec2f,domainInUVSpace: vec2f,halfTexelSize: vec2f)->vec2f {return unit*domainInUVSpace+halfTexelSize;}
fn sphereIntersectNearest(rayOrigin: vec3f,rayDirection: vec3f,sphereRadius: f32)->f32 {let result=sphereIntersectFromOrigin(rayOrigin,rayDirection,sphereRadius);let c=dot(rayOrigin,rayOrigin)-sphereRadius*sphereRadius;return select(result.x,result.y,c>=0.);}
fn moveToTopAtmosphere(
cameraPosition: vec3f,
positionRadius: f32,
positionGeocentricNormal: vec3f,
rayDirection: vec3f,
intersectsAtmosphere: ptr<function,bool>,
cameraPositionClampedToTopOfAtmosphere: ptr<function,vec3f>
) {*intersectsAtmosphere=true;*cameraPositionClampedToTopOfAtmosphere=cameraPosition;if (positionRadius>atmosphere.atmosphereRadius) {let tTop=sphereIntersectNearest(cameraPosition,rayDirection,atmosphere.atmosphereRadius);if (tTop>=0.) {let upOffset=-atmosphere.planetRadiusOffset*positionGeocentricNormal;*cameraPositionClampedToTopOfAtmosphere=cameraPosition+rayDirection*tTop+upOffset;} else {*intersectsAtmosphere=false;}}}
fn getSkyViewUVFromParameters(
intersectsGround: bool,
cosHorizonAngleFromZenith: f32,
cosAngleBetweenViewAndZenith: f32,
cosAngleBetweenViewAndLightOnPlane: f32,
uv: ptr<function,vec2f>
) {var unit=vec2f(0.);if (intersectsGround) {var coord=(cosAngleBetweenViewAndZenith+1.)/(cosHorizonAngleFromZenith+1.);coord=sqrtClamped(coord); 
unit.y=.5*coord; } else {var coord=(cosAngleBetweenViewAndZenith-cosHorizonAngleFromZenith)/(1.-cosHorizonAngleFromZenith);coord=sqrtClamped(coord); 
unit.y=.5*coord+.5; }
unit.x=.5-.5*cosAngleBetweenViewAndLightOnPlane;*uv=unitToUV(unit,SkyViewLutDomainInUVSpace,SkyViewLutHalfTexelSize);}
#if USE_SKY_VIEW_LUT && SAMPLE_SKY_VIEW_LUT
fn sampleSkyViewLut(
skyViewLut: texture_2d<f32>,
positionRadius: f32,
geocentricNormal: vec3f,
rayDirection: vec3f,
directionToLight: vec3f,
cosHorizonAngleFromZenith: f32,
cosAngleBetweenViewAndZenith: ptr<function,f32>,
isRayIntersectingGround: ptr<function,bool>
)->vec4f {*cosAngleBetweenViewAndZenith=dot(rayDirection,geocentricNormal);if (positionRadius>atmosphere.atmosphereRadius) {let sinAngleBetweenViewAndNadir=sqrtClamped(1.-*cosAngleBetweenViewAndZenith**cosAngleBetweenViewAndZenith);if (sinAngleBetweenViewAndNadir>atmosphere.sinCameraAtmosphereHorizonAngleFromNadir) {*isRayIntersectingGround=false;return vec4f(0.);}}
let sideVector=normalize(cross(geocentricNormal,rayDirection));let forwardVector=normalize(cross(sideVector,geocentricNormal));let lightOnPlane=normalize(vec2f(dot(directionToLight,forwardVector),dot(directionToLight,sideVector)));let cosAngleBetweenViewAndLightOnPlane=lightOnPlane.x;let rayIntersectionScale=mix(.95,1.,saturate((positionRadius-atmosphere.planetRadius)/atmosphere.atmosphereThickness));*isRayIntersectingGround =
positionRadius>atmosphere.planetRadius &&
(rayIntersectionScale**cosAngleBetweenViewAndZenith)<=cosHorizonAngleFromZenith;var uv: vec2f;getSkyViewUVFromParameters(
*isRayIntersectingGround,
cosHorizonAngleFromZenith,
*cosAngleBetweenViewAndZenith,
cosAngleBetweenViewAndLightOnPlane,
&uv);return textureSampleLevel(skyViewLut,skyViewLutSampler,uv,0.);}
#endif
fn computeRayleighPhase(onePlusCosThetaSq: f32)->f32 {return 0.0596831037*onePlusCosThetaSq;}
fn computeMiePhaseCornetteShanks(cosTheta: f32,onePlusCosThetaSq: f32)->f32 {const g=.8;const gSquared=g*g;const oneMinusGSquared=1.-gSquared;const onePlusGSquared=1.+gSquared;const twoPlusGSquared=2.+gSquared;const twoG=2.*g;const threeOverEightPi=3./(8.*PI);return threeOverEightPi*oneMinusGSquared*onePlusCosThetaSq/(twoPlusGSquared*pow(onePlusGSquared-twoG*cosTheta,1.5));}
fn computeOzoneDensity(normalizedViewHeight: f32)->f32 {const MinOzoneDensity=.135;const OneMinusMinOzoneDensity=1.-MinOzoneDensity;const OzoneStartHeight=.15; 
const PeakOzoneHeight=.25;const MaxOzoneHeight=.6;const InverseRampupDistance=1./(PeakOzoneHeight-OzoneStartHeight);const InverseRampdownDistance=1./(MaxOzoneHeight-PeakOzoneHeight);let lowerAtmosphereDensity=MinOzoneDensity+OneMinusMinOzoneDensity*max(0.,normalizedViewHeight-OzoneStartHeight)*InverseRampupDistance;let sqrtUpperAtmosphereDensity=max(0.,1.-(normalizedViewHeight-PeakOzoneHeight)*InverseRampdownDistance);let upperAtmosphereDensity=sqrtUpperAtmosphereDensity*sqrtUpperAtmosphereDensity;let densityOzone=select(upperAtmosphereDensity,lowerAtmosphereDensity,normalizedViewHeight<PeakOzoneHeight);return densityOzone;}
fn sampleMediumRGB(
viewHeight: f32,
scatteringRayleigh: ptr<function,vec3f>,
scatteringMie: ptr<function,vec3f>,
extinction: ptr<function,vec3f>,
scattering: ptr<function,vec3f>
) {let normalizedViewHeight=saturate(viewHeight*atmosphere.inverseAtmosphereThickness);let densityMie=exp(-83.333*normalizedViewHeight);let densityRayleigh=exp(-12.5*normalizedViewHeight);let densityOzone=computeOzoneDensity(normalizedViewHeight);*scatteringRayleigh=densityRayleigh*atmosphere.peakRayleighScattering;*scatteringMie=densityMie*atmosphere.peakMieScattering;*scattering=*scatteringMie+*scatteringRayleigh;let extinctionRayleigh=*scatteringRayleigh;let extinctionMie=densityMie*atmosphere.peakMieExtinction;let extinctionOzone=densityOzone*atmosphere.peakOzoneAbsorption;*extinction=extinctionRayleigh+extinctionMie+extinctionOzone;}
fn computeTransmittance(rayOriginGlobal: vec3f,rayDirection: vec3f,tMax: f32,sampleCount: f32)->vec3f {var opticalDepth=vec3f(0.);var t=0.;let sampleSegmentWeight=tMax/sampleCount;const sampleSegmentT=.3;for (var s=0.; s<sampleCount; s+=1.) {let newT=sampleSegmentWeight*(s+sampleSegmentT);let dt=newT-t;t=newT;var scatteringRayleigh: vec3f;var scatteringMie: vec3f;var extinction: vec3f;var scattering: vec3f;let samplePositionGlobal=rayOriginGlobal+t*rayDirection;sampleMediumRGB(length(samplePositionGlobal)-atmosphere.planetRadius,&scatteringRayleigh,&scatteringMie,&extinction,&scattering);opticalDepth+=extinction*dt;}
return exp(-opticalDepth);}
#if defined(SAMPLE_TRANSMITTANCE_LUT) || !defined(EXCLUDE_RAY_MARCHING_FUNCTIONS)
fn getTransmittanceUV(radius: f32,cosAngleLightToZenith: f32,distanceToHorizon: ptr<function,f32>)->vec2f {let radiusSquared=radius*radius;let horizonDistance=sqrtClamped(radiusSquared-atmosphere.planetRadiusSquared);*distanceToHorizon=horizonDistance;let cosAngleLightToZenithSquared=cosAngleLightToZenith*cosAngleLightToZenith;let discriminant=radiusSquared*(cosAngleLightToZenithSquared-1.)+atmosphere.atmosphereRadiusSquared;let distanceToAtmosphereEdge=max(0.,-radius*cosAngleLightToZenith+sqrtClamped(discriminant));let minDistanceToAtmosphereEdge=max(0.,atmosphere.atmosphereRadius-radius);let maxDistanceToAtmosphereEdge=horizonDistance+atmosphere.horizonDistanceToAtmosphereEdge;let cosAngleLightToZenithCoordinate=(distanceToAtmosphereEdge-minDistanceToAtmosphereEdge)/max(.000001,maxDistanceToAtmosphereEdge-minDistanceToAtmosphereEdge);let distanceToHorizonCoordinate=horizonDistance/max(.000001,atmosphere.horizonDistanceToAtmosphereEdge);let unit=vec2f(cosAngleLightToZenithCoordinate,distanceToHorizonCoordinate);return unit*TransmittanceLutDomainInUVSpace+TransmittanceLutHalfTexelSize; }
fn sampleTransmittanceLut(transmittanceLut: texture_2d<f32>,positionRadius: f32,cosAngleLightToZenith: f32)->vec4f {var distanceToHorizon=0.;let uv=getTransmittanceUV(positionRadius,cosAngleLightToZenith,&distanceToHorizon);let weight=smoothstep(TransmittanceMinOccludedU,TransmittanceMaxUnoccludedU,uv.x);return weight*textureSampleLevel(transmittanceLut,transmittanceLutSampler,uv,0.);}
#endif
#ifndef EXCLUDE_RAY_MARCHING_FUNCTIONS
#ifndef COMPUTE_MULTI_SCATTERING
fn sampleMultiScatteringLut(multiScatteringLut: texture_2d<f32>,radius: f32,cosAngleLightToZenith: f32)->vec3f {let unit=vec2f(.5+.5*cosAngleLightToZenith,(radius-atmosphere.planetRadius)/atmosphere.atmosphereThickness);let uv=unitToUV(unit,MultiScatteringLutDomainInUVSpace,MultiScatteringLutHalfTexelSize);let multiScattering=textureSampleLevel(multiScatteringLut,multiScatteringLutSampler,uv,0.).rgb;return max(atmosphere.minMultiScattering,multiScattering);}
#endif
const uniformPhase=RECIPROCAL_PI4;fn integrateScatteredRadiance(
isAerialPerspectiveLut: bool,
lightIntensityParam: f32,
transmittanceLut: texture_2d<f32>,
#ifndef COMPUTE_MULTI_SCATTERING
multiScatteringLut: texture_2d<f32>,
multiScatteringIntensityParam: f32,
#endif
rayOriginGlobal: vec3f,
rayDirection: vec3f,
directionToLightParam: vec3f,
tMaxMax: f32,
sampleCount: f32,
distanceToSurface: f32,
transmittance: ptr<function,vec3f>
#if COMPUTE_MULTI_SCATTERING
,multiScattering: ptr<function,vec3f>
#endif
)->vec3f {var radiance=vec3f(0.);*transmittance=vec3f(1.);
#if COMPUTE_MULTI_SCATTERING
*multiScattering=vec3f(0.);
#endif
let tBottom=sphereIntersectNearest(rayOriginGlobal,rayDirection,atmosphere.planetRadius);let tTop=sphereIntersectNearest(rayOriginGlobal,rayDirection,atmosphere.atmosphereRadius);var tMax=0.;if (tBottom<0.) {if (tTop<0.) {return radiance;} else {tMax=tTop;}} else {if (tTop>0.) {if (isAerialPerspectiveLut) {tMax=tTop;} else {tMax=min(tBottom,tTop);}}}
if (distanceToSurface>0. && distanceToSurface<tMax) {tMax=distanceToSurface;}
tMax=min(tMax,tMaxMax);
#ifndef COMPUTE_MULTI_SCATTERING
let cosTheta=dot(rayDirection,directionToLightParam);let onePlusCosThetaSq=1.+cosTheta*cosTheta;let rayleighPhase=computeRayleighPhase(onePlusCosThetaSq);let miePhase=computeMiePhaseCornetteShanks(cosTheta,onePlusCosThetaSq);
#endif
let transmittanceScale=select(1.,atmosphere.aerialPerspectiveTransmittanceScale,isAerialPerspectiveLut);var t=0.;let sampleSegmentWeight=tMax/sampleCount;const sampleSegmentT=.3;for (var s=0.; s<sampleCount; s+=1.) {let newT=sampleSegmentWeight*(s+sampleSegmentT);let dt=newT-t;t=newT;let samplePositionGlobal=rayOriginGlobal+t*rayDirection;let sampleRadiusGlobal=length(samplePositionGlobal);let sampleGeocentricNormal=samplePositionGlobal/sampleRadiusGlobal;let sampleCosAngleLightToZenith=dot(directionToLightParam,sampleGeocentricNormal);var scatteringRayleigh: vec3f;var scatteringMie: vec3f;var extinction: vec3f;var scattering: vec3f;sampleMediumRGB(sampleRadiusGlobal-atmosphere.planetRadius,&scatteringRayleigh,&scatteringMie,&extinction,&scattering);let transmittanceToLight=sampleTransmittanceLut(transmittanceLut,sampleRadiusGlobal,sampleCosAngleLightToZenith).rgb;
#if COMPUTE_MULTI_SCATTERING
let phaseTimesScattering=uniformPhase*scattering;let S=transmittanceToLight*phaseTimesScattering;
#else
let phaseTimesScattering=scatteringMie*miePhase+scatteringRayleigh*rayleighPhase;let multiScatteredRadiance=sampleMultiScatteringLut(multiScatteringLut,sampleRadiusGlobal,sampleCosAngleLightToZenith);let S=transmittanceScale*transmittanceToLight*phaseTimesScattering+multiScatteringIntensityParam*multiScatteredRadiance*scattering;
#endif
let sampleOpticalDepth=extinction*dt;let sampleTransmittanceVal=exp(-sampleOpticalDepth);let clampedExtinction=max(vec3f(.0000001),extinction);let SInt=(S-S*sampleTransmittanceVal)/clampedExtinction;radiance+=*transmittance*SInt;
#if COMPUTE_MULTI_SCATTERING
let MSInt=(scattering-scattering*sampleTransmittanceVal)/clampedExtinction;*multiScattering+=*transmittance*MSInt;
#endif
*transmittance*=sampleTransmittanceVal;}
#if USE_GROUND_ALBEDO
if (tMax==tBottom && tBottom>0.) {let planetPos=rayOriginGlobal+tBottom*rayDirection;let planetPosRadius=length(planetPos);let planetPosGeocentricNormal=planetPos/planetPosRadius;let nDotL=dot(directionToLightParam,planetPosGeocentricNormal);let lightTransmittance=sampleTransmittanceLut(transmittanceLut,planetPosRadius,nDotL).rgb;const diffuseBrdf=RECIPROCAL_PI;radiance+=lightTransmittance**transmittance*atmosphere.groundAlbedo*(nDotL*diffuseBrdf);}
#endif
radiance*=lightIntensityParam;return radiance;}
#endif
fn layerIdxToAerialPerspectiveLayer(layerIdx: f32)->f32 {var layer=(layerIdx+1.)/NumAerialPerspectiveLutLayers;layer*=layer; 
layer*=NumAerialPerspectiveLutLayers;return layer;}
fn toAerialPerspectiveDepth(layer: f32)->f32 {return layer*AerialPerspectiveLutKMPerSlice;}
fn toAerialPerspectiveLayer(distance: f32,aerialPerspectiveLutDistancePerSlice: f32)->f32 {return distance/aerialPerspectiveLutDistancePerSlice;}
fn applyAerialPerspectiveSaturation(aerialPerspective: vec4f)->vec4f {let previousRadiance=getLuminanceUnclamped(aerialPerspective.rgb);let mixed=mix(vec3f(previousRadiance),aerialPerspective.rgb,atmosphere.aerialPerspectiveSaturation);return vec4f(mixed,aerialPerspective.a);}
fn applyAerialPerspectiveIntensity(aerialPerspective: vec4f)->vec4f {var result=aerialPerspective;
#if APPLY_AERIAL_PERSPECTIVE_INTENSITY
if (atmosphere.aerialPerspectiveIntensity==0.) {result=vec4f(0.);} else {let previousAlpha=result.a;result=result/max(.00001,previousAlpha);result=result*pow(previousAlpha,1./atmosphere.aerialPerspectiveIntensity);}
#endif
return result;}
fn applyAerialPerspectiveRadianceBias(aerialPerspective: vec4f)->vec4f {var result=aerialPerspective;
#if APPLY_AERIAL_PERSPECTIVE_RADIANCE_BIAS
let originalRadiance=dot(result.rgb,LuminanceEncodeApprox);let targetRadiance=originalRadiance+atmosphere.aerialPerspectiveRadianceBias;if (originalRadiance>0.) {result=result*max(0.,targetRadiance/originalRadiance);} else {result=max(vec4f(0.),vec4f(atmosphere.aerialPerspectiveRadianceBias));}
result.a=min(result.a,1.);
#endif
return result;}
fn sampleAerialPerspectiveLut(
screenUV: vec2f,
clampToLutRange: bool,
distanceFromCamera: f32,
numAerialPerspectiveLutLayers: f32,
aerialPerspectiveLutKMPerSlice: f32,
aerialPerspectiveLutRangeKM: f32,
aerialPerspective: ptr<function,vec4f>
)->bool {*aerialPerspective=vec4f(0.);
#if USE_AERIAL_PERSPECTIVE_LUT
if (distanceFromCamera>0. &&
(clampToLutRange || distanceFromCamera<aerialPerspectiveLutRangeKM) &&
atmosphere.clampedCameraRadius<=atmosphere.atmosphereRadius) {var layer=toAerialPerspectiveLayer(distanceFromCamera,aerialPerspectiveLutKMPerSlice);let normalizedLayer=sqrt(layer/numAerialPerspectiveLutLayers); 
layer=min(normalizedLayer*numAerialPerspectiveLutLayers,numAerialPerspectiveLutLayers);let weight=min(layer,1.);let layerIdx=max(0.,layer-1.);let floorLayerIdx=floor(layerIdx);let aerialPerspectiveLayer0=textureSampleLevel(aerialPerspectiveLut,aerialPerspectiveLutSampler,screenUV,i32(floorLayerIdx),0.);let aerialPerspectiveLayer1=textureSampleLevel(aerialPerspectiveLut,aerialPerspectiveLutSampler,screenUV,i32(floorLayerIdx+1.),0.);var interpolated=mix(aerialPerspectiveLayer0,aerialPerspectiveLayer1,layerIdx-floorLayerIdx);interpolated=vec4f(interpolated.rgb*atmosphere.atmosphereExposure,interpolated.a);interpolated=applyAerialPerspectiveSaturation(interpolated);interpolated=weight*applyAerialPerspectiveIntensity(interpolated);interpolated=applyAerialPerspectiveRadianceBias(interpolated);*aerialPerspective=interpolated;return true;}
#endif
return false;}
#if RENDER_TRANSMITTANCE
fn getTransmittanceParameters(uv: vec2f,radius: ptr<function,f32>,cosAngleLightToZenith: ptr<function,f32>,distanceToAtmosphereEdge: ptr<function,f32>) {let unit=uvToUnit(uv,TransmittanceLutDomainInUVSpace,TransmittanceLutHalfTexelSize);let distanceToHorizon=unit.y*atmosphere.horizonDistanceToAtmosphereEdge;let distanceToHorizonSquared=distanceToHorizon*distanceToHorizon;*radius=sqrtClamped(distanceToHorizonSquared+atmosphere.planetRadiusSquared);let minDistanceToAtmosphereEdge=atmosphere.atmosphereRadius-*radius;let maxDistanceToAtmosphereEdge=distanceToHorizon+atmosphere.horizonDistanceToAtmosphereEdge;*distanceToAtmosphereEdge=minDistanceToAtmosphereEdge+unit.x*(maxDistanceToAtmosphereEdge-minDistanceToAtmosphereEdge);let distanceToAtmosphereEdgeSquared=*distanceToAtmosphereEdge**distanceToAtmosphereEdge;*cosAngleLightToZenith=select(
(atmosphere.horizonDistanceToAtmosphereEdgeSquared-distanceToAtmosphereEdgeSquared-distanceToHorizonSquared)/(2.**radius**distanceToAtmosphereEdge),
1.,
*distanceToAtmosphereEdge<=0.
);*cosAngleLightToZenith=clamp(*cosAngleLightToZenith,-1.,1.);}
fn renderTransmittance(uv: vec2f)->vec4f {var radius: f32;var cosAngleLightToZenith: f32;var distanceToAtmosphereEdgeAlongAngle: f32;getTransmittanceParameters(uv,&radius,&cosAngleLightToZenith,&distanceToAtmosphereEdgeAlongAngle);let sinAngleLightToZenith=sqrtClamped(1.-cosAngleLightToZenith*cosAngleLightToZenith);let directionToLight=normalize(vec3f(0.,cosAngleLightToZenith,sinAngleLightToZenith));let transmittance=computeTransmittance(vec3f(0.,radius,0.),directionToLight,distanceToAtmosphereEdgeAlongAngle,atmosphere.transmittanceSampleCount);return vec4f(transmittance,avg(transmittance));}
#endif
#if RENDER_MULTI_SCATTERING
fn getSphereSample(azimuth: f32,inclination: f32,sinInclination: ptr<function,f32>)->vec3f {*sinInclination=sin(inclination);return vec3f(*sinInclination*sin(azimuth),cos(inclination),*sinInclination*cos(azimuth));}
fn renderMultiScattering(uv: vec2f,transmittanceLut: texture_2d<f32>)->vec4f {let MultiScatteringAzimuthIterationAngle=TWO_PI/atmosphere.multiScatteringAzimuthSampleCount;let MultiScatteringInclinationIterationAngle=PI/atmosphere.multiScatteringInclinationSampleCount;let MultiScatteringAngleStepProduct=MultiScatteringAzimuthIterationAngle*MultiScatteringInclinationIterationAngle;let unit=uvToUnit(uv,MultiScatteringLutDomainInUVSpace,MultiScatteringLutHalfTexelSize);let cosAngleLightToZenith=2.*unit.x-1.;let sinAngleLightToZenith=sqrtClamped(1.-cosAngleLightToZenith*cosAngleLightToZenith);let directionToLightLocal=normalize(vec3f(0.,cosAngleLightToZenith,sinAngleLightToZenith));let rayOriginRadius=atmosphere.planetRadius+max(unit.y,.001)*atmosphere.atmosphereThickness;let rayOrigin=vec3f(0.,rayOriginRadius,0.);var inscattered=vec3f(0.);var multiScatteringTotal=vec3f(0.);for (var i=.5; i<atmosphere.multiScatteringAzimuthSampleCount; i+=1.) {let azimuth=MultiScatteringAzimuthIterationAngle*i;for (var j=.5; j<atmosphere.multiScatteringInclinationSampleCount; j+=1.) {let inclination=MultiScatteringInclinationIterationAngle*j;var sinInclination: f32;let rayDirection=getSphereSample(azimuth,inclination,&sinInclination);var transmittanceVal: vec3f;var multiScatteringVal: vec3f;let radianceVal=integrateScatteredRadiance(
false,
1.,
transmittanceLut,
rayOrigin,
rayDirection,
directionToLightLocal,
100000000.,
atmosphere.multiScatteringLutSampleCount,
-1.,
&transmittanceVal,
&multiScatteringVal);let weight=RECIPROCAL_PI4*abs(sinInclination)*MultiScatteringAngleStepProduct;multiScatteringTotal+=multiScatteringVal*weight;inscattered+=radianceVal*weight;}}
let multiScatteringResult=inscattered/max(vec3f(.000001),vec3f(1.)-multiScatteringTotal);return vec4f(multiScatteringResult,1.);}
#endif
fn computeCosHorizonAngleFromZenith(radius: f32)->f32 {let sinAngleBetweenHorizonAndNadir=min(1.,atmosphere.planetRadius/radius);let cosHorizonAngleFromNadir=sqrt(1.-sinAngleBetweenHorizonAndNadir*sinAngleBetweenHorizonAndNadir);let cosHorizonAngleFromZenith=-cosHorizonAngleFromNadir;return cosHorizonAngleFromZenith;}
#if RENDER_SKY_VIEW
fn getSkyViewParametersFromUV(
radius: f32,
uv: vec2f,
cosAngleBetweenViewAndZenith: ptr<function,f32>,
cosAngleBetweenViewAndLightOnPlane: ptr<function,f32>
) {let unit=uvToUnit(uv,SkyViewLutDomainInUVSpace,SkyViewLutHalfTexelSize);let cosHorizonAngleFromZenith=computeCosHorizonAngleFromZenith(radius);if (unit.y<.5) {var coord=2.*unit.y; 
coord*=coord; 
*cosAngleBetweenViewAndZenith=mix(-1.,cosHorizonAngleFromZenith,coord); } else {var coord=2.*unit.y-1.; 
coord*=coord; 
*cosAngleBetweenViewAndZenith=mix(cosHorizonAngleFromZenith,1.,coord); }
*cosAngleBetweenViewAndLightOnPlane=1.-2.*unit.x;}
fn renderSkyView(uv: vec2f,transmittanceLut: texture_2d<f32>,multiScatteringLut: texture_2d<f32>)->vec4f {var cosAngleBetweenViewAndZenith: f32;var cosAngleBetweenViewAndLightOnPlane: f32;getSkyViewParametersFromUV(atmosphere.clampedCameraRadius,uv,&cosAngleBetweenViewAndZenith,&cosAngleBetweenViewAndLightOnPlane);let sinAngleBetweenViewAndZenith=sqrtClamped(1.-cosAngleBetweenViewAndZenith*cosAngleBetweenViewAndZenith);let sinAngleBetweenViewAndLightOnPlane=sqrtClamped(1.-cosAngleBetweenViewAndLightOnPlane*cosAngleBetweenViewAndLightOnPlane);let rayDirection =
vec3f(
sinAngleBetweenViewAndZenith*cosAngleBetweenViewAndLightOnPlane,
cosAngleBetweenViewAndZenith,
sinAngleBetweenViewAndZenith*sinAngleBetweenViewAndLightOnPlane);var intersectsAtmosphere=false;var cameraPositionGlobalClampedToTopOfAtmosphere=vec3f(0.);moveToTopAtmosphere(
vec3f(0.,atmosphere.clampedCameraRadius,0.),
atmosphere.clampedCameraRadius,
vec3f(0.,1.,0.),
rayDirection,
&intersectsAtmosphere,
&cameraPositionGlobalClampedToTopOfAtmosphere
);if (!intersectsAtmosphere) {return vec4f(0.);}
var transmittanceVal: vec3f;let radiance=integrateScatteredRadiance(
false,
atmosphere.atmosphereExposure*atmosphere.lightIntensity,
transmittanceLut,
multiScatteringLut,
atmosphere.multiScatteringIntensity,
cameraPositionGlobalClampedToTopOfAtmosphere,
rayDirection,
atmosphere.directionToLightRelativeToCameraGeocentricNormal,
100000000.,
atmosphere.skyViewLutSampleCount,
-1.,
&transmittanceVal
);let transparency=1.-avg(transmittanceVal);return vec4f(radiance,transparency);}
#endif
#if RENDER_CAMERA_VOLUME
fn renderCameraVolume(
positionOnNearPlane: vec3f,
layerIdx: f32,
transmittanceLut: texture_2d<f32>,
multiScatteringLut: texture_2d<f32>
)->vec4f {var result=vec4f(0.);let rayDirection=normalize(positionOnNearPlane);let layer=layerIdxToAerialPerspectiveLayer(layerIdx);let tMax=toAerialPerspectiveDepth(layer);var tMaxMax=tMax;var cameraPositionGlobalClampedToTopOfAtmosphere=atmosphere.clampedCameraPositionGlobal;if (atmosphere.clampedCameraRadius>=atmosphere.atmosphereRadius) {var intersectsAtmosphere=false;moveToTopAtmosphere(
atmosphere.clampedCameraPositionGlobal,
atmosphere.clampedCameraRadius,
atmosphere.cameraGeocentricNormal,
rayDirection,
&intersectsAtmosphere,
&cameraPositionGlobalClampedToTopOfAtmosphere);if (!intersectsAtmosphere) {return result;}
let distanceToAtmosphere=distance(atmosphere.clampedCameraPositionGlobal,cameraPositionGlobalClampedToTopOfAtmosphere);if (tMaxMax<distanceToAtmosphere) {return result;}
tMaxMax=max(0.,tMaxMax-distanceToAtmosphere);}
let sampleCount=min(atmosphere.skyViewLutSampleCount,2.*layer+2.);var transmittance: vec3f;let radiance=integrateScatteredRadiance(
true,
atmosphere.lightIntensity,
transmittanceLut,
multiScatteringLut,
atmosphere.multiScatteringIntensity,
cameraPositionGlobalClampedToTopOfAtmosphere,
rayDirection,
atmosphere.directionToLight,
tMaxMax,
sampleCount,
-1.,
&transmittance);let transparency=1.-avg(transmittance);result=vec4f(radiance,transparency);return result;}
#endif
`;a.ShaderStore.IncludesShadersStoreWGSL[ut]||(a.ShaderStore.IncludesShadersStoreWGSL[ut]=wi);const he={name:ut,shader:wi};var Zr={__proto__:null,atmosphereFunctionsWGSL:he};const ht="atmosphereUboDeclaration",bi=`struct Atmosphere {peakRayleighScattering: vec3<f32>,
planetRadius: f32,
peakMieScattering: vec3<f32>,
atmosphereThickness: f32,
peakMieAbsorption: vec3<f32>,
planetRadiusSquared: f32,
peakMieExtinction: vec3<f32>,
atmosphereRadius: f32,
peakOzoneAbsorption: vec3<f32>,
atmosphereRadiusSquared: f32,
horizonDistanceToAtmosphereEdge: f32,
horizonDistanceToAtmosphereEdgeSquared: f32,
planetRadiusWithOffset: f32,
planetRadiusOffset: f32,
atmosphereExposure: f32,
aerialPerspectiveRadianceBias: f32,
inverseAtmosphereThickness: f32,
aerialPerspectiveTransmittanceScale: f32,
inverseViewProjectionWithoutTranslation: mat4x4<f32>,
directionToLight: vec3<f32>,
multiScatteringIntensity: f32,
directionToLightRelativeToCameraGeocentricNormal: vec3<f32>,
cameraRadius: f32,
lightRadianceAtCamera: vec3<f32>,
diffuseSkyIrradianceDesaturationFactor: f32,
groundAlbedo: vec3<f32>,
aerialPerspectiveSaturation: f32,
minMultiScattering: vec3<f32>,
diffuseSkyIrradianceIntensity: f32,
cameraPositionGlobal: vec3<f32>,
lightIntensity: f32,
clampedCameraPositionGlobal: vec3<f32>,
aerialPerspectiveIntensity: f32,
cameraGeocentricNormal: vec3<f32>,
clampedCameraRadius: f32,
cameraForward: vec3<f32>,
clampedCameraHeight: f32,
cameraPosition: vec3<f32>,
cosCameraHorizonAngleFromZenith: f32,
viewport: vec4<f32>,
additionalDiffuseSkyIrradiance: vec3<f32>,
cameraHeight: f32,
cameraNearPlane: f32,
originHeight: f32,
sinCameraAtmosphereHorizonAngleFromNadir: f32,
transmittanceSampleCount: f32,
skyViewLutSampleCount: f32,
multiScatteringLutSampleCount: f32,
multiScatteringAzimuthSampleCount: f32,
multiScatteringInclinationSampleCount: f32,
diffuseSkyIrradianceLutSampleCount: f32};var<uniform> atmosphere : Atmosphere;
`;a.ShaderStore.IncludesShadersStoreWGSL[ht]||(a.ShaderStore.IncludesShadersStoreWGSL[ht]=bi);const re={name:ht,shader:bi};var $r={__proto__:null,atmosphereUboDeclarationWGSL:re};const dt="atmosphereFunctions",Oi=`#include<intersectionFunctions>
const vec2 MultiScatteringLutSize=vec2(32.0,32.0);const vec2 MultiScatteringLutDomainInUVSpace=(MultiScatteringLutSize-vec2(1.0))/MultiScatteringLutSize;const vec2 MultiScatteringLutHalfTexelSize=vec2(0.5)/MultiScatteringLutSize;const float NumAerialPerspectiveLutLayers=32.0;const vec3 AerialPerspectiveLutSize=vec3(16.0,64.0,NumAerialPerspectiveLutLayers);const vec2 DiffuseSkyIrradianceLutSize=vec2(64.0,16.0);const vec2 DiffuseSkyIrradianceLutDomainInUVSpace=(DiffuseSkyIrradianceLutSize-vec2(1.0))/DiffuseSkyIrradianceLutSize;const vec2 DiffuseSkyIrradianceLutHalfTexelSize=vec2(0.5)/DiffuseSkyIrradianceLutSize;const vec2 SkyViewLutSize=vec2(128.0,128.0);const vec2 SkyViewLutDomainInUVSpace=(SkyViewLutSize-vec2(1.0))/SkyViewLutSize;const vec2 SkyViewLutHalfTexelSize=vec2(0.5)/SkyViewLutSize;const float AerialPerspectiveLutKMPerSlice=4.0;const float AerialPerspectiveLutRangeKM=AerialPerspectiveLutKMPerSlice*NumAerialPerspectiveLutLayers;const vec2 TransmittanceLutSize=vec2(256.,64.);const vec2 TransmittanceLutDomainInUVSpace=(TransmittanceLutSize-vec2(1.))/TransmittanceLutSize;const vec2 TransmittanceLutHalfTexelSize=vec2(0.5)/TransmittanceLutSize;const float TransmittanceHorizonRange=2.*TransmittanceLutHalfTexelSize.x;const float TransmittanceMaxUnoccludedU=1.-0.5*TransmittanceHorizonRange;const float TransmittanceMinOccludedU=1.+0.5*TransmittanceHorizonRange;vec2 uvToUnit(vec2 uv,vec2 domainInUVSpace,vec2 halfTexelSize) {return (uv-halfTexelSize)/domainInUVSpace;}
vec2 unitToUV(vec2 unit,vec2 domainInUVSpace,vec2 halfTexelSize) {return unit*domainInUVSpace+halfTexelSize;}
float sphereIntersectNearest(vec3 rayOrigin,vec3 rayDirection,float sphereRadius) {vec2 result=sphereIntersectFromOrigin(rayOrigin,rayDirection,sphereRadius);float c=dot(rayOrigin,rayOrigin)-sphereRadius*sphereRadius;return c>=0.0 ?
result.y :
result.x;}
void moveToTopAtmosphere(
vec3 cameraPosition,
float positionRadius,
vec3 positionGeocentricNormal,
vec3 rayDirection,
out bool intersectsAtmosphere,
out vec3 cameraPositionClampedToTopOfAtmosphere) {intersectsAtmosphere=true;cameraPositionClampedToTopOfAtmosphere=cameraPosition;if (positionRadius>atmosphereRadius) {float tTop=sphereIntersectNearest(cameraPosition,rayDirection,atmosphereRadius);if (tTop>=0.0) {vec3 upOffset=-planetRadiusOffset*positionGeocentricNormal;cameraPositionClampedToTopOfAtmosphere=cameraPosition+rayDirection*tTop+upOffset;} else {intersectsAtmosphere=false;}}}
void getSkyViewUVFromParameters(
bool intersectsGround,
float cosHorizonAngleFromZenith,
float cosAngleBetweenViewAndZenith,
float cosAngleBetweenViewAndLightOnPlane,
out vec2 uv)
{vec2 unit=vec2(0.);if (intersectsGround) {float coord=(cosAngleBetweenViewAndZenith+1.)/(cosHorizonAngleFromZenith+1.);coord=sqrtClamped(coord); 
unit.y=0.5*coord; } else {float coord=(cosAngleBetweenViewAndZenith-cosHorizonAngleFromZenith)/(1.-cosHorizonAngleFromZenith);coord=sqrtClamped(coord); 
unit.y=0.5*coord+0.5; }
{float coord=0.5-0.5*cosAngleBetweenViewAndLightOnPlane;unit.x=coord;}
uv=unitToUV(unit,SkyViewLutDomainInUVSpace,SkyViewLutHalfTexelSize);}
#if USE_SKY_VIEW_LUT && SAMPLE_SKY_VIEW_LUT
vec4 sampleSkyViewLut(
sampler2D skyViewLut,
float positionRadius,
vec3 geocentricNormal,
vec3 rayDirection,
vec3 directionToLight,
float cosHorizonAngleFromZenith,
out float cosAngleBetweenViewAndZenith,
out bool isRayIntersectingGround) {cosAngleBetweenViewAndZenith=dot(rayDirection,geocentricNormal);if (positionRadius>atmosphereRadius) {float sinAngleBetweenViewAndNadir=sqrtClamped(1.-cosAngleBetweenViewAndZenith*cosAngleBetweenViewAndZenith);if (sinAngleBetweenViewAndNadir>sinCameraAtmosphereHorizonAngleFromNadir) {isRayIntersectingGround=false;return vec4(0.);}}
vec3 sideVector=normalize(cross(geocentricNormal,rayDirection));vec3 forwardVector=normalize(cross(sideVector,geocentricNormal));vec2 lightOnPlane=normalize(vec2(dot(directionToLight,forwardVector),dot(directionToLight,sideVector)));float cosAngleBetweenViewAndLightOnPlane=lightOnPlane.x;float rayIntersectionScale=mix(0.95,1.,saturate((positionRadius-planetRadius)/atmosphereThickness));isRayIntersectingGround =
positionRadius>planetRadius &&
(rayIntersectionScale*cosAngleBetweenViewAndZenith)<=cosHorizonAngleFromZenith;vec2 uv;getSkyViewUVFromParameters(
isRayIntersectingGround,
cosHorizonAngleFromZenith,
cosAngleBetweenViewAndZenith,
cosAngleBetweenViewAndLightOnPlane,
uv);return textureLod(skyViewLut,uv,0.);}
#endif
float computeRayleighPhase(float onePlusCosThetaSq) {return 0.0596831037*onePlusCosThetaSq;}
float computeMiePhaseCornetteShanks(float cosTheta,float onePlusCosThetaSq) {const float g=0.8;const float gSquared=g*g;const float oneMinusGSquared=1.-gSquared;const float onePlusGSquared=1.+gSquared;const float twoPlusGSquared=2.+gSquared;const float twoG=2.*g;const float threeOverEightPi=3./(8.*PI);return threeOverEightPi*oneMinusGSquared*onePlusCosThetaSq/(twoPlusGSquared*pow(onePlusGSquared-twoG*cosTheta,1.5));}
float computeOzoneDensity(float normalizedViewHeight) {const float MinOzoneDensity=0.135;const float OneMinusMinOzoneDensity=1.-MinOzoneDensity;const float OzoneStartHeight=.15; 
const float PeakOzoneHeight=.25;const float MaxOzoneHeight=0.6;const float InverseRampupDistance=1./(PeakOzoneHeight-OzoneStartHeight);const float InverseRampdownDistance=1./(MaxOzoneHeight-PeakOzoneHeight);float lowerAtmosphereDensity=MinOzoneDensity+OneMinusMinOzoneDensity*max(0.,normalizedViewHeight-OzoneStartHeight)*InverseRampupDistance;float sqrtUpperAtmosphereDensity=max(0.,1.-(normalizedViewHeight-PeakOzoneHeight)*InverseRampdownDistance);float upperAtmosphereDensity=sqrtUpperAtmosphereDensity*sqrtUpperAtmosphereDensity;float densityOzone=normalizedViewHeight<PeakOzoneHeight ? lowerAtmosphereDensity : upperAtmosphereDensity;return densityOzone;}
void sampleMediumRGB(
float viewHeight,
out vec3 scatteringRayleigh,
out vec3 scatteringMie,
out vec3 extinction,
out vec3 scattering) {float normalizedViewHeight=saturate(viewHeight*inverseAtmosphereThickness);float densityMie=exp(-83.333*normalizedViewHeight);float densityRayleigh=exp(-12.5*normalizedViewHeight);float densityOzone=computeOzoneDensity(normalizedViewHeight);scatteringRayleigh=densityRayleigh*peakRayleighScattering;scatteringMie=densityMie*peakMieScattering;scattering=scatteringMie+scatteringRayleigh;vec3 extinctionRayleigh=scatteringRayleigh;vec3 extinctionMie=densityMie*peakMieExtinction;vec3 extinctionOzone=densityOzone*peakOzoneAbsorption;extinction=extinctionRayleigh+extinctionMie+extinctionOzone;}
vec3 computeTransmittance(vec3 rayOriginGlobal,vec3 rayDirection,float tMax,float sampleCount) {vec3 opticalDepth=vec3(0.);float t=0.;float sampleSegmentWeight=tMax/sampleCount;const float sampleSegmentT=0.3;for (float s=0.; s<sampleCount; s+=1.) {float newT=sampleSegmentWeight*(s+sampleSegmentT);float dt=newT-t;t=newT;vec3 scatteringRayleigh,scatteringMie,extinction,scattering;vec3 samplePositionGlobal=rayOriginGlobal+t*rayDirection;sampleMediumRGB(length(samplePositionGlobal)-planetRadius,scatteringRayleigh,scatteringMie,extinction,scattering);opticalDepth+=extinction*dt;}
return exp(-opticalDepth);}
#if defined(SAMPLE_TRANSMITTANCE_LUT) || !defined(EXCLUDE_RAY_MARCHING_FUNCTIONS)
vec2 getTransmittanceUV(float radius,float cosAngleLightToZenith,out float distanceToHorizon) {float radiusSquared=radius*radius;distanceToHorizon=sqrtClamped(radiusSquared-planetRadiusSquared);float cosAngleLightToZenithSquared=cosAngleLightToZenith*cosAngleLightToZenith;float discriminant=radiusSquared*(cosAngleLightToZenithSquared-1.)+atmosphereRadiusSquared;float distanceToAtmosphereEdge=max(0.,-radius*cosAngleLightToZenith+sqrtClamped(discriminant));float minDistanceToAtmosphereEdge=max(0.,atmosphereRadius-radius);float maxDistanceToAtmosphereEdge=distanceToHorizon+horizonDistanceToAtmosphereEdge;float cosAngleLightToZenithCoordinate=(distanceToAtmosphereEdge-minDistanceToAtmosphereEdge)/max(0.000001,maxDistanceToAtmosphereEdge-minDistanceToAtmosphereEdge);float distanceToHorizonCoordinate=distanceToHorizon/max(0.000001,horizonDistanceToAtmosphereEdge);vec2 unit=vec2(cosAngleLightToZenithCoordinate,distanceToHorizonCoordinate);return unit*TransmittanceLutDomainInUVSpace+TransmittanceLutHalfTexelSize; }
vec4 sampleTransmittanceLut(sampler2D transmittanceLut,float positionRadius,float cosAngleLightToZenith) {float distanceToHorizon;vec2 uv=getTransmittanceUV(positionRadius,cosAngleLightToZenith,distanceToHorizon);float weight=smoothstep(TransmittanceMinOccludedU,TransmittanceMaxUnoccludedU,uv.x);return weight*textureLod(transmittanceLut,uv,0.);}
#endif
#ifndef EXCLUDE_RAY_MARCHING_FUNCTIONS
#ifndef COMPUTE_MULTI_SCATTERING
vec3 sampleMultiScatteringLut(sampler2D multiScatteringLut,float radius,float cosAngleLightToZenith) {vec2 unit=vec2(0.5+0.5*cosAngleLightToZenith,(radius-planetRadius)/atmosphereThickness);vec2 uv=unitToUV(unit,MultiScatteringLutDomainInUVSpace,MultiScatteringLutHalfTexelSize);vec3 multiScattering=textureLod(multiScatteringLut,uv,0.).rgb;return max(minMultiScattering,multiScattering);}
#endif
const float uniformPhase=RECIPROCAL_PI4;vec3 integrateScatteredRadiance(
bool isAerialPerspectiveLut,
float lightIntensity,
sampler2D transmittanceLut,
#ifndef COMPUTE_MULTI_SCATTERING
sampler2D multiScatteringLut,
float multiScatteringIntensity,
#endif
vec3 rayOriginGlobal,
vec3 rayDirection,
vec3 directionToLight,
float tMaxMax,
float sampleCount,
float distanceToSurface,
out vec3 transmittance
#if COMPUTE_MULTI_SCATTERING
,out vec3 multiScattering
#endif
) {vec3 radiance=vec3(0.);transmittance=vec3(1.);
#if COMPUTE_MULTI_SCATTERING
multiScattering=vec3(0.);
#endif
float tBottom=sphereIntersectNearest(rayOriginGlobal,rayDirection,planetRadius);float tTop=sphereIntersectNearest(rayOriginGlobal,rayDirection,atmosphereRadius);float tMax=0.;if (tBottom<0.) {if (tTop<0.) {return radiance;} else {tMax=tTop;}} else {if (tTop>0.) {if (isAerialPerspectiveLut) {tMax=tTop;} else {tMax=min(tBottom,tTop);}}}
if (distanceToSurface>0. && distanceToSurface<tMax) {tMax=distanceToSurface;}
tMax=min(tMax,tMaxMax);
#ifndef COMPUTE_MULTI_SCATTERING
float cosTheta=dot(rayDirection,directionToLight);float onePlusCosThetaSq=1.+cosTheta*cosTheta;float rayleighPhase=computeRayleighPhase(onePlusCosThetaSq);float miePhase=computeMiePhaseCornetteShanks(cosTheta,onePlusCosThetaSq);
#endif
float transmittanceScale=isAerialPerspectiveLut ? aerialPerspectiveTransmittanceScale : 1.;float t=0.;float sampleSegmentWeight=tMax/sampleCount;const float sampleSegmentT=0.3;for (float s=0.; s<sampleCount; s+=1.) {float newT=sampleSegmentWeight*(s+sampleSegmentT);float dt=newT-t;t=newT;vec3 samplePositionGlobal=rayOriginGlobal+t*rayDirection;float sampleRadiusGlobal=length(samplePositionGlobal);vec3 sampleGeocentricNormal=samplePositionGlobal/sampleRadiusGlobal;float sampleCosAngleLightToZenith=dot(directionToLight,sampleGeocentricNormal);vec3 scatteringRayleigh,scatteringMie,extinction,scattering;sampleMediumRGB(sampleRadiusGlobal-planetRadius,scatteringRayleigh,scatteringMie,extinction,scattering);vec3 transmittanceToLight=sampleTransmittanceLut(transmittanceLut,sampleRadiusGlobal,sampleCosAngleLightToZenith).rgb;
#if COMPUTE_MULTI_SCATTERING
vec3 phaseTimesScattering=uniformPhase*scattering;vec3 S=transmittanceToLight*phaseTimesScattering;
#else
vec3 phaseTimesScattering=scatteringMie*miePhase+scatteringRayleigh*rayleighPhase;vec3 multiScatteredRadiance=sampleMultiScatteringLut(multiScatteringLut,sampleRadiusGlobal,sampleCosAngleLightToZenith);vec3 S=transmittanceScale*transmittanceToLight*phaseTimesScattering+multiScatteringIntensity*multiScatteredRadiance*scattering;
#endif
vec3 sampleOpticalDepth=extinction*dt;vec3 sampleTransmittance=exp(-sampleOpticalDepth);vec3 clampedExtinction=max(vec3(0.0000001),extinction);vec3 SInt=(S-S*sampleTransmittance)/clampedExtinction;radiance+=transmittance*SInt;
#if COMPUTE_MULTI_SCATTERING
vec3 MSInt=(scattering-scattering*sampleTransmittance)/clampedExtinction;multiScattering+=transmittance*MSInt;
#endif
transmittance*=sampleTransmittance;}
#if USE_GROUND_ALBEDO
if (tMax==tBottom && tBottom>0.) {vec3 planetPos=rayOriginGlobal+tBottom*rayDirection;float planetPosRadius=length(planetPos);vec3 planetPosGeocentricNormal=planetPos/planetPosRadius;float nDotL=dot(directionToLight,planetPosGeocentricNormal);vec3 lightTransmittance=sampleTransmittanceLut(transmittanceLut,planetPosRadius,nDotL).rgb;const float diffuseBrdf=RECIPROCAL_PI;radiance+=lightTransmittance*transmittance*groundAlbedo*(nDotL*diffuseBrdf);}
#endif
radiance*=lightIntensity;return radiance;}
#endif
float layerIdxToAerialPerspectiveLayer(float layerIdx) {float layer=(layerIdx+1.)/NumAerialPerspectiveLutLayers;layer*=layer; 
layer*=NumAerialPerspectiveLutLayers;return layer;}
float toAerialPerspectiveDepth(float layer) {return layer*AerialPerspectiveLutKMPerSlice;}
float toAerialPerspectiveLayer(float distance,float aerialPerspectiveLutDistancePerSlice) {return distance/aerialPerspectiveLutDistancePerSlice;}
vec4 applyAerialPerspectiveSaturation(vec4 aerialPerspective) {float previousRadiance=getLuminanceUnclamped(aerialPerspective.rgb);aerialPerspective.rgb=mix(vec3(previousRadiance),aerialPerspective.rgb,aerialPerspectiveSaturation);return aerialPerspective;}
vec4 applyAerialPerspectiveIntensity(vec4 aerialPerspective) {
#if APPLY_AERIAL_PERSPECTIVE_INTENSITY
if (aerialPerspectiveIntensity==0.) {aerialPerspective=vec4(0.);} else {float previousAlpha=aerialPerspective.a;aerialPerspective/=max(0.00001,previousAlpha);aerialPerspective*=pow(previousAlpha,1./aerialPerspectiveIntensity);}
#endif
return aerialPerspective;}
vec4 applyAerialPerspectiveRadianceBias(vec4 aerialPerspective) {
#if APPLY_AERIAL_PERSPECTIVE_RADIANCE_BIAS
float originalRadiance=dot(aerialPerspective.rgb,LuminanceEncodeApprox);float targetRadiance=originalRadiance+aerialPerspectiveRadianceBias;if (originalRadiance>0.) {aerialPerspective*=max(0.,targetRadiance/originalRadiance);} else {aerialPerspective=max(vec4(0.),vec4(aerialPerspectiveRadianceBias));}
aerialPerspective.a=min(aerialPerspective.a,1.);
#endif
return aerialPerspective;}
bool sampleAerialPerspectiveLut(
vec2 screenUV,
bool clampToLutRange,
float distanceFromCamera,
float numAerialPerspectiveLutLayers,
float aerialPerspectiveLutKMPerSlice,
float aerialPerspectiveLutRangeKM,
out vec4 aerialPerspective) {aerialPerspective=vec4(0.);
#if USE_AERIAL_PERSPECTIVE_LUT
if (distanceFromCamera>0. &&
(clampToLutRange || distanceFromCamera<aerialPerspectiveLutRangeKM) &&
clampedCameraRadius<=atmosphereRadius) {float layer=toAerialPerspectiveLayer(distanceFromCamera,aerialPerspectiveLutKMPerSlice);float normalizedLayer=sqrt(layer/numAerialPerspectiveLutLayers); 
layer=min(normalizedLayer*numAerialPerspectiveLutLayers,numAerialPerspectiveLutLayers);float weight=min(layer,1.);float layerIdx=max(0.,layer-1.);float floorLayerIdx=floor(layerIdx);vec4 aerialPerspectiveLayer0=textureLod(aerialPerspectiveLut,vec3(screenUV,floorLayerIdx),0.);vec4 aerialPerspectiveLayer1=textureLod(aerialPerspectiveLut,vec3(screenUV,floorLayerIdx+1.),0.);aerialPerspective=mix(aerialPerspectiveLayer0,aerialPerspectiveLayer1,layerIdx-floorLayerIdx);aerialPerspective.rgb*=atmosphereExposure;aerialPerspective=applyAerialPerspectiveSaturation(aerialPerspective);aerialPerspective=weight*applyAerialPerspectiveIntensity(aerialPerspective);aerialPerspective=applyAerialPerspectiveRadianceBias(aerialPerspective);return true;}
#endif
return false;}
#if RENDER_TRANSMITTANCE
void getTransmittanceParameters(vec2 uv,out float radius,out float cosAngleLightToZenith,out float distanceToAtmosphereEdge) {vec2 unit=uvToUnit(uv,TransmittanceLutDomainInUVSpace,TransmittanceLutHalfTexelSize);float distanceToHorizon=unit.y*horizonDistanceToAtmosphereEdge;float distanceToHorizonSquared=distanceToHorizon*distanceToHorizon;radius=sqrtClamped(distanceToHorizonSquared+planetRadiusSquared);float minDistanceToAtmosphereEdge=atmosphereRadius-radius;float maxDistanceToAtmosphereEdge=distanceToHorizon+horizonDistanceToAtmosphereEdge;distanceToAtmosphereEdge=minDistanceToAtmosphereEdge+unit.x*(maxDistanceToAtmosphereEdge-minDistanceToAtmosphereEdge);float distanceToAtmosphereEdgeSquared=distanceToAtmosphereEdge*distanceToAtmosphereEdge;cosAngleLightToZenith =
distanceToAtmosphereEdge<=0. ?
1. :
(horizonDistanceToAtmosphereEdgeSquared-distanceToAtmosphereEdgeSquared-distanceToHorizonSquared)/(2.*radius*distanceToAtmosphereEdge);cosAngleLightToZenith=clamp(cosAngleLightToZenith,-1.,1.);}
vec4 renderTransmittance(vec2 uv) {float radius,cosAngleLightToZenith,distanceToAtmosphereEdgeAlongAngle;getTransmittanceParameters(uv,radius,cosAngleLightToZenith,distanceToAtmosphereEdgeAlongAngle);float sinAngleLightToZenith=sqrtClamped(1.-cosAngleLightToZenith*cosAngleLightToZenith);vec3 directionToLight=normalize(vec3(0.,cosAngleLightToZenith,sinAngleLightToZenith));vec3 transmittance=computeTransmittance(vec3(0.,radius,0.),directionToLight,distanceToAtmosphereEdgeAlongAngle,transmittanceSampleCount);return vec4(transmittance,avg(transmittance));}
#endif
#if RENDER_MULTI_SCATTERING
vec3 getSphereSample(float azimuth,float inclination,out float sinInclination) {sinInclination=sin(inclination);return vec3(sinInclination*sin(azimuth),cos(inclination),sinInclination*cos(azimuth));}
vec4 renderMultiScattering(vec2 uv,sampler2D transmittanceLut) {float MultiScatteringAzimuthIterationAngle=TWO_PI/multiScatteringAzimuthSampleCount;float MultiScatteringInclinationIterationAngle=PI/multiScatteringInclinationSampleCount;float MultiScatteringAngleStepProduct=MultiScatteringAzimuthIterationAngle*MultiScatteringInclinationIterationAngle;vec2 unit=uvToUnit(uv,MultiScatteringLutDomainInUVSpace,MultiScatteringLutHalfTexelSize);float cosAngleLightToZenith=2.*unit.x-1.;float sinAngleLightToZenith=sqrtClamped(1.-cosAngleLightToZenith*cosAngleLightToZenith);vec3 directionToLight=normalize(vec3(0.,cosAngleLightToZenith,sinAngleLightToZenith));float rayOriginRadius=planetRadius+max(unit.y,0.001)*atmosphereThickness;vec3 rayOrigin=vec3(0.,rayOriginRadius,0.);vec3 inscattered=vec3(0.);vec3 multiScatteringTotal=vec3(0.);for (float i=0.5; i<multiScatteringAzimuthSampleCount; i+=1.) {float azimuth=MultiScatteringAzimuthIterationAngle*i;for (float j=0.5; j<multiScatteringInclinationSampleCount; j+=1.) {float inclination=MultiScatteringInclinationIterationAngle*j;float sinInclination;vec3 rayDirection=getSphereSample(azimuth,inclination,sinInclination);vec3 transmittance;vec3 multiScattering;vec3 radiance=integrateScatteredRadiance(
false,
1.,
transmittanceLut,
rayOrigin,
rayDirection,
directionToLight,
100000000.,
multiScatteringLutSampleCount,
-1.,
transmittance,
multiScattering);float weight=RECIPROCAL_PI4*abs(sinInclination)*MultiScatteringAngleStepProduct;multiScatteringTotal+=multiScattering*weight;inscattered+=radiance*weight;}}
vec3 multiScattering=inscattered/max(vec3(0.000001),vec3(1.)-multiScatteringTotal);return vec4(multiScattering,1.);}
#endif
float computeCosHorizonAngleFromZenith(float radius) {float sinAngleBetweenHorizonAndNadir=min(1.,planetRadius/radius);float cosHorizonAngleFromNadir=sqrt(1.-sinAngleBetweenHorizonAndNadir*sinAngleBetweenHorizonAndNadir);float cosHorizonAngleFromZenith=-cosHorizonAngleFromNadir;return cosHorizonAngleFromZenith;}
#if RENDER_SKY_VIEW
void getSkyViewParametersFromUV(
float radius,
vec2 uv,
out float cosAngleBetweenViewAndZenith,
out float cosAngleBetweenViewAndLightOnPlane) {vec2 unit=uvToUnit(uv,SkyViewLutDomainInUVSpace,SkyViewLutHalfTexelSize);float cosHorizonAngleFromZenith=computeCosHorizonAngleFromZenith(radius);if (unit.y<0.5) {float coord=2.*unit.y; 
coord*=coord; 
cosAngleBetweenViewAndZenith=mix(-1.,cosHorizonAngleFromZenith,coord); } else {float coord=2.*unit.y-1.; 
coord*=coord; 
cosAngleBetweenViewAndZenith=mix(cosHorizonAngleFromZenith,1.,coord); }
{float coord=unit.x;cosAngleBetweenViewAndLightOnPlane=1.-2.*coord;}}
vec4 renderSkyView(vec2 uv,sampler2D transmittanceLut,sampler2D multiScatteringLut) {float cosAngleBetweenViewAndZenith;float cosAngleBetweenViewAndLightOnPlane;getSkyViewParametersFromUV(clampedCameraRadius,uv,cosAngleBetweenViewAndZenith,cosAngleBetweenViewAndLightOnPlane);float sinAngleBetweenViewAndZenith=sqrtClamped(1.-cosAngleBetweenViewAndZenith*cosAngleBetweenViewAndZenith);float sinAngleBetweenViewAndLightOnPlane=sqrtClamped(1.-cosAngleBetweenViewAndLightOnPlane*cosAngleBetweenViewAndLightOnPlane);vec3 rayDirection =
vec3(
sinAngleBetweenViewAndZenith*cosAngleBetweenViewAndLightOnPlane,
cosAngleBetweenViewAndZenith,
sinAngleBetweenViewAndZenith*sinAngleBetweenViewAndLightOnPlane);bool intersectsAtmosphere=false;vec3 cameraPositionGlobalClampedToTopOfAtmosphere=vec3(0.);moveToTopAtmosphere(
vec3(0.,clampedCameraRadius,0.),
clampedCameraRadius,
vec3(0.,1.,0.),
rayDirection,
intersectsAtmosphere,
cameraPositionGlobalClampedToTopOfAtmosphere);if (!intersectsAtmosphere) {return vec4(0.);}
vec3 transmittance;vec3 radiance=integrateScatteredRadiance(
false,
atmosphereExposure*lightIntensity,
transmittanceLut,
multiScatteringLut,
multiScatteringIntensity,
cameraPositionGlobalClampedToTopOfAtmosphere,
rayDirection,
directionToLightRelativeToCameraGeocentricNormal,
100000000.,
skyViewLutSampleCount,
-1.,
transmittance);float transparency=1.-avg(transmittance);return vec4(radiance,transparency);}
#endif
#if RENDER_CAMERA_VOLUME
vec4 renderCameraVolume(
vec3 positionOnNearPlane,
float layerIdx,
sampler2D transmittanceLut,
sampler2D multiScatteringLut) {vec4 result=vec4(0.);vec3 rayDirection=normalize(positionOnNearPlane);float layer=layerIdxToAerialPerspectiveLayer(layerIdx);float tMax=toAerialPerspectiveDepth(layer);float tMaxMax=tMax;vec3 cameraPositionGlobalClampedToTopOfAtmosphere=clampedCameraPositionGlobal;if (clampedCameraRadius>=atmosphereRadius) {bool intersectsAtmosphere=false;moveToTopAtmosphere(
clampedCameraPositionGlobal,
clampedCameraRadius,
cameraGeocentricNormal,
rayDirection,
intersectsAtmosphere,
cameraPositionGlobalClampedToTopOfAtmosphere);if (!intersectsAtmosphere) {return result;}
float distanceToAtmosphere=distance(clampedCameraPositionGlobal,cameraPositionGlobalClampedToTopOfAtmosphere);if (tMaxMax<distanceToAtmosphere) {return result;}
tMaxMax=max(0.,tMaxMax-distanceToAtmosphere);}
float sampleCount=min(skyViewLutSampleCount,2.*layer+2.);vec3 transmittance;vec3 radiance=integrateScatteredRadiance(
true,
lightIntensity,
transmittanceLut,
multiScatteringLut,
multiScatteringIntensity,
cameraPositionGlobalClampedToTopOfAtmosphere,
rayDirection,
directionToLight,
tMaxMax,
sampleCount,
-1.,
transmittance);float transparency=1.-avg(transmittance);result=vec4(radiance,transparency);return result;}
#endif
`;a.ShaderStore.IncludesShadersStore[dt]||(a.ShaderStore.IncludesShadersStore[dt]=Oi);const de={name:dt,shader:Oi};var Yr={__proto__:null,atmosphereFunctions:de};const mt="atmosphereUboDeclaration",Di=`layout(std140,column_major) uniform;uniform Atmosphere {vec3 peakRayleighScattering;float planetRadius;vec3 peakMieScattering;float atmosphereThickness;vec3 peakMieAbsorption;float planetRadiusSquared;vec3 peakMieExtinction;float atmosphereRadius;vec3 peakOzoneAbsorption;float atmosphereRadiusSquared;float horizonDistanceToAtmosphereEdge;float horizonDistanceToAtmosphereEdgeSquared;float planetRadiusWithOffset;float planetRadiusOffset;float atmosphereExposure;float aerialPerspectiveRadianceBias;float inverseAtmosphereThickness;float aerialPerspectiveTransmittanceScale;mat4 inverseViewProjectionWithoutTranslation;vec3 directionToLight;float multiScatteringIntensity;vec3 directionToLightRelativeToCameraGeocentricNormal;float cameraRadius;vec3 lightRadianceAtCamera;float diffuseSkyIrradianceDesaturationFactor;vec3 groundAlbedo;float aerialPerspectiveSaturation;vec3 minMultiScattering;float diffuseSkyIrradianceIntensity;vec3 cameraPositionGlobal;float lightIntensity;vec3 clampedCameraPositionGlobal;float aerialPerspectiveIntensity;vec3 cameraGeocentricNormal;float clampedCameraRadius;vec3 cameraForward;float clampedCameraHeight;vec3 cameraPosition;float cosCameraHorizonAngleFromZenith;vec4 viewport;vec3 additionalDiffuseSkyIrradiance;float cameraHeight;float cameraNearPlane;float originHeight;float sinCameraAtmosphereHorizonAngleFromNadir;float transmittanceSampleCount;float skyViewLutSampleCount;float multiScatteringLutSampleCount;float multiScatteringAzimuthSampleCount;float multiScatteringInclinationSampleCount;float diffuseSkyIrradianceLutSampleCount;};
`;a.ShaderStore.IncludesShadersStore[mt]||(a.ShaderStore.IncludesShadersStore[mt]=Di);const ne={name:mt,shader:Di};var jr={__proto__:null,atmosphereUboDeclaration:ne};const pt="atmosphereFragmentDeclaration",Ni=`uniform vec3 peakRayleighScattering;uniform float planetRadius;uniform vec3 peakMieScattering;uniform float atmosphereThickness;uniform vec3 peakMieAbsorption;uniform float planetRadiusSquared;uniform vec3 peakMieExtinction;uniform float atmosphereRadius;uniform vec3 peakOzoneAbsorption;uniform float atmosphereRadiusSquared;uniform float horizonDistanceToAtmosphereEdge;uniform float horizonDistanceToAtmosphereEdgeSquared;uniform float planetRadiusWithOffset;uniform float planetRadiusOffset;uniform float atmosphereExposure;uniform float aerialPerspectiveRadianceBias;uniform float inverseAtmosphereThickness;uniform float aerialPerspectiveTransmittanceScale;uniform mat4 inverseViewProjectionWithoutTranslation;uniform vec3 directionToLight;uniform float multiScatteringIntensity;uniform vec3 directionToLightRelativeToCameraGeocentricNormal;uniform float cameraRadius;uniform vec3 lightRadianceAtCamera;uniform float diffuseSkyIrradianceDesaturationFactor;uniform vec3 groundAlbedo;uniform float aerialPerspectiveSaturation;uniform vec3 minMultiScattering;uniform float diffuseSkyIrradianceIntensity;uniform vec3 cameraPositionGlobal;uniform float lightIntensity;uniform vec3 clampedCameraPositionGlobal;uniform float aerialPerspectiveIntensity;uniform vec3 cameraGeocentricNormal;uniform float clampedCameraRadius;uniform vec3 cameraForward;uniform float clampedCameraHeight;uniform vec3 cameraPosition;uniform float cosCameraHorizonAngleFromZenith;uniform vec4 viewport;uniform vec3 additionalDiffuseSkyIrradiance;uniform float cameraHeight;uniform float cameraNearPlane;uniform float originHeight;uniform float sinCameraAtmosphereHorizonAngleFromNadir;uniform float transmittanceSampleCount;uniform float skyViewLutSampleCount;uniform float multiScatteringLutSampleCount;uniform float multiScatteringAzimuthSampleCount;uniform float multiScatteringInclinationSampleCount;uniform float diffuseSkyIrradianceLutSampleCount;
`;a.ShaderStore.IncludesShadersStore[pt]||(a.ShaderStore.IncludesShadersStore[pt]=Ni);const ae={name:pt,shader:Ni};var Xr={__proto__:null,atmosphereFragmentDeclaration:ae};const ft="fullscreenTriangleVertexShader",Ui=`#include<atmosphereUboDeclaration>
#if POSITION_VEC2
attribute position: vec2f;
#else
attribute position: vec3f;
#endif
uniform depth: f32;varying vUV: vec2f;
#if COMPUTE_WORLD_RAY
varying positionOnNearPlane: vec3f;
#endif
#if COMPUTE_WORLD_RAY
const nearPlaneNDC: f32=-1.0;
#endif
@vertex
fn main(input: VertexInputs)->FragmentInputs {vertexOutputs.position=vec4f(input.position.xy,uniforms.depth,1.0);vertexOutputs.vUV=input.position.xy*vec2f(0.5,0.5)+vec2f(0.5,0.5);
#if COMPUTE_WORLD_RAY
vertexOutputs.positionOnNearPlane=(atmosphere.inverseViewProjectionWithoutTranslation*vec4f(input.position.xy,nearPlaneNDC,1.0)).xyz;
#endif
}
`;a.ShaderStore.ShadersStoreWGSL[ft]||(a.ShaderStore.ShadersStoreWGSL[ft]=Ui);const Qr=[re];for(const n of Qr)a.ShaderStore.IncludesShadersStoreWGSL[n.name]||(a.ShaderStore.IncludesShadersStoreWGSL[n.name]=n.shader);var pe={__proto__:null,fullscreenTriangleVertexShaderWGSL:{name:ft,shader:Ui}};const gt="diffuseSkyIrradiancePixelShader",Fi=`#include<atmosphereUboDeclaration>
var transmittanceLutSampler: sampler;var transmittanceLut: texture_2d<f32>;var multiScatteringLutSampler: sampler;var multiScatteringLut: texture_2d<f32>;
#include<helperFunctions>
#include<atmosphereFunctions>
fn integrateForIrradiance(directionToLightParam: vec3f,rayDirection: vec3f,rayOrigin: vec3f)->vec3f {var transmittance: vec3f;let radiance=integrateScatteredRadiance(
false,
1.,
transmittanceLut,
multiScatteringLut,
atmosphere.multiScatteringIntensity,
rayOrigin,
rayDirection.xzy,
directionToLightParam.xzy,
100000000.,
atmosphere.diffuseSkyIrradianceLutSampleCount,
-1.,
&transmittance);return radiance;}
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
varying vUV: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let unit=uvToUnit(input.vUV,DiffuseSkyIrradianceLutDomainInUVSpace,DiffuseSkyIrradianceLutHalfTexelSize);let cosLightInclination=2.*unit.x-1.;let sinLightInclination=sqrtClamped(1.-cosLightInclination*cosLightInclination);let directionToLight=normalize(vec3f(0.,cosLightInclination,sinLightInclination));let radius=max(atmosphere.planetRadiusWithOffset,unit.y*atmosphere.atmosphereThickness+atmosphere.planetRadius);let swappedDirectionToLight=vec3f(directionToLight.x,directionToLight.z,directionToLight.y); 
var irradianceResult=PI*irradiance(
swappedDirectionToLight,
vec2f(radius,0.),
1.,
vec3f(1.),
vec3f(1.));let averageIrradiance=getLuminanceUnclamped(irradianceResult);let newIrradiance=mix(irradianceResult,vec3f(averageIrradiance),atmosphere.diffuseSkyIrradianceDesaturationFactor);let newIrradianceScale=getLuminanceUnclamped(newIrradiance);let rescaling=averageIrradiance/max(0.000001,newIrradianceScale);irradianceResult=newIrradiance*rescaling;fragmentOutputs.color=vec4f(irradianceResult,1.);}
`;a.ShaderStore.ShadersStoreWGSL[gt]||(a.ShaderStore.ShadersStoreWGSL[gt]=Fi);const Kr=[re,a.helperFunctionsWGSL,a.intersectionFunctionsWGSL,he,a.importanceSamplingWGSL,a.pbrBRDFFunctionsWGSL,a.hdrFilteringFunctionsWGSL];for(const n of Kr)a.ShaderStore.IncludesShadersStoreWGSL[n.name]||(a.ShaderStore.IncludesShadersStoreWGSL[n.name]=n.shader);var Jr={__proto__:null,diffuseSkyIrradiancePixelShaderWGSL:{name:gt,shader:Fi}};const vt="fullscreenTriangleVertexShader",Vi=`precision highp float;
#include<__decl__atmosphereFragment>
#if POSITION_VEC2
attribute vec2 position;
#else
attribute vec3 position;
#endif
uniform float depth;varying vec2 uv;
#if COMPUTE_WORLD_RAY
varying vec3 positionOnNearPlane;
#endif
#if COMPUTE_WORLD_RAY
const float nearPlaneNDC=-1.;
#endif
void main() {gl_Position=vec4(position.xy,depth,1.);uv=0.5*position.xy+vec2(0.5);
#if COMPUTE_WORLD_RAY
positionOnNearPlane=(inverseViewProjectionWithoutTranslation*vec4(position.xy,nearPlaneNDC,1.)).xyz;
#endif
}`;a.ShaderStore.ShadersStore[vt]||(a.ShaderStore.ShadersStore[vt]=Vi);const en=[ae,ne];for(const n of en)a.ShaderStore.IncludesShadersStore[n.name]||(a.ShaderStore.IncludesShadersStore[n.name]=n.shader);var fe={__proto__:null,fullscreenTriangleVertexShader:{name:vt,shader:Vi}};const _t="diffuseSkyIrradiancePixelShader",ki=`precision highp float;
#include<__decl__atmosphereFragment>
uniform sampler2D transmittanceLut;uniform sampler2D multiScatteringLut;
#include<helperFunctions>
#include<atmosphereFunctions>
vec3 integrateForIrradiance(vec3 directionToLight,vec3 rayDirection,vec3 rayOrigin) {vec3 transmittance;vec3 radiance=integrateScatteredRadiance(
false,
1.,
transmittanceLut,
multiScatteringLut,
multiScatteringIntensity,
rayOrigin,
rayDirection.xzy,
directionToLight.xzy,
100000000.,
diffuseSkyIrradianceLutSampleCount,
-1.,
transmittance);return radiance;}
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
varying vec2 uv;void main() {vec2 unit=uvToUnit(uv,DiffuseSkyIrradianceLutDomainInUVSpace,DiffuseSkyIrradianceLutHalfTexelSize);float cosLightInclination=2.*unit.x-1.;float sinLightInclination=sqrtClamped(1.-cosLightInclination*cosLightInclination);vec3 directionToLight=normalize(vec3(0.,cosLightInclination,sinLightInclination));float radius=max(planetRadiusWithOffset,unit.y*atmosphereThickness+planetRadius);vec3 swappedDirectionToLight=vec3(directionToLight.x,directionToLight.z,directionToLight.y); 
vec3 irradiance=PI*irradiance(
swappedDirectionToLight,
vec2(radius,0.),
1.,
vec3(1.),
vec3(1.));float averageIrradiance=getLuminanceUnclamped(irradiance);vec3 newIrradiance=mix(irradiance,vec3(averageIrradiance),diffuseSkyIrradianceDesaturationFactor);float newIrradianceScale=getLuminanceUnclamped(newIrradiance);float rescaling=averageIrradiance/max(0.000001,newIrradianceScale);irradiance=newIrradiance*rescaling;gl_FragColor=vec4(irradiance,1.);}`;a.ShaderStore.ShadersStore[_t]||(a.ShaderStore.ShadersStore[_t]=ki);const tn=[ae,ne,a.helperFunctions,a.intersectionFunctions,de,a.importanceSampling,a.pbrBRDFFunctions,a.hdrFilteringFunctions];for(const n of tn)a.ShaderStore.IncludesShadersStore[n.name]||(a.ShaderStore.IncludesShadersStore[n.name]=n.shader);var rn={__proto__:null,diffuseSkyIrradiancePixelShader:{name:_t,shader:ki}};const St="transmittancePixelShader",Gi=`#define RENDER_TRANSMITTANCE
#define EXCLUDE_RAY_MARCHING_FUNCTIONS
#include<atmosphereUboDeclaration>
#include<helperFunctions>
#include<atmosphereFunctions>
varying vUV: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=renderTransmittance(input.vUV);}
`;a.ShaderStore.ShadersStoreWGSL[St]||(a.ShaderStore.ShadersStoreWGSL[St]=Gi);const nn=[re,a.helperFunctionsWGSL,a.intersectionFunctionsWGSL,he];for(const n of nn)a.ShaderStore.IncludesShadersStoreWGSL[n.name]||(a.ShaderStore.IncludesShadersStoreWGSL[n.name]=n.shader);var an={__proto__:null,transmittancePixelShaderWGSL:{name:St,shader:Gi}};const yt="transmittancePixelShader",zi=`#define RENDER_TRANSMITTANCE
#define EXCLUDE_RAY_MARCHING_FUNCTIONS
precision highp float;
#include<__decl__atmosphereFragment>
#include<helperFunctions>
#include<atmosphereFunctions>
varying vec2 uv;void main() {gl_FragColor=renderTransmittance(uv);}`;a.ShaderStore.ShadersStore[yt]||(a.ShaderStore.ShadersStore[yt]=zi);const sn=[ae,ne,a.helperFunctions,a.intersectionFunctions,de];for(const n of sn)a.ShaderStore.IncludesShadersStore[n.name]||(a.ShaderStore.IncludesShadersStore[n.name]=n.shader);var on={__proto__:null,transmittancePixelShader:{name:yt,shader:zi}};const Tt="multiScatteringPixelShader",Bi=`#define RENDER_MULTI_SCATTERING
#define COMPUTE_MULTI_SCATTERING
#include<atmosphereUboDeclaration>
var transmittanceLutSampler: sampler;var transmittanceLut: texture_2d<f32>;
#include<helperFunctions>
#include<atmosphereFunctions>
varying vUV: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=renderMultiScattering(input.vUV,transmittanceLut);}
`;a.ShaderStore.ShadersStoreWGSL[Tt]||(a.ShaderStore.ShadersStoreWGSL[Tt]=Bi);const ln=[re,a.helperFunctionsWGSL,a.intersectionFunctionsWGSL,he];for(const n of ln)a.ShaderStore.IncludesShadersStoreWGSL[n.name]||(a.ShaderStore.IncludesShadersStoreWGSL[n.name]=n.shader);var cn={__proto__:null,multiScatteringPixelShaderWGSL:{name:Tt,shader:Bi}};const At="multiScatteringPixelShader",Wi=`#define RENDER_MULTI_SCATTERING
#define COMPUTE_MULTI_SCATTERING
precision highp float;
#include<__decl__atmosphereFragment>
uniform sampler2D transmittanceLut;
#include<helperFunctions>
#include<atmosphereFunctions>
varying vec2 uv;void main() {gl_FragColor=renderMultiScattering(uv,transmittanceLut);}`;a.ShaderStore.ShadersStore[At]||(a.ShaderStore.ShadersStore[At]=Wi);const un=[ae,ne,a.helperFunctions,a.intersectionFunctions,de];for(const n of un)a.ShaderStore.IncludesShadersStore[n.name]||(a.ShaderStore.IncludesShadersStore[n.name]=n.shader);var hn={__proto__:null,multiScatteringPixelShader:{name:At,shader:Wi}};const Lt="compositeSkyPixelShader",Hi=`#define SAMPLE_SKY_VIEW_LUT
#if USE_SKY_VIEW_LUT
#define EXCLUDE_RAY_MARCHING_FUNCTIONS
#endif
#include<atmosphereUboDeclaration>
#if USE_SKY_VIEW_LUT
var skyViewLutSampler: sampler;var skyViewLut: texture_2d<f32>;
#else
var transmittanceLutSampler: sampler;var transmittanceLut: texture_2d<f32>;var multiScatteringLutSampler: sampler;var multiScatteringLut: texture_2d<f32>;
#endif
#include<helperFunctions>
#include<atmosphereFunctions>
varying vUV: vec2f;varying positionOnNearPlane: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(0.);let rayDirection=normalize(input.positionOnNearPlane);
#if USE_SKY_VIEW_LUT
var cosAngleBetweenViewAndZenith: f32;var isRayIntersectingGround: bool;var skyColor=sampleSkyViewLut(
skyViewLut,
atmosphere.clampedCameraRadius,
atmosphere.cameraGeocentricNormal,
rayDirection,
atmosphere.directionToLight,
atmosphere.cosCameraHorizonAngleFromZenith,
&cosAngleBetweenViewAndZenith,
&isRayIntersectingGround);
#ifndef APPLY_TRANSMITTANCE_BLENDING
skyColor=vec4f(skyColor.rgb,0.);
#endif
fragmentOutputs.color=skyColor;fragmentOutputs.color=vec4f(fragmentOutputs.color.rgb,select(fragmentOutputs.color.a,1.,isRayIntersectingGround));
#else
var intersectsAtmosphere=false;var cameraPositionGlobalClampedToTopOfAtmosphere=vec3f(0.);moveToTopAtmosphere(
atmosphere.clampedCameraPositionGlobal,
atmosphere.clampedCameraRadius,
atmosphere.cameraGeocentricNormal,
rayDirection,
&intersectsAtmosphere,
&cameraPositionGlobalClampedToTopOfAtmosphere);if (!intersectsAtmosphere) {return fragmentOutputs;}
var transmittance: vec3f;let radiance=integrateScatteredRadiance(
false,
atmosphere.atmosphereExposure*atmosphere.lightIntensity,
transmittanceLut,
multiScatteringLut,
atmosphere.multiScatteringIntensity,
cameraPositionGlobalClampedToTopOfAtmosphere,
rayDirection,
atmosphere.directionToLight,
100000000.,
atmosphere.skyViewLutSampleCount,
-1.,
&transmittance);
#if APPLY_TRANSMITTANCE_BLENDING
let transparency=1.-avg(transmittance);
#else
let transparency=0.;
#endif
fragmentOutputs.color=vec4f(radiance,transparency);
#endif
#if OUTPUT_TO_SRGB
fragmentOutputs.color=toGammaSpace(fragmentOutputs.color);
#endif
}
`;a.ShaderStore.ShadersStoreWGSL[Lt]||(a.ShaderStore.ShadersStoreWGSL[Lt]=Hi);const dn=[re,a.helperFunctionsWGSL,a.intersectionFunctionsWGSL,he];for(const n of dn)a.ShaderStore.IncludesShadersStoreWGSL[n.name]||(a.ShaderStore.IncludesShadersStoreWGSL[n.name]=n.shader);var mn={__proto__:null,compositeSkyPixelShaderWGSL:{name:Lt,shader:Hi}};const Pt="compositeSkyPixelShader",qi=`#define SAMPLE_SKY_VIEW_LUT
#if USE_SKY_VIEW_LUT
#define EXCLUDE_RAY_MARCHING_FUNCTIONS
#endif
precision highp float;precision highp sampler2D;
#include<__decl__atmosphereFragment>
#if USE_SKY_VIEW_LUT
uniform sampler2D skyViewLut;
#else
uniform sampler2D transmittanceLut;uniform sampler2D multiScatteringLut;
#endif
#include<helperFunctions>
#include<atmosphereFunctions>
varying vec2 uv;varying vec3 positionOnNearPlane;void main() {gl_FragColor=vec4(0.);vec3 rayDirection=normalize(positionOnNearPlane);
#if USE_SKY_VIEW_LUT
float cosAngleBetweenViewAndZenith;bool isRayIntersectingGround;vec4 skyColor=sampleSkyViewLut(
skyViewLut,
clampedCameraRadius,
cameraGeocentricNormal,
rayDirection,
directionToLight,
cosCameraHorizonAngleFromZenith,
cosAngleBetweenViewAndZenith,
isRayIntersectingGround);
#ifndef APPLY_TRANSMITTANCE_BLENDING
skyColor.a=0.;
#endif
gl_FragColor=skyColor;gl_FragColor.a=isRayIntersectingGround ? 1. : gl_FragColor.a;
#else
bool intersectsAtmosphere=false;vec3 cameraPositionGlobalClampedToTopOfAtmosphere=vec3(0.);moveToTopAtmosphere(
clampedCameraPositionGlobal,
clampedCameraRadius,
cameraGeocentricNormal,
rayDirection,
intersectsAtmosphere,
cameraPositionGlobalClampedToTopOfAtmosphere);if (!intersectsAtmosphere) {return;}
vec3 transmittance;vec3 radiance=integrateScatteredRadiance(
false,
atmosphereExposure*lightIntensity,
transmittanceLut,
multiScatteringLut,
multiScatteringIntensity,
cameraPositionGlobalClampedToTopOfAtmosphere,
rayDirection,
directionToLight,
100000000.,
skyViewLutSampleCount,
-1.,
transmittance);
#if APPLY_TRANSMITTANCE_BLENDING
float transparency=1.-avg(transmittance);
#else
float transparency=0.;
#endif
gl_FragColor=vec4(radiance,transparency);
#endif
#if OUTPUT_TO_SRGB
gl_FragColor=toGammaSpace(gl_FragColor);
#endif
}`;a.ShaderStore.ShadersStore[Pt]||(a.ShaderStore.ShadersStore[Pt]=qi);const pn=[ae,ne,a.helperFunctions,a.intersectionFunctions,de];for(const n of pn)a.ShaderStore.IncludesShadersStore[n.name]||(a.ShaderStore.IncludesShadersStore[n.name]=n.shader);var fn={__proto__:null,compositeSkyPixelShader:{name:Pt,shader:qi}};const Et="aerialPerspectivePixelShader",Zi=`#define RENDER_CAMERA_VOLUME
#include<atmosphereUboDeclaration>
var transmittanceLutSampler: sampler;var transmittanceLut: texture_2d<f32>;var multiScatteringLutSampler: sampler;var multiScatteringLut: texture_2d<f32>;
#include<helperFunctions>
#include<atmosphereFunctions>
varying positionOnNearPlane: vec3f;uniform layerIdx: f32;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=renderCameraVolume(
input.positionOnNearPlane,
uniforms.layerIdx,
transmittanceLut,
multiScatteringLut
);}
`;a.ShaderStore.ShadersStoreWGSL[Et]||(a.ShaderStore.ShadersStoreWGSL[Et]=Zi);const gn=[re,a.helperFunctionsWGSL,a.intersectionFunctionsWGSL,he];for(const n of gn)a.ShaderStore.IncludesShadersStoreWGSL[n.name]||(a.ShaderStore.IncludesShadersStoreWGSL[n.name]=n.shader);var vn={__proto__:null,aerialPerspectivePixelShaderWGSL:{name:Et,shader:Zi}};const Rt="aerialPerspectivePixelShader",$i=`#define RENDER_CAMERA_VOLUME
precision highp float;
#include<__decl__atmosphereFragment>
uniform sampler2D transmittanceLut;uniform sampler2D multiScatteringLut;
#include<helperFunctions>
#include<atmosphereFunctions>
varying vec3 positionOnNearPlane;uniform float layerIdx;void main() {gl_FragColor=renderCameraVolume(
positionOnNearPlane,
layerIdx,
transmittanceLut,
multiScatteringLut
);}`;a.ShaderStore.ShadersStore[Rt]||(a.ShaderStore.ShadersStore[Rt]=$i);const _n=[ae,ne,a.helperFunctions,a.intersectionFunctions,de];for(const n of _n)a.ShaderStore.IncludesShadersStore[n.name]||(a.ShaderStore.IncludesShadersStore[n.name]=n.shader);var Sn={__proto__:null,aerialPerspectivePixelShader:{name:Rt,shader:$i}};const xt="depthFunctions",Yi=`fn reconstructDistanceFromCameraPlane(depth: f32,cameraNearPlane: f32)->f32 {return cameraNearPlane/(1.-depth);}
fn sampleDistanceFromCameraPlane(depthTex: texture_2d<f32>,depthSampler: sampler,uv: vec2f,cameraNearPlane: f32)->f32 {let depth=textureSampleLevel(depthTex,depthSampler,uv,0.).r;return select(reconstructDistanceFromCameraPlane(depth,cameraNearPlane),0.,depth>=1.);}
fn reconstructDistanceFromCamera(depth: f32,cameraRayDirection: vec3f,cameraForward: vec3f,cameraNearPlane: f32)->f32 {let distanceFromCameraPlane=reconstructDistanceFromCameraPlane(depth,cameraNearPlane);return distanceFromCameraPlane/max(.00001,dot(cameraForward,cameraRayDirection));}
fn reconstructDistanceFromCameraWithTexture(
depthTex: texture_2d<f32>,
depthSampler: sampler,
uv: vec2f,
cameraRayDirection: vec3f,
cameraForward: vec3f,
cameraNearPlane: f32)->f32 {let depth=textureSampleLevel(depthTex,depthSampler,uv,0.).r;return select(reconstructDistanceFromCamera(depth,cameraRayDirection,cameraForward,cameraNearPlane),0.,depth>=1.);}
`;a.ShaderStore.IncludesShadersStoreWGSL[xt]||(a.ShaderStore.IncludesShadersStoreWGSL[xt]=Yi);const ji={name:xt,shader:Yi},Ct="compositeAerialPerspectivePixelShader",Xi=`#include<atmosphereUboDeclaration>
#if USE_AERIAL_PERSPECTIVE_LUT
var aerialPerspectiveLutSampler: sampler;var aerialPerspectiveLut: texture_2d_array<f32>;
#endif
var depthTextureSampler: sampler;var depthTexture: texture_2d<f32>;var transmittanceLutSampler: sampler;var transmittanceLut: texture_2d<f32>;var multiScatteringLutSampler: sampler;var multiScatteringLut: texture_2d<f32>;
#include<helperFunctions>
#include<depthFunctions>
#include<atmosphereFunctions>
varying vUV: vec2f;varying positionOnNearPlane: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(0.);let depth=textureSampleLevel(depthTexture,depthTextureSampler,input.vUV,0.).r;if (depth>=1.) {discard;}
let rayDirection=normalize(input.positionOnNearPlane);let distanceFromCamera =
reconstructDistanceFromCamera(
depth,
rayDirection,
atmosphere.cameraForward,
atmosphere.cameraNearPlane);let distanceToSurface=distanceFromCamera/1000.;var aerialPerspective=vec4f(0.);if (sampleAerialPerspectiveLut(
input.vUV,
false,
distanceToSurface,
NumAerialPerspectiveLutLayers,
AerialPerspectiveLutKMPerSlice,
AerialPerspectiveLutRangeKM,
&aerialPerspective)) {
#ifndef APPLY_TRANSMITTANCE_BLENDING
aerialPerspective=vec4f(aerialPerspective.rgb,0.);
#endif
fragmentOutputs.color=aerialPerspective;} else {var intersectsAtmosphere=false;var cameraPositionGlobalClampedToTopOfAtmosphere=vec3f(0.);moveToTopAtmosphere(
atmosphere.clampedCameraPositionGlobal,
atmosphere.clampedCameraRadius,
atmosphere.cameraGeocentricNormal,
rayDirection,
&intersectsAtmosphere,
&cameraPositionGlobalClampedToTopOfAtmosphere);if (!intersectsAtmosphere) {fragmentOutputs.color=vec4f(0.);return fragmentOutputs;}
let isAerialPerspectiveLut=atmosphere.clampedCameraRadius<atmosphere.atmosphereRadius;var transmittance: vec3f;let radiance=integrateScatteredRadiance(
isAerialPerspectiveLut,
atmosphere.atmosphereExposure*atmosphere.lightIntensity,
transmittanceLut,
multiScatteringLut,
atmosphere.multiScatteringIntensity,
cameraPositionGlobalClampedToTopOfAtmosphere,
rayDirection,
atmosphere.directionToLight,
100000000.,
atmosphere.skyViewLutSampleCount,
distanceToSurface,
&transmittance);let transparency=1.-avg(transmittance);fragmentOutputs.color =
applyAerialPerspectiveRadianceBias(
applyAerialPerspectiveIntensity(
applyAerialPerspectiveSaturation(vec4f(radiance,transparency))));
#ifndef APPLY_TRANSMITTANCE_BLENDING
fragmentOutputs.color=vec4f(fragmentOutputs.color.rgb,0.);
#endif
}
#if OUTPUT_TO_SRGB
fragmentOutputs.color=toGammaSpace(fragmentOutputs.color);
#endif
}
`;a.ShaderStore.ShadersStoreWGSL[Ct]||(a.ShaderStore.ShadersStoreWGSL[Ct]=Xi);const yn=[re,a.helperFunctionsWGSL,ji,a.intersectionFunctionsWGSL,he];for(const n of yn)a.ShaderStore.IncludesShadersStoreWGSL[n.name]||(a.ShaderStore.IncludesShadersStoreWGSL[n.name]=n.shader);var Tn={__proto__:null,compositeAerialPerspectivePixelShaderWGSL:{name:Ct,shader:Xi}};const Mt="depthFunctions",Qi=`float reconstructDistanceFromCameraPlane(float depth,float cameraNearPlane) {return cameraNearPlane/(1.-depth);}
float sampleDistanceFromCameraPlane(sampler2D depthTexture,vec2 uv,float cameraNearPlane) {float depth=textureLod(depthTexture,uv,0.).r;return depth>=1. ? 0. : reconstructDistanceFromCameraPlane(depth,cameraNearPlane);}
float reconstructDistanceFromCamera(float depth,vec3 cameraRayDirection,vec3 cameraForward,float cameraNearPlane) {float distanceFromCameraPlane=reconstructDistanceFromCameraPlane(depth,cameraNearPlane);return distanceFromCameraPlane/max(0.00001,dot(cameraForward,cameraRayDirection));}
float reconstructDistanceFromCamera(
sampler2D depthTexture,
vec2 uv,
vec3 cameraRayDirection,
vec3 cameraForward,
float cameraNearPlane) {float depth=textureLod(depthTexture,uv,0.).r;return depth>=1. ? 0. : reconstructDistanceFromCamera(depth,cameraRayDirection,cameraForward,cameraNearPlane);}`;a.ShaderStore.IncludesShadersStore[Mt]||(a.ShaderStore.IncludesShadersStore[Mt]=Qi);const Ki={name:Mt,shader:Qi},It="compositeAerialPerspectivePixelShader",Ji=`precision highp float;precision highp sampler2D;precision highp sampler2DArray;
#include<__decl__atmosphereFragment>
#if USE_AERIAL_PERSPECTIVE_LUT
uniform sampler2DArray aerialPerspectiveLut;
#endif
uniform sampler2D depthTexture;uniform sampler2D transmittanceLut;uniform sampler2D multiScatteringLut;
#include<helperFunctions>
#include<depthFunctions>
#include<atmosphereFunctions>
varying vec2 uv;varying vec3 positionOnNearPlane;void main() {gl_FragColor=vec4(0.);float depth=textureLod(depthTexture,uv,0.).r;if (depth>=1.) {discard;}
vec3 rayDirection=normalize(positionOnNearPlane);float distanceFromCamera =
reconstructDistanceFromCamera(
depth,
rayDirection,
cameraForward,
cameraNearPlane);float distanceToSurface=distanceFromCamera/1000.;vec4 aerialPerspective=vec4(0.);if (sampleAerialPerspectiveLut(
uv,
false,
distanceToSurface,
NumAerialPerspectiveLutLayers,
AerialPerspectiveLutKMPerSlice,
AerialPerspectiveLutRangeKM,
aerialPerspective)) {
#ifndef APPLY_TRANSMITTANCE_BLENDING
aerialPerspective.a=0.;
#endif
gl_FragColor=aerialPerspective;} else {bool intersectsAtmosphere=false;vec3 cameraPositionGlobalClampedToTopOfAtmosphere=vec3(0.);moveToTopAtmosphere(
clampedCameraPositionGlobal,
clampedCameraRadius,
cameraGeocentricNormal,
rayDirection,
intersectsAtmosphere,
cameraPositionGlobalClampedToTopOfAtmosphere);if (!intersectsAtmosphere) {gl_FragColor=vec4(0.);return;}
bool isAerialPerspectiveLut=clampedCameraRadius<atmosphereRadius;vec3 transmittance;vec3 radiance=integrateScatteredRadiance(
isAerialPerspectiveLut,
atmosphereExposure*lightIntensity,
transmittanceLut,
multiScatteringLut,
multiScatteringIntensity,
cameraPositionGlobalClampedToTopOfAtmosphere,
rayDirection,
directionToLight,
100000000.,
skyViewLutSampleCount,
distanceToSurface,
transmittance);float transparency=1.-avg(transmittance);gl_FragColor =
applyAerialPerspectiveRadianceBias(
applyAerialPerspectiveIntensity(
applyAerialPerspectiveSaturation(vec4(radiance,transparency))));
#ifndef APPLY_TRANSMITTANCE_BLENDING
gl_FragColor.a=0.;
#endif
}
#if OUTPUT_TO_SRGB
gl_FragColor=toGammaSpace(gl_FragColor);
#endif
}`;a.ShaderStore.ShadersStore[It]||(a.ShaderStore.ShadersStore[It]=Ji);const An=[ae,ne,a.helperFunctions,Ki,a.intersectionFunctions,de];for(const n of An)a.ShaderStore.IncludesShadersStore[n.name]||(a.ShaderStore.IncludesShadersStore[n.name]=n.shader);var Ln={__proto__:null,compositeAerialPerspectivePixelShader:{name:It,shader:Ji}};const wt="compositeGlobeAtmospherePixelShader",er=`#define SAMPLE_SKY_VIEW_LUT
#if USE_SKY_VIEW_LUT
#define EXCLUDE_RAY_MARCHING_FUNCTIONS
#endif
#include<atmosphereUboDeclaration>
#if HAS_DEPTH_TEXTURE
var depthTextureSampler: sampler;var depthTexture: texture_2d<f32>;
#endif
#if USE_SKY_VIEW_LUT
var skyViewLutSampler: sampler;var skyViewLut: texture_2d<f32>;
#else
var transmittanceLutSampler: sampler;var transmittanceLut: texture_2d<f32>;var multiScatteringLutSampler: sampler;var multiScatteringLut: texture_2d<f32>;
#endif
#include<helperFunctions>
#include<depthFunctions>
#include<atmosphereFunctions>
varying vUV: vec2f;varying positionOnNearPlane: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(0.);
#if HAS_DEPTH_TEXTURE
let depth=textureSampleLevel(depthTexture,depthTextureSampler,input.vUV,0.).r;
#endif
let rayDirection=normalize(input.positionOnNearPlane);
#if USE_SKY_VIEW_LUT
var cosAngleBetweenViewAndZenith: f32;var isRayIntersectingGround: bool;var skyColor=sampleSkyViewLut(
skyViewLut,
atmosphere.clampedCameraRadius,
atmosphere.cameraGeocentricNormal,
rayDirection,
atmosphere.directionToLight,
atmosphere.cosCameraHorizonAngleFromZenith,
&cosAngleBetweenViewAndZenith,
&isRayIntersectingGround);fragmentOutputs.color=skyColor;if (isRayIntersectingGround) {fragmentOutputs.color =
applyAerialPerspectiveRadianceBias(
applyAerialPerspectiveIntensity(
applyAerialPerspectiveSaturation(fragmentOutputs.color)));
#if HAS_DEPTH_TEXTURE
fragmentOutputs.color=vec4f(fragmentOutputs.color.rgb,select(fragmentOutputs.color.a,1.,depth>=1.));
#endif
}
#else
var intersectsAtmosphere=false;var cameraPositionGlobalClampedToTopOfAtmosphere=vec3f(0.);moveToTopAtmosphere(
atmosphere.clampedCameraPositionGlobal,
atmosphere.clampedCameraRadius,
atmosphere.cameraGeocentricNormal,
rayDirection,
&intersectsAtmosphere,
&cameraPositionGlobalClampedToTopOfAtmosphere);if (!intersectsAtmosphere) {return fragmentOutputs;}
#if HAS_DEPTH_TEXTURE
let distanceFromCamera =
reconstructDistanceFromCamera(
depth,
rayDirection,
atmosphere.cameraForward,
atmosphere.cameraNearPlane);let distanceToSurface=distanceFromCamera/1000.;
#else
let distanceToSurface=0.;
#endif
var transmittance: vec3f;let radiance=integrateScatteredRadiance(
false,
atmosphere.atmosphereExposure*atmosphere.lightIntensity,
transmittanceLut,
multiScatteringLut,
atmosphere.multiScatteringIntensity,
cameraPositionGlobalClampedToTopOfAtmosphere,
rayDirection,
atmosphere.directionToLight,
100000000.,
atmosphere.skyViewLutSampleCount,
distanceToSurface,
&transmittance);let transparency=1.-avg(transmittance);fragmentOutputs.color=vec4f(radiance,transparency);if (distanceToSurface>0.) {fragmentOutputs.color =
applyAerialPerspectiveRadianceBias(
applyAerialPerspectiveIntensity(
applyAerialPerspectiveSaturation(fragmentOutputs.color)));
#if HAS_DEPTH_TEXTURE
fragmentOutputs.color=vec4f(fragmentOutputs.color.rgb,select(fragmentOutputs.color.a,1.,depth>=1.));
#endif
}
#endif
#if OUTPUT_TO_SRGB
fragmentOutputs.color=toGammaSpace(fragmentOutputs.color);
#endif
}
`;a.ShaderStore.ShadersStoreWGSL[wt]||(a.ShaderStore.ShadersStoreWGSL[wt]=er);const Pn=[re,a.helperFunctionsWGSL,ji,a.intersectionFunctionsWGSL,he];for(const n of Pn)a.ShaderStore.IncludesShadersStoreWGSL[n.name]||(a.ShaderStore.IncludesShadersStoreWGSL[n.name]=n.shader);var En={__proto__:null,compositeGlobeAtmospherePixelShaderWGSL:{name:wt,shader:er}};const bt="compositeGlobeAtmospherePixelShader",tr=`#define SAMPLE_SKY_VIEW_LUT
#if USE_SKY_VIEW_LUT
#define EXCLUDE_RAY_MARCHING_FUNCTIONS
#endif
precision highp float;precision highp sampler2D;
#include<__decl__atmosphereFragment>
#if HAS_DEPTH_TEXTURE
uniform sampler2D depthTexture;
#endif
#if USE_SKY_VIEW_LUT
uniform sampler2D skyViewLut;
#else
uniform sampler2D transmittanceLut;uniform sampler2D multiScatteringLut;
#endif
#include<helperFunctions>
#include<depthFunctions>
#include<atmosphereFunctions>
varying vec2 uv;varying vec3 positionOnNearPlane;void main() {gl_FragColor=vec4(0.);
#if HAS_DEPTH_TEXTURE
float depth=textureLod(depthTexture,uv,0.).r;
#endif
vec3 rayDirection=normalize(positionOnNearPlane);
#if USE_SKY_VIEW_LUT
float cosAngleBetweenViewAndZenith;bool isRayIntersectingGround;vec4 skyColor=sampleSkyViewLut(
skyViewLut,
clampedCameraRadius,
cameraGeocentricNormal,
rayDirection,
directionToLight,
cosCameraHorizonAngleFromZenith,
cosAngleBetweenViewAndZenith,
isRayIntersectingGround);gl_FragColor=skyColor;if (isRayIntersectingGround) {gl_FragColor =
applyAerialPerspectiveRadianceBias(
applyAerialPerspectiveIntensity(
applyAerialPerspectiveSaturation(gl_FragColor)));
#if HAS_DEPTH_TEXTURE
gl_FragColor.a=depth>=1. ? 1. : gl_FragColor.a;
#endif
}
#else
bool intersectsAtmosphere=false;vec3 cameraPositionGlobalClampedToTopOfAtmosphere=vec3(0.);moveToTopAtmosphere(
clampedCameraPositionGlobal,
clampedCameraRadius,
cameraGeocentricNormal,
rayDirection,
intersectsAtmosphere,
cameraPositionGlobalClampedToTopOfAtmosphere);if (!intersectsAtmosphere) {return;}
#if HAS_DEPTH_TEXTURE
float distanceFromCamera =
reconstructDistanceFromCamera(
depth,
rayDirection,
cameraForward,
cameraNearPlane);float distanceToSurface=distanceFromCamera/1000.;
#else
float distanceToSurface=0.;
#endif
vec3 transmittance;vec3 radiance=integrateScatteredRadiance(
false,
atmosphereExposure*lightIntensity,
transmittanceLut,
multiScatteringLut,
multiScatteringIntensity,
cameraPositionGlobalClampedToTopOfAtmosphere,
rayDirection,
directionToLight,
100000000.,
skyViewLutSampleCount,
distanceToSurface,
transmittance);float transparency=1.-avg(transmittance);gl_FragColor=vec4(radiance,transparency);if (distanceToSurface>0.) {gl_FragColor =
applyAerialPerspectiveRadianceBias(
applyAerialPerspectiveIntensity(
applyAerialPerspectiveSaturation(gl_FragColor)));
#if HAS_DEPTH_TEXTURE
gl_FragColor.a=depth>=1. ? 1. : gl_FragColor.a;
#endif
}
#endif
#if OUTPUT_TO_SRGB
gl_FragColor=toGammaSpace(gl_FragColor);
#endif
}`;a.ShaderStore.ShadersStore[bt]||(a.ShaderStore.ShadersStore[bt]=tr);const Rn=[ae,ne,a.helperFunctions,Ki,a.intersectionFunctions,de];for(const n of Rn)a.ShaderStore.IncludesShadersStore[n.name]||(a.ShaderStore.IncludesShadersStore[n.name]=n.shader);var xn={__proto__:null,compositeGlobeAtmospherePixelShader:{name:bt,shader:tr}};const Ot="skyViewPixelShader",ir=`#define RENDER_SKY_VIEW
#include<atmosphereUboDeclaration>
var transmittanceLutSampler: sampler;var transmittanceLut: texture_2d<f32>;var multiScatteringLutSampler: sampler;var multiScatteringLut: texture_2d<f32>;
#include<helperFunctions>
#include<atmosphereFunctions>
varying vUV: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=renderSkyView(input.vUV,transmittanceLut,multiScatteringLut);}
`;a.ShaderStore.ShadersStoreWGSL[Ot]||(a.ShaderStore.ShadersStoreWGSL[Ot]=ir);const Cn=[re,a.helperFunctionsWGSL,a.intersectionFunctionsWGSL,he];for(const n of Cn)a.ShaderStore.IncludesShadersStoreWGSL[n.name]||(a.ShaderStore.IncludesShadersStoreWGSL[n.name]=n.shader);var Mn={__proto__:null,skyViewPixelShaderWGSL:{name:Ot,shader:ir}};const Dt="skyViewPixelShader",rr=`#define RENDER_SKY_VIEW
precision highp float;precision highp sampler2D;
#include<__decl__atmosphereFragment>
uniform sampler2D transmittanceLut;uniform sampler2D multiScatteringLut;
#include<helperFunctions>
#include<atmosphereFunctions>
varying vec2 uv;void main() {gl_FragColor=renderSkyView(uv,transmittanceLut,multiScatteringLut);}`;a.ShaderStore.ShadersStore[Dt]||(a.ShaderStore.ShadersStore[Dt]=rr);const In=[ae,ne,a.helperFunctions,a.intersectionFunctions,de];for(const n of In)a.ShaderStore.IncludesShadersStore[n.name]||(a.ShaderStore.IncludesShadersStore[n.name]=n.shader);var wn={__proto__:null,skyViewPixelShader:{name:Dt,shader:rr}};const Nt="multiTextureCompositeAlphaBlendPixelShader",nr=`var uLayers: texture_2d_array<f32>;var uLayersSampler: sampler;uniform uLayerCount: i32;varying vUV: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=vec4f(0.0);for (var i: i32=0; i<MULTITEXTURE_MAXLAYERS; i++) {if (i>=uniforms.uLayerCount) { break; }
let s: vec4f=textureSampleLevel(uLayers,uLayersSampler,input.vUV,i,0.0);
#ifdef MULTITEXTURE_PREMULTIPLY
result=s+result*(1.0-s.a);
#else
let pm: vec4f=vec4f(s.rgb*s.a,s.a);result=pm+result*(1.0-s.a);
#endif
}
let outA: f32=result.a;fragmentOutputs.color=vec4f(select(vec3f(0.0),result.rgb/outA,outA>0.0),outA);}
`;a.ShaderStore.ShadersStoreWGSL[Nt]||(a.ShaderStore.ShadersStoreWGSL[Nt]=nr);var bn={__proto__:null,multiTextureCompositeAlphaBlendPixelShaderWGSL:{name:Nt,shader:nr}};const Ut="multiTextureCompositeAlphaMaxPixelShader",ar=`var uLayers: texture_2d_array<f32>;var uLayersSampler: sampler;uniform uLayerCount: i32;varying vUV: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=vec4f(0.0);for (var i: i32=0; i<MULTITEXTURE_MAXLAYERS; i++) {if (i>=uniforms.uLayerCount) { break; }
let s: vec4f=textureSampleLevel(uLayers,uLayersSampler,input.vUV,i,0.0);if (s.a>=result.a) {result=s;}}
fragmentOutputs.color=result;}
`;a.ShaderStore.ShadersStoreWGSL[Ut]||(a.ShaderStore.ShadersStoreWGSL[Ut]=ar);var On={__proto__:null,multiTextureCompositeAlphaMaxPixelShaderWGSL:{name:Ut,shader:ar}};const Ft="multiTextureCompositeAddPixelShader",sr=`var uLayers: texture_2d_array<f32>;var uLayersSampler: sampler;uniform uLayerCount: i32;varying vUV: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=vec4f(0.0);for (var i: i32=0; i<MULTITEXTURE_MAXLAYERS; i++) {if (i>=uniforms.uLayerCount) { break; }
let s: vec4f=textureSampleLevel(uLayers,uLayersSampler,input.vUV,i,0.0);result=min(result+s,vec4f(1.0));}
fragmentOutputs.color=result;}
`;a.ShaderStore.ShadersStoreWGSL[Ft]||(a.ShaderStore.ShadersStoreWGSL[Ft]=sr);var Dn={__proto__:null,multiTextureCompositeAddPixelShaderWGSL:{name:Ft,shader:sr}};const Vt="multiTextureCompositeMultiplyPixelShader",or=`var uLayers: texture_2d_array<f32>;var uLayersSampler: sampler;uniform uLayerCount: i32;varying vUV: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=vec4f(1.0);for (var i: i32=0; i<MULTITEXTURE_MAXLAYERS; i++) {if (i>=uniforms.uLayerCount) { break; }
let s: vec4f=textureSampleLevel(uLayers,uLayersSampler,input.vUV,i,0.0);result=result*s;if (dot(result,vec4f(1.0))==0.0) { break; }}
fragmentOutputs.color=result;} `;a.ShaderStore.ShadersStoreWGSL[Vt]||(a.ShaderStore.ShadersStoreWGSL[Vt]=or);var Nn={__proto__:null,multiTextureCompositeMultiplyPixelShaderWGSL:{name:Vt,shader:or}};const kt="multiTextureCompositeSubtractPixelShader",lr=`var uLayers: texture_2d_array<f32>;var uLayersSampler: sampler;uniform uLayerCount: i32;varying vUV: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=textureSampleLevel(uLayers,uLayersSampler,input.vUV,0,0.0);for (var i: i32=1; i<MULTITEXTURE_MAXLAYERS; i++) {if (i>=uniforms.uLayerCount) { break; }
let s: vec4f=textureSampleLevel(uLayers,uLayersSampler,input.vUV,i,0.0);result=max(result-s,vec4f(0.0));if (dot(result,vec4f(1.0))==0.0) { break; }}
fragmentOutputs.color=result;}
`;a.ShaderStore.ShadersStoreWGSL[kt]||(a.ShaderStore.ShadersStoreWGSL[kt]=lr);var Un={__proto__:null,multiTextureCompositeSubtractPixelShaderWGSL:{name:kt,shader:lr}};const Gt="multiTextureCompositeScreenPixelShader",cr=`var uLayers: texture_2d_array<f32>;var uLayersSampler: sampler;uniform uLayerCount: i32;varying vUV: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var result: vec4f=vec4f(0.0);for (var i: i32=0; i<MULTITEXTURE_MAXLAYERS; i++) {if (i>=uniforms.uLayerCount) { break; }
let s: vec4f=textureSampleLevel(uLayers,uLayersSampler,input.vUV,i,0.0);result=vec4f(1.0)-(vec4f(1.0)-result)*(vec4f(1.0)-s);if (all(result==vec4f(1.0))) { break; }}
fragmentOutputs.color=result;}
`;a.ShaderStore.ShadersStoreWGSL[Gt]||(a.ShaderStore.ShadersStoreWGSL[Gt]=cr);var Fn={__proto__:null,multiTextureCompositeScreenPixelShaderWGSL:{name:Gt,shader:cr}};const zt="multiTextureCompositeAlphaBlendPixelShader",ur=`uniform highp sampler2DArray uLayers;uniform int uLayerCount;varying vec2 vUV;void main() {vec4 result=vec4(0.0);for (int i=0; i<MULTITEXTURE_MAXLAYERS; ++i) {if (i>=uLayerCount) break;vec4 s=texture(uLayers,vec3(vUV,float(i)));
#ifdef MULTITEXTURE_PREMULTIPLY
result=s+result*(1.0-s.a);
#else
result=vec4(s.rgb*s.a,s.a)+result*(1.0-s.a);
#endif
}
gl_FragColor=vec4((result.a>0.0) ? result.rgb/result.a : vec3(0.0),result.a);}
`;a.ShaderStore.ShadersStore[zt]||(a.ShaderStore.ShadersStore[zt]=ur);var Vn={__proto__:null,multiTextureCompositeAlphaBlendPixelShader:{name:zt,shader:ur}};const Bt="multiTextureCompositeAlphaMaxPixelShader",hr=`uniform highp sampler2DArray uLayers;uniform int uLayerCount;varying vec2 vUV;void main() {vec4 result=vec4(0.0);for (int i=0; i<MULTITEXTURE_MAXLAYERS; ++i) {if (i>=uLayerCount) break;vec4 s=texture(uLayers,vec3(vUV,float(i)));if (s.a>=result.a) {result=s;}}
gl_FragColor=result;}
`;a.ShaderStore.ShadersStore[Bt]||(a.ShaderStore.ShadersStore[Bt]=hr);var kn={__proto__:null,multiTextureCompositeAlphaMaxPixelShader:{name:Bt,shader:hr}};const Wt="multiTextureCompositeAddPixelShader",dr=`uniform highp sampler2DArray uLayers;uniform int uLayerCount;varying vec2 vUV;void main() {vec4 result=vec4(0.0);for (int i=0; i<MULTITEXTURE_MAXLAYERS; ++i) {if (i>=uLayerCount) break;vec4 s=texture(uLayers,vec3(vUV,float(i)));result=min(result+s,vec4(1.0));}
gl_FragColor=result;}
`;a.ShaderStore.ShadersStore[Wt]||(a.ShaderStore.ShadersStore[Wt]=dr);var Gn={__proto__:null,multiTextureCompositeAddPixelShader:{name:Wt,shader:dr}};const Ht="multiTextureCompositeMultiplyPixelShader",mr=`uniform highp sampler2DArray uLayers;uniform int uLayerCount;varying vec2 vUV;void main() {vec4 result=vec4(1.0);for (int i=0; i<MULTITEXTURE_MAXLAYERS; ++i) {if (i>=uLayerCount) break;vec4 s=texture(uLayers,vec3(vUV,float(i)));result=result*s;if (dot(result,vec4(1.0))==0.0) break;}
gl_FragColor=result;}
`;a.ShaderStore.ShadersStore[Ht]||(a.ShaderStore.ShadersStore[Ht]=mr);var zn={__proto__:null,multiTextureCompositeMultiplyPixelShader:{name:Ht,shader:mr}};const qt="multiTextureCompositeSubtractPixelShader",pr=`uniform highp sampler2DArray uLayers;uniform int uLayerCount;varying vec2 vUV;void main() {vec4 result=texture(uLayers,vec3(vUV,0.0));for (int i=1; i<MULTITEXTURE_MAXLAYERS; ++i) {if (i>=uLayerCount) break;vec4 s=texture(uLayers,vec3(vUV,float(i)));result=max(result-s,vec4(0.0));if (dot(result,vec4(1.0))==0.0) break;}
gl_FragColor=result;}
`;a.ShaderStore.ShadersStore[qt]||(a.ShaderStore.ShadersStore[qt]=pr);var Bn={__proto__:null,multiTextureCompositeSubtractPixelShader:{name:qt,shader:pr}};const Zt="multiTextureCompositeScreenPixelShader",fr=`uniform highp sampler2DArray uLayers;uniform int uLayerCount;varying vec2 vUV;void main() {vec4 result=vec4(0.0);for (int i=0; i<MULTITEXTURE_MAXLAYERS; ++i) {if (i>=uLayerCount) break;vec4 s=texture(uLayers,vec3(vUV,float(i)));result=1.0-(1.0-result)*(1.0-s);if (all(equal(result,vec4(1.0)))) break;}
gl_FragColor=result;}
`;a.ShaderStore.ShadersStore[Zt]||(a.ShaderStore.ShadersStore[Zt]=fr);var Wn={__proto__:null,multiTextureCompositeScreenPixelShader:{name:Zt,shader:fr}};v.Atmosphere=class{static IsSupported(n){return!n._badOS&&(n.isWebGPU||n.version>=2)}get exposure(){return this._exposure}set exposure(n){this._exposure=Math.max(0,n)}get multiScatteringIntensity(){return this._multiScatteringIntensity}set multiScatteringIntensity(n){var e;Math.max(0,n)!==this._multiScatteringIntensity&&(this._multiScatteringIntensity=n,(e=this._diffuseSkyIrradianceLut)===null||e===void 0||e.markDirty())}get groundAlbedo(){return this._groundAlbedo}set groundAlbedo(n){var e;this._groundAlbedo.equals(n)||(this._groundAlbedo.copyFrom(n),(e=this._multiScatteringEffectWrapper)===null||e===void 0||e.dispose(),this._multiScatteringEffectWrapper=null,this._hasRenderedMultiScatteringLut=!1)}get minimumMultiScatteringColor(){return this._minimumMultiScatteringColor}set minimumMultiScatteringColor(n){var e;if(!this._minimumMultiScatteringColor.equals(n)){const t=this._minimumMultiScatteringColor.copyFrom(n);this._minimumMultiScattering.x=t.r*this._minimumMultiScatteringIntensity,this._minimumMultiScattering.y=t.g*this._minimumMultiScatteringIntensity,this._minimumMultiScattering.z=t.b*this._minimumMultiScatteringIntensity,(e=this._diffuseSkyIrradianceLut)===null||e===void 0||e.markDirty()}}get minimumMultiScatteringIntensity(){return this._minimumMultiScatteringIntensity}set minimumMultiScatteringIntensity(n){var e;Math.max(0,n)!==this._minimumMultiScatteringIntensity&&(this._minimumMultiScatteringIntensity=n,this._minimumMultiScattering.x=this._minimumMultiScatteringColor.r*n,this._minimumMultiScattering.y=this._minimumMultiScatteringColor.g*n,this._minimumMultiScattering.z=this._minimumMultiScatteringColor.b*n,(e=this._diffuseSkyIrradianceLut)===null||e===void 0||e.markDirty())}get diffuseSkyIrradianceDesaturationFactor(){return this._diffuseSkyIrradianceDesaturationFactor}set diffuseSkyIrradianceDesaturationFactor(n){var e;const t=Math.max(n,0);t!==this._diffuseSkyIrradianceDesaturationFactor&&(this._diffuseSkyIrradianceDesaturationFactor=t,(e=this._diffuseSkyIrradianceLut)===null||e===void 0||e.markDirty())}get additionalDiffuseSkyIrradianceIntensity(){return this._additionalDiffuseSkyIrradianceIntensity}set additionalDiffuseSkyIrradianceIntensity(n){(n=Math.max(0,n))!==this._additionalDiffuseSkyIrradianceIntensity&&(this._additionalDiffuseSkyIrradianceIntensity=n,this._additionalDiffuseSkyIrradianceColor.scaleToRef(n,this._additionalDiffuseSkyIrradiance))}get additionalDiffuseSkyIrradianceColor(){return this._additionalDiffuseSkyIrradianceColor}set additionalDiffuseSkyIrradianceColor(n){this._additionalDiffuseSkyIrradianceColor.equals(n)||this._additionalDiffuseSkyIrradianceColor.copyFrom(n).scaleToRef(this._additionalDiffuseSkyIrradianceIntensity,this._additionalDiffuseSkyIrradiance)}get additionalDiffuseSkyIrradiance(){return this._additionalDiffuseSkyIrradiance}get diffuseSkyIrradianceIntensity(){return this._diffuseSkyIrradianceIntensity}set diffuseSkyIrradianceIntensity(n){this._diffuseSkyIrradianceIntensity=Math.max(n,0)}get isSkyViewLutEnabled(){return this._isSkyViewLutEnabled}set isSkyViewLutEnabled(n){this._isSkyViewLutEnabled=n,this._disposeSkyCompositor(),this._disposeGlobeAtmosphereCompositor()}get skyViewLutRenderTarget(){if(!this._isSkyViewLutEnabled)return null;if(this._skyViewLutRenderTarget!==null)return this._skyViewLutRenderTarget;const n=this._skyViewLutRenderTarget=$e("atmo-skyView",{width:128,height:128},this.scene);return n.coordinatesMode=a.Constants.TEXTURE_EQUIRECTANGULAR_MODE,this._skyViewLutEffectWrapper=((e,t)=>{const i=e.isWebGPU&&!a.EffectWrapper.ForceGLSL,r=i?"atmosphere":t.name;return Ee(e,"atmo-skyView","skyView",["depth",...t.useUbo?[]:t.getUniformNames()],["transmittanceLut","multiScatteringLut"],t.useUbo?[r]:[],["POSITION_VEC2"],i,(s,o)=>{o.push(...i?[Promise.resolve().then(function(){return pe}),Promise.resolve().then(function(){return Mn})]:[Promise.resolve().then(function(){return fe}),Promise.resolve().then(function(){return wn})])})})(this._engine,this.uniformBuffer),n}get isAerialPerspectiveLutEnabled(){return this._isAerialPerspectiveLutEnabled}set isAerialPerspectiveLutEnabled(n){this._isAerialPerspectiveLutEnabled=n,this._disposeAerialPerspectiveCompositor()}get aerialPerspectiveLutRenderTarget(){if(!this._isAerialPerspectiveLutEnabled)return null;if(this._aerialPerspectiveLutRenderTarget!==null)return this._aerialPerspectiveLutRenderTarget;const n=this.scene,e=this._aerialPerspectiveLutRenderTarget=$e("atmo-aerialPerspective",{width:16,height:64,layers:32},n,{});return this._aerialPerspectiveLutEffectWrapper=((t,i)=>{const r=t.isWebGPU&&!a.EffectWrapper.ForceGLSL,s=r?"atmosphere":i.name;return Ee(t,"atmo-aerialPerspective","aerialPerspective",["layerIdx",...i.useUbo?[]:i.getUniformNames()],["transmittanceLut","multiScatteringLut"],i.useUbo?[s]:[],["POSITION_VEC2","COMPUTE_WORLD_RAY"],r,(o,c)=>{c.push(...r?[Promise.resolve().then(function(){return pe}),Promise.resolve().then(function(){return vn})]:[Promise.resolve().then(function(){return fe}),Promise.resolve().then(function(){return Sn})])})})(this._engine,this.uniformBuffer),e}get aerialPerspectiveIntensity(){return this._aerialPerspectiveIntensity}set aerialPerspectiveIntensity(n){if((n=Math.max(.001,n))!==this._aerialPerspectiveIntensity){const e=n===1!=(this._aerialPerspectiveIntensity===1);this._aerialPerspectiveIntensity=n,e&&(this._disposeAerialPerspectiveCompositor(),this._disposeGlobeAtmosphereCompositor())}}get aerialPerspectiveTransmittanceScale(){return this._aerialPerspectiveTransmittanceScale}set aerialPerspectiveTransmittanceScale(n){(n=Math.max(0,n))!==this._aerialPerspectiveTransmittanceScale&&(this._aerialPerspectiveTransmittanceScale=n)}get aerialPerspectiveSaturation(){return this._aerialPerspectiveSaturation}set aerialPerspectiveSaturation(n){(n=Math.max(0,n))!==this._aerialPerspectiveSaturation&&(this._aerialPerspectiveSaturation=n)}get aerialPerspectiveRadianceBias(){return this._aerialPerspectiveRadianceBias}set aerialPerspectiveRadianceBias(n){if(n!==this._aerialPerspectiveRadianceBias){const e=n===0!=(this._aerialPerspectiveRadianceBias===0);this._aerialPerspectiveRadianceBias=n,e&&(this._disposeAerialPerspectiveCompositor(),this._disposeGlobeAtmosphereCompositor())}}get isLinearSpaceComposition(){return this._isLinearSpaceComposition}set isLinearSpaceComposition(n){n!==this._isLinearSpaceComposition&&(this._isLinearSpaceComposition=n,this._disposeSkyCompositor(),this._disposeAerialPerspectiveCompositor(),this._disposeGlobeAtmosphereCompositor())}get isLinearSpaceLight(){return this._isLinearSpaceLight}set isLinearSpaceLight(n){this._isLinearSpaceLight=n}get transmittanceLut(){return this._transmittanceLut}get multiScatteringLutRenderTarget(){return this._multiScatteringLutRenderTarget}get diffuseSkyIrradianceLut(){return this._diffuseSkyIrradianceLut}get physicalProperties(){return this._physicalProperties}get originHeight(){return this._originHeight}set originHeight(n){this._originHeight=n}get applyApproximateTransmittance(){return this._applyApproximateTransmittance}set applyApproximateTransmittance(n){this._applyApproximateTransmittance!==n&&(this._applyApproximateTransmittance=n,this._disposeSkyCompositor(),this._disposeAerialPerspectiveCompositor(),this._disposeGlobeAtmosphereCompositor())}get lights(){return this._lights}get skyRenderingGroup(){return this._skyRenderingGroup}set skyRenderingGroup(n){this._skyRenderingGroup=n,this.scene.renderingManager.getRenderingGroup(n)}get aerialPerspectiveRenderingGroup(){return this._aerialPerspectiveRenderingGroup}set aerialPerspectiveRenderingGroup(n){this._aerialPerspectiveRenderingGroup=n,this.scene.renderingManager.getRenderingGroup(n)}get globeAtmosphereRenderingGroup(){return this._globeAtmosphereRenderingGroup}set globeAtmosphereRenderingGroup(n){this._globeAtmosphereRenderingGroup=n,this.scene.renderingManager.getRenderingGroup(n)}get uniformBuffer(){if(this._atmosphereUbo===null){const n=this._atmosphereUbo=new a.UniformBuffer(this._engine,void 0,!0,"Atmosphere");n.addUniform("peakRayleighScattering",3),n.addUniform("planetRadius",1),n.addUniform("peakMieScattering",3),n.addUniform("atmosphereThickness",1),n.addUniform("peakMieAbsorption",3),n.addUniform("planetRadiusSquared",1),n.addUniform("peakMieExtinction",3),n.addUniform("atmosphereRadius",1),n.addUniform("peakOzoneAbsorption",3),n.addUniform("atmosphereRadiusSquared",1),n.addUniform("horizonDistanceToAtmosphereEdge",1),n.addUniform("horizonDistanceToAtmosphereEdgeSquared",1),n.addUniform("planetRadiusWithOffset",1),n.addUniform("planetRadiusOffset",1),n.addUniform("atmosphereExposure",1),n.addUniform("aerialPerspectiveRadianceBias",1),n.addUniform("inverseAtmosphereThickness",1),n.addUniform("aerialPerspectiveTransmittanceScale",1),n.addUniform("inverseViewProjectionWithoutTranslation",16),n.addUniform("directionToLight",3),n.addUniform("multiScatteringIntensity",1),n.addUniform("directionToLightRelativeToCameraGeocentricNormal",3),n.addUniform("cameraRadius",1),n.addUniform("lightRadianceAtCamera",3),n.addUniform("diffuseSkyIrradianceDesaturationFactor",1),n.addUniform("groundAlbedo",3),n.addUniform("aerialPerspectiveSaturation",1),n.addUniform("minMultiScattering",3),n.addUniform("diffuseSkyIrradianceIntensity",1),n.addUniform("cameraPositionGlobal",3),n.addUniform("lightIntensity",1),n.addUniform("clampedCameraPositionGlobal",3),n.addUniform("aerialPerspectiveIntensity",1),n.addUniform("cameraGeocentricNormal",3),n.addUniform("clampedCameraRadius",1),n.addUniform("cameraForward",3),n.addUniform("clampedCameraHeight",1),n.addUniform("cameraPosition",3),n.addUniform("cosCameraHorizonAngleFromZenith",1),n.addUniform("viewport",4),n.addUniform("additionalDiffuseSkyIrradiance",3),n.addUniform("cameraHeight",1),n.addUniform("cameraNearPlane",1),n.addUniform("originHeight",1),n.addUniform("sinCameraAtmosphereHorizonAngleFromNadir",1),n.addUniform("transmittanceSampleCount",1),n.addUniform("skyViewLutSampleCount",1),n.addUniform("multiScatteringLutSampleCount",1),n.addUniform("multiScatteringAzimuthSampleCount",1),n.addUniform("multiScatteringInclinationSampleCount",1),n.addUniform("diffuseSkyIrradianceLutSampleCount",1),n.create()}return this._atmosphereUbo}get cameraAtmosphereVariables(){return this._cameraAtmosphereVariables}constructor(n,e,t,i){var r,s,o,c,l,u,h,d,m,p,f,_,S,g,L,x,R,C,O,w,B,Q;this.name=n,this.scene=e,this._directionToLight=a.Vector3.Zero(),this._tempSceneAmbient=new a.Color3,this._additionalDiffuseSkyIrradiance=new a.Color3,this._atmosphereUbo=null,this._minimumMultiScattering=new a.Vector3,this._cameraAtmosphereVariables=new N,this._lightRadianceAtCamera=new a.Vector3,this._linearLightColor=new a.Color3,this._atmosphereUniformBufferAsArray=[],this._effectRenderer=null,this._isEnabled=!0,this._aerialPerspectiveLutHasBeenRendered=!1,this._hasRenderedMultiScatteringLut=!1,this._hasEverRenderedMultiScatteringLut=!1,this._multiScatteringEffectWrapper=null,this._multiScatteringLutRenderTarget=null,this._aerialPerspectiveLutEffectWrapper=null,this._aerialPerspectiveLutEffectRenderer=null,this._aerialPerspectiveLutRenderTarget=null,this._skyViewLutEffectWrapper=null,this._skyViewLutEffectRenderer=null,this._skyViewLutRenderTarget=null,this._aerialPerspectiveCompositorEffectWrapper=null,this._skyCompositorEffectWrapper=null,this._globeAtmosphereCompositorEffectWrapper=null,this._onBeforeCameraRenderObserver=null,this._onBeforeRenderObserver=null,this._onBeforeDrawPhaseObserver=null,this._onAfterRenderingGroupObserver=null,this.uniqueId=Mr++,this._materialPluginName=`atmo-pbr-${this.uniqueId}`,this.onAfterUpdateVariablesForCameraObservable=new a.Observable,this.onBeforeLightVariablesUpdateObservable=new a.Observable,this.onBeforeRenderLutsForCameraObservable=new a.Observable,this.onAfterRenderLutsForCameraObservable=new a.Observable,this.depthTexture=null,this.getTransmittedColorToRef=(P,E,T,Pe)=>this._transmittanceLut.getTransmittedColorToRef(P,E,T,Pe),this.getDiffuseSkyIrradianceToRef=(P,E,T,Pe,I)=>{var V,k;return(k=(V=this._diffuseSkyIrradianceLut)===null||V===void 0?void 0:V.getDiffuseSkyIrradianceToRef(P,E,T,Pe,I))!==null&&k!==void 0?k:(I.r=0,I.g=0,I.b=0,I)},a.RegisterEngineUniformBuffer(),a.RegisterEnginesExtensionsEngineRenderTarget();const J=this._engine=e.getEngine();if(!J.isWebGPU&&J.version<2)throw new Error(`Atmosphere is not supported on WebGL ${J.version}.`);if(this._physicalProperties=(r=i==null?void 0:i.physicalProperties)!==null&&r!==void 0?r:new jt,this._physicalProperties.onChangedObservable.add(()=>{var P;(P=this._transmittanceLut)===null||P===void 0||P.markDirty()}),t.length!==1)throw new Error("Atmosphere only supports one light source currently.");this._lights=t,this.depthTexture=(s=i==null?void 0:i.depthTexture)!==null&&s!==void 0?s:null,this._exposure=(o=i==null?void 0:i.exposure)!==null&&o!==void 0?o:1,this._isLinearSpaceLight=(c=i==null?void 0:i.isLinearSpaceLight)!==null&&c!==void 0&&c,this._isLinearSpaceComposition=(l=i==null?void 0:i.isLinearSpaceComposition)!==null&&l!==void 0&&l,this._applyApproximateTransmittance=(u=i==null?void 0:i.applyApproximateTransmittance)===null||u===void 0||u,this._aerialPerspectiveRadianceBias=(h=i==null?void 0:i.aerialPerspectiveRadianceBias)!==null&&h!==void 0?h:0,this._aerialPerspectiveTransmittanceScale=(d=i==null?void 0:i.aerialPerspectiveTransmittanceScale)!==null&&d!==void 0?d:1,this._aerialPerspectiveSaturation=(m=i==null?void 0:i.aerialPerspectiveSaturation)!==null&&m!==void 0?m:1,this._aerialPerspectiveIntensity=(p=i==null?void 0:i.aerialPerspectiveIntensity)!==null&&p!==void 0?p:1,this._diffuseSkyIrradianceDesaturationFactor=(f=i==null?void 0:i.diffuseSkyIrradianceDesaturationFactor)!==null&&f!==void 0?f:.5,this._diffuseSkyIrradianceIntensity=(_=i==null?void 0:i.diffuseSkyIrradianceIntensity)!==null&&_!==void 0?_:1,this._additionalDiffuseSkyIrradianceIntensity=(S=i==null?void 0:i.additionalDiffuseSkyIrradianceIntensity)!==null&&S!==void 0?S:.01,this._multiScatteringIntensity=(g=i==null?void 0:i.multiScatteringIntensity)!==null&&g!==void 0?g:1,this._minimumMultiScatteringIntensity=(L=i==null?void 0:i.minimumMultiScatteringIntensity)!==null&&L!==void 0?L:618e-6,this._isSkyViewLutEnabled=(x=i==null?void 0:i.isSkyViewLutEnabled)===null||x===void 0||x,this._isAerialPerspectiveLutEnabled=(R=i==null?void 0:i.isAerialPerspectiveLutEnabled)===null||R===void 0||R,this._originHeight=(C=i==null?void 0:i.originHeight)!==null&&C!==void 0?C:0,this._additionalDiffuseSkyIrradianceColor=i!=null&&i.additionalDiffuseSkyIrradianceColor?new a.Color3().copyFrom(i.additionalDiffuseSkyIrradianceColor):new a.Color3(163/255,199/255,1),this._groundAlbedo=i!=null&&i.groundAlbedo?new a.Color3().copyFrom(i.groundAlbedo):new a.Color3().set(124/255,165/255,1);const Z=this._minimumMultiScatteringColor=i!=null&&i.minimumMultiScatteringColor?new a.Color3().copyFrom(i.minimumMultiScatteringColor):new a.Color3(30/255,40/255,77/255);this._skyRenderingGroup=(O=i==null?void 0:i.skyRenderingGroup)!==null&&O!==void 0?O:0,this._aerialPerspectiveRenderingGroup=(w=i==null?void 0:i.aerialPerspectiveRenderingGroup)!==null&&w!==void 0?w:0,this._globeAtmosphereRenderingGroup=(B=i==null?void 0:i.globeAtmosphereRenderingGroup)!==null&&B!==void 0?B:0,this._additionalDiffuseSkyIrradianceColor.scaleToRef(this._additionalDiffuseSkyIrradianceIntensity,this._additionalDiffuseSkyIrradiance),this._minimumMultiScattering.x=Z.r*this._minimumMultiScatteringIntensity,this._minimumMultiScattering.y=Z.g*this._minimumMultiScatteringIntensity,this._minimumMultiScattering.z=Z.b*this._minimumMultiScatteringIntensity;{const P=t[0];this._directionToLight.copyFrom(P.direction).scaleInPlace(-1);const E=this._linearLightColor.copyFrom(P.diffuse);this._isLinearSpaceLight||E.toLinearSpaceToRef(E);const T=P.intensity;this._lightRadianceAtCamera.set(T*E.r,T*E.g,T*E.b)}this._effectRenderer=new a.EffectRenderer(J,{indices:[0,2,1],positions:[-1,-1,-1,3,3,-1]}),this._transmittanceLut=new Jt(this),this._multiScatteringLutRenderTarget=$e("atmo-multiScattering",{width:32,height:32},e),this._multiScatteringEffectWrapper=ei(J,this.uniformBuffer,this._groundAlbedo),this._isDiffuseSkyIrradianceLutEnabled=(Q=i==null?void 0:i.isDiffuseSkyIrradianceLutEnabled)===null||Q===void 0||Q,this._isDiffuseSkyIrradianceLutEnabled&&(this._diffuseSkyIrradianceLut=new Kt(this)),this._isSkyViewLutEnabled&&this.skyViewLutRenderTarget,this._isAerialPerspectiveLutEnabled&&this.aerialPerspectiveLutRenderTarget,this._onBeforeRenderObserver=e.onBeforeRenderObservable.add(()=>{this.renderGlobalLuts()}),this._onBeforeCameraRenderObserver=e.onBeforeCameraRenderObservable.add(P=>{this._updatePerCameraVariables(P),this._renderLutsForCamera(P)});{const P=e.renderingManager;this._skyRenderingGroup>=0&&P.getRenderingGroup(this._skyRenderingGroup),this._aerialPerspectiveRenderingGroup>=0&&P.getRenderingGroup(this._aerialPerspectiveRenderingGroup),this._globeAtmosphereRenderingGroup>=0&&P.getRenderingGroup(this._globeAtmosphereRenderingGroup),this._onBeforeDrawPhaseObserver=e.onBeforeDrawPhaseObservable.add(()=>{this._skyRenderingGroup>=0&&(P.getRenderingGroup(this._skyRenderingGroup)._empty=!1),this._aerialPerspectiveRenderingGroup>=0&&(P.getRenderingGroup(this._aerialPerspectiveRenderingGroup)._empty=!1),this._globeAtmosphereRenderingGroup>=0&&(P.getRenderingGroup(this._globeAtmosphereRenderingGroup)._empty=!1)}),this._onAfterRenderingGroupObserver=e.onAfterRenderingGroupObservable.add(E=>{if(E.renderingManager!==e.renderingManager)return;const T=E.renderingGroupId;this._skyRenderingGroup===T&&this.drawSkyCompositor(),this._aerialPerspectiveRenderingGroup===T&&this.drawAerialPerspectiveCompositor(),this._globeAtmosphereRenderingGroup===T&&this.drawGlobeAtmosphereCompositor()})}e.onDisposeObservable.addOnce(()=>{e.removeExternalData("atmosphere"),this.dispose()}),e.addExternalData("atmosphere",this),a.RegisterMaterialPlugin(this._materialPluginName,P=>{var E;return P.getClassName()!=="PBRMaterial"||P.getScene()!==this.scene||!((E=P.pluginManager)===null||E===void 0)&&E.getPlugin("AtmospherePBRMaterialPlugin")?null:new M(P,this,this.depthTexture===null)}),this._eagerlyPreloadMaterialPluginShaderIncludesAsync(),e.addIsReadyCheck(this)}_eagerlyPreloadMaterialPluginShaderIncludesAsync(){return y(this,void 0,void 0,function*(){try{yield this.preloadMaterialPluginShaderIncludesAsync()}catch{}})}preloadMaterialPluginShaderIncludesAsync(){return y(this,void 0,void 0,function*(){const n=this.scene.getEngine().isWebGPU&&!a.EffectWrapper.ForceGLSL?1:0;yield M.PreloadShaderIncludesAsync(n)})}dispose(){var n,e,t,i,r,s,o,c,l,u,h,d,m,p,f,_,S,g,L;this.scene.removeIsReadyCheck(this),(n=this._onBeforeCameraRenderObserver)===null||n===void 0||n.remove(),this._onBeforeCameraRenderObserver=null,(e=this._onBeforeDrawPhaseObserver)===null||e===void 0||e.remove(),this._onBeforeDrawPhaseObserver=null,(t=this._onAfterRenderingGroupObserver)===null||t===void 0||t.remove(),this._onAfterRenderingGroupObserver=null,(i=this._onBeforeRenderObserver)===null||i===void 0||i.remove(),this._onBeforeRenderObserver=null,(r=this._globeAtmosphereCompositorEffectWrapper)===null||r===void 0||r.dispose(),this._globeAtmosphereCompositorEffectWrapper=null,(s=this._skyCompositorEffectWrapper)===null||s===void 0||s.dispose(),this._skyCompositorEffectWrapper=null,(o=this._aerialPerspectiveCompositorEffectWrapper)===null||o===void 0||o.dispose(),this._aerialPerspectiveCompositorEffectWrapper=null,(c=this._skyViewLutRenderTarget)===null||c===void 0||c.dispose(),this._skyViewLutRenderTarget=null,(l=this._skyViewLutEffectWrapper)===null||l===void 0||l.dispose(),this._skyViewLutEffectWrapper=null,(u=this._skyViewLutEffectRenderer)===null||u===void 0||u.dispose(),this._skyViewLutEffectRenderer=null,(h=this._aerialPerspectiveLutRenderTarget)===null||h===void 0||h.dispose(),this._aerialPerspectiveLutRenderTarget=null,(d=this._aerialPerspectiveLutEffectWrapper)===null||d===void 0||d.dispose(),this._aerialPerspectiveLutEffectWrapper=null,(m=this._aerialPerspectiveLutEffectRenderer)===null||m===void 0||m.dispose(),this._aerialPerspectiveLutEffectRenderer=null,(p=this._multiScatteringEffectWrapper)===null||p===void 0||p.dispose(),this._multiScatteringEffectWrapper=null,(f=this._multiScatteringLutRenderTarget)===null||f===void 0||f.dispose(),this._multiScatteringLutRenderTarget=null,(_=this._transmittanceLut)===null||_===void 0||_.dispose(),this._transmittanceLut=null,(S=this._diffuseSkyIrradianceLut)===null||S===void 0||S.dispose(),this._diffuseSkyIrradianceLut=null,(g=this._atmosphereUbo)===null||g===void 0||g.dispose(),this._atmosphereUbo=null,(L=this._effectRenderer)===null||L===void 0||L.dispose(),this._effectRenderer=null,this._atmosphereUniformBufferAsArray.length=0,a.UnregisterMaterialPlugin(this._materialPluginName)}isEnabled(){return this._isEnabled}setEnabled(n){this._isEnabled=n}isReady(){var n,e,t,i,r,s,o,c,l,u,h,d,m,p,f,_;if(!this._isEnabled)return!0;const S=this._engine,g=this.uniformBuffer,L=this._isSkyViewLutEnabled,x=this._isLinearSpaceComposition,R=this._applyApproximateTransmittance,C=this.depthTexture;return(n=this._skyCompositorEffectWrapper)!==null&&n!==void 0||(this._skyCompositorEffectWrapper=ti(S,g,L,x,R)),(e=this._globeAtmosphereCompositorEffectWrapper)!==null&&e!==void 0||(this._globeAtmosphereCompositorEffectWrapper=ri(S,g,L,x,R,this._aerialPerspectiveIntensity,this._aerialPerspectiveRadianceBias,C!==null)),C!==null&&((t=this._aerialPerspectiveCompositorEffectWrapper)!==null&&t!==void 0||(this._aerialPerspectiveCompositorEffectWrapper=ii(S,g,this._isAerialPerspectiveLutEnabled,L,x,R,this._aerialPerspectiveIntensity,this._aerialPerspectiveRadianceBias))),(i=this._transmittanceLut)===null||i===void 0||i.readPixelsAsync(),(r=this._diffuseSkyIrradianceLut)===null||r===void 0||r.readPixelsAsync(),this.renderGlobalLuts(),!(!(!((s=this._transmittanceLut)===null||s===void 0)&&s.hasLutData)||this._isDiffuseSkyIrradianceLutEnabled&&!(!((o=this._diffuseSkyIrradianceLut)===null||o===void 0)&&o.hasLutData)||!this._hasRenderedMultiScatteringLut||((c=this._multiScatteringLutRenderTarget)===null||c===void 0?void 0:c.isReady())===!1||((l=this._multiScatteringEffectWrapper)===null||l===void 0?void 0:l.isReady())===!1||this._isSkyViewLutEnabled&&(((u=this._skyViewLutRenderTarget)===null||u===void 0?void 0:u.isReady())===!1||((h=this._skyViewLutEffectWrapper)===null||h===void 0?void 0:h.isReady())===!1)||this._isAerialPerspectiveLutEnabled&&(((d=this._aerialPerspectiveLutRenderTarget)===null||d===void 0?void 0:d.isReady())===!1||((m=this._aerialPerspectiveLutEffectWrapper)===null||m===void 0?void 0:m.isReady())===!1)||((p=this._skyCompositorEffectWrapper)===null||p===void 0?void 0:p.isReady())===!1||((f=this._aerialPerspectiveCompositorEffectWrapper)===null||f===void 0?void 0:f.isReady())===!1||((_=this._globeAtmosphereCompositorEffectWrapper)===null||_===void 0?void 0:_.isReady())===!1)}getClassName(){return"Atmosphere"}_drawMultiScatteringLut(){const n=this._transmittanceLut.renderTarget;Ae(this._engine,this._effectRenderer,this._multiScatteringEffectWrapper,this._multiScatteringLutRenderTarget,(e,t,i,r)=>{this.bindUniformBufferToEffect(i),r.bindFramebuffer(t,void 0,void 0,void 0,!0),e.bindBuffers(i),i.setTexture("transmittanceLut",n),e.draw()})}drawAerialPerspectiveCompositor(){var n,e,t;if(this.depthTexture===null||!this.isEnabled())return;const i=this._engine,r=(n=this._aerialPerspectiveCompositorEffectWrapper)!==null&&n!==void 0?n:this._aerialPerspectiveCompositorEffectWrapper=ii(i,this.uniformBuffer,this._isAerialPerspectiveLutEnabled,this._isSkyViewLutEnabled,this._isLinearSpaceComposition,this._applyApproximateTransmittance,this._aerialPerspectiveIntensity,this._aerialPerspectiveRadianceBias);if(!this._isGlobalLutsReady||this._cameraAtmosphereVariables.clampedCameraRadius>this._physicalProperties.atmosphereRadius)return;const s=this._isSkyViewLutEnabled?this.skyViewLutRenderTarget:null,o=this._multiScatteringLutRenderTarget,c=this._transmittanceLut.renderTarget,l=this._isAerialPerspectiveLutEnabled?this.aerialPerspectiveLutRenderTarget:null;r.isReady()&&((e=s==null?void 0:s.isReady())===null||e===void 0||e)&&o.isReady()&&c.isReady()&&((t=l==null?void 0:l.isReady())===null||t===void 0||t)&&this.depthTexture.isReady()&&Ae(i,this._effectRenderer,r,null,(u,h,d)=>{if(this.depthTexture===null)throw new Error("Depth texture is required for aerial perspective compositor.");this.bindUniformBufferToEffect(d),u.bindBuffers(d),d.setTexture("transmittanceLut",c),d.setTexture("multiScatteringLut",o),this._isSkyViewLutEnabled&&d.setTexture("skyViewLut",s),this._isAerialPerspectiveLutEnabled&&d.setTexture("aerialPerspectiveLut",l),d.setTexture("depthTexture",this.depthTexture),u.draw()},1,this.applyApproximateTransmittance?a.Constants.ALPHA_PREMULTIPLIED_PORTERDUFF:a.Constants.ALPHA_ONEONE,!0,!1,a.Constants.ALWAYS,!1)}drawSkyCompositor(){var n,e;if(!this.isEnabled())return;const t=this._engine,i=(n=this._skyCompositorEffectWrapper)!==null&&n!==void 0?n:this._skyCompositorEffectWrapper=ti(t,this.uniformBuffer,this._isSkyViewLutEnabled,this._isLinearSpaceComposition,this._applyApproximateTransmittance);if(!this._isGlobalLutsReady||this._cameraAtmosphereVariables.clampedCameraRadius>this._physicalProperties.atmosphereRadius||this.depthTexture!==null&&!this.depthTexture.isReady())return;const r=this._isSkyViewLutEnabled?this.skyViewLutRenderTarget:null,s=this._multiScatteringLutRenderTarget,o=this._transmittanceLut.renderTarget;i.isReady()&&((e=r==null?void 0:r.isReady())===null||e===void 0||e)&&s.isReady()&&o.isReady()&&Ae(t,this._effectRenderer,i,null,(c,l,u)=>{this.bindUniformBufferToEffect(u),c.bindBuffers(u),u.setTexture("multiScatteringLut",s),u.setTexture("transmittanceLut",o),this._isSkyViewLutEnabled&&u.setTexture("skyViewLut",r),c.draw()},1,this._applyApproximateTransmittance?a.Constants.ALPHA_PREMULTIPLIED_PORTERDUFF:a.Constants.ALPHA_ONEONE,!0,!1,a.Constants.EQUAL,!1)}drawGlobeAtmosphereCompositor(){var n,e;if(!this.isEnabled())return;const t=this._engine,i=(n=this._globeAtmosphereCompositorEffectWrapper)!==null&&n!==void 0?n:this._globeAtmosphereCompositorEffectWrapper=ri(t,this.uniformBuffer,this._isSkyViewLutEnabled,this._isLinearSpaceComposition,this._applyApproximateTransmittance,this._aerialPerspectiveIntensity,this._aerialPerspectiveRadianceBias,this.depthTexture!==null);if(!this._isGlobalLutsReady||!(this._cameraAtmosphereVariables.clampedCameraRadius>this._physicalProperties.atmosphereRadius))return;const r=this._isSkyViewLutEnabled?this.skyViewLutRenderTarget:null,s=this._multiScatteringLutRenderTarget,o=this._transmittanceLut.renderTarget;i.isReady()&&((e=r==null?void 0:r.isReady())===null||e===void 0||e)&&s.isReady()&&o.isReady()&&(this.depthTexture===null||this.depthTexture.isReady())&&Ae(t,this._effectRenderer,i,null,(c,l,u)=>{this.bindUniformBufferToEffect(u),c.bindBuffers(u),u.setTexture("transmittanceLut",o),u.setTexture("multiScatteringLut",s),this._isSkyViewLutEnabled&&u.setTexture("skyViewLut",r),this.depthTexture!==null&&u.setTexture("depthTexture",this.depthTexture),c.draw()},1,this._applyApproximateTransmittance?a.Constants.ALPHA_PREMULTIPLIED_PORTERDUFF:a.Constants.ALPHA_ONEONE,!0,!1,a.Constants.ALWAYS,!1)}_disposeSkyCompositor(){var n;(n=this._skyCompositorEffectWrapper)===null||n===void 0||n.dispose(),this._skyCompositorEffectWrapper=null}_disposeAerialPerspectiveCompositor(){var n;(n=this._aerialPerspectiveCompositorEffectWrapper)===null||n===void 0||n.dispose(),this._aerialPerspectiveCompositorEffectWrapper=null}_disposeGlobeAtmosphereCompositor(){var n;(n=this._globeAtmosphereCompositorEffectWrapper)===null||n===void 0||n.dispose(),this._globeAtmosphereCompositorEffectWrapper=null}get _isGlobalLutsReady(){var n;return this._hasEverRenderedMultiScatteringLut&&!!(!((n=this._transmittanceLut)===null||n===void 0)&&n.hasLutData)&&(!this._isDiffuseSkyIrradianceLutEnabled||this._diffuseSkyIrradianceLut.hasLutData)}_updatePerCameraVariables(n){const e=this._lights[0],t=this._directionToLight.copyFrom(e.direction).scaleInPlace(-1),i=this._physicalProperties,r=this._cameraAtmosphereVariables;r.update(n,i.planetRadius,i.planetRadiusWithOffset,i.atmosphereRadius,t,this.originHeight),this._transmittanceLut.updateLightParameters(e,r.clampedCameraRadius,r.cameraGeocentricNormal),this._linearLightColor.copyFrom(e.diffuse),this.getDiffuseSkyIrradianceToRef(t,0,r.cameraGeocentricNormal,e.intensity,this._tempSceneAmbient),this.isLinearSpaceLight||this._tempSceneAmbient.toGammaSpaceToRef(this._tempSceneAmbient),this.scene.ambientColor=this._tempSceneAmbient,this.onAfterUpdateVariablesForCameraObservable.notifyObservers(n)}_renderLutsForCamera(n){{this.onBeforeLightVariablesUpdateObservable.notifyObservers();const t=this.lights[0];this.isLinearSpaceLight||(t.diffuse=t.diffuse.toGammaSpaceToRef(t.diffuse),t.specular=t.specular.toGammaSpaceToRef(t.specular));const i=t.intensity;this._lightRadianceAtCamera.set(i*this._linearLightColor.r,i*this._linearLightColor.g,i*this._linearLightColor.b)}this.uniformBuffer.useUbo&&this.updateUniformBuffer();const e=this.isEnabled();this.onBeforeRenderLutsForCameraObservable.notifyObservers(n),e&&!this._transmittanceLut.isDirty&&this._hasRenderedMultiScatteringLut&&(this._isSkyViewLutEnabled&&this._drawSkyViewLut(),this._isAerialPerspectiveLutEnabled&&(this._cameraAtmosphereVariables.clampedCameraRadius<=this._physicalProperties.atmosphereRadius?this._drawAerialPerspectiveLut():this._aerialPerspectiveLutHasBeenRendered||this._clearAerialPerspectiveLut(),this._aerialPerspectiveLutHasBeenRendered=!0)),this.onAfterRenderLutsForCameraObservable.notifyObservers(n)}renderGlobalLuts(){var n,e,t,i,r;this.uniformBuffer.useUbo&&this.updateUniformBuffer(),this._transmittanceLut.render()&&(this._hasRenderedMultiScatteringLut=!1,(n=this._diffuseSkyIrradianceLut)===null||n===void 0||n.markDirty()),this._transmittanceLut.isDirty||this._hasRenderedMultiScatteringLut||((e=this._multiScatteringEffectWrapper)!==null&&e!==void 0||(this._multiScatteringEffectWrapper=ei(this._engine,this.uniformBuffer,this._groundAlbedo)),!((t=this._multiScatteringEffectWrapper)===null||t===void 0)&&t.isReady()&&(!((i=this._multiScatteringLutRenderTarget)===null||i===void 0)&&i.isReady())&&(this._drawMultiScatteringLut(),this._hasRenderedMultiScatteringLut=!0,this._hasEverRenderedMultiScatteringLut=!0)),!this._transmittanceLut.isDirty&&this._hasRenderedMultiScatteringLut&&((r=this._diffuseSkyIrradianceLut)===null||r===void 0||r.render())}bindUniformBufferToEffect(n){const e=this.uniformBuffer,t=n.shaderLanguage===1?"atmosphere":e.name;e.bindToEffect(n,t),e.useUbo?e.update():this.updateUniformBuffer()}updateUniformBuffer(){const n=this._physicalProperties,e=this._cameraAtmosphereVariables,t=this.uniformBuffer;t.updateVector3("peakRayleighScattering",n.rayleighScattering),t.updateFloat("planetRadius",n.planetRadius),t.updateVector3("peakMieScattering",n.mieScattering),t.updateFloat("atmosphereThickness",n.atmosphereThickness),t.updateVector3("peakMieAbsorption",n.mieAbsorption),t.updateFloat("planetRadiusSquared",n.planetRadiusSquared),t.updateVector3("peakMieExtinction",n.mieExtinction),t.updateFloat("atmosphereRadius",n.atmosphereRadius),t.updateVector3("peakOzoneAbsorption",n.ozoneAbsorption),t.updateFloat("atmosphereRadiusSquared",n.atmosphereRadiusSquared),t.updateFloat("horizonDistanceToAtmosphereEdge",n.horizonDistanceToAtmosphereEdge),t.updateFloat("horizonDistanceToAtmosphereEdgeSquared",n.horizonDistanceToAtmosphereEdgeSquared),t.updateFloat("planetRadiusWithOffset",n.planetRadiusWithOffset),t.updateFloat("planetRadiusOffset",n.planetRadiusOffset),t.updateFloat("aerialPerspectiveRadianceBias",this._aerialPerspectiveRadianceBias),t.updateFloat("inverseAtmosphereThickness",1/n.atmosphereThickness),t.updateFloat("aerialPerspectiveTransmittanceScale",this._aerialPerspectiveTransmittanceScale),t.updateMatrix("inverseViewProjectionWithoutTranslation",e.inverseViewProjectionMatrixWithoutTranslation),t.updateVector3("directionToLight",this._directionToLight),t.updateFloat("multiScatteringIntensity",this.multiScatteringIntensity),t.updateVector3("directionToLightRelativeToCameraGeocentricNormal",e.directionToLightRelativeToCameraGeocentricNormal),t.updateFloat("cameraRadius",e.cameraRadius),t.updateVector3("lightRadianceAtCamera",this._lightRadianceAtCamera),t.updateFloat("diffuseSkyIrradianceDesaturationFactor",this._diffuseSkyIrradianceDesaturationFactor),t.updateColor3("groundAlbedo",this._groundAlbedo),t.updateFloat("aerialPerspectiveSaturation",this._aerialPerspectiveSaturation),t.updateVector3("minMultiScattering",this._minimumMultiScattering),t.updateFloat("diffuseSkyIrradianceIntensity",this._diffuseSkyIrradianceIntensity),t.updateVector3("cameraPositionGlobal",e.cameraPositionGlobal),t.updateFloat("lightIntensity",this.lights[0].getScaledIntensity()),t.updateVector3("clampedCameraPositionGlobal",e.clampedCameraPositionGlobal),t.updateFloat("aerialPerspectiveIntensity",this._aerialPerspectiveIntensity),t.updateVector3("cameraGeocentricNormal",e.cameraGeocentricNormal),t.updateFloat("clampedCameraRadius",e.clampedCameraRadius),t.updateVector3("cameraForward",e.cameraForward),t.updateFloat("clampedCameraHeight",e.clampedCameraHeight),t.updateVector3("cameraPosition",e.cameraPosition),t.updateFloat("cosCameraHorizonAngleFromZenith",e.cosCameraHorizonAngleFromZenith),t.updateVector4("viewport",e.viewport),t.updateColor3("additionalDiffuseSkyIrradiance",this._additionalDiffuseSkyIrradiance),t.updateFloat("cameraHeight",e.cameraHeight),t.updateFloat("cameraNearPlane",e.cameraNearPlane),t.updateFloat("originHeight",this._originHeight),t.updateFloat("sinCameraAtmosphereHorizonAngleFromNadir",e.sinCameraAtmosphereHorizonAngleFromNadir),t.updateFloat("transmittanceSampleCount",128),t.updateFloat("skyViewLutSampleCount",30),t.updateFloat("multiScatteringLutSampleCount",64),t.updateFloat("multiScatteringAzimuthSampleCount",16),t.updateFloat("multiScatteringInclinationSampleCount",8),t.updateFloat("diffuseSkyIrradianceLutSampleCount",32),t.updateFloat("atmosphereExposure",this._exposure)}_drawAerialPerspectiveLut(){const n=this._transmittanceLut.renderTarget,e=this._multiScatteringLutRenderTarget;Ae(this._engine,this._effectRenderer,this._aerialPerspectiveLutEffectWrapper,this._aerialPerspectiveLutRenderTarget,(t,i,r,s)=>{this.bindUniformBufferToEffect(r),r.setTexture("transmittanceLut",n),r.setTexture("multiScatteringLut",e);for(let o=0;o<32;o++)s.bindFramebuffer(i,void 0,void 0,void 0,!0,void 0,o),t.bindBuffers(r),r.setFloat("layerIdx",o),t.draw()})}_clearAerialPerspectiveLut(){var n;const e=(n=this._aerialPerspectiveLutRenderTarget)===null||n===void 0?void 0:n.renderTarget;if(e){const t=this._engine,i={r:0,g:0,b:0,a:0};for(let r=0;r<32;r++)t.bindFramebuffer(e,void 0,void 0,void 0,!0,void 0,r),t.clear(i,!0,!1,!1)}}_drawSkyViewLut(){const n=this._transmittanceLut.renderTarget,e=this._multiScatteringLutRenderTarget;Ae(this._engine,this._effectRenderer,this._skyViewLutEffectWrapper,this._skyViewLutRenderTarget,(t,i,r,s)=>{this.bindUniformBufferToEffect(r),s.bindFramebuffer(i,void 0,void 0,void 0,!0),t.bindBuffers(r),r.setTexture("transmittanceLut",n),r.setTexture("multiScatteringLut",e),t.draw()})}},v.AtmospherePhysicalProperties=jt,v.BuildFromNavmeshData=function(n){const e=ie(),t=e.importNavMesh(n);if(!t.navMesh)throw new Error("Unable to deserialize NavMesh.");return{navMesh:t.navMesh,navMeshQuery:new e.NavMeshQuery(t.navMesh),tileCache:void 0}},v.BuildFromTileCacheData=function(n,e){const t=ie(),i=t.importTileCache(n,e);if(!i.tileCache)throw new Error("Unable to deserialize TileCache.");return{navMesh:i.navMesh,navMeshQuery:new t.NavMeshQuery(i.navMesh),tileCache:i.tileCache}},v.ComputeSmoothPath=xi,v.ConvertNavPathPoints=at,v.CreateDebugNavMesh=Mi,v.CreateDefaultTileCacheMeshProcess=it,v.CreateNavigationPluginAsync=function(n){return y(this,void 0,void 0,function*(){yield(function(t){return y(this,void 0,void 0,function*(){var i;const r=(i=t==null?void 0:t.version)!==null&&i!==void 0?i:"0.43.0",s=Object.assign({url:"https://unpkg.com/@recast-navigation",version:r},t);if(!Le)if(Be)yield Be;else if(s.instance)Le=s.instance;else{Be=(function(c,l){return y(this,void 0,void 0,function*(){const u={imports:{"@recast-navigation/core":`${c}/core@${l}/dist/index.mjs`,"@recast-navigation/wasm":`${c}/wasm@${l}/dist/recast-navigation.wasm-compat.js`,"@recast-navigation/generators":`${c}/generators@${l}/dist/index.mjs`}},h=document.createElement("script");return h.type="importmap",h.textContent=JSON.stringify(u),document.body.appendChild(h),yield a._LoadScriptModuleAsync(`
                import * as CoreModule from '${c}/core@${l}/dist/index.mjs';
                import * as GeneratorsModule from '${c}/generators@${l}/dist/index.mjs';
                const returnedValue =  {core: CoreModule, generators: GeneratorsModule};
            `)})})(s.url,s.version);const o=yield Be;Le=Object.assign(Object.assign({},o.core),o.generators),yield Le.init()}})})(n);const e=new Ii(ie());return ct(e),e})},v.CreateSoloNavMeshConfig=rt,v.CreateTileCacheNavMeshConfig=Pi,v.CreateTiledNavMeshConfig=nt,v.DebugLayerOption=X,v.DefaultMaxObstacles=128,v.DefaultParagraphOptions=ui,v.DiffuseSkyIrradianceLut=Kt,v.FitStrategy=je,v.FontAsset=class{constructor(n,e,t){this._chars=new Map,this._kernings=new Map,this._font=JSON.parse(n),this._font.pages=[e],this._font.chars.forEach(i=>this._chars.set(i.id,i)),this._font.kernings.forEach(i=>{let r=this._kernings.get(i.first);r||(r=new Map,this._kernings.set(i.first,r)),r.set(i.second,i.amount)}),this._charsRegex=new RegExp(`[${this._font.chars.map(i=>i.char.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")).join("")}]`,"g"),this._updateFallbacks(),this.scale=1/this._font.info.size,this.textures=this._font.pages.map(i=>{const r=new a.Texture(i,t,{noMipmap:!1,invertY:!1});return r.anisotropicFilteringLevel=16,r})}dispose(){for(const n of this.textures)n.dispose();this.textures.length=0}_updateFallbacks(){this._chars.has(ue.SPACE)||this._chars.set(ue.SPACE,{id:ue.SPACE,x:0,y:0,width:0,height:0,xoffset:0,yoffset:0,xadvance:.5*this._font.info.size,page:-1,chnl:-1,index:-1,char:" "}),this._chars.has(ue.TOFU)||this._chars.set(ue.TOFU,{id:ue.TOFU,x:0,y:0,width:this._font.info.size,height:this._font.info.size,xoffset:0,yoffset:0,xadvance:.5*this._font.info.size,page:-1,chnl:-1,index:-1,char:"￿"})}_getChar(n){return this._chars.get(n)||this._chars.get(ue.TOFU)}_getKerning(n,e){var t;return((t=this._kernings.get(n))===null||t===void 0?void 0:t.get(e))||0}_unsupportedChars(n){return n.replace(this._charsRegex,"")}},v.GenerateNavMesh=lt,v.GetChaikinSmoothPath=function(n,e=1){for(let t=0;t<e;t++){const i=[];for(let r=0;r<n.length-1;r++){const s=n[r],o=n[r+1];i.push({x:.75*s.x+.25*o.x,y:.75*s.y+.25*o.y,z:.75*s.z+.25*o.z}),i.push({x:.25*s.x+.75*o.x,y:.25*s.y+.75*o.y,z:.25*s.z+.75*o.z})}n[0].x===n[n.length-1].x&&n[0].y===n[n.length-1].y&&n[0].z===n[n.length-1].z&&i.push(i[0]),n=i}return n},v.GetLShapedPath=function(n){const e=[];for(let t=0;t<n.length-1;t++){const i=n[t],r=n[t+1],s=qr(i,r);e.push(i,new a.Vector3(s.x,r.y,s.z),r)}return e},v.GetPositionsAndIndices=Ci,v.GetReversedIndices=ot,v.HtmlMesh=Dr,v.HtmlMeshRenderer=ke,v.InjectGenerators=ct,v.MultiTexture=tt,v.NavigationDebugger=q,v.PointerEventsCaptureBehavior=ci,v.RecastNavigationJSPluginV2=Ii,v.RegisterMultiTexture=Li,v.SdfTextParagraph=hi,v.TextRenderer=Xe,v.ToCrowdAgentParams=Ri,v.ToSoloNavMeshGeneratorConfig=Ei,v.TransmittanceLut=Jt,v.WaitForFullTileCacheUpdate=Me,v.msdfPixelShader=fi,v.msdfPixelShaderWGSL=Si,v.msdfVertexShader=mi,v.msdfVertexShaderWGSL=vi})})(we,we.exports)),we.exports}var Tr=jn();function Xn(D){const K=String(D.index+1).padStart(2,"0"),v=document.createElement("div");v.id=`article-${K}-vitrine-content`,v.className="vitrine-article",v.style.cssText="width:1280px;height:839px;display:flex;background:#18141f;color:#f2eee6;font:30px/1.6 Segoe UI,Arial,sans-serif;overflow:hidden";const a=document.createElement("img");a.src="./"+D.cover,a.alt=D.title,a.style.cssText="width:34%;height:100%;object-fit:contain;object-position:left top;flex-shrink:0";const y=document.createElement("div");y.id=`article-${K}-vitrine-scroll`,y.className="vitrine-reader",y.tabIndex=0,y.setAttribute("aria-label",`Article ${K} reader`),y.style.cssText="flex:1;min-width:0;min-height:0;height:100%;max-height:100%;overflow-y:auto;overflow-x:hidden;padding:36px 42px;overscroll-behavior:contain;scrollbar-color:#a797bf #25202f";const W=document.createElement("p");W.textContent=D.category,W.style.cssText="font-size:22px;letter-spacing:1px;color:#e5cfa8;margin:24px 0 12px";const $=document.createElement("h2");$.textContent=D.title,$.style.cssText="font:600 48px/1.15 Segoe UI,Arial,sans-serif;margin:0 0 24px;overflow-wrap:break-word",y.append(W,$);for(const U of["subtitle","byline"])if(D[U]){const Y=document.createElement("p");Y.textContent=D[U],Y.style.cssText=`font-size:26px;line-height:1.5;margin:0 0 20px;color:#dfd4e7;${U==="byline"?"font-weight:600":"font-style:italic"}`,y.append(Y)}const me=document.createElement("div"),b=document.createElement("button");b.type="button",b.textContent="Read more",b.setAttribute("aria-expanded","false"),b.style.cssText="font:26px Segoe UI,Arial,sans-serif;padding:12px 24px;border:1px solid #d9c39c70;border-radius:5px;background:#282131;color:#e5cfa8;cursor:pointer",me.id=`article-${K}-vitrine-body`,b.id=`article-${K}-vitrine-read-more`;function ee(U){const Y=D.paragraphs||[D.description];me.replaceChildren(...Y.slice(0,U?Y.length:1).map((Te,ge)=>{var M,G;const te=document.createElement("p");te.style.cssText="font-size:30px;line-height:1.6;margin:0 0 24px;color:#dfd4e7";const A=(G=(M=D.formattedParagraphs)==null?void 0:M[ge])==null?void 0:G.runs;if(!A)te.textContent=Te;else for(const N of A){let z=document.createTextNode(N.text);if(N.italic){const F=document.createElement("em");F.append(z),z=F}if(N.bold){const F=document.createElement("strong");F.append(z),z=F}te.append(z)}return te})),b.hidden=U||Y.length<=1,b.setAttribute("aria-expanded",String(U))}return b.onclick=()=>{ee(!0),y.focus({preventScroll:!0})},ee(!1),y.append(me,b),v.append(a,y),v}function Jn({scene:D,camera:K,canvas:v,parents:a,articles:y}){D.clearColor.a=0,document.body.style.isolation="isolate";const W=new Tr.HtmlMeshRenderer(D,{_containerId:"hall-html-vitrines"}),$=[],me=new Map,b=y.map((A,M)=>{const G=A.index+1,N=new Tr.HtmlMesh(D,`article-${String(G).padStart(2,"0")}-vitrine-html`,{captureOnPointerEnter:!1});N.parent=a[M],N.position.set(0,4.35,-.17),N.checkCollisions=!1,N.metadata={htmlVitrine:!0,articleNumber:G};const z=Xn(A);return $.push(z),me.set(N,z.querySelector(".vitrine-reader")),N.setContent(z,6.18,4.05),N.setContentSizePx(1280,839),N});let ee=null;function U(A){if(A===ee)return;const M=ee;M&&M.releasePointerEvents(),ee=A,A?(A.capturePointerEvents(),K.detachControl()):!document.querySelector("dialog[open]")&&!document.querySelector("#light-debug:focus-within")&&(K.attachControl(v,!0),M!=null&&M.element.contains(document.activeElement)&&v.focus({preventScroll:!0}))}function Y(){U(null),document.querySelector("dialog[open]")||(K.attachControl(v,!0),v.focus({preventScroll:!0}))}const Te=A=>{var N,z;if(document.querySelector("dialog[open]")||(z=(N=A.target).closest)!=null&&z.call(N,"header,footer")){U(null);return}if(!b.some(F=>{const se=F.element.getBoundingClientRect();return A.clientX>=se.left&&A.clientX<=se.right&&A.clientY>=se.top&&A.clientY<=se.bottom})){U(null);return}const M=v.getBoundingClientRect(),G=D.pick(A.clientX-M.left,A.clientY-M.top,F=>{var se,be;return F.isEnabled()&&F.isVisible&&F.visibility>0&&!((se=F.metadata)!=null&&se.skybox)&&!((be=F.metadata)!=null&&be.lanternHalo)});U(b.includes(G==null?void 0:G.pickedMesh)?G.pickedMesh:null)};document.addEventListener("pointermove",Te,!0);const ge=A=>{const M=me.get(ee);if(!M||A.ctrlKey||document.querySelector("dialog[open]"))return;const G=A.deltaMode===1?30:A.deltaMode===2?M.clientHeight:1;M.scrollTop+=A.deltaY*G,A.preventDefault(),A.stopImmediatePropagation()};document.addEventListener("wheel",ge,{capture:!0,passive:!1}),D.onBeforeRenderObservable.add(()=>{ee&&document.querySelector("dialog[open]")&&U(null)});const te=A=>{A.key==="Escape"&&$.some(M=>M.contains(document.activeElement))&&Y()};return document.addEventListener("keydown",te,!0),D.onDisposeObservable.add(()=>{document.removeEventListener("keydown",te,!0),document.removeEventListener("pointermove",Te,!0),document.removeEventListener("wheel",ge,!0);for(const A of b)A.dispose();W.dispose(),document.body.style.pointerEvents="auto"}),{mesh:b[0],articleMesh:b[1],meshes:b,release:Y,getState:()=>({articleNumbers:y.map(A=>A.index+1),width:6.18,height:4.05})}}export{Jn as createHtmlVitrine};
