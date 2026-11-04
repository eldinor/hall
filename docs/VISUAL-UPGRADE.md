# EXALTED cinematic upgrade

> Historical visual-upgrade benchmark: a later lighting revision removed the two extra spotlights, all shadow maps and their debug controls. Current lighting uses the clustered lanterns and ambient fills; the measurements below describe the earlier rig.

The six implementation stages are complete. The night environment, four blue light shades, 1,800 glass blocks, eight billboard exhibits, article navigation and 30-second tour are retained. Work is local; nothing was deployed or pushed.

## Measured desktop results

Renderer: ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Laptop GPU (0x00002520) Direct3D11 vs_5_0 ps_5_0, D3D11)

Browser: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36

All measurements use a visible hardware-accelerated browser at 1920 x 1080, device scale 1. Each fixed view has 1.8 seconds of warm-up and 5 seconds of samples; the first five samples are excluded. Tests use fresh browser storage and the requested profile from startup. Report timestamps are UTC; this run was performed on October 28, 2026 (Europe/Moscow).

| Profile | FPS range | Frame p95 (ms) | Draw calls across passes | Estimated texture/target MiB |
|---|---:|---:|---:|---:|
| Baseline | 141.8–144.0 | 7.3–7.5 | 157–269 | 117–117 |
| Cinematic | 144.0–144.0 | 7.6–7.8 | 425–537 | 529–529 |
| Performance | 143.8–144.0 | 7.7–7.9 | 224–337 | 180–180 |

Both final profiles meet the 60 FPS target across entrance, nave, portal, windows and pedestal views. Results are near the display's 144 Hz limit; they do not establish maximum uncapped throughput. GPU timer observations were 4.39–5.91 ms for Cinematic and 1.80–3.35 ms for Performance. These GPU observations are the live timer value at capture, not a separate GPU-time percentile distribution. Texture memory is an uncompressed allocation estimate, not an OS VRAM measurement. Geometry is approximately 367,937 mesh triangles; pass-level triangle counts also include shadow, reflection and AO work. Headless timings are used only for correctness.

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
- Hardware reports and five-view images are saved under outputs/visual/. Shadow/AO-on and off comparisons are included.
- Open [the interactive before/after viewer](../outputs/visual/comparison.html) or http://127.0.0.1:5173/outputs/visual/comparison.html while the dev server runs.

Reproduce: npm run qa:hardware -- --phase final --profile cinematic, then repeat with --profile performance. For the effects comparison add --phase final-effects-off --effects-off. Run these serially with other GPU workloads closed. Generate this document and the comparison viewer with node write-visual-report.mjs.

Remaining artistic limits: article images are the existing procedural samples; geometry remains procedural; shadows and environment transmission are real-time approximations. Actual mobile-device FPS has not been measured. No Blender assets, baked GI or replacement editorial content were introduced.

The production build retains the pre-existing Vite warning about the large bundled Babylon.js chunk. It is a bundle-size notice, not a failed build or measured frame-rate failure.
