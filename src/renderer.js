import {WebGPUEngine} from '@babylonjs/core/Engines/webgpuEngine.js';
import {Engine} from '@babylonjs/core/Engines/engine.js';

export const rendererStorageKey = 'exalted-renderer-v1';

export function getRendererPreference() {
  try { return localStorage.getItem(rendererStorageKey) === 'webgl' ? 'webgl' : 'auto'; }
  catch { return 'auto'; }
}

export function renderingSamples(engine, profile) {
  if (engine.isWebGPU) return profile === 'cinematic' ? 4 : 1;
  return engine.webGLVersion > 1 ? Math.max(1, Math.min(profile === 'cinematic' ? 4 : 2, engine.getCaps().maxMSAASamples)) : 1;
}

export async function createRenderer(canvas) {
  const preference = getRendererPreference();
  let fallbackReason = null;
  if (preference === 'auto') {
    let candidate;
    try {
      if (!await WebGPUEngine.IsSupportedAsync) {
        fallbackReason = 'WebGPU is unavailable in this browser or on this device.';
      } else {
        const base = `${import.meta.env.BASE_URL}webgpu/9.33.0/`;
        candidate = new WebGPUEngine(canvas, {
          antialias: true, stencil: true,
          glslangOptions: { jsPath: `${base}glslang.js`, wasmPath: `${base}glslang.wasm` },
          twgslOptions: { jsPath: `${base}twgsl.js`, wasmPath: `${base}twgsl.wasm` },
        });
        await candidate.initAsync();
        return { engine: candidate, canvas, rendererInfo: Object.freeze({ preference, activeBackend: 'webgpu', fallbackReason }) };
      }
    } catch (error) {
      fallbackReason = `WebGPU initialization failed: ${error.message || error}`;
      try { candidate?.dispose(); } catch { /* Initialization may leave incomplete resources. */ }
      // A canvas can only belong to one graphics context type.
      const replacement = canvas.cloneNode(false);
      canvas.replaceWith(replacement);
      canvas = replacement;
      console.warn(fallbackReason);
    }
  }
  const engine = new Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true });
  return { engine, canvas, rendererInfo: Object.freeze({ preference, activeBackend: 'webgl', fallbackReason }) };
}
