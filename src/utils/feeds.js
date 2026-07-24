/**
 * Build-time feed generation helpers (RSS 2.0 + sitemap.xml).
 *
 * These are pure Node functions consumed by the inline Vite plugin defined in
 * `vite.config.js` (via its `writeBundle` hook). They intentionally depend only
 * on Node built-ins plus the existing `parseFrontmatter` util, so no new npm
 * package is required for RSS / sitemap output.
 *
 * @module feeds
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from './parseFrontmatter.js';

/**
 * Default content directory, resolved relative to this file
 * (`src/utils` -> `src/content`).
 * @type {string}
 */
const DEFAULT_CONTENT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'content'
);

/**
 * @typedef {Object} Post
 * @property {string} slug
 * @property {string} title
 * @property {string} date
 * @property {string[]} tags
 * @property {string} excerpt
 * @property {string} content
 */

/**
 * @typedef {Object} SiteConfig
 * @property {string} url
 * @property {string} title
 * @property {string} description
 */

/**
 * Read every `*.md` file from the content directory, parse its frontmatter,
 * and return normalized post objects sorted by date descending (newest first).
 *
 * @param {string} [contentDir] - directory containing markdown posts.
 * @return {Post[]}
 */
export function readPostsFromDisk(contentDir = DEFAULT_CONTENT_DIR) {
  let files = [];
  try {
    files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const { data, content } = parseFrontmatter(raw);
    const fileName = file.replace(/\.md$/, '');
    const slug =
      typeof data.slug === 'string' && data.slug ? data.slug : fileName;
    return {
      slug,
      title: typeof data.title === 'string' && data.title ? data.title : slug,
      date: typeof data.date === 'string' ? data.date : '',
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
      content,
    };
  });

  posts.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });

  return posts;
}

/**
 * Escape characters that are significant in XML text / attribute values.
 * @param {string} value
 * @return {string}
 */
function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Build an RSS 2.0 feed string from posts.
 *
 * @param {Post[]} posts
 * @param {SiteConfig} site
 * @return {string}
 */
export function generateRss(posts, site) {
  const { url, title, description } = site;
  const buildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const link = `${url}/post/${post.slug}`;
      const pubDate = post.date ? new Date(post.date).toUTCString() : buildDate;
      const desc = escapeXml(post.excerpt || post.title);
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${desc}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(url)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <lastBuildDate>${buildDate}</lastBuildDate>`,
    `    <generator>personal-blog feeds generator</generator>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

/**
 * Build a sitemap.xml string from posts.
 *
 * @param {Post[]} posts
 * @param {SiteConfig} site
 * @return {string}
 */
export function generateSitemap(posts, site) {
  const { url } = site;

  const urls = [
    { loc: url, priority: '1.0' },
    { loc: `${url}/tag`, priority: '0.6' },
    ...posts.map((post) => ({
      loc: `${url}/post/${post.slug}`,
      priority: '0.8',
    })),
  ];

  const body = urls
    .map(
      (u) =>
        '  <url>\n' +
        `    <loc>${escapeXml(u.loc)}</loc>\n` +
        `    <priority>${u.priority}</priority>\n` +
        '  </url>'
    )
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="https://raw.githubusercontent.com/sitemapxml/sitemap-xml/main/sitemap.xsl"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    '</urlset>',
    '',
  ].join('\n');
}
