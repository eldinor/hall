import {rendererStorageKey} from './renderer.js';

export function createLightingDebug({scene,camera,canvas,rendererInfo,ambient,fill,columnLights,columnLightCluster,columnLightColors,lanterns,frames,windowGlass,pipeline,imageProcessing,visuals,Color3}){
 const storageKey='exalted-lighting-v1';
 const defaultProfile=window.matchMedia('(pointer: coarse)').matches||innerWidth<=850?'performance':'cinematic';
 const defaults={schemaVersion:2,qualityProfile:defaultProfile,aoEnabled:true,aoStrength:.55,aoRadius:.35,fogDensity:.006,dustEnabled:true,ambient:.35,ambientColor:'#b3abdc',fill:.15,fillColor:'#9180db',columns:1.3,columnRange:14,columnColor:'#ffffff',columnPalette:'blue-v1',globeGlow:2,artGlow:.9,artGlowVersion:1,glassProfile:'blocks-v1',glassOpacity:.22,glassRoughness:.045,glassRefraction:1,glassIOR:1.52,glassThickness:.24,glassReflection:.55,skyBrightness:.7,skyRotation:110,exposure:1.2,contrast:1.1,bloom:true,bloomWeight:.22,bloomThreshold:.85,bloomKernel:64,vignette:true};
 const defaultMouseSensibility=camera.angularSensibility;
 defaults.mouseSensitivity=1;
 const sections=[
  ['Navigation',[['mouseSensitivity','Mouse Sensitivity',.25,3,.05]]],
  ['Rendering',[['qualityProfile','Quality','select',[['cinematic','Cinematic'],['performance','Performance']]],['aoEnabled','Ambient occlusion','checkbox'],['aoStrength','AO strength',0,1.5,.05],['aoRadius','AO radius (m)',.05,1,.05]]],
  ['Ambient light',[['ambient','Main ambient',0,2,.05],['ambientColor','Main color','color'],['fill','Blue fill',0,2,.05],['fillColor','Fill color','color']]],
  ['Column lights',[['columns','Intensity',0,8,.1],['columnRange','Range (m)',2,40,1],['columnColor','Palette tint','color'],['globeGlow','Crystal glow',0,6,.1]]],
  ['Self-lit surfaces',[['artGlow','Artwork glow',0,2,.05]]],
  ['Glass blocks',[['glassOpacity','Surface opacity',.02,.6,.01],['glassRoughness','Roughness',0,.5,.005],['glassRefraction','Refraction strength',0,1,.01],['glassIOR','Refraction index',1,1.8,.01],['glassThickness','Optical thickness (m)',.01,.4,.01],['glassReflection','Reflection strength',0,2,.05]]],
  ['Sky',[['skyBrightness','Brightness',.1,2,.05],['skyRotation','Rotation (degrees)',0,360,1]]],
  ['Atmosphere',[['fogDensity','Distance fog',0,.02,.001],['dustEnabled','Air particles','checkbox']]],
  ['Image processing',[['exposure','Exposure',.2,3,.05],['contrast','Contrast',.5,2,.05],['vignette','Vignette','checkbox']]],
  ['Bloom',[['bloom','Enable bloom','checkbox'],['bloomWeight','Strength',0,1,.01],['bloomThreshold','Threshold',0,2,.05],['bloomKernel','Blur radius',8,128,8]]]
 ];
 const definitions=sections.flatMap(([,fields])=>fields);
 let settings={...defaults};
 try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved&&typeof saved==='object'){
  for(const [key,,type,max] of definitions){const value=saved[key];if(type==='select'&&max.some(([id])=>id===value))settings[key]=value;else if(type==='color'&&typeof value==='string'&&/^#[\da-f]{6}$/i.test(value))settings[key]=value;else if(type==='checkbox'&&typeof value==='boolean')settings[key]=value;else if(typeof type==='number'&&typeof value==='number'&&Number.isFinite(value))settings[key]=Math.max(type,Math.min(max,value))}
  if(saved.artGlowVersion!==defaults.artGlowVersion)settings.artGlow=defaults.artGlow;
  // Upgrade the former glass defaults, preserving any custom lighting values.
  if(!('glassOpacity' in saved)){if(saved.glassRoughness===.08)settings.glassRoughness=defaults.glassRoughness;if(saved.glassReflection===.65)settings.glassReflection=defaults.glassReflection}
  if(saved.columnPalette!==defaults.columnPalette)settings.columnColor=defaults.columnColor;
  if(saved.glassProfile!==defaults.glassProfile)for(const key of ['glassOpacity','glassRoughness','glassThickness','glassReflection'])settings[key]=defaults[key];
  if(saved.schemaVersion!==2){if(saved.ambient===.7)settings.ambient=defaults.ambient;if(saved.fill===.4)settings.fill=defaults.fill}
 }}catch{}
 const panel=document.createElement('details');panel.id='light-debug';panel.className='light-debug';panel.open=false;
 panel.innerHTML='<summary>Settings</summary><div class="light-debug-body"><p class="light-debug-status"></p><form aria-label="Gallery settings"></form><div class="light-debug-actions"><button type="button" id="lighting-reset">Reset</button><button type="button" id="lighting-copy">Copy settings</button></div><p class="light-debug-feedback" role="status" aria-live="polite">Changes are saved in this browser.</p></div>';
 panel.querySelector('.light-debug-status').textContent=columnLightCluster?'14 column lights · Clustered':'GPU fallback · 2 nearest column lights';
 const form=panel.querySelector('form');
 for(const [name,fields] of sections){
  const fieldset=document.createElement('fieldset'),legend=document.createElement('legend');fieldset.dataset.section=name;legend.textContent=name;fieldset.append(legend);
  for(const [key,label,type,max,step] of fields){
   const row=document.createElement('label');row.className='light-debug-control';row.htmlFor='lighting-'+key;
   const title=document.createElement('span');title.textContent=label;const input=document.createElement(type==='select'?'select':'input');input.id='lighting-'+key;input.name=key;
   if(type==='select'){for(const [value,text]of max){const option=document.createElement('option');option.value=value;option.textContent=text;input.append(option)}}else input.type=typeof type==='number'?'range':type;
   if(input.type==='range'){input.min=type;input.max=max;input.step=step;const output=document.createElement('output');output.htmlFor=input.id;row.append(title,output,input)}else row.append(title,input);
   fieldset.append(row);
  }
  form.append(fieldset);
 }
 form.addEventListener('submit',event=>event.preventDefault());
 document.querySelector('.header-right').append(panel);
 const rendererRow=document.createElement('label');rendererRow.className='light-debug-control';
 const rendererLabel=document.createElement('span');rendererLabel.textContent='Renderer';
 const rendererSelect=document.createElement('select');rendererSelect.id='renderer-preference';rendererSelect.name='rendererPreference';
 for(const [value,text] of [['auto','Auto (WebGPU preferred)'],['webgl','WebGL compatibility']]){const option=document.createElement('option');option.value=value;option.textContent=text;rendererSelect.append(option)}
 rendererSelect.value=rendererInfo.preference;rendererRow.append(rendererLabel,rendererSelect);form.querySelector('fieldset[data-section="Rendering"]').prepend(rendererRow);
 rendererSelect.addEventListener('input',event=>{
  event.stopPropagation();
  try{localStorage.setItem(rendererStorageKey,rendererSelect.value);window.location.reload()}
  catch{rendererSelect.value=rendererInfo.preference;feedback.textContent='Renderer choice requires browser storage. Please allow storage and try again.'}
 });
 const backendStatus=document.createElement('p');backendStatus.className='renderer-status';backendStatus.textContent=`Active renderer: ${rendererInfo.activeBackend==='webgpu'?'WebGPU':'WebGL'}${rendererInfo.fallbackReason?' · '+rendererInfo.fallbackReason:''}`;
 rendererRow.after(backendStatus);
 const color=(hex,amount=1)=>Color3.FromHexString(hex).scale(amount);
 const feedback=panel.querySelector('.light-debug-feedback');
 function apply(){
  // Babylon divides mouse movement by angularSensibility: a larger slider
  // value therefore needs a smaller divisor to make looking around faster.
  camera.angularSensibility=defaultMouseSensibility/settings.mouseSensitivity;
  ambient.intensity=settings.ambient;ambient.diffuse=color(settings.ambientColor);
  fill.intensity=settings.fill;fill.diffuse=color(settings.fillColor);
  const shades=columnLightColors.map(shade=>shade.multiply(color(settings.columnColor)));
  for(const [index,light] of columnLights.entries()){const shade=shades[index%shades.length];light.intensity=settings.columns;light.range=settings.columnRange;light.diffuse=shade.clone();light.specular=shade.scale(.3)}
  if(columnLightCluster)columnLightCluster.maxRange=settings.columnRange;
  lanterns.setGlow(shades,settings.globeGlow);
  for(const frame of frames){
   if(frame.metadata?.testVitrine)continue;
   if(frame.material.metadata?.textureOnlyGlow){frame.material.emissiveColor=Color3.Black();frame.material.emissiveTexture.level=settings.artGlow}
   else frame.material.emissiveColor=new Color3(settings.artGlow,settings.artGlow,settings.artGlow);
  }
  for(const material of windowGlass.materials){material.alpha=settings.glassOpacity;material.roughness=settings.glassRoughness;material.environmentIntensity=settings.glassReflection;material.subSurface.refractionIntensity=settings.glassRefraction;material.subSurface.indexOfRefraction=settings.glassIOR;material.subSurface.minimumThickness=settings.glassThickness;material.subSurface.maximumThickness=settings.glassThickness}
  windowGlass.skyTexture.level=settings.skyBrightness;
  windowGlass.reflection.rotationY=windowGlass.skyTexture.rotationY=settings.skyRotation*Math.PI/180;
  imageProcessing.exposure=settings.exposure;imageProcessing.contrast=settings.contrast;imageProcessing.vignetteEnabled=settings.vignette;
  const rebuild=pipeline.bloomEnabled!==settings.bloom;
  // automaticBuild is disabled in the scene; toggling a pass requires prepare().
  pipeline.bloomEnabled=settings.bloom;pipeline.bloomWeight=settings.bloomWeight;pipeline.bloomThreshold=settings.bloomThreshold;pipeline.bloomKernel=settings.bloomKernel;
  if(rebuild)pipeline.prepare();
  visuals.applySettings(settings).catch(error=>{feedback.textContent='Rendering assets failed: '+error.message});
 }
 function sync(){for(const [key] of definitions){const input=form.elements.namedItem(key);if(input.type==='checkbox')input.checked=settings[key];else input.value=settings[key];const output=input.parentElement.querySelector('output');if(output)output.value=Number(settings[key]).toFixed(Number(input.step)<.01?3:Number(input.step)<1?2:0)}for(const key of ['aoEnabled','aoStrength','aoRadius']){const input=form.elements.namedItem(key);input.disabled=settings.qualityProfile==='performance';input.title=input.disabled?'Ambient occlusion is available in Cinematic quality.':'';if(key==='aoEnabled'&&input.disabled)input.checked=false}}
 function save(){try{localStorage.setItem(storageKey,JSON.stringify(settings));feedback.textContent='Saved in this browser.'}catch{feedback.textContent='Applied for this session; browser storage is unavailable.'}}
 form.addEventListener('input',event=>{const input=event.target;if(!(input instanceof HTMLInputElement||input instanceof HTMLSelectElement))return;settings[input.name]=input.type==='checkbox'?input.checked:input.type==='color'||input instanceof HTMLSelectElement?input.value:Number(input.value);apply();sync();save()});
 panel.querySelector('#lighting-reset').onclick=()=>{settings={...defaults};apply();sync();save();feedback.textContent='Default settings restored.'};
 panel.querySelector('#lighting-copy').onclick=async()=>{try{await navigator.clipboard.writeText(JSON.stringify(settings,null,2));feedback.textContent='Settings copied.'}catch{feedback.textContent='Clipboard unavailable. Settings remain saved in this browser.'}};
 // Focused controls own keyboard input; merely hovering the panel must not
 // disable WASD after a dialog closes or the visitor returns to the canvas.
 const resumeCamera=()=>{if(!panel.contains(document.activeElement)&&!document.querySelector('dialog[open]'))camera.attachControl(canvas,true)};
 panel.addEventListener('focusin',()=>camera.detachControl());panel.addEventListener('focusout',()=>queueMicrotask(resumeCamera));
 panel.addEventListener('keydown',event=>event.stopPropagation());
 sync();apply();save();
 const metricsTimer=setInterval(()=>{const m=visuals.getMetrics();panel.querySelector('.light-debug-status').textContent=`${columnLightCluster?'14 blue clustered lights':'2 nearest lights'} · ${visuals.getProfile()||''}${m.fps?' · '+m.fps+' FPS':''}${m.gpuFrameMs?' · GPU '+m.gpuFrameMs.toFixed(1)+' ms':''}`},1000);
 scene.onDisposeObservable.add(()=>clearInterval(metricsTimer));
 return {panel,getSettings:()=>({...settings}),reset:()=>panel.querySelector('#lighting-reset').click(),setSettings:patch=>{for(const [key,,type,max]of definitions){if(!(key in patch))continue;const value=patch[key];if(type==='select'&&max.some(([id])=>id===value)||type==='checkbox'&&typeof value==='boolean'||type==='color'&&/^#[\da-f]{6}$/i.test(value))settings[key]=value;else if(typeof type==='number'&&Number.isFinite(value))settings[key]=Math.max(type,Math.min(max,value))}apply();sync();save();return visuals.ready}};
}
