# Entrance portal shaders

The WGSL vertex, ring, and surface shaders are copied from the local
`exalted-sandbox/src/shaders` portal implementation. The gallery uses only the
already-open portal; the Cube and dissolve transition are not included.
The GLSL files reproduce the same equations for the WebGL compatibility renderer.

Source: `magicalCube.vertex.wgsl`, `portalRing.fragment.wgsl`, and
`portalSurface.fragment.wgsl`. Copyright and MIT terms are retained in `LICENSE`.

The gallery also reuses these shaders for the horizontal Hub portal. The optional
`HUB_PORTAL` define applies a blue color variant without changing the entrance portal.
