# EXALTED — Interactive 3D magazine

A desktop Babylon.js gallery with a vaulted nave, textured PBR architecture, blue clustered lighting, thick glass-block windows, a starry HDR sky and eight interactive exhibits arranged four on each side.

Ambient air now uses soft, fading particle sprites instead of line meshes. Dust stays along the sides of the hall; blue lantern motes drift upward less than half a metre. Five batched systems use GPU particles on WebGPU and WebGL2, with CPU particles on devices without GPU particle support. Performance reduces emission. Light Debug > Atmosphere > Air particles controls both effects; reduced-motion preferences suppress them. Particles are excluded from the floor reflection, interior reflection probe and AO pass. Inspect window.hall.atmosphere.getState(). Run npm run qa:particles (or node verify-atmosphere.mjs --hardware for a visible preview).

## Run

```sh
npm install
npm run dev
```

Open the printed local URL. `npm run build` creates `dist/`; `npm run preview` serves that production build.

The app uses selective `@babylonjs/core` imports and the modular `@babylonjs/addons` HTML-mesh implementation, both pinned to 9.33.0. Required runtime registrations are listed in `src/babylon-features.js`; avoid importing the full Babylon package or package-wide barrels. After changing Babylon imports, build and run `node verify-modular-bundle.mjs` to check all three editions on WebGL and WebGPU.

`index.html` now matches the current V3 feature set: RuneScape PDF display, collectible paper sheets, and the live Discord vitrine. Both pages use `data-hall-version="3"`; `data-hall-page="main"` and `data-hall-page="v3"` distinguish the published main edition from the experiment page. Scope future V3-only experiments to the latter page marker so they do not automatically change main. V2 remains the separate HTML-vitrine edition.

## GitHub Pages

All three entries (`index.html`, `v2.html`, and `v3.html`) are built, with relative asset paths for project hosting. The local `gh-pages` branch contains the prepared static site, including `.nojekyll`. Publishing is manual:

1. Push the prepared branch: `git push origin gh-pages`.
2. In GitHub repository settings, select **Pages > Source > Deploy from a branch**.
3. Select **gh-pages** and **/ (root)**, then save.

Publishing from a private repository requires an eligible GitHub plan. The repository visibility is not changed by this setup.

- Main page: https://eldinor.github.io/hall/
- Version 2: https://eldinor.github.io/hall/v2.html

Version 2 displays the RuneScape article directly in its 3D vitrine: clicking alternates between `venez_Page_1.png` and `venez_Page_2.png`, without opening an HTML article popup. The main page retains its article popup.

Drag to look; use WASD, arrow keys or the wheel to move. Hold Shift with WASD or arrow keys to run at twice the walking speed. Select an artwork to read its story. Entrance, The nave and The portal provide camera presets. Guided tour starts at the current entrance spawn, runs for 30 seconds with eased movement and four article highlights, and ends at the Portal overview (7 m before its former endpoint) with a clear view of the central pedestal and the EXALTED / Interactive 3D magazine inscription. Every pedestal and frame turns toward the visitor while staying upright. Ambient audio is optional and off initially.

## Entrance return portal

Turn around at the entrance to see the open violet/cyan portal behind the spawn point. When nearby and facing it, the message "Press E to return to Sandbox" appears. Press E to open https://eldinor.github.io/exalted-sandbox/. Moving away or looking away hides the message. The portal has no collision and walking through it does not navigate; the back wall remains solid. The ring and swirling interior reuse the exalted-sandbox portal shaders, with matching GLSL shaders for WebGL compatibility. Reduced motion freezes the portal animation. Pressing E emits `exalted:portal-entered` once before navigation; inspect `hall.entrancePortal.getState()` for its position and destination.

A localized, gently drifting ground-fog bank sits outside the rear wall, behind the return portal. It masks the low skybox horizon and fades upward, preserving the upper stars and the forward gallery view. Reduced motion freezes its drift. Inspect `hall.rearGroundFog.getState()`; run `node verify-rear-fog.mjs` to compare rear/forward views with fog enabled and disabled on both renderers.

The left floor tile near the sanctuary approach now has a horizontal blue portal labeled **To the Hub**. GPU blue flames surround its rim on WebGPU/WebGL2, with CPU fallback for older renderers. Performance reduces the flame population; reduced motion freezes the portal and suppresses flames. When nearby and looking at it, press E to fire `exalted:portal-entered` with `id: "gallery-hub-portal"` and `destination: null`. The visible confirmation reads "Hub portal event fired"; no navigation occurs until a Hub destination is added later. Inspect `hall.hubPortal.getState()`; run `node verify-hub-portal.mjs` with the dev server active.

## Desktop rendering and mobile placeholder

Screens **850px or narrower** show a branded mobile placeholder: "3D is available on desktop only." Babylon.js, textures, and graphics contexts are not loaded on that path. Crossing the breakpoint reloads the page into the appropriate experience, including when resizing a desktop window or rotating a tablet.

Wider screens prefer **WebGPU** and automatically fall back to **WebGL** when WebGPU is unavailable or fails to initialize. WebGPU requires a secure context (HTTPS or localhost). In **Light Debug > Rendering > Renderer**, choose **Auto (WebGPU preferred)** or **WebGL compatibility**. Changing the saved choice reloads the page; lighting and quality preferences remain saved separately. The panel shows the active backend and any fallback reason. Runtime device-loss switching is not implemented.

WebGPU Cinematic uses 4x MSAA; WebGPU Performance uses FXAA. WebGL retains up to 4x/2x MSAA respectively, with FXAA when unsupported. Shader compiler resources are bundled locally for Babylon.js 9.33.0; update them together with the pinned dependency.

Inspect `hall.rendererInfo` for `preference`, `activeBackend`, and `fallbackReason`. Performance metrics include `backend` and adapter information; unavailable GPU timing remains null.

## Visual quality

| Feature | Cinematic | Performance |
|---|---|---|
| Architectural textures | 2K | 1K |
| Floor reflection | 1024 px | 512 px |
| Visible skybox faces | 1024 px | 512 px |
| Shadow maps | Disabled | Disabled |
| Contact occlusion | Half-resolution SSAO2, 16 samples | Off |
| MSAA | Up to 4x | Up to 2x |
| Unsupported-MSAA fallback | FXAA | FXAA |

Cinematic is the desktop default; wider touch-first screens default to Performance. A saved explicit profile wins. All profiles retain HDR bloom, ACES tone mapping, restrained sharpening, the night sky and clear glass. Depth of field, chromatic aberration and grain are disabled for readability.

Open **Light Debug** to change rendering quality, AO, ambient light, column palette/intensity/range, glow, glass, sky brightness/rotation, fog and air particles. Settings are saved in this browser. **Reset** restores the current defaults; **Copy settings** exports JSON. Legacy default ambient values migrate to 0.35 main / 0.15 fill while customized values are preserved. Profile changes release unused texture sets and AO buffers after replacement resources are ready.

The hall is approximately 26 m wide, 80 m long and 24 m high. Architecture uses beveled frames, capitals, steps and plinths; columns have 32 sides and arch tubes have 16. UVs are projected at world scale before static meshes are merged. Static world matrices are frozen; exhibit parents remain dynamic.

Fourteen crystal lanterns alternate between four blue shades using one clustered-light container where supported. Each has a frosted glass shell, a slowly rotating faceted core, two brass meridians, a curved wall bracket and a soft blue halo. Crystal glow and palette tint remain adjustable in Light Debug; illumination stays steady and reduced-motion preferences stop the core rotation. Unsupported GPUs use the nearest two point lights. Lighting uses the lanterns and two ambient fills. Extra spotlights, directional lights and shadow maps are removed; Cinematic retains optional ambient occlusion. The floor has a live planar reflection; satin brass uses the prefiltered sky for broad, stable highlights, and pedestal marble uses a small interior reflection cube refreshed when lighting or texture quality changes.

There are 1,800 square, beveled glass blocks with 24 cm physical depth. Optical defaults: opacity 0.22, roughness 0.045 and IOR 1.52. The visible night sky, glass reflection and refraction use the same HDR source. Cinematic uses a 1024px-per-face sky cubemap baked from the 4K HDR; Performance, reflections and refraction retain the 512px cubemap. Glass uses alpha transmission and environment refraction, rather than ray-traced transmission. The original sky HDR remains under `assets/environment-source/`.

## Validation and reports

```sh
npm run qa:scenes
npm run qa:hardware -- --phase final --profile cinematic
npm run qa:hardware -- --phase final --profile performance
node write-visual-report.mjs
```

Run QA with the dev server active. `npm run qa:renderers` checks mobile resource isolation, breakpoint transitions, saved renderer selection, fallback/error paths, and both desktop backends; its WebGPU case fails if it silently falls back. `npm run qa:visual -- --backend webgpu` (or `webgl`) asserts the expected backend and records it in the report. Hardware/driver availability may prevent WebGPU validation; headless results are correctness checks, not GPU performance claims. `qa:scenes` checks local asset hashes/resolutions, rendering profiles, settings migration/persistence, article interactions, billboards, upper-window visibility, tour timing and the mobile placeholder. `qa:hardware` opens a temporary visible Chromium browser with the high-performance GPU requested. It verifies the actual renderer and measures fixed 1080p views. Run benchmarks serially with other GPU workloads closed. Headless visual capture is available through `npm run qa:visual`; its timings are not used to claim GPU performance.

[Implementation and measured results](docs/VISUAL-UPGRADE.md) document the staged upgrade. Screenshots, JSON reports and an interactive comparison viewer are saved under ignored `outputs/visual/`. With the server running, open `http://127.0.0.1:5173/outputs/visual/comparison.html`.

Console diagnostics preserve `window.hall` and add:

```js
hall.qualityProfile
hall.renderMetrics
hall.visuals.getState()
await hall.visuals.setProfile('performance')
await hall.lightingDebug.setSettings({ aoEnabled: false })
```

Metrics include renderer, frame/GPU time, draw calls, triangle estimates, texture/render-target estimates and render size. Memory estimates are not OS VRAM measurements. Performance measurements and limitations are recorded in the report; screens of 850px or less show the mobile placeholder instead of running 3D.

## Materials and content

[Material credits](public/materials/CREDITS.md) and [environment credits](public/environments/README.md) identify the bundled CC0 assets. `npm run assets:prepare` regenerates the local 1K/2K material sets using Sharp; rebuilding uncached sources requires network access. Gallery runtime uses local assets and Segoe UI with sans-serif fallbacks.

Architecture, PBR materials, glass, rendering profiles and the debug panel are implemented in modules under `src/`. `src/art.js` retains the eight original sample articles and deterministic canvas illustrations. This remains a procedural real-time concept: no Blender assets, baked GI or replacement editorial images were added.

Marble reflections: the floor uses an unblurred live planar capture with PBR surface polish; pedestal marble uses an interior reflection probe at exhibit height. The mirror blur chain is disabled because it returned a black target with this pipeline. Run npm run qa:reflections to compare reflection-on/off pixels for both surfaces and validate the Performance target.

Exhibits are numbered across the aisle from the entrance: left/right 01?02, 03?04, 05?06 and 07?08. Reading order is GTA VI, WoW Forever, Faker, RuneScape, Halloween, The Silent Observatory, The Last Citadel, A World Beyond. Previous/Next follows this order and wraps at either end; the stories retain their physical positions.

Camera framing: the Portal footer preset and guided-tour endpoint share the same lowered aim, keeping the magazine inscription above the footer. Tour turns blend normalized viewing directions; footer viewpoint transitions take the shortest yaw arc. Run node verify-guided-tour.mjs to check the four highlights, turn continuity, final caption visibility, and matching Portal framing at desktop and compact sizes.
