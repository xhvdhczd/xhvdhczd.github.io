import { describe, it, expect } from 'vitest';
import { parseFrontmatter } from '../parseFrontmatter.js';

describe('parseFrontmatter', () => {
  describe('scalar values', () => {
    it('keeps an unquoted string value as a string', () => {
      const { data } = parseFrontmatter('---\ntitle: Hello World\n---\n');
      expect(data.title).toBe('Hello World');
    });

    it('coerces the bare token "true" to a boolean', () => {
      const { data } = parseFrontmatter('---\npublished: true\n---\n');
      expect(data.published).toBe(true);
    });

    it('coerces the bare token "false" to a boolean', () => {
      const { data } = parseFrontmatter('---\ndraft: false\n---\n');
      expect(data.draft).toBe(false);
    });

    it('coerces an integer-like value to a number', () => {
      const { data } = parseFrontmatter('---\nviews: 42\n---\n');
      expect(data.views).toBe(42);
    });

    it('coerces a float-like value to a number', () => {
      const { data } = parseFrontmatter('---\nratio: 3.14\n---\n');
      expect(data.ratio).toBeCloseTo(3.14);
    });

    it('keeps an ISO date string as a string (not a number)', () => {
      const { data } = parseFrontmatter('---\ndate: 2026-07-18\n---\n');
      expect(data.date).toBe('2026-07-18');
    });

    it('keeps an empty scalar value as an empty string', () => {
      const { data } = parseFrontmatter('---\nauthor:\n---\n');
      expect(data.author).toBe('');
    });
  });

  describe('quote stripping', () => {
    it('strips double quotes from a scalar value', () => {
      const { data } = parseFrontmatter('---\ntitle: "Hello World"\n---\n');
      expect(data.title).toBe('Hello World');
    });

    it('strips single quotes from a scalar value', () => {
      const { data } = parseFrontmatter('---\nauthor: \'John Doe\'\n---\n');
      expect(data.author).toBe('John Doe');
    });
  });

  describe('array values', () => {
    it('parses a bracketed list into an array of strings', () => {
      const { data } = parseFrontmatter('---\ntags: [a, b, c]\n---\n');
      expect(data.tags).toEqual(['a', 'b', 'c']);
    });

    it('trims whitespace inside array items', () => {
      const { data } = parseFrontmatter('---\ntags: [ a , b , c ]\n---\n');
      expect(data.tags).toEqual(['a', 'b', 'c']);
    });

    it('strips quotes around array items', () => {
      const { data } = parseFrontmatter('---\ntags: ["x", "y"]\n---\n');
      expect(data.tags).toEqual(['x', 'y']);
    });

    it('returns an empty array for "[]"', () => {
      const { data } = parseFrontmatter('---\ntags: []\n---\n');
      expect(data.tags).toEqual([]);
    });
  });

  describe('multi-field documents', () => {
    it('parses a mixed frontmatter block', () => {
      const raw = [
        '---',
        'title: 脉冲涡流入门',
        'date: 2026-07-18',
        'tags: [脉冲涡流, 无损检测]',
        'published: true',
        'views: 10',
        '---',
        '# Body',
      ].join('\n');
      const { data, content } = parseFrontmatter(raw);
      expect(data).toEqual({
        title: '脉冲涡流入门',
        date: '2026-07-18',
        tags: ['脉冲涡流', '无损检测'],
        published: true,
        views: 10,
      });
      expect(content).toBe('# Body');
    });
  });

  describe('no frontmatter fallback', () => {
    it('returns empty data and the raw content when there is no frontmatter block', () => {
      const raw = '# Just a heading\n\nSome body text.';
      const { data, content } = parseFrontmatter(raw);
      expect(data).toEqual({});
      expect(content).toBe(raw);
    });

    it('treats a leading horizontal rule (not a fenced block) as no frontmatter', () => {
      const raw = '# Title\n\n---\n\nBody after a rule.';
      const { data, content } = parseFrontmatter(raw);
      expect(data).toEqual({});
      expect(content).toBe(raw);
    });
  });

  describe('known edge case (documented source behavior)', () => {
    // Per the PRD a quoted string should stay a string, but the parser strips
    // quotes first and then matches the bare token "true"/"false". As a result
    // `flag: "true"` currently becomes the boolean `true`. This is captured as
    // a characterization test and flagged for the engineer to review.
    it('coerces a quoted "true" to boolean (quirk to confirm with design)', () => {
      const { data } = parseFrontmatter('---\nflag: "true"\n---\n');
      expect(data.flag).toBe(true);
    });
  });
});
