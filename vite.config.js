import { defineConfig } from 'vite';

/* No framework. Vite is here for the dev server and for fingerprinting the
   built CSS and JS so Cloudflare can cache them forever. Build output stays
   in dist/ so the Cloudflare Pages settings never need to change. */
export default defineConfig({
  server: { port: 3000, host: '0.0.0.0' },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,   /* never inline an image into the CSS or JS */
  },
});
