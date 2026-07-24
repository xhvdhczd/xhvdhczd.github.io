/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  readPostsFromDisk,
  generateRss,
  generateSitemap,
} from './src/utils/feeds.js';

const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

// Site identity used by the RSS / sitemap generator. Kept in sync with
// `src/config/site.js` (duplicated on purpose: vite.config runs in Node where
// `import.meta.env` is unavailable, so the app's site module cannot be safely
// imported here).
const FEED_SITE = {
  url: process.env.VITE_SITE_URL || 'https://xhvdhczd.github.io',
  title: '颜培志 · 博客',
  description: '脉冲涡流无损检测研究笔记与实验记录',
};

/**
 * Inline Vite plugin that writes `dist/feed.xml` and `dist/sitemap.xml` at the
 * end of a production build (`writeBundle` hook). No backend and no extra npm
 * package: it reads the Markdown sources with Node `fs`, reuses the existing
 * `parseFrontmatter` util, and reuses the already-built `dist/` directory.
 */
function feedsPlugin() {
  return {
    name: 'blog-feeds',
    apply: 'build',
    writeBundle() {
      try {
        const posts = readPostsFromDisk(path.resolve(ROOT_DIR, 'src/content'));
        const distDir = path.resolve(ROOT_DIR, 'dist');
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }
        fs.writeFileSync(
          path.join(distDir, 'feed.xml'),
          generateRss(posts, FEED_SITE)
        );
        fs.writeFileSync(
          path.join(distDir, 'sitemap.xml'),
          generateSitemap(posts, FEED_SITE)
        );
        // eslint-disable-next-line no-console
        console.log(
          `[blog-feeds] wrote feed.xml & sitemap.xml (${posts.length} posts) -> ${distDir}`
        );
      } catch (err) {
        this.warn(`[blog-feeds] generation failed: ${err.message}`);
      }
    },
  };
}

// Vite configuration for the static personal blog.
// `import.meta.glob` is used at build time to load all Markdown posts eagerly.
export default defineConfig({
  // Base path. For a GitHub user/organization Pages site (xhvdhczd.github.io)
  // this is "/". For a project page it would be "/<repo>/". The router reads
  // the same value via import.meta.env.BASE_URL, so the two stay in sync.
  base: '/',
  plugins: [react(), feedsPlugin()],
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
