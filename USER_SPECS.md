# EXALTED — Recommended system specifications and browser settings

Updated: November 7, 2026.

EXALTED is a real-time 3D magazine for desktop and laptop browsers. For the best experience, use an up-to-date Chrome or Edge browser, enable graphics acceleration, and view at 1920 × 1080. It runs directly in the browser.

## Recommended hardware

These are practical recommendations, not certified minimum requirements or guaranteed frame rates. Start with Performance quality on less powerful computers.

| Component | Practical starting point — Performance | Recommended — Cinematic at 1080p |
| --- | --- | --- |
| Computer | Desktop or laptop with hardware-accelerated browser graphics | Desktop or laptop with a dedicated GPU |
| Processor | Modern four-core processor | Modern Intel Core i5 / AMD Ryzen 5 class processor or better |
| System memory | 8 GB RAM | 16 GB RAM or more |
| Graphics | Recent integrated graphics with working WebGL 2 or WebGPU support | NVIDIA GeForce RTX 3060 Laptop GPU class or better, with 6 GB dedicated video memory recommended |
| Operating system | An OS version still supported by your browser and graphics driver | Windows 11 with current graphics drivers; other desktop platforms should be checked with Performance first |
| Display | Preferably 1280 × 720 or larger | 1920 × 1080; a higher resolution increases GPU load |
| Input | Mouse or trackpad and keyboard | Mouse with scroll wheel and keyboard |
| Internet | Stable broadband for loading images, audio, and 3D assets | Stable broadband; allow the loading screen to finish before exploring |

The presentation target is approximately 60 FPS at 1080p on the recommended GPU class. Earlier hardware testing used an RTX 3060 Laptop GPU, but the scene has changed since that benchmark; it is not a performance guarantee for the current release. Historical measurements are in [the visual-upgrade report](docs/VISUAL-UPGRADE.md).

### Window size and mobile devices

The current 3D experience requires a browser viewport **wider than 850 CSS pixels**. At 850 pixels or below, the site shows the mobile placeholder instead of loading the hall. A narrow desktop window can also trigger this behavior.

Maximize the browser window and start at 100% browser zoom. Phones and tablets are not the supported target for this release.

## Recommended browsers

| Browser | Recommendation |
| --- | --- |
| Google Chrome, current stable desktop version | Preferred. Start with the magazine's Auto renderer. |
| Microsoft Edge, current stable desktop version | Preferred alternative. Start with Auto. |
| Firefox or Safari, current stable desktop version | Try Performance and the WebGL compatibility renderer. These browsers have not received the same project validation as Chromium; compatibility depends on the OS, GPU, and browser. |
| In-app browsers and embedded webviews | Open the link in a full desktop browser for the recommended experience. |

Auto tries WebGPU first and falls back to WebGL if WebGPU is unavailable or fails to initialize. WebGPU availability varies by browser, OS, and GPU, and requires a secure context; use the published HTTPS address. See [MDN's WebGPU documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API).

## Browser setup

1. **Update the browser** and install current graphics drivers from your computer or GPU manufacturer.
2. **Enable graphics acceleration.** In Chrome, open `chrome://settings/system` and enable **Use graphics acceleration when available**, then relaunch. This setting is required for Chrome's hardware WebGPU path; see [Chrome's troubleshooting guide](https://developer.chrome.com/docs/web-platform/webgpu/troubleshooting-tips).
3. In Edge, search Settings for **graphics acceleration**, enable **Use graphics acceleration when available**, and restart the browser. An organization-managed browser may have this controlled by policy; see [Microsoft's graphics acceleration documentation](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies/HardwareAccelerationModeEnabled).
4. On a laptop, connect external power and use a performance power mode. If the computer has both integrated and dedicated graphics, select the high-performance GPU for the browser in the OS graphics settings.
5. Close other GPU-heavy applications and unnecessary tabs if navigation feels slow. Start at 1080p rather than a 4K fullscreen resolution.
6. Use a normal browser session with site storage available if you want settings to persist. Clearing site data removes saved preferences.

Normal viewing uses the browser's standard graphics support. Start with the magazine's compatibility renderer rather than changing experimental browser flags.

## Settings inside the magazine

Open **Settings** at the top right. The panel starts collapsed and saves changes in the current browser.

| Setting | Suggested use |
| --- | --- |
| Navigation → Mouse Sensitivity | Start at **1.00**. Increase for faster turning or decrease for finer control. |
| Rendering → Quality → Cinematic | Start here on a dedicated GPU. Offers more detailed textures and reflections, with ambient occlusion available. |
| Rendering → Quality → Performance | Use on integrated graphics, for lower GPU load, or when movement stutters. Uses smaller textures and reflections, fewer particles, and disables ambient occlusion. |
| Rendering → Renderer → Auto (WebGPU preferred) | Recommended first choice. The panel reports the active renderer. |
| Rendering → Renderer → WebGL compatibility | Try if Auto produces graphics problems. Changing the renderer reloads the page. |
| Rendering → Ambient occlusion | Adds depth to recesses and contact areas in Cinematic. Disable it if you need to reduce GPU load. |
| Atmosphere → Air particles | Turn off for a clearer view or less particle activity. The OS reduced-motion preference also suppresses decorative particle animation. |
| Bloom | Controls the soft glow around bright elements. Reduce its strength if highlights distract from reading. |
| Reset | Restores the magazine's default settings, including mouse sensitivity. |

Settings and quality choices are saved per browser and site origin. Localhost preferences do not automatically transfer to the published site. The main and v2 pages on the same published origin share saved settings. Sound starts off and is enabled separately for the current session.

## Viewing and navigation

| Action | Control |
| --- | --- |
| Look around | Click and drag |
| Walk | W, A, S, D; arrow keys; or scroll wheel |
| Move faster | Hold Shift while using movement keys |
| Open an article | Click its artwork |
| Expand article text | Read more, where offered |
| Close an article | ×, Escape, or click outside the article window |
| Enlarge Halloween artwork | Click its image inside the article window |
| Turn RuneScape pages on v2 | Click the 3D vitrine image to alternate pages 1 and 2; this vitrine has no HTML article popup on v2 |
| Guided camera tour | Guided tour in the footer; the tour lasts 30 seconds |
| Fullscreen | Fullscreen button at the right of the footer |
| Sound | Click SOUND OFF to stream the soundtrack; click SOUND ON to pause it. Check browser tab mute and system volume if inaudible. |
| Enter a nearby portal | Face it and press E when its prompt appears; this navigates to another site |

## Troubleshooting

| Problem | What to try |
| --- | --- |
| Mobile message on a desktop | Widen the window beyond 850 CSS pixels; check browser zoom. |
| Slow movement or stuttering | Choose Performance, reduce the window resolution, connect laptop power, and close other GPU-heavy applications. |
| Black screen, missing graphics, or startup error | Update the browser and GPU driver, verify graphics acceleration, then try WebGL compatibility. If Settings is unavailable during startup, try the other recommended browser. |
| Scene stops after a graphics-device error | Reload the page. Runtime switching after device loss is not currently implemented. |
| Old images or behavior after a site update | Hard-refresh with Ctrl+Shift+R on Windows/Linux or Command+Shift+R on macOS. |
| Settings do not survive reopening the site | Check whether private browsing or automatic site-data clearing is in use. |
| Need to check GPU acceleration | Open `chrome://gpu` or `edge://gpu` and inspect Graphics Feature Status. Software-only rendering can explain poor performance; see [Chrome's GPU troubleshooting guide](https://developer.chrome.com/docs/web-platform/webgpu/troubleshooting-tips). |

## Magazine links

- Main edition: https://eldinor.github.io/hall/
- Version 2: https://eldinor.github.io/hall/v2.html
