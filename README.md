# EXALTED — Interactive 3D magazine

A local Babylon.js gallery with a vaulted nave, textured PBR architecture, blue clustered lighting, thick glass-block windows, a starry HDR sky and eight interactive exhibits arranged four on each side.

## Run

```sh
npm install
npm run dev
```

Open the printed local URL. `npm run build` creates `dist/`; `npm run preview` serves that production build. This project does not automatically publish or push to GitHub.

Drag to look; use WASD, arrow keys or the wheel to move. Select an artwork to read its story. Entrance, The nave and The portal provide camera presets. Guided tour runs for 30 seconds and looks toward four articles. Every pedestal and frame turns toward the visitor while staying upright. Ambient audio is optional and off initially.

## Visual quality

| Feature | Cinematic | Performance |
|---|---|---|
| Architectural textures | 2K | 1K |
| Floor reflection | 1024 px | 512 px |
| Shadow maps | Disabled | Disabled |
| Contact occlusion | Half-resolution SSAO2, 16 samples | Off |
| MSAA | Up to 4x | Up to 2x |
| Unsupported-MSAA fallback | FXAA | FXAA |

Cinematic is the desktop default; coarse-pointer/mobile devices default to Performance. A saved explicit profile wins. All profiles retain HDR bloom, ACES tone mapping, restrained sharpening, the night sky and clear glass. Depth of field, chromatic aberration and grain are disabled for readability.

Open **Light Debug** to change rendering quality, AO, ambient light, column palette/intensity/range, glow, glass, sky brightness/rotation, fog and dust. Settings are saved in this browser. **Reset** restores the current defaults; **Copy settings** exports JSON. Legacy default ambient values migrate to 0.35 main / 0.15 fill while customized values are preserved. Profile changes release unused texture sets and AO buffers after replacement resources are ready.

The hall is approximately 26 m wide, 80 m long and 24 m high. Architecture uses beveled frames, capitals, steps and plinths; columns have 32 sides and arch tubes have 16. UVs are projected at world scale before static meshes are merged. Static world matrices are frozen; exhibit parents remain dynamic.

Fourteen crystal lanterns alternate between four blue shades using one clustered-light container where supported. Each has a frosted glass shell, a slowly rotating faceted core, two brass meridians, a curved wall bracket and a soft blue halo. Crystal glow and palette tint remain adjustable in Light Debug; illumination stays steady and reduced-motion preferences stop the core rotation. Unsupported GPUs use the nearest two point lights. Lighting uses the lanterns and two ambient fills. Extra spotlights, directional lights and shadow maps are removed; Cinematic retains optional ambient occlusion. The floor has a live planar reflection; brass and pedestal marble also use a small interior reflection cube refreshed when lighting or texture quality changes.

There are 1,800 square, beveled glass blocks with 24 cm physical depth. Optical defaults: opacity 0.22, roughness 0.045 and IOR 1.52. The visible night sky, glass reflection and refraction share a locally prefiltered HDR environment. Glass uses alpha transmission and environment refraction, rather than ray-traced transmission. The original sky HDR remains under `assets/environment-source/`.

## Validation and reports

```sh
npm run qa:scenes
npm run qa:hardware -- --phase final --profile cinematic
npm run qa:hardware -- --phase final --profile performance
node write-visual-report.mjs
```

Run QA with the dev server active. `qa:scenes` checks local asset hashes/resolutions, rendering profiles, settings migration/persistence, article interactions, billboards, upper-window visibility, tour timing and mobile defaults. `qa:hardware` opens a temporary visible Chromium browser with the high-performance GPU requested. It verifies the actual renderer and measures fixed 1080p views. Run benchmarks serially with other GPU workloads closed. Headless visual capture is available through `npm run qa:visual`; its timings are not used to claim GPU performance.

[Implementation and measured results](docs/VISUAL-UPGRADE.md) document the staged upgrade. Screenshots, JSON reports and an interactive comparison viewer are saved under ignored `outputs/visual/`. With the server running, open `http://127.0.0.1:5173/outputs/visual/comparison.html`.

Console diagnostics preserve `window.hall` and add:

```js
hall.qualityProfile
hall.renderMetrics
hall.visuals.getState()
await hall.visuals.setProfile('performance')
await hall.lightingDebug.setSettings({ aoEnabled: false })
```

Metrics include renderer, frame/GPU time, draw calls, triangle estimates, texture/render-target estimates and render size. Memory estimates are not OS VRAM measurements. Performance measurements and limitations are recorded in the report; actual mobile-device FPS is not yet measured.

## Materials and content

[Material credits](public/materials/CREDITS.md) and [environment credits](public/environments/README.md) identify the bundled CC0 assets. `npm run assets:prepare` regenerates the local 1K/2K material sets using Sharp; rebuilding uncached sources requires network access. Gallery runtime uses local assets and Segoe UI with sans-serif fallbacks.

Architecture, PBR materials, glass, rendering profiles and the debug panel are implemented in modules under `src/`. `src/art.js` retains the eight original sample articles and deterministic canvas illustrations. This remains a procedural real-time concept: no Blender assets, baked GI or replacement editorial images were added.
