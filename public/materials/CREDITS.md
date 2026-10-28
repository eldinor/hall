# Architectural material credits

All source assets below are CC0 1.0. The runtime uses locally bundled, derived 1K and 2K maps. No material API is contacted by the gallery.

| Finish | Source | Creator | Derivation |
|---|---|---|---|
| Ivory and dark stone | [Beige Wall 001 — Poly Haven](https://polyhaven.com/a/beige_wall_001) | Dimitrios Savva: photography; Rico Cilliers: processing | Wall scan used as a subtle stone finish; tinted in PBR, reduced normal strength, matte roughness range. |
| Pedestal and floor marble | [Marble 012 — ambientCG](https://ambientcg.com/view?id=Marble012) | Lennart Demes | Continuous marble, polished roughness range; fine sparse wear added to roughness; no baked highlights. |
| Antique brass | [Metal Plate — Poly Haven](https://polyhaven.com/a/metal_plate) | Rob Tuytel | Low-contrast metal surface variation converted to neutral high-reflectance albedo, tinted brass in PBR. Raised tread removed; fine directional brushing is generated during preparation. Bounded roughness and metallic channel. |

Licenses: [Poly Haven](https://polyhaven.com/license), [ambientCG](https://docs.ambientcg.com/license/).

`manifest.json` records sources, texture resolutions and SHA-256 hashes. Base color is WebP in sRGB; normal and ORM maps are PNG in linear space. ORM is red=ambient occlusion, green=roughness, blue=metallicity. Source normal maps use OpenGL convention. The ambientCG roughness map is packed with white AO and zero metallicity. Runtime normal intensity is deliberately restrained.

Rebuild with `npm run assets:prepare`. It caches source downloads under ignored `outputs/asset-source/`, validates provider checksums where supplied, and generates both resolutions with Sharp. A network connection and PowerShell's archive extractor are needed only when rebuilding uncached assets. Runtime files are already included.

The night environment is credited separately in `public/environments/README.md`. Interior reflections use a local Babylon reflection probe generated from the hall itself.
