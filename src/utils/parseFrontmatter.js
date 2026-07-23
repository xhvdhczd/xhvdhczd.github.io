/**
 * Lightweight YAML-style frontmatter parser.
 *
 * Supports the subset needed for blog posts without pulling in a heavy
 * dependency:
 *   - `key: value`        -> string / number / boolean (auto-detected)
 *   - `key: [a, b, c]`    -> array of strings
 *   - `key: "quoted"`     -> quoted string (quotes stripped)
 *
 * @param {string} raw Raw Markdown content, optionally starting with a
 *   `---` fenced frontmatter block.
 * @return {{ data: Record<string, unknown>, content: string }}
 *   `data` holds parsed frontmatter fields; `content` is the Markdown body.
 */
export function parseFrontmatter(raw) {
  const matched = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

  if (!matched) {
    return { data: {}, content: raw };
  }

  const frontmatter = matched[1];
  const content = matched[2];
  const data = {};

  for (const line of frontmatter.split('\n')) {
    if (!line.trim()) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    if (value.startsWith('[') && value.endsWith(']')) {
      // Array form: [a, b, c]
      const inner = value.slice(1, -1).trim();
      data[key] = inner
        ? inner
            .split(',')
            .map((item) => item.trim().replace(/^["']|["']$/g, ''))
        : [];
    } else {
      // Scalar form. Strip surrounding quotes.
      value = value.replace(/^["']|["']$/g, '');
      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if (value !== '' && !Number.isNaN(Number(value))) {
        value = Number(value);
      }
      data[key] = value;
    }
  }

  return { data, content };
}
