# Latest work — 9 November 2026

Project: EXALTED Interactive 3D Magazine  
Source branch: `third`  
Date/time zone: Europe/Moscow

## RuneScape PDF

- Replaced `Urgent_V5o.pdf` with `public/covers/runelast.pdf` in the V3 PDF reader.
- Generated `public/covers/runelast-page-1.webp` from the new PDF's first page.
- Updated the RuneScape vitrine to show that first page without stretching it.
- The new document has two pages; the first page measures 529.5 × 768 PDF units.
- Existing page navigation, zoom, and click-outside closing behavior remain available.
- These changes are now included in the main page as part of the V3 promotion below.

## Loading investigation

Reviewed the app's PNG references, material loader, quality profiles, image dimensions, and file sizes.

- Cinematic loaded six architectural PNG maps totaling **12.47 MiB**.
- The largest were the 2K limestone normal map (**6.34 MiB**) and ORM map (**3.06 MiB**).
- Performance used 1K versions totaling **3.40 MiB**.
- Crown and crown-halo PNGs were small: approximately 12 KB and 56 KB.
- The older RuneScape page PNGs are used by main's former edition and/or V2; the current V3 feature set uses a WebP cover. After promotion, current main also uses the WebP cover and PDF.
- File sizes establish download cost; no measured startup-time improvement or hardware FPS improvement was claimed.

The agreed loading requirement is to reveal the complete scene together. Progressive texture upgrades, delayed artwork, deferred scene features, and delayed reflection captures were not introduced.

## Lossless WebP material conversion

- Converted all **12 architectural normal and ORM PNGs** to lossless WebP: limestone, marble, and brass at 1024 and 2048 resolutions.
- Kept the existing WebP albedo maps.
- Updated `src/materials.js` to load `normal.webp` and `orm.webp`.
- Updated `prepare-materials.mjs` so future material generation also produces lossless WebP data maps.
- Updated material manifest paths and SHA-256 checksums.
- Verified that every converted map decodes to exactly the same pixels as its PNG source.
- Verified all 18 material files against the manifest checksums.
- Archived the original PNG maps under ignored local `outputs/original-material-png/`, then removed them from `public/materials/`.
- Crown and older RuneScape page PNGs were not converted in this pass.

| Architectural normal/ORM maps | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Cinematic, 2048 | 12.47 MiB | 9.11 MiB | 26.9% |
| Performance, 1024 | 3.40 MiB | 2.61 MiB | 23.1% |

## Rear Sandbox portal fog

- Removed creation and animation of the separate fog layer behind the rear vertical portal to Sandbox.
- Removed the fog module import from the main scene entry.
- Retained `hall.rearGroundFog` as `null` in diagnostics.
- General scene distance fog was not removed.

## Modular Babylon.js migration

- Replaced the full `babylonjs` dependency with selective imports from **`@babylonjs/core@9.33.0`** across the scene and feature modules.
- Replaced `MeshBuilder` calls with imports of the individual mesh builder functions used by the Hall.
- Replaced `babylonjs-addons` with **`@babylonjs/addons@9.33.0`**, importing V2's `HtmlMesh` and `HtmlMeshRenderer` directly.
- Removed the legacy monolithic packages and updated `package-lock.json`.
- Added `src/babylon-features.js` to register required collision, picking, particle, geometry-buffer, engine timing, and WebGPU rendering/compute features explicitly.
- Fixed missing GPU timing and WebGPU multiple-render-target registrations discovered during browser checks.
- Updated environment preparation, visual QA, navigation version checks, and HTML-vitrine addon detection for the modular packages.
- Added `verify-modular-bundle.mjs` and documented the migration in `docs/BUNDLE-OPTIMIZATION.md`.
- Applied the migration to **main, V2, and V3**. The complete scene still initializes behind the loading screen.

| JavaScript chunk | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Main JavaScript | 8.91 MB | approximately 2.38 MB | 73% |
| Main JavaScript, gzip | 1.99 MB | approximately 593 KB | 70% |
| V2 HTML vitrine addon | 251 KB | 22.4 KB | 91% |

During migration verification, V3's startup scripts, including its required shader/feature chunks, totaled approximately **2.84 MB raw / 701 KB gzip** on WebGPU. These are calculated payload sizes, not measured load-time improvements. Later volume-control edits add a small amount of code.

## Main page renewed from V3

- Copied the current V3 page into `index.html`.
- Main now includes the RuneScape PDF vitrine, both collectible paper sheets and their collection flow, and the live Discord vitrine with its working invite button.
- Kept `v3.html` as the experiment page and V2 as the separate HTML-vitrine edition.
- Both main and V3 use `data-hall-version="3"` to enable the current feature set.
- Added page markers to distinguish them: `data-hall-page="main"` and `data-hall-page="v3"`.
- Verified the HTML files match apart from their page marker.
- Updated the modular browser check to expect PDF and collectible features on main too.
- Documented that future V3-only experiments must use the V3 page marker. The pages still share source modules; changes to shared code can affect both unless explicitly scoped.

## Sound controls

- Added a small volume slider below Sound on **main and V3**.
- The slider appears when hovering over Sound while playback is on.
- Moving away hides it after **450 ms**; returning cancels the hide delay.
- It remains available while adjusting the range and supports keyboard focus.
- Turning Sound off hides the slider immediately.
- The slider adjusts the streaming ambient `intro.mp3` volume and exposes an accessible percentage value.
- Set the ambient audio's default volume to **60%**.
- Preserved on-demand streaming: the ambient track is not downloaded during initial startup.

## Verification performed

- Production builds passed during the Babylon migration and for the final release preparation.
- The migration's production browser checks passed for **main, V2, and V3 on WebGL and WebGPU**.
- Checks covered startup errors, quality switching, AO, reflections, GPU particles, camera movement, picking, available article dialogs, V2 readers, V3 PDF rendering/zoom, collectible mesh initialization, and Discord display initialization.
- Discord responses were mocked in the browser regression check for reproducibility.
- Additional V2 browser checks passed on both backends for article expansion, formatting, wheel scrolling, camera input separation, focus recovery, and foreground geometry occlusion.
- Reports and screenshots are in ignored local `outputs/modular-bundle/`.
- After promoting V3 to main, verified HTML parity and distinct page markers without another full browser run.
- Later sound-control changes received JavaScript syntax checks and were included in the successful final production build; a separate interactive audio browser test was not run.

## Latest GitHub Pages build

- Built the current `third` working tree, including uncommitted source changes.
- Prepared all three entries: `index.html`, `v2.html`, and `v3.html`.
- Verified main/V3 HTML parity, required PDF/audio/cover assets, WebP material references, the Discord invite/server ID/logo, and the reduced main bundle.
- Updated local **`gh-pages` to commit `c197414`**.
- Left the source branch, source working files, and Git `main` branch unchanged by release preparation.
- **Pushed by the user**, as confirmed after this log was created. GitHub Pages deployment status has not been independently checked.

This `LATEST.md` was created after that build and is not included in commit `c197414`.
