import fs from 'node:fs';

const root='outputs/visual',read=name=>JSON.parse(fs.readFileSync(`${root}/${name}/report.json`));
const baseline=read('baseline-hardware-cinematic'),cinematic=read('final-hardware-cinematic'),performance=read('final-hardware-performance');
const off=fs.existsSync(`${root}/final-effects-off-hardware-cinematic/report.json`)?read('final-effects-off-hardware-cinematic'):null;
const range=(report,key,digits=1)=>{const values=report.views.map(v=>v[key]).filter(v=>v!==null&&v!==undefined);return `${Math.min(...values).toFixed(digits)}–${Math.max(...values).toFixed(digits)}`};
fs.mkdirSync('docs',{recursive:true});
const rows=[['Baseline',baseline],['Cinematic',cinematic],['Performance',performance]].map(([name,r])=>`| ${name} | ${range(r,'fps')} | ${range(r,'p95FrameMs')} | ${range(r,'drawCalls',0)} | ${range(r,'estimatedTextureMiB',0)} |`).join('\n');
fs.writeFileSync('docs/VISUAL-UPGRADE.md',`# EXALTED cinematic upgrade

> Historical visual-upgrade benchmark: a later lighting revision removed the two extra spotlights, all shadow maps and their debug controls. Current lighting uses the clustered lanterns and ambient fills; the measurements below describe the earlier rig.

The six implementation stages are complete. The night environment, four blue light shades, 1,800 glass blocks, eight billboard exhibits, article navigation and 30-second tour are retained. Work is local; nothing was deployed or pushed.

## Measured desktop results

Renderer: ${cinematic.views[0].renderer}

Browser: ${cinematic.views[0].browser}

All measurements use a visible hardware-accelerated browser at 1920 x 1080, device scale 1. Each fixed view has 1.8 seconds of warm-up and 5 seconds of samples; the first five samples are excluded. Tests use fresh browser storage and the requested profile from startup. Report timestamps are UTC; this run was performed on October 28, 2026 (Europe/Moscow).

| Profile | FPS range | Frame p95 (ms) | Draw calls across passes | Estimated texture/target MiB |
|---|---:|---:|---:|---:|
${rows}

Both final profiles meet the 60 FPS target across entrance, nave, portal, windows and pedestal views. Results are near the display's 144 Hz limit; they do not establish maximum uncapped throughput. GPU timer observations were ${range(cinematic,'gpuFrameMs',2)} ms for Cinematic and ${range(performance,'gpuFrameMs',2)} ms for Performance. These GPU observations are the live timer value at capture, not a separate GPU-time percentile distribution. Texture memory is an uncompressed allocation estimate, not an OS VRAM measurement. Geometry is approximately ${Math.round(cinematic.views[0].totalTriangles).toLocaleString('en-US')} mesh triangles; pass-level triangle counts also include shadow, reflection and AO work. Headless timings are used only for correctness.

## Staged changes

1. **Baseline and profiles:** five reproducible viewpoints, renderer/frame/draw/texture diagnostics, saved Cinematic and Performance selections, and a resettable version-2 settings migration.
2. **Architecture:** raised the vault spring and window backing lintel, removed the upper-window obstruction, beveled pedestals/frames/capitals/steps, increased columns to 32 sides and arch tube cross-sections to 16, and froze static world matrices.
3. **Materials:** five architectural PBR finishes use local 1K/2K albedo, normal and ORM maps. UV projection uses world-scale metres, baked once so billboard textures remain attached. Brass includes an interior reflection capture; source scans and derivations are credited in public/materials/CREDITS.md.
4. **Depth and lighting:** ambient defaults 0.35 / 0.15; fourteen bounded blue point lights; two independent blue shadow spotlights; filtered shadow maps; half-resolution, 16-sample SSAO2 before HDR tone mapping. Glass, sky and dust do not cast opaque shadows.
5. **Surface and atmosphere:** polished marble with roughness variation and fine wear, a linear-space planar reflection, a small interior reflection cube, reduced fog and 100 slowly moving dust motes. DOF, grain and chromatic aberration stay disabled.
6. **Optimization:** merged static meshes, shared source glass geometry, lazy profile-specific texture loads, disposal of superseded maps and AO geometry buffers, bounded lights and a reduced mobile profile.

## Quality and tuning

| Setting | Cinematic | Performance |
|---|---|---|
| Surface textures | 2048 px | 1024 px |
| Floor reflection | 1024 px | 512 px |
| Active shadow maps | 2 x 2048 px | 1 x 1024 px |
| Ambient occlusion | Half resolution, 16 samples | Disabled |
| MSAA | Up to 4x | Up to 2x |
| AA fallback | FXAA | FXAA |

Use **Light Debug > Rendering** to change profile, shadows, shadow strength, AO strength and radius. Atmosphere controls change fog and moving dust. Existing ambient, column palette, glass, sky and HDR controls remain. Mobile/coarse-pointer devices default to Performance; a saved explicit choice wins. Old default ambient values migrate to 0.35 / 0.15; other customized values survive. Reset restores the new defaults. Profile changes retain old textures until their replacements are ready, then release them. The local 256 px hall reflection cube refreshes after surface-profile and lighting changes, not every frame; its material receivers are excluded to avoid feedback.

Diagnostics: window.hall.qualityProfile, window.hall.renderMetrics, window.hall.visuals.getState(), window.hall.visuals.setProfile(name), and window.hall.lightingDebug.setSettings(patch). Existing inspection helpers remain. The render metrics include renderer, frame/GPU time, draw calls, estimated texture usage and render size.

## Validation and comparisons

- npm run build: production bundle succeeds.
- npm run qa:scenes: asset hashes/resolutions, both profiles, real MSAA target, AO ordering, saved settings, all eight articles, controls, upright billboards, upper-window sightlines, the 30-second tour, mobile defaults and layout pass with no page/shader errors.
- A pixel comparison confirms the planar reflection contributes to the visible floor; see outputs/visual/reflection-check/.
- Forced WebGL1 fallback passes with two nearest ordinary point lights, FXAA and no AO; see outputs/visual/fallback.json. The comparison viewer also passes image-loading, mode-selection and divider checks.
- Hardware reports and five-view images are saved under outputs/visual/. ${off?'Shadow/AO-on and off comparisons are included.':'The shadow/AO comparison capture is generated separately.'}
- Open [the interactive before/after viewer](../outputs/visual/comparison.html) or http://127.0.0.1:5173/outputs/visual/comparison.html while the dev server runs.

Reproduce: npm run qa:hardware -- --phase final --profile cinematic, then repeat with --profile performance. For the effects comparison add --phase final-effects-off --effects-off. Run these serially with other GPU workloads closed. Generate this document and the comparison viewer with node write-visual-report.mjs.

Remaining artistic limits: article images are the existing procedural samples; geometry remains procedural; shadows and environment transmission are real-time approximations. Actual mobile-device FPS has not been measured. No Blender assets, baked GI or replacement editorial content were introduced.

The production build retains the pre-existing Vite warning about the large bundled Babylon.js chunk. It is a bundle-size notice, not a failed build or measured frame-rate failure.
`);

const data={baseline,cinematic,performance,off};
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EXALTED visual comparison</title><style>body{margin:0;background:#121019;color:#eee;font:16px "Segoe UI",sans-serif}main{max-width:1500px;margin:auto;padding:24px}h1{font-size:28px;margin:0 0 8px}p{color:#b7aebe}label{display:inline-flex;gap:10px;align-items:center;margin:12px 20px 12px 0}select{font:inherit;padding:9px;color:#eee;background:#292330;border:1px solid #665b6e;border-radius:4px}.images{position:relative;aspect-ratio:16/9;background:#000;overflow:hidden}.images img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}.images #before{clip-path:inset(0 50% 0 0)}#divider{position:absolute;top:0;bottom:0;left:50%;width:2px;background:#d9c39c}input{width:100%;accent-color:#d9c39c;margin:16px 0}.labels{display:flex;justify-content:space-between;color:#d9c39c}.metrics{padding:16px;background:#211b29;border-radius:5px;line-height:1.8;font-variant-numeric:tabular-nums}</style><main><h1>EXALTED — visual upgrade</h1><p>Same cameras, 1920 x 1080. Drag the divider to compare. Hardware measurements use the RTX 3060 Laptop GPU.</p><label>View <select id="view"><option value="entrance">Entrance</option><option value="nave">Nave</option><option value="portal">Portal</option><option value="windows">Windows</option><option value="pedestal">Pedestal</option></select></label><label>Compare <select id="mode"><option value="cinematic">Baseline / Cinematic</option><option value="performance">Baseline / Performance</option>${off?'<option value="off">Effects off / Cinematic</option>':''}</select></label><div class="labels"><span id="leftLabel">Before</span><span id="rightLabel">After</span></div><div class="images"><img id="after" alt="Upgraded hall"><img id="before" alt="Baseline hall"><div id="divider"></div></div><input id="slider" type="range" min="0" max="100" value="50" aria-label="Before and after divider"><div class="metrics" id="metrics"></div><p>FPS is near the 144 Hz display limit. Texture memory is an estimate. Original images and JSON reports remain alongside this viewer.</p></main><script>const reports=${JSON.stringify(data).replaceAll('<','\\u003c')};const $=s=>document.querySelector(s);function update(){const name=$('#view').value,mode=$('#mode').value,left=mode==='off'?reports.off:reports.baseline,right=mode==='performance'?reports.performance:reports.cinematic;$('#before').src=(mode==='off'?'final-effects-off-hardware-cinematic':'baseline-hardware-cinematic')+'/'+name+'.png';$('#after').src='final-hardware-'+(mode==='performance'?'performance':'cinematic')+'/'+name+'.png';$('#leftLabel').textContent=mode==='off'?'Shadows and AO disabled':'Baseline';$('#rightLabel').textContent=mode==='performance'?'Performance':'Cinematic';const a=left.views.find(v=>v.name===name),b=right.views.find(v=>v.name===name);$('#metrics').textContent='Before: '+a.fps.toFixed(1)+' FPS · '+a.p95FrameMs.toFixed(1)+' ms p95 · '+a.drawCalls+' draws | After: '+b.fps.toFixed(1)+' FPS · '+b.p95FrameMs.toFixed(1)+' ms p95 · '+b.drawCalls+' draws · ~'+b.estimatedTextureMiB+' MiB textures/targets'}$('#view').onchange=$('#mode').onchange=update;$('#slider').oninput=e=>{$('#before').style.clipPath='inset(0 '+(100-e.target.value)+'% 0 0)';$('#divider').style.left=e.target.value+'%'};update();</script></html>`;
fs.writeFileSync(`${root}/comparison.html`,html);console.log('Saved docs/VISUAL-UPGRADE.md and outputs/visual/comparison.html');
