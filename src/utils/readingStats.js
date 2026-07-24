/**
 * Reading-time and word-count estimation for a Markdown body.
 *
 * CJK characters are counted individually; Latin/word tokens are counted by
 * whitespace. Reading speeds follow a common bilingual heuristic:
 *   - 400 CJK characters per minute
 *   - 200 Latin words per minute
 * The estimated minutes are rounded up, with a minimum of 1.
 *
 * @module readingStats
 */

const CJK_REGEX = /[一-鿿぀-ヿ]/g;

/**
 * @typedef {Object} ReadingStats
 * @property {number} wordCount  Total "words" (CJK chars + Latin word tokens).
 * @property {number} readingTime Estimated minutes to read (>= 1).
 */

/**
 * Compute word count and estimated reading time for a text block.
 * @param {string} content Markdown / plain text body.
 * @return {ReadingStats}
 */
export function computeReadingStats(content = '') {
  const text = content || '';
  const cjkMatches = text.match(CJK_REGEX);
  const cjk = cjkMatches ? cjkMatches.length : 0;

  // Remove CJK before counting Latin word tokens so they aren't double counted.
  const latinText = text.replace(CJK_REGEX, ' ');
  const latinTokens = latinText.trim()
    ? latinText.trim().split(/\s+/).filter(Boolean)
    : [];
  const latinWords = latinTokens.length;

  const wordCount = cjk + latinWords;
  const readingTime = Math.max(
    1,
    Math.ceil(cjk / 400 + latinWords / 200)
  );

  return { wordCount, readingTime };
}
