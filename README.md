# EXALTED - Interactive 3D magazine

An interactive Babylon.js concept model inspired by the supplied gallery references. The architecture emphasizes a long, vaulted nave, repeated structural arches, fluted columns, warm and cool stained glass, a reflective marble aisle, and a nested arched portal. Eight framed exhibits are arranged four on each side.

## Run locally

```sh
npm install
npm run dev
```

Open the printed local URL. `npm run build` creates the deployable `dist` directory; `npm run preview` serves the build.

## Explore

- Drag to look. Scroll, WASD, or arrow keys move through the hall.
- Select a painting to read its article, then browse previous/next.
- Use Entrance, The nave, and The portal for camera presets.
- Guided tour takes 30 seconds, turning toward four alternating left/right exhibits before ending at the portal. Click again to pause.
- Sound is an optional synthesized ambient chord, started only on request.

## Customize

`src/main.js` contains the procedural architecture, materials, lighting, camera and interaction code. Coordinates use metres approximately. The hall is about 26 m wide, 80 m long, and 24 m tall. `src/art.js` holds all eight sample article records and original procedural canvas landscapes. These are sample content; replace their textures and copy with the final exhibition content. `src/style.css` controls the interface.

This is a stylized real-time concept, not an exact reconstruction of the reference images or a production architectural model. The artwork images are generated deterministically in the browser with Canvas, without an image API. Babylon.js is bundled locally. All text uses local sans-serif fonts.

## Validation

With the dev server running at port 5173, run `node verify-browser.mjs` to check scene startup, 4+4 exhibit counts, article navigation, dialogs, tour controls and the mobile layout. The script saves desktop and mobile screenshots locally.

Static architecture is merged by material to reduce draw calls. Floor reflections and bloom require WebGL; performance varies with the device's GPU.

The visitor camera uses Babylon.js `DefaultRenderingPipeline` with HDR, up to 4x MSAA (limited by hardware), FXAA fallback when MSAA is unavailable, half-resolution bloom, subtle sharpening, ACES tone mapping and a gentle vignette. These settings live near the top of `src/main.js`. The pipeline replaces the standalone glow layer. HTML controls and article dialogs remain outside the postprocessing pass for readable text.
