import { defineConfig } from 'vite';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vite configuration:
// - base: '/' for local dev, '/global-geoactivity-tracker/' for GitHub Pages build
// - publicDir: copies your static assets (css, images, etc.) as-is
// - cacheDir: moved to system temp to avoid OneDrive/AV file locks
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/global-geoactivity-tracker/',
  resolve: {
    alias: {
      '/src': path.resolve(__dirname, 'src')
    }
  },
  cacheDir: path.join(os.tmpdir(), 'vite', 'global-geoactivity-tracker')
}));
