# Night sky environment

`night.env` is a prefiltered 512px cubemap generated with Babylon.js from the 2K HDR source for **Kloppenheim 02 (Pure Sky)** by Greg Zaal and Jarod Guest, distributed by Poly Haven under CC0.

`night-1024.env` is the Cinematic skybox: 1024px per face, baked from the 4K
version of the same HDR. It uses WebP-encoded RGBD mipmaps at 0.95 quality.
Performance mode and material reflections/refraction retain `night.env`.

Source and license:
https://polyhaven.com/a/kloppenheim_02_puresky
https://polyhaven.com/license

Original HDR download:
https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/kloppenheim_02_puresky_2k.hdr

Higher-resolution HDR download:
https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/kloppenheim_02_puresky_4k.hdr

Both HDR sources are retained in `assets/environment-source/`. Only the
prefiltered `.env` files are served to visitors. The sky and glass retain matching
brightness/rotation controls in Light Debug. Quality changes replace the visible
sky texture after it loads and release the previous texture.

With the dev server running, `npm run assets:environment` regenerates
`night-1024.env` from the local 4K HDR using Babylon.js. Set `HALL_URL` if the dev
server uses a different URL.
