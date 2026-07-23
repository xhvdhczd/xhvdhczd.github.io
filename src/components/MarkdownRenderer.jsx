import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

/**
 * Render Markdown content to React elements with GitHub-flavored Markdown
 * (tables, task lists, strikethrough, autolinks) and syntax-highlighted code
 * blocks.
 *
 * @param {{ content: string }} props
 */
export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
