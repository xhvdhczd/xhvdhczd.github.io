import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import rehypeLineNumbers from '../utils/rehypeLineNumbers.js';
import CodeBlock from './CodeBlock.jsx';

/**
 * Render Markdown content to React elements.
 *
 * Pipeline:
 *  - remark-gfm        : tables / task lists / strikethrough / autolinks
 *  - remark-math       : parse `$...$` and `$$...$$`
 *  - rehypeLineNumbers : (pre-highlight) extract ```lang:file filename
 *  - rehype-highlight  : syntax highlighting (kept intact)
 *  - rehype-slug       : add stable `id`s to headings (TOC anchors)
 *  - rehype-katex      : render math as KaTeX HTML
 *
 * The `pre` element is delegated to `CodeBlock`, which adds a filename title
 * bar, a copy button, and a line-number gutter while preserving highlighting.
 *
 * @param {{ content: string }} props
 */
export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeLineNumbers,
          rehypeHighlight,
          rehypeSlug,
          rehypeKatex,
        ]}
        components={{
          pre: CodeBlock,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
