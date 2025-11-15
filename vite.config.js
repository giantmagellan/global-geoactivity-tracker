import { defineConfig } from 'vite';

// Vite configuration for GitHub Pages deployment
// - base: must be your repo name so asset URLs work under /<repo>/
// - publicDir: copies your static assets (css, images, etc.) as-is
export default defineConfig({
  base: '/global-geoactivity-tracker/',
  publicDir: 'static'
});
