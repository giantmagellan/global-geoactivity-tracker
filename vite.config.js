import { defineConfig } from 'vite';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vite configuration:
// - base: '/' for local dev/preview, '/global-geoactivity-tracker/' for GitHub Pages
// - resolve.alias: maps /src to the actual src directory for imports
// - cacheDir: moved to system temp to avoid OneDrive/AV file locks
export default defineConfig(({ command, mode }) => ({
  // Use '/' for local development, '/global-geoactivity-tracker/' for production (GitHub Pages)
  base: mode === 'production' ? '/global-geoactivity-tracker/' : '/',
  resolve: {
    alias: {
      '/src': path.resolve(__dirname, 'src')
    }
  },
  cacheDir: path.join(os.tmpdir(), 'vite', 'global-geoactivity-tracker')
}));
