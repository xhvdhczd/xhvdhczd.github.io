/**
 * rehype plugin: extract an optional filename from a fenced code block's info
 * string and store it as a `data-filename` property, then normalize the
 * language class so `rehype-highlight` does not choke on the `:file` suffix.
 *
 * Convention (matches `CodeBlock`):
 *   ```js:app.js        -> lang "js", filename "app.js"
 *   ```python            -> lang "python", no filename
 *
 * This MUST run BEFORE `rehype-highlight`. It only rewrites the `className`
 * and attaches `data-filename` / `data-lang`; it never touches the code text,
 * so syntax highlighting is fully preserved.
 *
 * (Line numbers themselves are rendered by the `CodeBlock` component as a
 * separate gutter column — the component approach is more robust than a
 * post-highlight DOM rewrite and keeps highlight spans intact.)
 *
 * @return {import('unified').Plugin}
 */
export default function rehypeLineNumbers() {
  return (tree) => {
    visit(tree);
  };
}

/**
 * Recursively walk a hast tree.
 * @param {any} node
 */
function visit(node) {
  if (!node || typeof node !== 'object') return;

  if (node.type === 'element' && node.tagName === 'pre') {
    const code = (node.children || []).find(
      (child) =>
        child.type === 'element' && child.tagName === 'code'
    );
    if (code) processCode(code);
  }

  if (Array.isArray(node.children)) {
    node.children.forEach(visit);
  }
}

/**
 * Normalize a `pre > code` element's language class and capture its filename.
 * @param {any} code
 */
function processCode(code) {
  const properties = code.properties || (code.properties = {});
  const className = properties.className || [];

  const idx = className.findIndex(
    (c) => typeof c === 'string' && c.startsWith('language-')
  );
  if (idx === -1) return;

  const full = className[idx].slice('language-'.length); // e.g. "js:app.js"
  const colon = full.indexOf(':');
  if (colon === -1) {
    properties.dataLang = full;
    return;
  }

  const lang = full.slice(0, colon);
  const file = full.slice(colon + 1);
  // Rewrite to a clean language class so rehype-highlight can highlight it.
  className[idx] = `language-${lang}`;
  properties.className = className;
  if (lang) properties.dataLang = lang;
  if (file) properties.dataFilename = file;
}
