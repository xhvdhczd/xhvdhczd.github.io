/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vite configuration for the static personal blog.
// `import.meta.glob` is used at build time to load all Markdown posts eagerly.
export default defineConfig({
  // Base path. For a GitHub user/organization Pages site (xhvdhczd.github.io)
  // this is "/". For a project page it would be "/<repo>/". The router reads
  // the same value via import.meta.env.BASE_URL, so the two stay in sync.
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // MUI + markdown libs push the main chunk past 500 kB; raise the limit
    // to keep build output clean (no functional impact).
    chunkSizeWarningLimit: 1200,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
  },
});
