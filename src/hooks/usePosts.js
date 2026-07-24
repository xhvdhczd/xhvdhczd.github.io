import { useMemo } from 'react';
import { parseFrontmatter } from '../utils/parseFrontmatter.js';
import { computeReadingStats } from '../utils/readingStats.js';

/**
 * Eagerly load all Markdown posts at build time.
 * `import.meta.glob` with `eager: true` returns a map of
 * `{ path: rawMarkdownString }`.
 */
const modules = import.meta.glob('../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * Convert a raw Markdown module entry into a normalized post object.
 * @param {string} path File path (e.g. "../content/post-foo.md")
 * @param {string} raw Raw file contents including frontmatter.
 * @return {{
 *   slug: string,
 *   title: string,
 *   date: string,
 *   tags: string[],
 *   excerpt: string,
 *   content: string,
 *   wordCount: number,
 *   readingTime: number
 * }}
 */
function toPost(path, raw) {
  const { data, content } = parseFrontmatter(raw);
  const fileName = path.split('/').pop().replace(/\.md$/, '');
  const slug = typeof data.slug === 'string' && data.slug ? data.slug : fileName;
  const { wordCount, readingTime } = computeReadingStats(content);
  return {
    slug,
    title: typeof data.title === 'string' && data.title ? data.title : slug,
    date: typeof data.date === 'string' ? data.date : '',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
    content,
    wordCount,
    readingTime,
  };
}

/**
 * Load and sort all posts once (module scope, runs once).
 * @return {ReturnType<typeof toPost>[]}
 */
function loadAllPosts() {
  const posts = Object.entries(modules).map(([path, raw]) => toPost(path, raw));
  // Sort by date descending; posts without a date go last.
  posts.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });
  return posts;
}

const ALL_POSTS = loadAllPosts();

/**
 * Hook exposing post data and useful derived selectors.
 * @return {{
 *   posts: Array<object>,
 *   allTags: string[],
 *   tagCounts: Map<string, number>,
 *   getPostBySlug: (slug: string) => object | undefined,
 *   getPostsByTag: (tag: string) => Array<object>,
 *   getPrevNext: (slug: string) => { prev: object | undefined, next: object | undefined },
 *   getRelated: (slug: string, limit?: number) => Array<object>
 * }}
 */
export function usePosts() {
  // `posts` is stable (module-level), recomputed only if deps change.
  const posts = useMemo(() => ALL_POSTS, []);

  const allTags = useMemo(() => {
    const set = new Set();
    posts.forEach((post) => post.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  }, [posts]);

  // tag -> number of posts (drives the tag cloud font scaling).
  const tagCounts = useMemo(() => {
    const map = new Map();
    posts.forEach((post) =>
      post.tags.forEach((tag) => map.set(tag, (map.get(tag) || 0) + 1))
    );
    return map;
  }, [posts]);

  const getPostBySlug = (slug) =>
    posts.find((post) => post.slug === slug);

  const getPostsByTag = (tag) =>
    posts.filter((post) => post.tags.includes(tag));

  /**
   * Previous / next post relative to `slug`, in chronological reading order.
   * `posts` is sorted newest-first, so:
   *   - prev = the chronologically *older* post (index + 1)
   *   - next = the chronologically *newer* post (index - 1)
   * @param {string} slug
   * @return {{ prev: object | undefined, next: object | undefined }}
   */
  const getPrevNext = (slug) => {
    const i = posts.findIndex((post) => post.slug === slug);
    if (i === -1) return { prev: undefined, next: undefined };
    const prev = i + 1 < posts.length ? posts[i + 1] : undefined;
    const next = i - 1 >= 0 ? posts[i - 1] : undefined;
    return { prev, next };
  };

  /**
   * Related posts ranked by tag overlap (desc), tie-broken by date (desc).
   * Excludes the post itself. Returns at most `limit` (default 3) items.
   * Gracefully returns [] when there is no overlap.
   * @param {string} slug
   * @param {number} [limit=3]
   * @return {Array<object>}
   */
  const getRelated = (slug, limit = 3) => {
    const base = posts.find((post) => post.slug === slug);
    if (!base) return [];
    const baseTags = new Set(base.tags);
    return posts
      .filter((post) => post.slug !== slug)
      .map((post) => ({
        post,
        overlap: post.tags.filter((tag) => baseTags.has(tag)).length,
      }))
      .filter((entry) => entry.overlap > 0)
      .sort(
        (a, b) =>
          b.overlap - a.overlap ||
          (a.post.date < b.post.date ? 1 : a.post.date > b.post.date ? -1 : 0)
      )
      .slice(0, limit)
      .map((entry) => entry.post);
  };

  return {
    posts,
    allTags,
    tagCounts,
    getPostBySlug,
    getPostsByTag,
    getPrevNext,
    getRelated,
  };
}
