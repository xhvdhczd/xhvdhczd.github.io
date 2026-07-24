/**
 * Extract a table of contents (h2 / h3 only) from raw Markdown and generate
 * heading ids that are guaranteed to match `rehype-slug`.
 *
 * `rehype-slug` uses `github-slugger` internally, walking ALL headings
 * (h1–h6) in document order and de-duplicating repeated text (e.g. the second
 * "Overview" becomes "overview-1"). To stay perfectly in sync, we run a single
 * `GithubSlugger` instance over every ATX heading in order and only *collect*
 * h2/h3 — that way duplicate counters are identical to what the renderer
 * produces.
 *
 * @module extractToc
 */

import GithubSlugger from 'github-slugger';

/**
 * @typedef {Object} TocItem
 * @property {string} id    Anchor id (matches the rendered heading's `id`).
 * @property {string} text  Heading text (inline markdown stripped).
 * @property {number} depth Heading level (2 or 3).
 */

/**
 * Strip common inline markdown so the TOC label matches the heading's plain
 * text (which is what `github-slugger` slugifies).
 * @param {string} raw
 * @return {string}
 */
function stripInline(raw) {
  return raw
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\s+#+\s*$/g, '')
    .trim();
}

/**
 * Extract TOC items from raw Markdown.
 * @param {string} content Raw Markdown source.
 * @return {TocItem[]}
 */
export function extractToc(content = '') {
  const slugger = new GithubSlugger();
  const items = [];
  const lines = (content || '').split('\n');

  let inFence = false;
  for (const line of lines) {
    // Skip fenced code blocks (their `#` lines are not headings).
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,6})\s+(.*\S)\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length;
    const text = stripInline(match[2]);
    if (!text) continue;

    const id = slugger.slug(text);
    if (depth === 2 || depth === 3) {
      items.push({ id, text, depth });
    }
  }

  return items;
}
