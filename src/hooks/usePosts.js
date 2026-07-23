import { useMemo } from 'react';
import { parseFrontmatter } from '../utils/parseFrontmatter.js';

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
 *   content: string
 * }}
 */
function toPost(path, raw) {
  const { data, content } = parseFrontmatter(raw);
  const fileName = path.split('/').pop().replace(/\.md$/, '');
  const slug = typeof data.slug === 'string' && data.slug ? data.slug : fileName;
  return {
    slug,
    title: typeof data.title === 'string' && data.title ? data.title : slug,
    date: typeof data.date === 'string' ? data.date : '',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
    content,
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
 *   getPostBySlug: (slug: string) => object | undefined,
 *   getPostsByTag: (tag: string) => Array<object>
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

  const getPostBySlug = (slug) =>
    posts.find((post) => post.slug === slug);

  const getPostsByTag = (tag) =>
    posts.filter((post) => post.tags.includes(tag));

  return { posts, allTags, getPostBySlug, getPostsByTag };
}
