import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePosts } from '../usePosts.js';

const EXPECTED_TAGS = [
  '脉冲涡流',
  '无损检测',
  '学术',
  '机器学习',
  'Python',
  '信号处理',
  '生活随笔',
  '科研',
];

describe('usePosts', () => {
  it('loads all four markdown posts', () => {
    const { result } = renderHook(() => usePosts());
    expect(result.current.posts).toHaveLength(4);
  });

  it('sorts posts by date descending (newest first)', () => {
    const { result } = renderHook(() => usePosts());
    const dates = result.current.posts.map((p) => p.date);
    expect(dates).toEqual(['2026-07-20', '2026-07-18', '2026-07-15', '2026-07-12']);
  });

  it('orders slugs to match the descending date order', () => {
    const { result } = renderHook(() => usePosts());
    const slugs = result.current.posts.map((p) => p.slug);
    expect(slugs).toEqual([
      'pec-signal-python',
      'pec-intro',
      'phd-life',
      'corrosion-evaluation',
    ]);
  });

  it('exposes posts with fully parsed fields', () => {
    const { result } = renderHook(() => usePosts());
    const intro = result.current.getPostBySlug('pec-intro');
    expect(intro).toBeDefined();
    expect(intro.title).toBe('脉冲涡流无损检测（PEC-NDT）入门');
    expect(intro.tags).toEqual(['脉冲涡流', '无损检测', '学术']);
    expect(intro.content).toContain('# 脉冲涡流无损检测');
  });

  it('filters posts by a single tag', () => {
    const { result } = renderHook(() => usePosts());
    const pulsed = result.current.getPostsByTag('脉冲涡流');
    expect(pulsed).toHaveLength(3);
    expect(pulsed.map((p) => p.slug).sort()).toEqual(
      ['corrosion-evaluation', 'pec-intro', 'pec-signal-python'].sort()
    );
  });

  it('returns a single post for a tag used by only one article', () => {
    const { result } = renderHook(() => usePosts());
    const python = result.current.getPostsByTag('Python');
    expect(python).toHaveLength(1);
    expect(python[0].slug).toBe('pec-signal-python');
  });

  it('returns an empty array for an unknown tag', () => {
    const { result } = renderHook(() => usePosts());
    expect(result.current.getPostsByTag('不存在的标签')).toEqual([]);
  });

  it('returns undefined for an unknown slug', () => {
    const { result } = renderHook(() => usePosts());
    expect(result.current.getPostBySlug('nope')).toBeUndefined();
  });

  it('extracts the unique, sorted set of all tags', () => {
    const { result } = renderHook(() => usePosts());
    const { allTags } = result.current;
    expect(allTags).toHaveLength(EXPECTED_TAGS.length);
    // Membership: no missing and no extras.
    expect(new Set(allTags)).toEqual(new Set(EXPECTED_TAGS));
    // Sorted per the locale collation used by the hook.
    const sortedCopy = [...allTags].sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
    expect(allTags).toEqual(sortedCopy);
  });
});
