import React, { useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

/**
 * Recursively collect the plain text of a React children tree. Used to count
 * code lines and to fall back for copy if the DOM ref is unavailable.
 * @param {unknown} children
 * @return {string}
 */
function extractText(children) {
  if (children == null) return '';
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }
  if (React.isValidElement(children)) {
    return extractText(children.props && children.props.children);
  }
  return '';
}

/**
 * Code block enhancement: overrides the default `pre` renderer produced by
 * react-markdown.
 *
 * Responsibilities:
 *  - render a filename title bar (when a `data-filename` was set by
 *    `rehypeLineNumbers` from a ```js:app.js fence) plus a one-click copy
 *    button (always available);
 *  - render a line-number gutter column computed from the highlighted text.
 *
 * Highlighting (rehype-highlight spans) is left entirely intact — we only wrap
 * the existing `<code>` element, we never re-tokenize it.
 *
 * @param {{ children?: React.ReactNode }} props
 */
export default function CodeBlock({ children }) {
  const codeEl = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === 'code'
  );

  // Fallback: if structure is unexpected, render the original <pre>.
  if (!codeEl) {
    return <pre>{children}</pre>;
  }

  const codeProps = codeEl.props || {};
  const node = codeProps.node;
  const fileName =
    (node && node.properties && node.properties.dataFilename) ||
    codeProps['data-filename'] ||
    '';
  const lang =
    (node && node.properties && node.properties.dataLang) ||
    codeProps['data-lang'] ||
    '';

  const raw = extractText(codeProps.children);
  const lineCount = raw === '' ? 0 : raw.split('\n').length;

  const preRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = (preRef.current && preRef.current.textContent) || raw;
    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(text);
      } else if (typeof document !== 'undefined') {
        // Fallback for non-secure contexts / older browsers.
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="code-block">
      <div className="code-titlebar">
        <span className="code-filename">{fileName || (lang ? lang : 'code')}</span>
        <IconButton
          size="small"
          className="code-copy"
          onClick={handleCopy}
          aria-label="复制代码"
          title="复制代码"
        >
          {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </div>
      <div className="code-body">
        {lineCount > 0 && (
          <div className="code-gutter" aria-hidden="true">
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
        )}
        <pre ref={preRef} className="code-pre">
          {codeEl}
        </pre>
      </div>
    </div>
  );
}
