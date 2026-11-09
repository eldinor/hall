# Modular Babylon imports

The main, v2, and v3 editions now use named imports from specific
`@babylonjs/core@9.33.0` modules. Individual mesh builder functions replace
`MeshBuilder`. V2 imports the HTML mesh classes directly from
`@babylonjs/addons@9.33.0`, sharing the same core instance. The legacy
`babylonjs` and `babylonjs-addons` dependencies have been removed.

`src/babylon-features.js` explicitly registers collision handling, picking,
particle rendering, geometry-buffer rendering, and the WebGL/WebGPU engine
extensions used by the Hall. Preserve these registrations when changing imports.
Avoid replacing them with package-wide imports, which can undo the savings.

The complete scene still initializes behind the loading screen. No textures,
artwork, reflections, Discord display, or collectible sheets were postponed to
after the Hall is revealed. Babylon loads its required shader modules as part
of initialization. The PDF library remains loaded when opening the PDF.

## Size comparison

Production build sizes, in decimal MB/KB:

| Chunk | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Main JavaScript | 8.91 MB | 2.38 MB | 73% |
| Main JavaScript, gzip | 1.99 MB | 593 KB | 70% |
| V2 HTML vitrine addon | 251 KB | 22.4 KB | 91% |

The main chunk is only part of startup. The browser check records all script
requests before article/PDF interactions, then calculates their raw and gzip
sizes from the corresponding local build files. V3 on WebGPU totals about
2.84 MB raw / 701 KB gzip, including its required shader and feature chunks.
These are payload sizes, not measured loading-time improvements or server
compression guarantees.

## Verification

Run `npm run build`, then `node verify-modular-bundle.mjs`.
The test serves the production build and checks main, v2, and v3 on WebGL and
WebGPU, including startup shader errors, quality profiles, AO, reflections,
particles, camera movement, picking, article dialogs, HTML readers, the V3
PDF/zoom UI, both collectible sheet meshes, and Discord display initialization.
Discord responses are mocked for reproducible testing.

Run `node verify-html-vitrines.mjs` for additional V2 pointer capture, wheel
scrolling, focus, and geometry occlusion checks on both rendering backends.

Reports and screenshots are written to `outputs/modular-bundle/`.
