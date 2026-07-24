/**
 * Centralized site-wide constants shared by RSS / sitemap generation and
 * Open Graph / Twitter meta injection.
 *
 * `SITE_URL` may be overridden at build time via the `VITE_SITE_URL`
 * environment variable (e.g. for a project-style GitHub Pages site
 * `https://<user>.github.io/<repo>/`). When unset it falls back to the
 * GitHub Pages user-site URL, which matches `vite.config.js`'s `base: '/'`.
 *
 * `import.meta.env` is undefined when this module is imported from the Node
 * config context (vite.config.js), hence the optional chaining — it safely
 * degrades to the fallback instead of throwing.
 */

/** @type {string} */
export const SITE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  'https://xhvdhczd.github.io';

/** @type {string} */
export const SITE_TITLE = '颜培志 · 博客';

/** @type {string} */
export const SITE_DESCRIPTION = '脉冲涡流无损检测研究笔记与实验记录';

/**
 * Default social-share image.
 * We ship an SVG placeholder (`public/og-default.svg`) because generating a
 * binary 1200×630 PNG without external tooling is impractical.
 *
 * NOTE (known limitation, acceptable): most social crawlers do not render SVG
 * in `og:image`; a real raster (PNG/JPG) should replace this once available.
 * The `public/og-default.svg` file is copied verbatim into `dist/` on build.
 * @type {string}
 */
export const OG_IMAGE = '/og-default.svg';
