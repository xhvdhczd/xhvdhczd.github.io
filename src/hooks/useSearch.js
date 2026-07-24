import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { usePosts } from './usePosts.js';

/**
 * Client-side fuzzy search over posts.
 *
 * Builds a Fuse index from the post list (title / excerpt / tags) once per
 * posts change and exposes a `query(q)` function returning matching posts.
 * Pure front end — no backend involved.
 *
 * @return {{ query: (q: string) => Array<object> }}
 */
export function useSearch() {
  const { posts } = usePosts();

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ['title', 'excerpt', 'tags'],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 1,
      }),
    [posts]
  );

  /**
   * @param {string} q Search term.
   * @return {Array<object>} Matching posts (empty array when `q` is blank).
   */
  const query = (q) => {
    const term = (q || '').trim();
    if (!term) return [];
    return fuse.search(term).map((result) => result.item);
  };

  return { query };
}
