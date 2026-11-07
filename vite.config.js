import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

export default defineConfig({
 base:'./',
 build:{
  rollupOptions:{
   input:{
    main:fileURLToPath(new URL('./index.html',import.meta.url)),
    v2:fileURLToPath(new URL('./v2.html',import.meta.url)),
    v3:fileURLToPath(new URL('./v3.html',import.meta.url)),
   },
  },
 },
});
