# Landscape HTML articles on v2

The first left/right pair on `v2.html` has landscape displays with an inner area of 6.18 x 4.05 world units. They retain their original positions and upright billboard behavior. The main edition keeps its original portrait exhibits.

- Vitrine 01: GTA VI: Inside Rockstar's New Open World.
- Vitrine 02: WoW Forever: Some Worlds Never Leave Us.

Both readers use local HTML `<div>` elements rendered in the scene through Babylon.js `HtmlMesh` / `HtmlMeshRenderer`, from the matching `babylonjs-addons@9.33.0` package. The former Hub iframe and its controls have been removed from the first vitrine. No iframe or external embedding permission is needed for these articles.

Each display includes its original artwork, title, optional subtitle and byline, and formatted text. Read more expands the full body inside a fixed-height scroll area. Mouse-wheel input over either reader explicitly scrolls the text and is prevented from moving the camera.

Move the pointer outside a display, or press Escape while its reader has keyboard focus, to restore camera control. There are no Back to hall buttons.

## Rendering and navigation

- The DOM panels follow their exhibit parents and camera-facing rotation.
- Transparent scene clear color and depth masks allow architecture to occlude the panels.
- HTML is outside the GPU image pipeline and is not captured in marble reflections. Its depth masks are excluded from reflection and AO passes.
- The two displays do not open article popups. Reader Previous / Next skips them on v2, as well as the RuneScape vitrine that uses direct image-page switching.
- The add-on loads only on v2.
- Diagnostics: `window.hall.htmlVitrine.getState()` and `.meshes`.
- Optional browser verification: `node verify-html-vitrines.mjs`. It checks both HTML articles, formatting, Read more, scrolling, camera focus, occlusion, and the unchanged main edition on WebGPU and WebGL.

See [Babylon's HtmlMesh documentation](https://doc.babylonjs.com/addons/htmlMesh/).
