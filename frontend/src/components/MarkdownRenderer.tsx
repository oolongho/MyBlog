import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: FC<MarkdownRendererProps> = ({ 
  content, 
  className = 'prose prose-lg max-w-none' 
}) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mt-8 mb-4 text-[var(--text-primary)]">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mt-8 mb-4 text-[var(--text-primary)]">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mt-6 mb-3 text-[var(--text-primary)]">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-semibold mt-4 mb-2 text-[var(--text-primary)]">{children}</h4>
        ),
        p: ({ children }) => (
          <p className="mb-4 leading-relaxed text-[var(--text-primary)]">{children}</p>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-[var(--text-primary)]">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-[var(--text-primary)]">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-[var(--text-primary)]">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-[var(--text-secondary)]">
            {children}
          </blockquote>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code 
                className="bg-[var(--border-color)] px-1.5 py-0.5 rounded text-sm font-mono text-[var(--text-primary)]" 
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border border-[var(--border-color)] rounded-lg">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-[var(--border-color)]">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-[var(--border-color)]">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-[var(--border-color)]/50">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left font-semibold text-[var(--text-primary)]">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-[var(--text-primary)]">{children}</td>
        ),
        hr: () => (
          <hr className="my-8 border-[var(--border-color)]" />
        ),
        img: ({ src, alt }) => (
          <img src={src} alt={alt} className="max-w-full h-auto rounded-lg my-4" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
